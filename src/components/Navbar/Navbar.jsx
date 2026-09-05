import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'id' : 'en';
        i18n.changeLanguage(newLang);
    };

    const navLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/about', label: t('nav.about') },
        { to: '/blog', label: t('nav.blog') },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${isScrolled ? 'shadow-[0_4px_16px_rgba(0,0,0,0.06)]' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="h-20 max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md">
                {/* Logo + Open to Work */}
                <div className="flex items-center gap-space-md">
                    <Link to="/" className="flex items-center gap-space-sm group">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-indigo to-cyan shadow-sm">
                            {'</>'}
                        </span>
                        <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors">
                            Damar<span className="text-indigo">Dev</span>
                        </span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed font-label-sm text-label-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
                        </span>
                        <span>Open to Work</span>
                    </div>
                </div>

                {/* Pill Navigation */}
                <div className="hidden lg:flex items-center">
                    <nav className="flex items-center p-space-2xs bg-surface-container-high/60 backdrop-blur-md rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) =>
                                    `px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${
                                        isActive
                                            ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-space-sm">
                    {/* Language Toggle */}
                    <button
                        className="flex items-center px-space-sm py-space-xs rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-code-sm text-code-sm transition-colors"
                        onClick={toggleLanguage}
                        title="Language toggle"
                    >
                        <span className={i18n.language === 'en' ? 'text-on-surface font-semibold' : 'opacity-60'}>EN</span>
                        <span className="text-outline-variant mx-1">/</span>
                        <span className={i18n.language === 'id' ? 'text-on-surface font-semibold' : 'opacity-60'}>ID</span>
                    </button>

                    {/* CTA */}
                    <Link
                        to="/about#contact"
                        className="hidden sm:flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-all shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                    >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        <span>{t('nav.hireMe') || "Let's Connect"}</span>
                    </Link>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container-high/50 text-on-surface"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="lg:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="flex flex-col p-space-md gap-space-xs">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    className={({ isActive }) =>
                                        `px-space-md py-space-sm rounded-lg font-label-md text-label-md ${
                                            isActive ? 'bg-primary-container text-on-primary-container font-medium' : 'text-on-surface-variant hover:bg-surface-container'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            <Link to="/about#contact" className="mt-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary text-center font-label-md text-label-md">
                                {t('nav.hireMe') || "Let's Connect"}
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
