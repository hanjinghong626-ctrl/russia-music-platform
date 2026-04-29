'use client';

import { useEffect, useState } from 'react';
import './ComposerCard.css';

export default function ComposerCard({ composer, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (composer) {
      setIsVisible(true);
    }
  }, [composer]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!composer) return null;

  const periodThemes = {
    'orthodox': { primary: '#8B7355', accent: '#1E3A5F' },
    'russian-soul': { primary: '#D4AF37', accent: '#8B0000' },
    'steel-rose': { primary: '#6B5B95', accent: '#FF4444' }
  };

  const theme = periodThemes[composer.period] || periodThemes['russian-soul'];

  return (
    <div 
      className={`composer-card-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div 
        className="composer-card"
        style={{
          '--card-primary': theme.primary,
          '--card-accent': theme.accent
        }}
      >
        <div className="card-bloom"></div>
        
        <button className="card-close" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="card-header">
          <div className="card-avatar">
            <span className="card-initial">{composer.name.charAt(0)}</span>
            <div className="card-avatar-ring"></div>
          </div>
          <div className="card-titles">
            <h2 className="card-name">{composer.name}</h2>
            <p className="card-name-ru">{composer.nameRu}</p>
            <p className="card-name-en">{composer.nameEn}</p>
          </div>
        </div>

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-label">生卒年份</span>
            <span className="meta-value">{composer.birthYear} - {composer.deathYear}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">学派</span>
            <span className="meta-value">{composer.school}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">主要城市</span>
            <span className="meta-value">{composer.mainCity}</span>
          </div>
        </div>

        <div className="card-genres">
          {composer.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>

        <div className="card-description">
          <p>{composer.description}</p>
        </div>

        <div className="card-works">
          <h3 className="section-title">代表作品</h3>
          <div className="works-list">
            {composer.works.map((work, index) => (
              <div key={index} className="work-item">
                <span className="work-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="work-info">
                  <span className="work-title">{work.title}</span>
                  <span className="work-title-ru">{work.titleRu}</span>
                  <span className="work-year">{work.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {composer.quote && (
          <div className="card-quote">
            <div className="quote-mark">"</div>
            <p>{composer.quote}</p>
          </div>
        )}

        <div className="card-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-note">♪</div>
          <div className="decoration-line"></div>
        </div>
      </div>
    </div>
  );
}
