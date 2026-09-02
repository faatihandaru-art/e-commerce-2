import React, { useCallback, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    // Handler dibuat stabil agar tidak dibuat ulang setiap render
    const handleEmailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        },
        []
    );

    const handlePasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
        },
        []
    );

    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: {
            email?: string;
            password?: string;
        } = {};

        // Validasi email
        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        // Validasi password
        if (!password) {
            newErrors.password = 'Kata sandi wajib diisi';
        } else if (password.length < 6) {
            newErrors.password = 'Kata sandi minimal 6 karakter';
        }

        // Jika validasi gagal
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        router.post(
            '/login',
            {
                email,
                password,
            },
            {
                onStart: () => {
                    setIsLoading(true);
                },

                onFinish: () => {
                    setIsLoading(false);
                },

                onSuccess: () => {
                    setLoginSuccess(true);

                    setTimeout(() => {
                        setLoginSuccess(false);

                        if (onSuccess) {
                            onSuccess();
                        }

                        onClose();
                    }, 800);
                },

                onError: (serverErrors) => {
                    if (serverErrors.email) {
                        setErrors({
                            email: serverErrors.email,
                        });
                    } else if (serverErrors.password) {
                        setErrors({
                            password: serverErrors.password,
                        });
                    }
                },
            }
        );
    };

    const handleClose = useCallback(() => {
        setEmail('');
        setPassword('');
        setErrors({});
        setShowPassword(false);
        setLoginSuccess(false);
        setIsLoading(false);

        onClose();
    }, [onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Masuk ke Akun VGS"
            size="md"
        >
            {loginSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-vgs-success/20 text-vgs-success flex items-center justify-center">
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white">
                        Berhasil Masuk!
                    </h3>

                    <p className="text-xs text-vgs-silver-muted font-mono">
                        Selamat datang kembali di Vortix Gaming Store.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* EMAIL */}
                    <Input
                        label="Email Pengguna"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={handleEmailChange}
                        error={errors.email}
                        required
                    />

                    {/* PASSWORD */}
                    <Input
                        label="Kata Sandi"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors.password}
                        suffix={
                            <button
                                type="button"
                                onClick={handleTogglePassword}
                                className="text-vgs-silver-muted hover:text-vgs-silver-bright focus:outline-none cursor-pointer"
                                aria-label={
                                    showPassword
                                        ? 'Sembunyikan sandi'
                                        : 'Tampilkan sandi'
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-3.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        }
                        required
                    />

                    {/* LOGIN BUTTON */}
                    <div className="pt-2">
                        <Button
                            variant="primary"
                            size="lg"
                            block
                            type="submit"
                            loading={isLoading}
                        >
                            Masuk ke Akun
                        </Button>
                    </div>

                    {/* REGISTER */}
                    <div className="text-center pt-2 text-xs text-vgs-silver-muted">
                        <span>Belum punya akun? </span>

                        <Link
                            href="/register"
                            onClick={handleClose}
                            className="text-vgs-blue-electric font-semibold hover:underline"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default LoginModal;
