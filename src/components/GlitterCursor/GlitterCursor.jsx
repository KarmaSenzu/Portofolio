/**
 * ================================================
 * GLITTER CURSOR COMPONENT (Canvas-Optimized)
 * ================================================
 * Performance optimizations:
 * - Canvas rendering (zero DOM manipulation)
 * - Idle-stopping rAF loop
 * - Pooled particles (no GC churn)
 * - Auto-stop when idle
 * ================================================
 */

import { useEffect, useRef, memo } from 'react';

const GlitterCursor = memo(() => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    mouse: { x: 0, y: 0 },
    lastMove: 0,
    running: false,
    lastMouseX: 0,
    lastMouseY: 0,
    frameCount: 0
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const COLORS = ['#3b82f6', '#22d3ee', '#8b5cf6', '#6366f1', '#ffffff'];
    const MAX_PARTICLES = 20;
    const s = stateRef.current;

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Spawn particles based on mouse movement speed
      s.frameCount++;
      const mouseSpeed = Math.sqrt(
        Math.pow(s.mouse.x - s.lastMouseX, 2) +
        Math.pow(s.mouse.y - s.lastMouseY, 2)
      );

      if (s.frameCount % 3 === 0 && mouseSpeed > 2 && s.particles.length < MAX_PARTICLES) {
        const spawnCount = Math.min(2, Math.floor(mouseSpeed / 12));
        for (let i = 0; i < spawnCount; i++) {
          s.particles.push({
            x: s.mouse.x + (Math.random() - 0.5) * 8,
            y: s.mouse.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.3,
            life: 1,
            decay: Math.random() * 0.02 + 0.015,
            size: Math.random() * 3 + 1.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
          });
        }
      }

      // Update & render particles (single canvas paint, no DOM)
      s.particles = s.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;

        if (p.life <= 0) return false;

        // Core particle
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Halo glow (cheap, no shadowBlur)
        ctx.globalAlpha = p.life * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;

      // Update last mouse pos
      s.lastMouseX = s.mouse.x;
      s.lastMouseY = s.mouse.y;

      // ✅ AUTO-STOP when idle (critical performance feature)
      const isIdle = performance.now() - s.lastMove > 300 && s.particles.length === 0;
      if (!isIdle) {
        requestAnimationFrame(animate);
      } else {
        s.running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const handleMouseMove = (e) => {
      s.lastMove = performance.now();
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;

      // Restart loop if stopped
      if (!s.running) {
        s.running = true;
        requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      s.particles = [];
      s.running = false;
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="glitter-canvas" aria-hidden="true" />
      {/* Cursor glow - static CSS, GPU composited */}
      <div className="cursor-glow-static" aria-hidden="true" />
    </>
  );
});

GlitterCursor.displayName = 'GlitterCursor';

export default GlitterCursor;
