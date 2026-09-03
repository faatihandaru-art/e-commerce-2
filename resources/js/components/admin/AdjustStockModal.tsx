import React, { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

export interface AdjustStockInventory {
    id: number;
    warehouse_id: number;
    warehouse_name: string | null;
    variant_id: number;
    sku: string | null;
    product_name: string | null;
    quantity_on_hand: number;
    quantity_reserved: number;
    available_quantity: number;
    reorder_level: number;
    is_low: boolean;
    is_out_of_stock: boolean;
}

interface AdjustStockModalProps {
    inventory: AdjustStockInventory;
    onClose: () => void;
}

type AdjustDirection = 'add' | 'subtract';

const REASON_OPTIONS: string[] = [
    'Stok masuk dari supplier',
    'Koreksi stock opname',
    'Barang rusak/hilang',
    'Lainnya',
];

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ inventory, onClose }) => {
    const [direction, setDirection] = useState<AdjustDirection>('add');
    const [reason, setReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');

    const form = useForm<{ quantity: number; reason: string }>({
        quantity: 0,
        reason: '',
    });

    const { quantity, error: unitError, projected, canSubmit } = useMemo(() => {
        const current = inventory.quantity_on_hand;
        const qty = form.data.quantity;
        const delta = direction === 'add' ? qty : -qty;
        const projectedStock = current + delta;

        let error: string | null = null;
        if (Number.isNaN(qty) || qty <= 0) {
            error = 'Jumlah harus lebih dari 0';
        } else if (direction === 'subtract' && projectedStock < 0) {
            error = `Stok tidak boleh negatif. Maksimal yang bisa dikurangi: ${current}`;
        }

        const reasonValid = reason === 'Lainnya' ? customReason.trim().length > 0 : reason.length > 0;
        return {
            quantity: qty,
            error,
            projected: projectedStock,
            canSubmit: error === null && reasonValid,
        };
    }, [form.data.quantity, direction, reason, customReason, inventory.quantity_on_hand]);

    const selectedReason = reason === 'Lainnya' ? customReason.trim() : reason;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const qty = direction === 'add' ? quantity : -quantity;
        form.setData({
            quantity: qty,
            reason: selectedReason,
        });
        form.post(`/admin/inventory/${inventory.id}/adjust`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const lowText = inventory.is_out_of_stock
        ? 'Habis'
        : inventory.is_low
          ? 'Stok menipis'
          : null;

    return (
        <Modal isOpen={true} onClose={onClose} title="Sesuaikan Stok" size="md">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Info produk read-only */}
                <div className="rounded-xl border border-vgs-gray-border bg-vgs-black-surface/60 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-vgs-silver-bright text-sm leading-snug">
                            {inventory.product_name ?? '(Produk tidak tersedia)'}
                        </p>
                        {lowText && <Badge variant={inventory.is_out_of_stock ? 'danger' : 'warning'}>{lowText}</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-vgs-silver-mid">
                        <span>SKU: <span className="font-mono text-vgs-silver-bright">{inventory.sku ?? '-'}</span></span>
                        <span>Gudang: <span className="text-vgs-silver-bright">{inventory.warehouse_name ?? '-'}</span></span>
                    </div>
                    <div className="pt-1 border-t border-vgs-gray-border flex items-baseline gap-2">
                        <span className="text-xs uppercase tracking-wider text-vgs-silver-mid">Stok saat ini</span>
                        <span className="font-display text-2xl font-bold text-vgs-blue-electric">{inventory.quantity_on_hand}</span>
                        <span className="text-xs text-vgs-silver-mid">unit</span>
                    </div>
                </div>

                {/* Pilihan tambah / kurang */}
                <fieldset>
                    <legend className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid mb-2">
                        Jenis penyesuaian
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                { value: 'add', label: 'Tambah Stok', desc: 'Menambah jumlah stok' },
                                { value: 'subtract', label: 'Kurangi Stok', desc: 'Mengurangi jumlah stok' },
                            ] as { value: AdjustDirection; label: string; desc: string }[]
                        ).map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setDirection(opt.value)}
                                aria-pressed={direction === opt.value}
                                className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left min-h-[44px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                                    direction === opt.value
                                        ? 'border-vgs-blue-electric bg-vgs-blue-electric/10'
                                        : 'border-vgs-gray-border bg-vgs-black-surface/60 hover:border-vgs-silver-muted/50'
                                }`}
                            >
                                <span className={`text-sm font-semibold ${direction === opt.value ? 'text-vgs-blue-electric' : 'text-vgs-silver-bright'}`}>
                                    {opt.label}
                                </span>
                                <span className="text-xs text-vgs-silver-mid">{opt.desc}</span>
                            </button>
                        ))}
                    </div>
                </fieldset>

                {/* Jumlah */}
                <Input
                    id="adjust-quantity"
                    label="Jumlah"
                    type="number"
                    min={1}
                    step={1}
                    required
                    value={form.data.quantity === 0 ? '' : String(form.data.quantity)}
                    onChange={(e) =>
                        form.setData('quantity', Number(e.target.value))
                    }
                    error={unitError || (form.errors.quantity ?? undefined)}
                    hint={`Stok setelah penyesuaian: ${Number.isNaN(projected) ? '-' : projected} unit`}
                    autoFocus
                />

                {/* Alasan */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="adjust-reason" className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid">
                        Alasan <span className="text-vgs-danger">*</span>
                    </label>
                    <select
                        id="adjust-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30 min-h-[44px]"
                    >
                        <option value="">Pilih alasan…</option>
                        {REASON_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                    {reason === 'Lainnya' && (
                        <Input
                            id="adjust-custom-reason"
                            placeholder="Tulis alasan…"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            error={form.errors.reason}
                        />
                    )}
                    {form.errors.reason && reason !== 'Lainnya' && (
                        <p className="text-xs text-vgs-danger">{form.errors.reason}</p>
                    )}
                </div>

                {/* Tombol */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={form.processing}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={form.processing}
                        disabled={!canSubmit}
                    >
                        {form.processing ? 'Menyimpan…' : 'Simpan Penyesuaian'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

function handleClose() {
    return;
}

export default AdjustStockModal;
