'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { periods } from './data/periods';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import ComposerCard from './components/ComposerCard';
import './globals.css';

// Dynamic import MapComponent with ssr: false (Leaflet requires window)
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="loading-spinner"></div>
      <p>正在加载地图...</p>
    </div>
  )
});

export default function MusicHistoryPage() {
  const [activePeriod, setActivePeriod] = useState(periods[2]); // Start with national foundation
  const [selectedComposer, setSelectedComposer] = useState(null);

  const handlePeriodChange = useCallback((period) => {
    setActivePeriod(period);
    setSelectedComposer(null);
  }, []);

  const handleComposerSelect = useCallback((composer) => {
    setSelectedComposer(composer);
  }, []);

  const handleComposerClose = useCallback(() => {
    setSelectedComposer(null);
  }, []);

  const handleCitySelect = useCallback((city) => {
    // Could be expanded to show city details
    console.log('City selected:', city);
  }, []);

  return (
    <div className="music-history-page">
      <header className="page-header">
        <div className="header-logo">
          <span className="logo-icon">♪</span>
          <span className="logo-text">俄罗斯音乐史</span>
        </div>
        <nav className="header-nav">
          <a href="/" className="nav-link">返回首页</a>
          <a href="/music-history" className="nav-link active">交互地图</a>
        </nav>
      </header>

      <main className="page-main">
        <Sidebar 
          activePeriod={activePeriod}
          selectedComposer={selectedComposer}
          onComposerSelect={handleComposerSelect}
        />
        
        <div className="map-container">
          {/* 穹顶暗角效果 */}
          <div className="cupola-vignette"></div>
          <MapComponent
            activePeriod={activePeriod}
            onComposerSelect={handleComposerSelect}
            onCitySelect={handleCitySelect}
          />
        </div>
      </main>

      <Timeline 
        activePeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
      />

      <ComposerCard 
        composer={selectedComposer}
        onClose={handleComposerClose}
      />
    </div>
  );
}
