import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
    const [direction, setDirection] = useState(0);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') {
            setDirection(-1);
            onNavigate(currentIndex - 1);
        }
        if (e.key === 'ArrowRight') {
            setDirection(1);
            onNavigate(currentIndex + 1);
        }
    }, [currentIndex, onClose, onNavigate]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handlePrev = () => {
        setDirection(-1);
        onNavigate(currentIndex - 1);
    };

    const handleNext = () => {
        setDirection(1);
        onNavigate(currentIndex + 1);
    };

    const handleDragEnd = (event, info) => {
        const threshold = 50;
        if (info.offset.x > threshold && currentIndex > 0) {
            handlePrev();
        } else if (info.offset.x < -threshold && currentIndex < images.length - 1) {
            handleNext();
        }
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 400 : -400,
            opacity: 0,
            scale: 0.9
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="lightbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Close button */}
                    <button className="lightbox__close" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="lightbox__nav lightbox__nav--prev"
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                disabled={currentIndex === 0}
                                aria-label="Previous image"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                className="lightbox__nav lightbox__nav--next"
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                disabled={currentIndex === images.length - 1}
                                aria-label="Next image"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={`Image ${currentIndex + 1}`}
                                className="lightbox__image"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.4,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.15}
                                onDragEnd={handleDragEnd}
                                style={{ cursor: 'grab' }}
                                whileDrag={{ cursor: 'grabbing' }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Counter */}
                    {images.length > 1 && (
                        <div className="lightbox__counter">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="lightbox__thumbnails">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`lightbox__thumb ${idx === currentIndex ? 'lightbox__thumb--active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setDirection(idx > currentIndex ? 1 : -1); onNavigate(idx); }}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Lightbox;
