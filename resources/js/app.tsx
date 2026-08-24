import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import { CartProvider } from '@/context/CartContext';

createInertiaApp({
    title: (title) => `${title} — Vortix Gaming Store`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ) as Promise<ResolvedComponent>,
    setup({ el, App, props }) {
        if (!el) return;
        createRoot(el).render(
            <CartProvider>
                <App {...props} />
            </CartProvider>
        );
    },
    progress: { color: '#2B6FF6' },
});
