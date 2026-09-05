import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotMode, setForgotMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Username atau password salah. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword(resetEmail);
            setResetSent(true);
        } catch (err) {
            setError(err.message || 'Gagal mengirim email reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-gutter-mobile md:px-gutter-desktop py-space-xl overflow-hidden bg-background">
            {/* Ambient mesh background */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                <div className="absolute -top-32 -left-20 w-[580px] h-[580px] bg-primary-fixed-dim/35 rounded-full blur-[130px] opacity-70"></div>
                <div className="absolute top-1/4 right-0 w-[520px] h-[520px] bg-secondary-fixed/40 rounded-full blur-[140px] opacity-80"></div>
                <div className="absolute -bottom-24 left-1/3 w-[640px] h-[480px] bg-tertiary-fixed-dim/30 rounded-full blur-[120px] opacity-60"></div>
            </div>

            {/* Centered Auth Console */}
            <div className="w-full max-w-[480px] mx-auto z-10">
                {/* Upper Telemetry Bar */}
                <div className="flex items-center justify-between mb-space-md px-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <div className="flex items-center gap-space-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
                        </span>
                        <span className="font-code-sm text-code-sm text-tertiary font-semibold">SYS.NODE_01 OK</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-code-sm text-code-sm opacity-80">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        <span>TLS 1.3 / E2EE</span>
                    </div>
                </div>

                {/* Glassmorphic Card */}
                <motion.div
                    className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl shadow-xl p-space-lg md:p-space-xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Top accent beam */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-space-lg">
                        <div className="mb-space-sm flex items-center justify-center p-1 bg-surface-container-low rounded-lg">
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-indigo to-cyan">{'</>'}</span>
                        </div>
                        <div className="flex items-center gap-space-xs mb-space-xs">
                            <h1 className="font-headline-sm text-headline-sm text-on-surface">Admin &amp; CMS Console</h1>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                            High-privilege gateway for portfolio architecture, CMS deployments, and API endpoints.
                        </p>
                        <div className="mt-space-md inline-flex items-center gap-1.5 px-space-md py-1 bg-surface-container rounded-full text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
                            <span>WebAuthn FIDO2 &amp; 2FA Armed</span>
                        </div>
                    </div>

                    {/* Form */}
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
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="font-label-md text-label-md text-on-surface" htmlFor="identity">Work Email / Handle</label>
                                <span className="font-code-sm text-code-sm text-on-surface-variant opacity-70">dev@damar.internal</span>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">terminal</span>
                                <input
                                    id="identity"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="architect@damar.dev"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    disabled={loading}
                                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="font-label-md text-label-md text-on-surface" htmlFor="passcode">Console Master Key</label>
                                <button
                                    type="button"
                                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                                    onClick={() => { setForgotMode(true); setResetSent(false); setError(''); }}
                                >
                                    Forgot key?
                                </button>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">key</span>
                                <input
                                    id="passcode"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter root credentials"
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full pl-9 pr-10 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary accent-primary" defaultChecked />
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Remember hardware fingerprint</span>
                            </label>
                            <span className="font-code-sm text-code-sm text-on-surface-variant opacity-60">30d validity</span>
                        </div>

                        <div className="pt-space-xs">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-space-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Authorize &amp; Enter Workspace</span>
                                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Forgot Password Form */}
                    <AnimatePresence>
                        {forgotMode && (
                            <motion.form
                                onSubmit={handleForgotPassword}
                                className="space-y-space-md mt-space-lg p-space-md rounded-lg bg-surface-container-low"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {resetSent ? (
                                    <div className="text-center py-space-sm">
                                        <span className="material-symbols-outlined text-[28px] text-tertiary">mark_email_read</span>
                                        <p className="font-body-sm text-body-sm text-on-surface mt-space-xs">
                                            Reset link telah dikirim ke email Anda. Cek inbox (dan spam) untuk melanjutkan.
                                        </p>
                                        <button
                                            type="button"
                                            className="mt-space-sm font-label-sm text-label-sm text-primary hover:underline"
                                            onClick={() => { setForgotMode(false); setResetSent(false); }}
                                        >
                                            ← Kembali ke Login
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="font-label-md text-label-md text-on-surface" htmlFor="reset-email">Email Terdaftar</label>
                                            <div className="relative mt-1.5">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
                                                <input
                                                    id="reset-email"
                                                    type="email"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    placeholder="architect@damar.dev"
                                                    required
                                                    disabled={loading}
                                                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-lowest rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
                                                <>Kirim Reset Link</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface text-center"
                                            onClick={() => setForgotMode(false)}
                                        >
                                            ← Kembali
                                        </button>
                                    </>
                                )}
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm px-space-xs text-on-surface-variant font-body-sm text-body-sm">
                        <div className="flex items-center gap-1.5 font-code-sm text-code-sm">
                            <span className="material-symbols-outlined text-[15px] text-tertiary">my_location</span>
                            <span>Gateway: <span className="text-on-surface font-medium">192.0.2.84 (FRA-1)</span></span>
                        </div>
                        <a href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                            Back to Portfolio
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
