'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import './BasilCathedral.css';

export default function BasilCathedral({ cityActive }) {
  const [phase, setPhase] = useState('waiting');
  const [artwork, setArtwork] = useState('cathedral');
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

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
          setArtwork(prev => prev === 'cathedral' ? 'reindeer' : prev === 'reindeer' ? 'gum' : prev === 'gum' ? 'bolshoi' : prev === 'bolshoi' ? 'msu' : prev === 'msu' ? 'soviet' : prev === 'soviet' ? 'st-isaac' : 'cathedral');
          startCycle();
        }, 10000));
      }, goneStart));
    }
    
    startCycle();
    return () => timers.forEach(clearTimeout);
  }, [artwork]);

  // Canvas stroke-by-stroke drawing
  const startDrawing = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    try {
      const res = await fetch('/images/basil-stroke-data.json');
      const data = await res.json();
      canvas.width = data.width;
      canvas.height = data.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      ctx.shadowBlur = 4;
      
      const totalStrokes = data.strokes.length;
      const totalDuration = 19000;
      const strokeDuration = totalDuration / totalStrokes;
      
      let strokeIndex = 0;
      let pointIndex = 0;
      let strokeStartTime = performance.now();
      
      function animate(timestamp) {
        const elapsed = timestamp - strokeStartTime;
        const progress = Math.min(elapsed / strokeDuration, 1);
        
        const currentStroke = data.strokes[strokeIndex];
        if (!currentStroke) return;
        
        const targetPoint = Math.floor(progress * currentStroke.points.length);
        
        if (targetPoint > pointIndex) {
          ctx.beginPath();
          ctx.moveTo(currentStroke.points[pointIndex][0], currentStroke.points[pointIndex][1]);
          for (let i = pointIndex + 1; i <= targetPoint && i < currentStroke.points.length; i++) {
            ctx.lineTo(currentStroke.points[i][0], currentStroke.points[i][1]);
          }
          ctx.stroke();
          pointIndex = targetPoint;
        }
        
        if (progress >= 1) {
          strokeIndex++;
          pointIndex = 0;
          strokeStartTime = timestamp;
        }
        
        if (strokeIndex < totalStrokes) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      }
      
      animFrameRef.current = requestAnimationFrame(animate);
    } catch (e) {
      console.error('Failed to load stroke data:', e);
    }
  }, []);

  useEffect(() => {
    if (artwork === 'cathedral' && phase === 'drawing') {
      startDrawing();
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [artwork, phase, startDrawing]);

  const imageSrc = artwork === 'cathedral' 
    ? '/images/basil-golden-lineart.png' 
    : artwork === 'reindeer'
    ? '/images/golden-reindeer-lineart.png'
    : artwork === 'gum'
    ? '/images/gum-golden-lineart.png'
    : artwork === 'bolshoi' ? '/images/bolshoi-golden-lineart.png' : artwork === 'msu' ? '/images/msu-golden-lineart.png' : artwork === 'soviet' ? '/images/soviet-palace-golden-lineart.png' : '/images/st-isaac-golden-lineart.png';

  const drawDirection = artwork === 'reindeer' ? 'horizontal' : 'vertical';

  return (
    <div className={`basil-container phase-${phase} draw-${drawDirection}${cityActive ? " city-active" : ""}`}>
      {artwork === 'cathedral' ? (
        <canvas ref={canvasRef} className="basil-canvas" />
      ) : (
        <div 
          className="basil-image" 
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}
      {phase === 'drawing' && artwork !== 'cathedral' && (
        <>
          <div className={`basil-pen-light draw-${drawDirection}`} />
        </>
      )}
    </div>
  );
}
