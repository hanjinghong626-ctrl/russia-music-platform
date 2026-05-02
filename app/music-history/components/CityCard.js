'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './CityCard.css';

export default function CityCard({ city, composers, onClose, onSelectComposer }) {
  const [animationState, setAnimationState] = useState('entering');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('visible');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = useCallback(() => {
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClose]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setMousePosition({ x: mouseX, y: mouseY });
    
    if (imageRef.current) {
      const imageMoveX = mouseX * 0.008;
      const imageMoveY = mouseY * 0.008;
      imageRef.current.style.transform = `translateY(${-3 + Math.sin(Date.now() / 1000) * 3}px) translate(${imageMoveX}px, ${imageMoveY}px)`;
    }
    
    if (infoRef.current) {
      const infoMoveX = mouseX * 0.003;
      const infoMoveY = mouseY * 0.003;
      infoRef.current.style.transform = `translate(${infoMoveX}px, ${infoMoveY}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
    if (imageRef.current) {
      imageRef.current.style.transform = 'translateY(0px)';
    }
    if (infoRef.current) {
      infoRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  const getComposersByCity = (composerIds) => {
    return composerIds
      .map(id => composers.find(c => c.id === id))
      .filter(Boolean);
  };

  const cityComposers = getComposersByCity(city.composers);

  const getInitials = (name) => {
    return name.charAt(0);
  };

  const handleComposerClick = (composerId) => {
    if (onSelectComposer) {
      onSelectComposer(composerId);
      handleClose();
    }
  };

  const overlayClass = animationState === 'entering' 
    ? 'city-card-overlay entering' 
    : animationState === 'exiting' 
      ? 'city-card-overlay exiting' 
      : 'city-card-overlay';

  return (
    <div 
      className={overlayClass}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        ref={cardRef}
        className="city-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button className="city-card-close" onClick={handleClose}>
          ✕
        </button>
        
        <div className="city-card-image-section">
          <div className="city-card-image-wrapper" ref={imageRef}>
            <img 
              src={city.image} 
              alt={city.name}
              className="city-card-image"
            />
          </div>
        </div>
        
        <div className="city-card-info-section" ref={infoRef}>
          <div className="city-card-content">
            <div className="city-card-title">
              <h2>{city.name}</h2>
              <div className="name-ru">{city.nameRu}</div>
              <div className="name-en">{city.nameEn}</div>
            </div>
            
            <div className="city-card-description">
              <p className="desc-ru">{city.descriptionRu}</p>
              <p>{city.description}</p>
            </div>
            
            <div className="city-card-landmarks">
              <h3>音乐地标</h3>
              {city.musicLandmarks.map((landmark, index) => (
                <div key={index} className="landmark-item">
                  <div className="landmark-name">{landmark.name}</div>
                  <div className="landmark-name-ru">{landmark.nameRu}</div>
                  <div className="landmark-desc">{landmark.desc}</div>
                </div>
              ))}
            </div>
            
            <div className="city-card-composers">
              <h3>关联作曲家</h3>
              <div className="composers-grid">
                {cityComposers.map((composer) => (
                  <div 
                    key={composer.id}
                    className="composer-chip"
                    onClick={() => handleComposerClick(composer.id)}
                  >
                    <div className="avatar">
                      {composer.portrait ? (
                        <img 
                          src={composer.portrait} 
                          alt={composer.name}
                          style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                        />
                      ) : (
                        getInitials(composer.name)
                      )}
                    </div>
                    <span className="name">{composer.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
