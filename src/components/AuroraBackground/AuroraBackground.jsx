/**
 * ================================================
 * AURORA BACKGROUND COMPONENT (Optimized)
 * ================================================
 * Performance optimizations:
 * - Removed permanent rAF loop (CSS animations handle movement)
 * - Removed mouse tracking (CSS animations override JS anyway)
 * - Pure CSS-driven aurora (zero JS runtime cost)
 * ================================================
 */

import { memo } from 'react';

const AuroraBackground = memo(() => {
  return (
    <div className="aurora-container">
      {/* CSS-animated aurora layers (GPU composited, zero JS) */}
      <div className="aurora-layer aurora-layer--1" />
      <div className="aurora-layer aurora-layer--2" />
      <div className="aurora-layer aurora-layer--3" />
    </div>
  );
});

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
