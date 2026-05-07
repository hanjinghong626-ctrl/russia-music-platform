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
  const pngImageRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const lastDrawnPointRef = useRef(0);

  // Load stroke data and PNG image once on mount
  useEffect(() => {
    let strokesLoaded = false;
    let imageLoaded = false;

    function checkBoth() {
      if (strokesLoaded && imageLoaded) setDataReady(true);
    }

    fetch('/images/basil-stroke-data.json')
      .then(r => r.json())
      .then(data => {
        strokeDataRef.current = data;
        strokesLoaded = true;
        checkBoth();
      })
      .catch(err => console.error('Failed to load stroke data:', err));

    const img = new Image();
    img.onload = () => {
      pngImageRef.current = img;
      imageLoaded = true;
      checkBoth();
    };
    img.src = '/images/basil-golden-lineart.png';
  }, []);

  // Helper: ensure offscreen mask canvas exists
  function ensureMaskCanvas() {
    if (!maskCanvasRef.current) {
      const mc = document.createElement('canvas');
      mc.width = CANVAS_W;
      mc.height = CANVAS_H;
      maskCanvasRef.current = mc;
    }
    return maskCanvasRef.current;
  }

  // Reset mask to fully opaque black (hides everything)
  function resetMask() {
    const mc = ensureMaskCanvas();
    const mctx = mc.getContext('2d');
    mctx.globalCompositeOperation = 'source-over';
    mctx.fillStyle = '#000000';
    mctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    lastDrawnPointRef.current = 0;
  }

  // Render visible canvas: PNG with mask applied
  // mask black areas → erase PNG → transparent → page bg shows through
  // mask transparent areas → PNG remains visible
  function renderFrame() {
    const canvas = canvasRef.current;
    const pngImage = pngImageRef.current;
    const maskCanvas = ensureMaskCanvas();
    if (!canvas || !pngImage) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw PNG image scaled to canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(pngImage, 0, 0, CANVAS_W, CANVAS_H);

    // Apply mask: black areas in mask erase PNG
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(maskCanvas, 0, 0);

    ctx.globalCompositeOperation = 'source-over';
  }

  // Incrementally erase strokes on mask
  function eraseStrokesOnMask(strokes, targetPoint) {
    const mc = ensureMaskCanvas();
    const mctx = mc.getContext('2d');

    mctx.globalCompositeOperation = 'destination-out';
    mctx.strokeStyle = 'rgba(255,255,255,1)';
    mctx.lineWidth = 4;
    mctx.lineCap = 'round';
    mctx.lineJoin = 'round';

    let pointCount = 0;

    for (let si = 0; si < strokes.length; si++) {
      const stroke = strokes[si];
      const pts = stroke.points;
      const strokeLen = pts.length;
      const strokeEnd = pointCount + strokeLen;

      if (strokeEnd <= lastDrawnPointRef.current) {
        pointCount = strokeEnd;
        continue;
      }

      if (pointCount >= targetPoint) {
        break;
      }

      const startIdx = Math.max(0, lastDrawnPointRef.current - pointCount);
      const endIdx = Math.min(strokeLen, targetPoint - pointCount);

      if (endIdx - startIdx >= 2) {
        mctx.beginPath();
        const drawStart = Math.max(0, startIdx - 1);
        mctx.moveTo(pts[drawStart][0], pts[drawStart][1]);
        for (let i = drawStart + 1; i < endIdx; i++) {
          mctx.lineTo(pts[i][0], pts[i][1]);
        }
        mctx.stroke();
      }

      pointCount = strokeEnd;
    }

    mctx.globalCompositeOperation = 'source-over';
    lastDrawnPointRef.current = targetPoint;
  }

  // Drawing animation loop (cathedral only)
  useEffect(() => {
    if (artwork !== 'cathedral' || phase !== 'drawing' || !dataReady) return;

    const data = strokeDataRef.current;
    if (!data || !pngImageRef.current) return;

    // Reset mask and render initial blank state
    resetMask();
    renderFrame();

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

      if (targetPoint > lastDrawnPointRef.current) {
        eraseStrokesOnMask(strokes, targetPoint);
        renderFrame();
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

  // Setup canvas dimensions and initial state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    if (artwork === 'cathedral') {
      resetMask();
      renderFrame();
    }
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
      {artwork === 'cathedral' ? (
        <canvas
          ref={canvasRef}
          className="basil-canvas"
        />
      ) : (
        <div
          className="basil-image"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}
      {phase === 'drawing' && (
        <div className={`basil-pen-light draw-${drawDirection}`} />
      )}
    </div>
  );
}
