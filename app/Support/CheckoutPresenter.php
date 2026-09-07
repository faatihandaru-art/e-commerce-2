<?php

namespace App\Support;

use App\Models\CustomerAddress;
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
            ->map(fn (CustomerAddress $a) => self::formatAddress($a))
            ->values()
            ->all();
    }

    /**
     * Bentuk tunggal alamat yang sama dengan daftar di halaman checkout,
     * dipakai juga setelah menyimpan alamat baru saat checkout.
     *
     * @return array<string, mixed>
     */
    public static function formatAddress(CustomerAddress $address): array
    {
        return [
            'id' => $address->id,
            'label' => $address->is_default ? 'Alamat Rumah' : 'Alamat Tambahan',
            'recipient' => $address->recipient,
            'phone' => $address->phone,
            'line' => trim(implode(', ', array_filter([
                $address->street,
                $address->village,
                $address->district,
            ], fn ($part) => ! empty($part)))),
            'city' => trim("{$address->city}, {$address->province} {$address->postal_code}"),
            'note' => $address->is_default ? 'Utama' : null,
            'province' => $address->province,
            'postal_code' => $address->postal_code,
            'country' => $address->country ?? 'Indonesia',
        ];
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
                'logoUrl' => '/images/products/' . strtolower((string) $method->provider) . '.png',
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
            [
                'id' => 'shopeepay',
                'name' => 'ShopeePay',
                'group' => 'ewallet',
                'logo' => '/images/logo/shopeepay.png',
                'fee' => 0,
                'desc' => 'Saldo & Voucher',
            ],
            [
                'id' => 'gopay',
                'name' => 'GoPay',
                'group' => 'ewallet',
                'logo' => '/images/logo/gopay.png',
                'fee' => 0,
            ],
            [
                'id' => 'ovo',
                'name' => 'OVO',
                'group' => 'ewallet',
                'logo' => '/images/logo/ovo.jpg',
                'fee' => 0,
            ],
            [
                'id' => 'dana',
                'name' => 'DANA',
                'group' => 'ewallet',
                'logo' => '/images/logo/dana.jpg',
                'fee' => 0,
            ],
            [
                'id' => 'qris',
                'name' => 'QRIS (Semua Aplikasi E-Wallet / Mobile Banking)',
                'group' => 'qris',
                'logo' => '/images/logo/qris.png',
                'fee' => 0,
                'desc' => 'Scan sekali untuk semua pembayaran',
            ],
            [
                'id' => 'cod',
                'name' => 'Bayar di Tempat (COD)',
                'group' => 'cod',
                'logo' => '/images/logo/cod.jpg',
                'fee' => 0,
                'desc' => 'Tersedia hanya di area tertentu',
            ],
        ];
    }
}