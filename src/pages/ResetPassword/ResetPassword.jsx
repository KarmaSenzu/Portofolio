import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokens, setTokens] = useState({ access: null, refresh: null });

    // Baca token dari URL fragment (#access_token=...&refresh_token=...)
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken) {
            setTokens({ access: accessToken, refresh: refreshToken });
            // Bersihkan hash dari URL (keamanan)
            window.history.replaceState(null, '', window.location.pathname);
        } else {
            setError('Link reset tidak valid atau sudah expired. Silakan minta link baru.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Password tidak cocok.');
            return;
        }
        if (!tokens.access) {
            setError('Link reset tidak valid atau sudah expired.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(password, tokens);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Gagal reset password. Link mungkin sudah expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-gutter-mobile py-space-xl overflow-hidden bg-background">
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                <div className="absolute -top-32 -left-20 w-[580px] h-[580px] bg-primary-fixed-dim/35 rounded-full blur-[130px] opacity-70"></div>
                <div className="absolute top-1/4 right-0 w-[520px] h-[520px] bg-secondary-fixed/40 rounded-full blur-[140px] opacity-70"></div>
            </div>

            <div className="w-full max-w-[440px] mx-auto z-10">
                <motion.div
                    className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl shadow-xl p-space-lg md:p-space-xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                    <div className="flex flex-col items-center text-center mb-space-lg">
                        <div className="mb-space-sm w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                        </div>
                        <h1 className="font-headline-sm text-headline-sm text-on-surface">Reset Console Key</h1>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-space-xs">
                            Masukkan password baru untuk akun Anda.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-space-md">
                            <span className="material-symbols-outlined text-[36px] text-tertiary">check_circle</span>
                            <p className="font-body-sm text-body-sm text-on-surface mt-space-sm">
                                Password berhasil diubah! Mengalihkan ke login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-space-md">
                            {error && (
                                <motion.div
                                    className="p-space-sm bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm text-center"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div>
                                <label className="font-label-md text-label-md text-on-surface" htmlFor="new-password">Password Baru</label>
                                <div className="relative mt-1.5">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">key</span>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimal 6 karakter"
                                        required
                                        disabled={loading}
                                        className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-label-md text-label-md text-on-surface" htmlFor="confirm-password">Konfirmasi Password</label>
                                <div className="relative mt-1.5">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">verified</span>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi password"
                                        required
                                        disabled={loading}
                                        className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-space-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Update Password</>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
