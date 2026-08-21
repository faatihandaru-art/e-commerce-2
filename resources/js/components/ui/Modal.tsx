import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    /** Klik overlay untuk menutup (default true) */
    closeOnOverlay?: boolean;
    /** Sembunyikan tombol X di pojok kanan atas */
    hideCloseButton?: boolean;
    className?: string;
}

const SIZE_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
} as const;

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnOverlay = true,
    hideCloseButton = false,
    className = '',
}) => {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
        >
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeOnOverlay ? onClose : undefined}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                tabIndex={-1}
                className={`relative w-full ${SIZE_CLASSES[size]} bg-vgs-black-elevated border border-vgs-gray-border rounded-2xl shadow-2xl focus:outline-none ${className}`}
            >
                {(title || !hideCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-vgs-gray-border">
                        {title && (
                            <h2 id={titleId} className="font-display text-lg font-bold text-vgs-silver-bright">
                                {title}
                            </h2>
                        )}
                        {!hideCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Tutup modal"
                                className={`inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-vgs-silver-mid transition-colors hover:bg-vgs-black-surface hover:text-vgs-silver-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${!title ? 'absolute right-4 top-4' : ''}`}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                <div className="px-6 py-5">{children}</div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
