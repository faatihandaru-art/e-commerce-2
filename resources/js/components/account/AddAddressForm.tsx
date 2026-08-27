import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface AddAddressFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddAddressForm({ isOpen, onClose }: AddAddressFormProps) {
    const [mode, setMode] = useState<'manual' | 'location'>('manual');
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        recipient: '',
        phone: '',
        street: '',
        village: '',
        district: '',
        city: '',
        province: '',
        postal_code: '',
        country: 'Indonesia',
        latitude: '' as string | number,
        longitude: '' as string | number,
        is_default: false,
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setLocationError(null);
            setLocationLoading(false);
            setMode('manual');
        }
    }, [isOpen]);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Browser Anda tidak mendukung Geolocation.');
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                        { headers: { 'Accept-Language': 'id' } }
                    );

                    if (!res.ok) throw new Error('Gagal mengambil data lokasi.');

                    const result = await res.json();
                    const addr = result.address || {};

                    const street = [addr.road, addr.house_number].filter(Boolean).join(' ');

                    setData({
                        ...data,
                        street: street || '',
                        village: addr.village || addr.suburb || '',
                        district: addr.city_district || addr.district || '',
                        city: addr.city || addr.county || '',
                        province: addr.state || '',
                        postal_code: addr.postcode || '',
                        latitude,
                        longitude,
                    });

                    setLocationError(null);
                } catch {
                    setLocationError('Gagal menghubungi layanan geocoding. Silakan isi manual.');
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                setLocationLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Izin lokasi ditolak. Silakan izinkan akses lokasi di browser Anda.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Informasi lokasi tidak tersedia. Silakan isi manual.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Permintaan lokasi habis waktu. Silakan coba lagi.');
                        break;
                    default:
                        setLocationError('Gagal mendapatkan lokasi. Silakan isi manual.');
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/account/addresses', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    type AddressField = keyof typeof data;

    const field = (name: AddressField, label: string, opts?: { required?: boolean; placeholder?: string; type?: string }) => (
        <Input
            name={name}
            label={label}
            type={opts?.type || 'text'}
            value={String(data[name] ?? '')}
            onChange={(e) => setData(name, e.target.value)}
            required={opts?.required}
            placeholder={opts?.placeholder}
            error={(errors as Record<string, string>)[name]}
        />
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Alamat" size="lg">
            {/* Mode Toggle */}
            <div className="flex rounded-xl bg-vgs-black-surface border border-vgs-gray-border p-1 mb-6">
                <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
                        mode === 'manual'
                            ? 'bg-vgs-blue-electric text-white shadow-sm'
                            : 'text-vgs-silver-mid hover:text-vgs-silver-bright'
                    }`}
                >
                    Isi Manual
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode('location');
                        handleDetectLocation();
                    }}
                    className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
                        mode === 'location'
                            ? 'bg-vgs-blue-electric text-white shadow-sm'
                            : 'text-vgs-silver-mid hover:text-vgs-silver-bright'
                    }`}
                >
                    Gunakan Lokasi Saat Ini
                </button>
            </div>

            {/* Location Loading */}
            {locationLoading && (
                <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/20">
                    <svg className="w-5 h-5 text-vgs-blue-electric animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-vgs-blue-electric font-medium">Mendeteksi lokasi Anda...</span>
                </div>
            )}

            {/* Location Error */}
            {locationError && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-vgs-danger/10 border border-vgs-danger/20">
                    <svg className="w-5 h-5 text-vgs-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-vgs-danger">{locationError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Penerima & Telepon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('recipient', 'Nama Penerima', { required: true, placeholder: 'Nama lengkap penerima' })}
                    {field('phone', 'Nomor Telepon', { required: true, placeholder: '08xxxxxxxxxx', type: 'tel' })}
                </div>

                {/* Alamat */}
                {field('street', 'Nama Jalan & Nomor Rumah', { required: true, placeholder: 'Jl. Contoh No. 123' })}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('village', 'Kelurahan/Desa', { placeholder: 'Nama kelurahan/desa' })}
                    {field('district', 'Kecamatan', { placeholder: 'Nama kecamatan' })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('city', 'Kota/Kabupaten', { required: true })}
                    {field('province', 'Provinsi', { required: true })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('postal_code', 'Kode Pos', { required: true, placeholder: '12345' })}
                    <Input
                        name="country"
                        label="Negara"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        error={errors.country}
                    />
                </div>

                {/* Default */}
                <label className="flex items-center gap-3 cursor-pointer py-2">
                    <input
                        type="checkbox"
                        checked={data.is_default}
                        onChange={(e) => setData('is_default', e.target.checked)}
                        className="w-4 h-4 rounded border-vgs-gray-border bg-vgs-black-surface text-vgs-blue-electric focus:ring-vgs-blue-electric/30 cursor-pointer"
                    />
                    <span className="text-sm text-vgs-silver-mid">
                        Jadikan alamat utama
                    </span>
                </label>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-3 border-t border-vgs-gray-border">
                    <Button variant="ghost" type="button" onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="primary" type="submit" loading={processing}>
                        Simpan Alamat
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
