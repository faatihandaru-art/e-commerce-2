import React from 'react';
import { Head } from '@inertiajs/react';

/**
 * STUB HALAMAN CART
 * Dikerjakan secara lengkap oleh Orang 2 (BRIEF_ORANG2.md).
 * Orang 1 hanya menyediakan stub supaya ikon keranjang di Navbar tidak 404.
 */
export default function Cart() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Head title="Keranjang — Vortix Gaming Store" />
            <h1 className="font-display text-3xl font-bold text-vgs-silver-bright">
                Keranjang Belanja
            </h1>
            <p className="mt-2 text-sm text-vgs-silver-mid">
                Halaman ini dikerjakan oleh Orang 2.
            </p>
        </main>
    );
}
