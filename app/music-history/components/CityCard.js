'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './CityCard.css';

// 音效管理器 - Phase 5
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = false;
    this.masterGain = null;
  }

  init() {
    if (this.audioContext) return;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioContext.destination);
  }

  enable() {
    this.init();
    this.enabled = true;
    this.masterGain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.5);
  }

  disable() {
    if (!this.audioContext) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
    setTimeout(() => {
      this.enabled = false;
    }, 300);
  }

  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  // 卡片打开音效 - 柔和的和弦
  playCardOpen() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;
    
    // 和弦音
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5 + i * 0.1);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now + i * 0.1);
      osc.stop(now + 2);
    });
  }

  // 地标hover音效 - 清脆叮咚
  playLandmarkHover() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 昼夜切换音效 - 环境音过渡
  playDayNightSwitch(isNight) {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = isNight ? 220 : 440;
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

const soundManager = new SoundManager();

export default function CityCard({ city, composers, onClose, onSelectComposer }) {
  const [animationState, setAnimationState] = useState('entering');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isNight, setIsNight] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);
  const glowRef = useRef(null);
  const snowflakesRef = useRef(null);
  const auroraRef = useRef(null);

  // Phase 4: 检测昼夜 (莫斯科时间 UTC+3)
  useEffect(() => {
    const checkDayNight = () => {
      const now = new Date();
      const moscowHour = (now.getUTCHours() + 3) % 24;
      setIsNight(moscowHour < 6 || moscowHour >= 21);
    };
    
    checkDayNight();
    const interval = setInterval(checkDayNight, 60000);
    return () => clearInterval(interval);
  }, []);

  // Phase 2: 3D倾斜效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('visible');
      soundManager.playCardOpen();
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

  // Phase 2: 增强视差 + 3D倾斜
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setMousePosition({ x: mouseX, y: mouseY });
    
    // 3D倾斜 - 克制幅度
    const tiltX = (mouseY / rect.height) * -4;
    const tiltY = (mouseX / rect.width) * 4;
    setTilt({ x: tiltX, y: tiltY });
    
    // 图片层 - 移动速率0.012倍
    if (imageRef.current) {
      const imageMoveX = mouseX * 0.012;
      const imageMoveY = mouseY * 0.012;
      const floatY = Math.sin(Date.now() / 1500) * 4;
      imageRef.current.style.transform = `translateY(${floatY}px) translate(${imageMoveX}px, ${imageMoveY}px) rotate3d(1, 0, 0, ${tiltX * 0.5}deg) rotate3d(0, 1, 0, ${-tiltY * 0.5}deg)`;
    }
    
    // 信息层 - 移动速率0.004倍
    if (infoRef.current) {
      const infoMoveX = mouseX * 0.004;
      const infoMoveY = mouseY * 0.004;
      infoRef.current.style.transform = `translate(${infoMoveX}px, ${infoMoveY}px) rotate3d(0, 1, 0, ${tiltY * 0.3}deg)`;
    }
    
    // 边缘光晕效果 - 跟随鼠标
    if (glowRef.current) {
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
    if (imageRef.current) {
      imageRef.current.style.transform = 'translateY(0px) rotate3d(0, 0, 0, 0deg)';
    }
    if (infoRef.current) {
      infoRef.current.style.transform = 'translate(0px, 0px) rotate3d(0, 0, 0, 0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  // Phase 3: 地标热点hover
  const handleLandmarkHover = useCallback((index) => {
    setActiveLandmark(index);
    soundManager.playLandmarkHover();
  }, []);

  // Phase 4: 昼夜切换
  const toggleDayNight = useCallback(() => {
    setIsNight(prev => !prev);
    soundManager.playDayNightSwitch(!isNight);
  }, [isNight]);

  // Phase 5: 音效开关
  const toggleSound = useCallback(() => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
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

  // 城市特定的热点数据 - Phase 3
  const getLandmarkSpots = () => {
    if (city.id === 'moscow') {
      return [
        { x: 30, y: 45, name: 'Московская консерватория', nameCn: '莫斯科音乐学院' },
        { x: 55, y: 55, name: 'Большой театр', nameCn: '大剧院' },
        { x: 70, y: 35, name: 'Московский Кремль', nameCn: '克里姆林宫' }
      ];
    } else if (city.id === 'st-petersburg') {
      return [
        { x: 35, y: 50, name: 'Санкт-Петербургская консерватория', nameCn: '圣彼得堡音乐学院' },
        { x: 60, y: 60, name: 'Мариинский театр', nameCn: '马林斯基剧院' },
        { x: 25, y: 40, name: 'Эрмитаж', nameCn: '冬宫' }
      ];
    }
    return [];
  };

  const landmarkSpots = getLandmarkSpots();

  return (
    <div 
      className={overlayClass}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        ref={cardRef}
        className={`city-card ${isNight ? 'night-mode' : 'day-mode'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <button className="city-card-close" onClick={handleClose}>
          ✕
        </button>
        
        {/* 控制按钮 */}
        <div className="city-card-controls">
          <button 
            className={`control-btn ${isNight ? 'active' : ''}`} 
            onClick={toggleDayNight}
            title={isNight ? '切换白天' : '切换夜间'}
          >
            {isNight ? '☾' : '☀'}
          </button>
          <button 
            className={`control-btn sound-btn ${soundEnabled ? 'active' : ''}`} 
            onClick={toggleSound}
            title={soundEnabled ? '关闭音效' : '开启音效'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <div className="city-card-image-section">
          {/* Phase 4: 昼夜效果 */}
          {isNight && city.id === 'st-petersburg' && (
            <div className="aurora-overlay" ref={auroraRef}>
              <div className="aurora-waves"></div>
              <div className="stars"></div>
            </div>
          )}
          
          {isNight && city.id === 'moscow' && (
            <div className="snow-overlay" ref={snowflakesRef}>
              {[...Array(30)].map((_, i) => (
                <div key={i} className="snowflake" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}></div>
              ))}
            </div>
          )}
          
          <div className="city-card-image-wrapper" ref={imageRef}>
            <img 
              src={city.image} 
              alt={city.name}
              className="city-card-image"
            />
            
            {/* Phase 3: 热点标记 */}
            {landmarkSpots.map((spot, index) => (
              <div 
                key={index}
                className={`landmark-spot ${activeLandmark === index ? 'active' : ''}`}
                style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` }}
                onMouseEnter={() => handleLandmarkHover(index)}
              >
                <div className="spot-pulse"></div>
                <div className="spot-icon">♪</div>
                <div className="spot-tooltip">
                  <span className="spot-name-ru">{spot.name}</span>
                  <span className="spot-name-cn">{spot.nameCn}</span>
                </div>
              </div>
            ))}
            
            {/* Phase 4: 夜间窗户灯光 */}
            {isNight && <div className="night-lights-overlay"></div>}
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
                <div 
                  key={index} 
                  className={`landmark-item ${activeLandmark === index ? 'highlighted' : ''}`}
                  onMouseEnter={() => handleLandmarkHover(index)}
                >
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
          
          {/* 边缘光晕效果 */}
          <div ref={glowRef} className="card-glow-overlay"></div>
        </div>
      </div>
    </div>
  );
}
