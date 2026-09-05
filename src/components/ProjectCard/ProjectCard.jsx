import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { getLocalizedText, getCategoryColor, getCategoryLabel } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import { uploadService } from '../../services/upload';

const ProjectCard = ({ project, index = 0, featured = false }) => {
    const { t, i18n } = useTranslation();
    const { onDemoClick, onRepoClick } = useAnalytics();
    const language = i18n.language;

    const categoryColor = getCategoryColor(project.category);
    const categoryLabel = getCategoryLabel(project.category, language);

    // Ambil semua gambar (images array, atau fallback ke image tunggal)
    const rawImages = project.images && project.images.length > 0
        ? project.images
        : [project.image];
    const images = rawImages.filter(Boolean).map(img => uploadService.getImageUrl(img));

    const [imageIndex, setImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const dragStartX = useRef(0);

    const hasMultiple = images.length > 1;

    // Autoplay: gambar berganti otomatis setiap 3 detik (pause saat hover)
    useEffect(() => {
        if (!hasMultiple || isHovered) return;
        const timer = setInterval(() => {
            setDirection(1);
            setImageIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [hasMultiple, isHovered, images.length]);

    const nextImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setDirection(1);
        setImageIndex(prev => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setDirection(-1);
        setImageIndex(prev => (prev - 1 + images.length) % images.length);
    };

    const handleDragStart = (e) => {
        dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    };

    const handleDragEnd = (e) => {
        const endX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
        const delta = endX - dragStartX.current;
        if (delta < -40 && hasMultiple) nextImage();
        else if (delta > 40 && hasMultiple) prevImage();
    };

    const imageVariants = {
        enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
    };

    return (
        <motion.article
            className={`rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.15),0_6px_16px_rgba(24,24,27,0.1)] hover:-translate-y-1 overflow-hidden flex flex-col transition-all duration-300 group ${featured ? 'lg:col-span-2' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Image Carousel */}
            <div
                className={`relative overflow-hidden bg-surface-container-low cursor-grab active:cursor-grabbing ${featured ? 'h-64' : 'h-48'}`}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link to={`/projects/${project.id}`} onClick={(e) => { /* biarkan navigasi */ }}>
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.img
                            key={imageIndex}
                            className="w-full h-48 md:h-full object-cover"
                            src={images[imageIndex]}
                            alt={getLocalizedText(project.title, language)}
                            loading="lazy"
                            draggable="false"
                            custom={direction}
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25 }}
                            style={featured ? { height: '16rem' } : { height: '12rem' }}
                        />
                    </AnimatePresence>
                </Link>

                {/* Overlay hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-on-surface/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-white font-semibold text-body-sm px-space-md py-space-xs bg-white/10 backdrop-blur border border-white/20 rounded-full">
                        {t('featured.viewCaseStudy')} →
                    </span>
                </div>

                {/* Prev/Next buttons (jika multiple) */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            aria-label="Gambar sebelumnya"
                        >
                            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            aria-label="Gambar berikutnya"
                        >
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>

                        {/* Indicator dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Counter badge (jika multiple) */}
                {hasMultiple && (
                    <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur text-white font-code-sm text-[10px]">
                        {imageIndex + 1}/{images.length}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-space-lg flex flex-col gap-space-sm flex-1">
                {/* Category Badge */}
                <div className="flex items-center gap-space-xs">
                    <span
                        className="font-label-sm text-label-sm px-space-xs py-space-2xs rounded font-semibold"
                        style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                    >
                        {categoryLabel}
                    </span>
                    {project.date && (
                        <span className="font-code-sm text-code-sm text-on-surface-variant">{project.date}</span>
                    )}
                </div>

                {/* Title */}
                <Link to={`/projects/${project.id}`}>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {getLocalizedText(project.title, language)}
                    </h3>
                </Link>

                {/* Description */}
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                    {getLocalizedText(project.description, language)}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-space-xs mt-auto pt-space-xs">
                    {project.techStack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-space-xs py-space-2xs rounded bg-surface-container-high/60 font-code-sm text-code-sm text-on-surface-variant">
                            {tech}
                        </span>
                    ))}
                    {project.techStack?.length > 3 && (
                        <span className="px-space-xs py-space-2xs rounded bg-surface-container-high/60 font-code-sm text-code-sm text-on-surface-variant">
                            +{project.techStack.length - 3}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-space-md pt-space-xs">
                    {project.repoUrl && (
                        <button
                            className="inline-flex items-center gap-space-2xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
                            onClick={() => onRepoClick(project.id, project.repoUrl)}
                        >
                            <span className="material-symbols-outlined text-[16px]">code</span>
                            {t('projects.source')}
                        </button>
                    )}
                    {project.liveUrl && (
                        <button
                            className="inline-flex items-center gap-space-2xs font-label-md text-label-md text-primary hover:text-primary-container font-semibold transition-colors"
                            onClick={() => onDemoClick(project.id, project.liveUrl)}
                        >
                            {t('projects.liveDemo')}
                            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default memo(ProjectCard);
