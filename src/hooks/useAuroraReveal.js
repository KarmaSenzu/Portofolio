/**
 * ================================================
 * USE AURORA REVEAL HOOK
 * ================================================
 * Intersection Observer-based scroll reveal
 * with stagger support
 * ================================================
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook untuk scroll reveal animation
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for observer
 * @param {boolean} options.once - Only animate once
 */
export const useAuroraReveal = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true
  } = options;

  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      element.classList.add('reveal--visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            
            // Find stagger items inside and animate them
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('stagger-item--visible');
              }, index * 60); // 60ms stagger delay
            });

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('reveal--visible');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, once]);

  return ref;
};

/**
 * Hook untuk stagger animations pada multiple elements
 */
export const useAuroraStagger = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      const items = container.querySelectorAll('.stagger-item');
      items.forEach(item => item.classList.add('stagger-item--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('stagger-item--visible');
              }, index * 60);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return containerRef;
};

/**
 * Hook untuk mouse position tracking dengan lerp
 * Untuk card spotlight effects
 */
export const useAuroraMouse = () => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.1);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.1);

      element.style.setProperty('--mouse-x', `${currentRef.current.x}%`);
      element.style.setProperty('--mouse-y', `${currentRef.current.y}%`);

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      targetRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      targetRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return ref;
};

/**
 * Hook untuk CTA/Contact card dengan mouse spotlight
 * Performance: Auto-stops saat converge, restart saat mouse move
 */
export const useCardSpotlight = () => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 50, y: 50 });
  const currentRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;

      // ✅ AUTO-STOP saat converged (critical performance feature)
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        rafRef.current = null;
        return;
      }

      currentRef.current.x += dx * 0.08;
      currentRef.current.y += dy * 0.08;

      element.style.setProperty('--mouse-x', `${currentRef.current.x.toFixed(1)}%`);
      element.style.setProperty('--mouse-y', `${currentRef.current.y.toFixed(1)}%`);

      rafRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      targetRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      targetRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      startAnimation();
    };

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseenter', startAnimation, { passive: true });

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', startAnimation);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return ref;
};

export default useAuroraReveal;
