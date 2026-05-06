'use client';
import { useEffect, useState } from 'react';
import './BasilCathedral.css';

export default function BasilCathedral({ cityActive }) {
  const [phase, setPhase] = useState('waiting');
  const [artwork, setArtwork] = useState('cathedral');

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
          setArtwork(prev => prev === 'cathedral' ? 'reindeer' : prev === 'reindeer' ? 'gum' : prev === 'gum' ? 'bolshoi' : prev === 'bolshoi' ? 'msu' : 'cathedral');
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
    : artwork === 'gum' ? '/images/gum-golden-lineart.png' : artwork === 'bolshoi' ? '/images/bolshoi-golden-lineart.png' : '/images/msu-golden-lineart.png';

  const drawDirection = artwork === 'reindeer' ? 'horizontal' : 'vertical';

  return (
    <div className={`basil-container phase-${phase} draw-${drawDirection}${cityActive ? " city-active" : ""}`}>
      <div 
        className="basil-image" 
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      {phase === 'drawing' && (
        <>
          <div className={`basil-pen-light draw-${drawDirection}`} />
        </>
      )}
    </div>
  );
}
