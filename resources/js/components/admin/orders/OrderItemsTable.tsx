import React from 'react';
import { formatRupiah } from '@/lib/format';

export interface OrderItem {
    id: number | string;
    sku: string | null;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    tax_amount: number;
    total: number;
    image: string | null;
    cost_price?: number | null;
}

interface OrderItemsTableProps {
    items: OrderItem[];
    showCost?: boolean;
}

export default function OrderItemsTable({ items, showCost = false }: OrderItemsTableProps) {
    if (!items || items.length === 0) {
        return (
            <p className="text-sm text-vgs-silver-muted">Belum ada item untuk pesanan ini.</p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-vgs-gray-border bg-vgs-black-elevated/40">
                        <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Produk / SKU
                        </th>
                        <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Qty
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Harga Satuan
                        </th>
                        {showCost && (
                            <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                Harga Modal
                            </th>
                        )}
                        <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Diskon
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Pajak
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-vgs-gray-border/60">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 shrink-0 rounded-lg border border-vgs-gray-border bg-vgs-black-void p-1 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="h-full w-full object-contain" />
                                        ) : (
                                            <span className="text-[10px] text-vgs-silver-muted">VGS</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-vgs-silver-bright">{item.product_name}</p>
                                        {item.variant_name && (
                                            <p className="text-xs text-vgs-silver-mid">{item.variant_name}</p>
                                        )}
                                        {item.sku && (
                                            <p className="text-xs font-mono text-vgs-silver-muted">{item.sku}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-4 text-vgs-silver-mid">{item.quantity}</td>
                            <td className="px-4 py-4 text-right text-vgs-silver-mid">{formatRupiah(item.unit_price)}</td>
                            {showCost && (
                                <td className="px-4 py-4 text-right text-vgs-silver-mid">
                                    {item.cost_price != null ? formatRupiah(item.cost_price) : '—'}
                                </td>
                            )}
                            <td className="px-4 py-4 text-right text-vgs-success">
                                {item.discount_amount > 0 ? `-${formatRupiah(item.discount_amount)}` : '—'}
                            </td>
                            <td className="px-4 py-4 text-right text-vgs-silver-mid">
                                {item.tax_amount > 0 ? formatRupiah(item.tax_amount) : '—'}
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-vgs-silver-bright">
                                {formatRupiah(item.total)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
