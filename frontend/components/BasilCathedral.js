'use client';
import { useEffect, useRef } from 'react';
import './BasilCathedral.css';

const ARTWORKS = ['cathedral', 'reindeer', 'gum', 'bolshoi', 'msu', 'soviet', 'st-isaac'];
const STORAGE_KEY = 'basil-cycle-start';

function getDrawDuration(artwork) {
  return artwork === 'reindeer' ? 8000 : 19000;
}

function getArtworkDuration(artwork) {
  return 2000 + getDrawDuration(artwork) + 30000 + 3000 + 10000;
}

const FULL_CYCLE_MS = ARTWORKS.reduce((sum, a) => sum + getArtworkDuration(a), 0);

function getImageUrl(artwork) {
  const map = {
    cathedral: '/images/basil-golden-lineart.png',
    reindeer: '/images/golden-reindeer-lineart.png',
    gum: '/images/gum-golden-lineart.png',
    bolshoi: '/images/bolshoi-golden-lineart.png',
    msu: '/images/msu-golden-lineart.png',
    soviet: '/images/soviet-palace-golden-lineart.png',
    'st-isaac': '/images/st-isaac-golden-lineart.png',
  };
  return map[artwork] || map.cathedral;
}

function calcState(elapsed) {
  let t = ((elapsed % FULL_CYCLE_MS) + FULL_CYCLE_MS) % FULL_CYCLE_MS;
  for (const artwork of ARTWORKS) {
    const dur = getArtworkDuration(artwork);
    if (t < dur) {
      const dd = getDrawDuration(artwork);
      if (t < 2000) return { artwork, phase: 'waiting' };
      t -= 2000;
      if (t < dd) return { artwork, phase: 'drawing' };
      t -= dd;
      if (t < 30000) return { artwork, phase: 'holding' };
      t -= 30000;
      if (t < 3000) return { artwork, phase: 'fading' };
      return { artwork, phase: 'gone' };
    }
    t -= dur;
  }
  return { artwork: 'cathedral', phase: 'waiting' };
}

export default function BasilCathedral({ cityActive }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const penRef = useRef(null);
  const rafRef = useRef(null);
  const lastRenderedRef = useRef('');

  useEffect(() => {
    // Get or create cycle start timestamp in sessionStorage
    let startTime;
    try {
      const val = sessionStorage.getItem(STORAGE_KEY);
      startTime = val ? parseInt(val, 10) : null;
    } catch (e) { startTime = null; }

    if (!startTime) {
      startTime = Date.now();
      try { sessionStorage.setItem(STORAGE_KEY, String(startTime)); } catch (e) { /* */ }
    }

    function update() {
      if (!containerRef.current || !imageRef.current || !penRef.current) return;

      const elapsed = Date.now() - startTime;
      const { artwork, phase } = calcState(elapsed);

      // Build a cache key to avoid redundant DOM updates
      const key = `${artwork}|${phase}`;
      if (key !== lastRenderedRef.current) {
        lastRenderedRef.current = key;

        const drawDirection = artwork === 'reindeer' ? 'horizontal' : 'vertical';

        // Update container classes
        containerRef.current.className = `basil-container phase-${phase} draw-${drawDirection}${cityActive ? ' city-active' : ''}`;

        // Update image
        imageRef.current.style.backgroundImage = `url(${getImageUrl(artwork)})`;

        // Update pen visibility
        penRef.current.style.display = phase === 'drawing' ? '' : 'none';
        penRef.current.className = `basil-pen-light draw-${drawDirection}`;
      }

      rafRef.current = requestAnimationFrame(update);
    }

    // Start the animation loop
    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cityActive]);

  return (
    <div ref={containerRef} className="basil-container phase-waiting draw-vertical">
      <div ref={imageRef} className="basil-image" />
      <div ref={penRef} className="basil-pen-light draw-vertical" style={{ display: 'none' }} />
    </div>
  );
}
