'use client';
import { useEffect, useState, useRef } from 'react';
import './BasilCathedral.css';

const CANVAS_W = 280;
const CANVAS_H = 380;
const DRAW_DURATION = 19000; // 19 seconds for cathedral drawing

export default function BasilCathedral({ cityActive }) {
  const [phase, setPhase] = useState('waiting');
  const [artwork, setArtwork] = useState('cathedral');
  const [dataReady, setDataReady] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const strokeDataRef = useRef(null);
  const drawnPointsRef = useRef(0);

  // Load stroke data once on mount
  useEffect(() => {
    fetch('/images/basil-stroke-data.json')
      .then(r => r.json())
      .then(data => {
        strokeDataRef.current = data;
        setDataReady(true);
      })
      .catch(err => console.error('Failed to load stroke data:', err));
  }, []);

  // Canvas drawing animation loop (cathedral only)
  useEffect(() => {
    if (artwork !== 'cathedral' || phase !== 'drawing' || !dataReady) return;

    const canvas = canvasRef.current;
    const data = strokeDataRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas and reset progress
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawnPointsRef.current = 0;

    // Set up drawing style
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
    ctx.shadowBlur = 4;

    const strokes = data.strokes;
    let totalPoints = 0;
    for (const s of strokes) {
      totalPoints += s.points.length;
    }

    const startTime = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DRAW_DURATION, 1.0);
      const targetPoint = Math.floor(progress * totalPoints);

      if (targetPoint > drawnPointsRef.current) {
        // Incrementally draw only new line segments
        let pointCount = 0;
        const drawnPoints = drawnPointsRef.current;

        for (let si = 0; si < strokes.length; si++) {
          const pts = strokes[si].points;
          const strokeStart = pointCount;
          const strokeEnd = pointCount + pts.length;

          // Skip fully drawn strokes
          if (strokeEnd <= drawnPoints) {
            pointCount = strokeEnd;
            continue;
          }
          // Skip strokes not yet reached
          if (strokeStart >= targetPoint) break;

          // Calculate the range to draw within this stroke
          const fromIdx = Math.max(0, drawnPoints - strokeStart);
          const toIdx = Math.min(pts.length, targetPoint - strokeStart);

          if (fromIdx === 0 && toIdx > 0) {
            // New stroke beginning - draw a small dot at start point
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            ctx.lineTo(pts[0][0] + 0.1, pts[0][1]);
            ctx.stroke();
          }

          for (let i = Math.max(1, fromIdx); i < toIdx; i++) {
            ctx.beginPath();
            ctx.moveTo(pts[i - 1][0], pts[i - 1][1]);
            ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.stroke();
          }

          pointCount = strokeEnd;
        }

        drawnPointsRef.current = targetPoint;
      }

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [artwork, phase, dataReady]);

  // Reset canvas when switching back to cathedral
  useEffect(() => {
    if (artwork === 'cathedral') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      }
      drawnPointsRef.current = 0;
    }
  }, [artwork]);

  // Phase cycle
  useEffect(() => {
    let timers = [];

    function startCycle() {
      const drawDuration = artwork === 'reindeer' ? 8000 : 19000;

      setPhase('waiting');
      timers.push(setTimeout(() => setPhase('drawing'), 2000));

      const holdingStart = 2000 + drawDuration;
      timers.push(setTimeout(() => setPhase('holding'), holdingStart));

      const fadingStart = holdingStart + 30000;
      timers.push(setTimeout(() => setPhase('fading'), fadingStart));

      const goneStart = fadingStart + 3000;
      timers.push(setTimeout(() => {
        setPhase('gone');
        timers.push(setTimeout(() => {
          setArtwork(prev =>
            prev === 'cathedral' ? 'reindeer'
            : prev === 'reindeer' ? 'gum'
            : prev === 'gum' ? 'bolshoi'
            : prev === 'bolshoi' ? 'msu'
            : prev === 'msu' ? 'soviet'
            : prev === 'soviet' ? 'st-isaac'
            : 'cathedral'
          );
          startCycle();
        }, 10000));
      }, goneStart));
    }

    startCycle();
    return () => timers.forEach(clearTimeout);
  }, [artwork]);

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
    <div className={`basil-container phase-${phase} draw-${drawDirection}${cityActive ? ' city-active' : ''}`}>
      {artwork === 'cathedral' && (
        <>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="basil-canvas" />
          <img src="/images/basil-golden-lineart.png" className="basil-png-fade" alt="" />
        </>
      )}
      {artwork !== 'cathedral' && (
        <div className="basil-image" style={{ backgroundImage: `url(${imageSrc})` }} />
      )}
      {phase === 'drawing' && <div className={`basil-pen-light draw-${drawDirection}`} />}
    </div>
  );
}
