<?php

namespace App\Support;

use App\Models\ShippingMethod;
use App\Models\User;

/**
 * Shared payload builders for the storefront checkout flow.
 */
class CheckoutPresenter
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public static function addresses(User $user): array
    {
        return $user->addresses()
            ->latest()
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'label' => $a->is_default ? 'Alamat Rumah' : 'Alamat Tambahan',
                'recipient' => $a->recipient,
                'phone' => $a->phone,
                'line' => trim(implode(', ', array_filter([
                    $a->street,
                    $a->village,
                    $a->district,
                ], fn ($part) => ! empty($part)))),
                'city' => trim("{$a->city}, {$a->province} {$a->postal_code}"),
                'note' => $a->is_default ? 'Utama' : null,
                'province' => $a->province,
                'postal_code' => $a->postal_code,
                'country' => $a->country ?? 'Indonesia',
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function shippingMethods(): array
    {
        $eta = [
            'jne-reguler' => '2-4 hari',
            'jne-express' => '1-2 hari',
            'jnt-express' => '2-3 hari',
            'sicepat-reguler' => '2-4 hari',
            'sicepat-best' => '1-2 hari',
        ];

        return ShippingMethod::query()
            ->where('status', 'active')
            ->orderBy('base_price')
            ->get()
            ->map(fn (ShippingMethod $method) => [
                'id' => $method->id,
                'code' => $method->code,
                'name' => $method->name,
                'provider' => $method->provider,
                'eta' => $eta[$method->code] ?? '2-5 hari',
                'cost' => (int) $method->base_price,
                'logoUrl' => '/images/products/'.strtolower((string) $method->provider).'.png',
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function paymentMethods(): array
    {
        return [
            ['id' => 'shopeepay', 'name' => 'ShopeePay', 'group' => 'ewallet', 'logo' => '/images/products/shopeepay.png', 'fee' => 0, 'desc' => 'Saldo & Voucher'],
            ['id' => 'gopay', 'name' => 'GoPay', 'group' => 'ewallet', 'logo' => '/images/products/gopay.png', 'fee' => 0],
            ['id' => 'ovo', 'name' => 'OVO', 'group' => 'ewallet', 'logo' => '/images/products/ovo.jpg', 'fee' => 0],
            ['id' => 'dana', 'name' => 'DANA', 'group' => 'ewallet', 'logo' => '/images/products/dana.jpg', 'fee' => 0],
            ['id' => 'qris', 'name' => 'QRIS (Semua Aplikasi E-Wallet / Mobile Banking)', 'group' => 'qris', 'logo' => '/images/products/qris.png', 'fee' => 0, 'desc' => 'Scan sekali untuk semua pembayaran'],
            ['id' => 'cod', 'name' => 'Bayar di Tempat (COD)', 'group' => 'cod', 'logo' => '/images/products/cod.jpg', 'fee' => 0, 'desc' => 'Tersedia hanya di area tertentu'],
        ];
    }
}