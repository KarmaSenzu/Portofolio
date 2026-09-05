import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-gutter-mobile">
      {/* Ambient mesh background */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute -top-32 -left-20 w-[580px] h-[580px] bg-primary-fixed-dim/35 rounded-full blur-[130px] opacity-70"></div>
        <div className="absolute top-1/4 right-0 w-[520px] h-[520px] bg-secondary-fixed/40 rounded-full blur-[140px] opacity-70"></div>
        <div className="absolute -bottom-24 left-1/3 w-[640px] h-[480px] bg-tertiary-fixed-dim/30 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="flex flex-col items-center text-center gap-space-md">
        {/* Animated 404 with floating digits */}
        <div className="relative flex items-center justify-center select-none">
          <motion.h1
            className="font-headline-2xl text-headline-2xl font-bold leading-none tracking-tight"
            style={{ fontSize: 'clamp(8rem, 20vw, 16rem)' }}
            initial={{ opacity: 0, scale: 0.6, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.span
              className="inline-block text-on-surface"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            >
              4
            </motion.span>
            <motion.span
              className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mx-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              0
            </motion.span>
            <motion.span
              className="inline-block text-on-surface"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              4
            </motion.span>
          </motion.h1>
        </div>

        {/* Title & description */}
        <motion.h2
          className="font-headline-xl text-headline-xl text-on-surface font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Halaman Tidak Ditemukan
        </motion.h2>
        <motion.p
          className="font-body-lg text-body-lg text-on-surface-variant max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke lokasi lain.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-space-sm pt-space-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md hover:shadow-lg transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Kembali ke Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/50 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            Lihat Projects
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
