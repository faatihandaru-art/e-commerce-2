<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

#[Fillable(['name', 'email', 'phone', 'password', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function addresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function customerAddresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function customerNotes(): HasMany
    {
        return $this->hasMany(CustomerNote::class, 'user_id');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    /**
     * Scope untuk membatasi query hanya pada user ber-role customer,
     * agar staf/role lain tidak pernah ikut tampil di modul Customers.
     */
    public function scopeCustomersOnly(Builder $query): Builder
    {
        return $query->whereHas('roles', fn ($q) => $q->where('slug', 'customer'));
    }

    /**
     * Jumlah semua order milik user ini (termasuk yang belum dibayar).
     */
    public function totalOrders(): int
    {
        return $this->orders()->count();
    }

    /**
     * Total belanja dari order dengan payment_status 'paid' saja.
     */
    public function totalSpent(): int
    {
        return (int) $this->orders()->where('payment_status', 'paid')->sum('grand_total');
    }

    /**
     * Tanggal order terakhir user, atau null jika belum pernah order.
     */
    public function lastOrderAt(): ?Carbon
    {
        $latest = $this->orders()->latest('placed_at')->first('placed_at');

        return $latest?->placed_at;
    }

    public function hasRole(string $roleSlug): bool
    {
        return $this->roles->contains('slug', $roleSlug);
    }

    public function isStaff(): bool
    {
        if ($this->roles->isEmpty()) {
            return false;
        }

        return $this->roles->contains(fn (Role $role) => $role->slug !== 'customer');
    }

    public function isCustomer(): bool
    {
        return ! $this->isStaff();
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'last_order_at' => 'datetime',
        ];
    }
}
