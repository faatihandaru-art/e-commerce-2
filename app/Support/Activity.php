<?php

namespace App\Support;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\CustomerNote;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\OrderNote;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use App\Notifications\AdminActivityNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class Activity
{
    /**
     * Mencatat aksi ke tabel audit_logs sekaligus mengirim notifikasi
     * ke seluruh staf (non-customer).
     *
     * @param  array<string, mixed>  $options
     */
    public static function record(string $action, ?Model $subject = null, array $options = []): void
    {
        try {
            [$kind, $label] = self::resolveSubject($subject, $options['label'] ?? null);

            $actor = self::actor($options['actor_id'] ?? null);
            $details = $options['details'] ?? null;
            $message = $options['message'] ?? self::buildMessage($action, $label, $actor, $details);
            $title = $options['title'] ?? self::buildTitle($action, $kind);
            $link = $options['link'] ?? null;

            AuditLog::create([
                'actor_id' => $actor?->id,
                'action' => $action,
                'subject_type' => $subject ? get_class($subject) : ($options['subject_type'] ?? null),
                'subject_id' => $subject?->getKey(),
                'subject_label' => $label,
                'message' => $message,
                'link' => $link,
                'before_state' => $options['before'] ?? null,
                'after_state' => $options['after'] ?? null,
                'ip_address' => request()?->ip(),
                'user_agent' => request()?->userAgent(),
                'created_at' => now(),
            ]);

            self::notifyStaff($title, $message, $action, $subject, $actor, $link);
        } catch (\Throwable $e) {
            Log::warning('Gagal mencatat aktivitas: '.$e->getMessage());
        }
    }

    /**
     * @return array{0: string, 1: string} [kind, label]
     */
    protected static function resolveSubject(?Model $subject, ?string $labelOverride): array
    {
        if (! $subject) {
            return [$labelOverride ?? 'Data', $labelOverride ?? 'Data'];
        }

        $kind = match (true) {
            $subject instanceof Product => 'Produk',
            $subject instanceof Category => 'Kategori',
            $subject instanceof Warehouse => 'Gudang',
            $subject instanceof Order => 'Pesanan',
            $subject instanceof Inventory => 'Stok',
            $subject instanceof CustomerNote => 'Catatan',
            $subject instanceof OrderNote => 'Catatan Order',
            $subject instanceof User => 'Customer',
            default => class_basename($subject),
        };

        $label = $labelOverride ?? self::subjectLabel($subject, $kind);

        return [$kind, $label];
    }

    protected static function subjectLabel(Model $subject, string $kind): string
    {
        return match (true) {
            $subject instanceof Product, $subject instanceof Category, $subject instanceof Warehouse => "{$kind} '{$subject->name}'",
            $subject instanceof Order => "'{$subject->order_number}'",
            $subject instanceof Inventory => "'".($subject->variant?->sku ?? $subject->id)."'",
            $subject instanceof OrderNote => "'".($subject->order?->order_number ?? '—')."'",
            default => $kind.' #'.$subject->getKey(),
        };
    }

    protected static function actor(?int $actorId): ?User
    {
        if ($actorId) {
            return User::find($actorId);
        }

        return auth()->check() ? auth()->user() : null;
    }

    protected static function buildMessage(string $action, string $label, ?User $actor, ?string $details): string
    {
        $actorName = $actor?->name ?? 'Sistem';
        $suffix = $details ? " ({$details})" : '';

        return match ($action) {
            'created' => "{$label} ditambahkan oleh {$actorName}",
            'updated' => "{$label} diperbarui oleh {$actorName}{$suffix}",
            'deleted' => "{$label} dihapus oleh {$actorName}",
            'status_changed' => "Status {$label} diubah{$suffix} oleh {$actorName}",
            'order_placed' => "Pesanan baru {$label} dari {$actorName}{$suffix}",
            'order_status_changed' => "Pesanan {$label} diperbarui{$suffix} oleh {$actorName}",
            'stock_adjusted' => "Stok {$label} disesuaikan{$suffix} oleh {$actorName}",
            'note_added' => "Catatan untuk {$label} ditambahkan oleh {$actorName}",
            'note_deleted' => "Catatan untuk {$label} dihapus oleh {$actorName}",
            'customer_registered' => "Customer baru {$label} terdaftar",
            'customer_status_changed' => "Status akun {$label} diubah{$suffix} oleh {$actorName}",
            default => "{$label} — {$action} oleh {$actorName}",
        };
    }

    protected static function buildTitle(string $action, string $kind): string
    {
        $verb = match ($action) {
            'created' => 'ditambahkan',
            'updated' => 'diperbarui',
            'deleted' => 'dihapus',
            'status_changed', 'customer_status_changed' => 'diubah',
            'order_placed' => 'baru',
            'order_status_changed' => 'diperbarui',
            'stock_adjusted' => 'disesuaikan',
            'note_added' => 'ditambahkan',
            'note_deleted' => 'dihapus',
            'customer_registered' => 'baru terdaftar',
            default => $action,
        };

        return $kind.' '.$verb;
    }

    protected static function notifyStaff(string $title, string $message, string $action, ?Model $subject, ?User $actor, ?string $link): void
    {
        $staff = User::query()
            ->whereHas('roles', fn ($query) => $query->where('slug', '!=', 'customer'))
            ->get();

        if ($staff->isEmpty()) {
            return;
        }

        NotificationFacade::send(
            $staff,
            new AdminActivityNotification(
                title: $title,
                message: $message,
                action: $action,
                subjectType: $subject ? get_class($subject) : null,
                subjectId: $subject?->getKey(),
                actor: $actor?->name,
                link: $link,
            )
        );
    }
}
