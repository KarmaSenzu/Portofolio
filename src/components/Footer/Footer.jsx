import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
    const { t } = useTranslation();

    const socialLinks = [
        { name: 'GitHub', url: 'https://github.com/KarmaSenzu', icon: 'code' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/damar-fikrie-216240238/', icon: 'work' },
        { name: 'Twitter', url: 'https://twitter.com/damar', icon: 'alternate_email' },
    ];

    return (
        <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-space-3xl">
            <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl mb-space-2xl">
                    {/* Brand */}
                    <div className="md:col-span-5 flex flex-col gap-space-md">
                        <div className="flex items-center gap-space-sm">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-indigo to-cyan">
                                {'</>'}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface">DamarDev Ecosystem</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                            Engineering high-resilience web platforms, distributed cloud architectures, and developer experiences with craft and architectural rigor.
                        </p>
                        <div className="flex items-center gap-space-sm pt-space-xs">
                            <div className="w-2 h-2 rounded-full bg-tertiary-container"></div>
                            <span className="font-code-sm text-code-sm text-on-surface-variant">Available for Q3/Q4 Architecture Advisory</span>
                        </div>
                    </div>

                    {/* Index Nav */}
                    <div className="md:col-span-3 flex flex-col gap-space-sm">
                        <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Index</span>
                        <nav className="flex flex-col gap-space-xs">
                            <Link to="/projects" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Production Projects</Link>
                            <Link to="/about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">About</Link>
                            <Link to="/blog" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Engineering Journal</Link>
                            <Link to="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Home</Link>
                        </nav>
                    </div>

                    {/* Telemetry & Network */}
                    <div className="md:col-span-4 flex flex-col gap-space-sm">
                        <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Telemetry &amp; Network</span>
                        <div className="flex flex-col gap-space-xs">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-space-xs"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{social.icon}</span>
                                    <span>{social.name}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/50">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 DamarDev. Ultra-modern developer portfolio &amp; CMS engine.</p>
                    <div className="flex items-center gap-space-md">
                        <span className="font-code-sm text-code-sm text-on-surface-variant">v4.2.0 • build::prod</span>
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
                            <span className="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span>
                            <span>All systems nominal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
