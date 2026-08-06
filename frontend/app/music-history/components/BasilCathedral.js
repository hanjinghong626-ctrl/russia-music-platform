'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
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

/**
 * Given elapsed ms since cycle start, determine which artwork and phase should be showing.
 */
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

/**
 * Get remaining phase transitions for the current artwork, given elapsed time within its slot.
 */
function getPhaseTransitions(artwork, artworkElapsed) {
  const dd = getDrawDuration(artwork);
  const boundaries = [
    { at: 2000, phase: 'drawing' },
    { at: 2000 + dd, phase: 'holding' },
    { at: 2000 + dd + 30000, phase: 'fading' },
    { at: 2000 + dd + 30000 + 3000, phase: 'gone' },
  ];
  return boundaries
    .filter(b => b.at > artworkElapsed)
    .map(b => ({ delay: b.at - artworkElapsed, phase: b.phase }));
}

/**
 * Get how far into the current artwork's time slot we are.
 */
function getArtworkElapsed(elapsed) {
  let t = ((elapsed % FULL_CYCLE_MS) + FULL_CYCLE_MS) % FULL_CYCLE_MS;
  for (const artwork of ARTWORKS) {
    const dur = getArtworkDuration(artwork);
    if (t < dur) return { artwork, artworkElapsed: t };
    t -= dur;
  }
  return { artwork: 'cathedral', artworkElapsed: 0 };
}

function getNextArtwork(current) {
  const idx = ARTWORKS.indexOf(current);
  return ARTWORKS[(idx + 1) % ARTWORKS.length];
}

function readCycleStart() {
  try {
    const val = sessionStorage.getItem(STORAGE_KEY);
    if (val) return parseInt(val, 10);
  } catch (e) { /* ignore */ }
  return null;
}

function writeCycleStart(ts) {
  try { sessionStorage.setItem(STORAGE_KEY, String(ts)); } catch (e) { /* ignore */ }
}

export default function BasilCathedral({ cityActive }) {
  const [phase, setPhase] = useState('waiting');
  const [artwork, setArtwork] = useState('cathedral');
  const cancelledRef = useRef(false);
  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /**
   * Run continuous animation cycle starting from the given artwork.
   * All timers are tracked in timersRef so they can be cleaned up on unmount.
   */
  const runCycle = useCallback((startArtwork) => {
    function cycle(artworkName) {
      if (cancelledRef.current) return;
      const dd = getDrawDuration(artworkName);

      setPhase('waiting');
      timersRef.current.push(setTimeout(() => {
        if (!cancelledRef.current) setPhase('drawing');
      }, 2000));

      timersRef.current.push(setTimeout(() => {
        if (!cancelledRef.current) setPhase('holding');
      }, 2000 + dd));

      timersRef.current.push(setTimeout(() => {
        if (!cancelledRef.current) setPhase('fading');
      }, 2000 + dd + 30000));

      timersRef.current.push(setTimeout(() => {
        if (cancelledRef.current) return;
        setPhase('gone');
        timersRef.current.push(setTimeout(() => {
          if (cancelledRef.current) return;
          const next = getNextArtwork(artworkName);
          setArtwork(next);
          cycle(next);
        }, 10000));
      }, 2000 + dd + 30000 + 3000));
    }

    cycle(startArtwork);
  }, []);

  // Main effect: runs once on mount
  useEffect(() => {
    cancelledRef.current = false;

    // 1. Get or create cycle start timestamp
    let startTime = readCycleStart();
    if (!startTime) {
      startTime = Date.now();
      writeCycleStart(startTime);
    }

    // 2. Calculate where we should be right now
    const elapsed = Date.now() - startTime;
    const state = calcState(elapsed);
    setArtwork(state.artwork);
    setPhase(state.phase);

    // 3. Schedule remaining phase transitions for the current artwork
    const { artwork: currentArt, artworkElapsed } = getArtworkElapsed(elapsed);
    const transitions = getPhaseTransitions(currentArt, artworkElapsed);

    transitions.forEach(({ delay, phase: nextPhase }) => {
      timersRef.current.push(setTimeout(() => {
        if (!cancelledRef.current) setPhase(nextPhase);
      }, delay));
    });

    // 4. When current artwork slot ends, start continuous cycling
    const totalArtworkDur = getArtworkDuration(currentArt);
    const timeUntilNext = totalArtworkDur - artworkElapsed;

    timersRef.current.push(setTimeout(() => {
      if (cancelledRef.current) return;
      const next = getNextArtwork(currentArt);
      setArtwork(next);
      runCycle(next);
    }, timeUntilNext));

    // Cleanup: cancel everything on unmount
    return () => {
      cancelledRef.current = true;
      clearAllTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const imageSrc = artwork === 'cathedral'
    ? '/images/basil-golden-lineart.png'
    : artwork === 'reindeer'
    ? '/images/golden-reindeer-lineart.png'
    : artwork === 'gum'
    ? '/images/gum-golden-lineart.png'
    : artwork === 'bolshoi'
    ? '/images/bolshoi-golden-lineart.png'
    : artwork === 'msu'
    ? '/images/msu-golden-lineart.png'
    : artwork === 'soviet'
    ? '/images/soviet-palace-golden-lineart.png'
    : '/images/st-isaac-golden-lineart.png';

  const drawDirection = artwork === 'reindeer' ? 'horizontal' : 'vertical';

  return (
    <div className={`basil-container phase-${phase} draw-${drawDirection}${cityActive ? " city-active" : ""}`}>
      <div
        className="basil-image"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      {phase === 'drawing' && (
        <div className={`basil-pen-light draw-${drawDirection}`} />
      )}
    </div>
  );
}
