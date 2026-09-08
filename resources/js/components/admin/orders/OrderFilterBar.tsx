import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ORDER_STATUS_META } from '@/components/admin/orders/orderStatus';
import { PAYMENT_STATUS_META } from '@/components/admin/orders/orderStatus';
import { FULFILLMENT_STATUS_META } from '@/components/admin/orders/orderStatus';
import type {
    FulfillmentStatus,
    OrderFilters,
    OrderStatus,
    PaymentStatus,
} from '@/types/orders';

export interface OrderFilterBarProps {
    filters: OrderFilters;
    /** Dipanggil saat user menekan "Terapkan" atau Enter. */
    onApply: (filters: OrderFilters) => void;
    /** Aktifkan dropdown payment_status & fulfillment_status (default true). */
    showSecondaryStatus?: boolean;
    /** Sembunyikan input date range (default false). */
    hideDateRange?: boolean;
}

const EMPTY: OrderFilters = {
    status: '',
    order_status: '',
    payment_status: '',
    fulfillment_status: '',
    search: '',
    date_from: '',
    date_to: '',
};

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
    filters,
    onApply,
    showSecondaryStatus = true,
    hideDateRange = false,
}) => {
    const [draft, setDraft] = useState<OrderFilters>({ ...EMPTY, ...filters });

    useEffect(() => {
        setDraft({ ...EMPTY, ...filters });
    }, [filters]);

    const update = (patch: Partial<OrderFilters>) => {
        setDraft((prev) => ({ ...prev, ...patch }));
    };

    const apply = () => {
        const cleaned: OrderFilters = {
            status: draft.order_status ?? draft.status ?? '',
            order_status: draft.order_status ?? '',
            payment_status: draft.payment_status ?? '',
            fulfillment_status: draft.fulfillment_status ?? '',
            search: draft.search ?? '',
            date_from: draft.date_from ?? '',
            date_to: draft.date_to ?? '',
        };
        onApply(cleaned);
    };

    const selectClass =
        'w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30';

    return (
        <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                <div className="lg:col-span-4">
                    <Input
                        label="Cari No. Order / Customer"
                        placeholder="Ketik no. order, nama, email, atau telepon…"
                        value={draft.search ?? ''}
                        onChange={(e) => update({ search: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') apply();
                        }}
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Status Order
                    </label>
                    <select
                        value={draft.order_status ?? ''}
                        onChange={(e) => update({ order_status: e.target.value })}
                        className={selectClass}
                    >
                        <option value="">Semua Status</option>
                        {(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((key) => (
                            <option key={key} value={key}>
                                {ORDER_STATUS_META[key].label}
                            </option>
                        ))}
                    </select>
                </div>

                {showSecondaryStatus && (
                    <>
                        <div className="lg:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Status Pembayaran
                            </label>
                            <select
                                value={draft.payment_status ?? ''}
                                onChange={(e) => update({ payment_status: e.target.value })}
                                className={selectClass}
                            >
                                <option value="">Semua</option>
                                {(Object.keys(PAYMENT_STATUS_META) as PaymentStatus[]).map((key) => (
                                    <option key={key} value={key}>
                                        {PAYMENT_STATUS_META[key].label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Status Fulfillment
                            </label>
                            <select
                                value={draft.fulfillment_status ?? ''}
                                onChange={(e) => update({ fulfillment_status: e.target.value })}
                                className={selectClass}
                            >
                                <option value="">Semua</option>
                                {(Object.keys(FULFILLMENT_STATUS_META) as FulfillmentStatus[]).map(
                                    (key) => (
                                        <option key={key} value={key}>
                                            {FULFILLMENT_STATUS_META[key].label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </>
                )}

                {!hideDateRange && (
                    <>
                        <div className="lg:col-span-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Dari
                            </label>
                            <input
                                type="date"
                                value={draft.date_from ?? ''}
                                onChange={(e) => update({ date_from: e.target.value })}
                                className={selectClass}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Sampai
                            </label>
                            <input
                                type="date"
                                value={draft.date_to ?? ''}
                                onChange={(e) => update({ date_to: e.target.value })}
                                className={selectClass}
                            />
                        </div>
                    </>
                )}

                <div className="lg:col-span-2 lg:justify-self-start">
                    <Button variant="primary" size="md" onClick={apply} block>
                        Terapkan Filter
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderFilterBar;