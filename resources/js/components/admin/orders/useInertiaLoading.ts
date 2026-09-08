import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Melacak "sedang loading" untuk setiap kunjungan Inertia (router.get/reload/dll)
 * agar bisa menampilkan indikator loading saat filter/paginasi berubah.
 */
export function useInertiaLoading(): boolean {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stopStart = router.on('start', () => setLoading(true));
        const stopFinish = router.on('finish', () => setLoading(false));
        return () => {
            stopStart();
            stopFinish();
        };
    }, []);

    return loading;
}

export default useInertiaLoading;