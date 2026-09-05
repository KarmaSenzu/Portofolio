import { memo } from 'react';

const TECH_STACK = [
  'Go', 'JavaScript', 'TypeScript', 'Python', 'PHP',
  'React', 'Node.js', 'Next.js', 'Laravel', 'Gin',
  'PostgreSQL', 'MySQL', 'Docker', 'Nginx', 'Linux',
  'Supabase', 'Tailwind CSS', 'Flutter', 'Redis', 'Git'
];

/**
 * Tech Marquee - seamless scrolling ticker
 * Menampilkan nama-nama tech yang bergerak dari kiri ke kanan
 */
const TechMarquee = memo(({ items = TECH_STACK, speed = 40, showDots = true }) => {
  return (
    <section className="relative w-full overflow-hidden py-space-xl bg-surface-container-lowest/80 backdrop-blur-md border-y border-outline-variant/50">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling track */}
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {/* Run 1 */}
        <div className="flex items-center gap-space-xl pr-space-xl whitespace-nowrap">
          {items.map((tech, i) => (
            <span key={`${tech}-${i}`} className="flex items-center gap-space-xl">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{tech}</span>
              {showDots && <span className="text-primary font-normal">·</span>}
            </span>
          ))}
        </div>
        {/* Run 2 (duplicate untuk seamless loop) */}
        <div className="flex items-center gap-space-xl pr-space-xl whitespace-nowrap" aria-hidden="true">
          {items.map((tech, i) => (
            <span key={`${tech}-dup-${i}`} className="flex items-center gap-space-xl">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{tech}</span>
              {showDots && <span className="text-primary font-normal">·</span>}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flex.w-max { animation: none !important; }
        }
      `}</style>
    </section>
  );
});

TechMarquee.displayName = 'TechMarquee';

export default TechMarquee;
