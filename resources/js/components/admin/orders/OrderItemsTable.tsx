import React from 'react';
import { formatRupiah } from '@/lib/format';
import type { OrderItem } from '@/types/orders';

export interface OrderItemsTableProps {
    items: OrderItem[];
    currency?: string;
    emptyText?: string;
}

/**
 * Tabel item pesanan — read-only. Semua angka berasal dari snapshot
 * order_items backend, TIDAK dihitung ulang di frontend.
 */
export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({
    items,
    emptyText = 'Tidak ada item pada pesanan ini.',
}) => {
    const rows = items ?? [];

    if (rows.length === 0) {
        return (
            <div className="rounded-xl border border-vgs-gray-border bg-vgs-black-void/40 px-4 py-8 text-center">
                <p className="text-sm text-vgs-silver-mid">{emptyText}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-vgs-gray-border bg-vgs-black-elevated/40">
                        <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Produk / Varian
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Harga Satuan
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Qty
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Diskon
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Pajak
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-vgs-gray-border/60">
                    {rows.map((item) => (
                        <tr key={item.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-vgs-black-surface border border-vgs-gray-border p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.product_name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-mono text-vgs-silver-muted">
                                                VGS
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-vgs-silver-bright truncate">
                                            {item.product_name}
                                        </p>
                                        <p className="text-xs font-mono text-vgs-silver-muted truncate">
                                            {item.variant_name ? `${item.variant_name} • ` : ''}
                                            {item.sku}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-vgs-silver-mid whitespace-nowrap">
                                {formatRupiah(item.unit_price)}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-vgs-silver-bright whitespace-nowrap">
                                {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-right font-mono whitespace-nowrap">
                                {item.discount_amount > 0 ? (
                                    <span className="text-vgs-danger">
                                        -{formatRupiah(item.discount_amount)}
                                    </span>
                                ) : (
                                    <span className="text-vgs-silver-muted">—</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right font-mono whitespace-nowrap">
                                {item.tax_amount > 0 ? (
                                    <span className="text-vgs-warning">{formatRupiah(item.tax_amount)}</span>
                                ) : (
                                    <span className="text-vgs-silver-muted">—</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-vgs-silver-bright whitespace-nowrap">
                                {formatRupiah(item.total)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderItemsTable;