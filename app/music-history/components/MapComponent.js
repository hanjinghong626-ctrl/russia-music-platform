'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { composers } from '../data/composers';
import { cities } from '../data/cities';
import RelationshipNetwork from './RelationshipNetwork';
import CityCard from './CityCard';
import './MapComponent.css';

// Custom gold marker icon
const createCustomIcon = (isActive = false, isHighlighted = false, isDimmed = false) => {
  let color = '#8B7355';
  let size = 24;
  let innerSize = 8;
  
  if (isActive) {
    color = '#D4AF37';
    size = 32;
    innerSize = 12;
  } else if (isHighlighted) {
    color = '#4A90D9';
    size = 28;
    innerSize = 10;
  }
  
  if (isDimmed) {
    color = '#3a3a3a';
  }
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-wrapper ${isActive ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}" style="
        width: ${size}px;
        height: ${size}px;
        position: relative;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          inset: 0;
          background: ${color};
          border-radius: 50%;
          box-shadow: 0 0 ${isActive ? '20px' : '10px'} ${color}80;
          animation: marker-pulse ${isActive ? '1.5s' : '2.5s'} ease-in-out infinite;
          transition: all 0.3s ease;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${innerSize}px;
          height: ${innerSize}px;
          background: #0A0E17;
          border-radius: 50%;
          border: 2px solid ${color};
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// City marker icon with music note style (for cities with images)
const createCityIcon = () => {
  const size = 14;
  
  return L.divIcon({
    className: 'city-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #D4AF37;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(212, 175, 55, 0.5), 0 0 2px rgba(212, 175, 55, 0.8);
        cursor: pointer;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};


// Smaller city marker icon for cities without images
const createSmallCityIcon = () => {
  const size = 10;
  
  return L.divIcon({
    className: 'city-marker small',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #9B8B6E;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(155, 139, 110, 0.4), 0 0 2px rgba(155, 139, 110, 0.6);
        cursor: pointer;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};


export default function MapComponent({ 
  activePeriod, 
  onComposerSelect, 
  onCitySelect,
  mapCenter = [60, 50],
  mapZoom = 4 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const cityMarkersRef = useRef([]);
  const composerMapRef = useRef({});
  
  const [relationshipMode, setRelationshipMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: 3,
      maxZoom: 12
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.control.attribution({
      position: 'bottomright',
      prefix: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    const style = document.createElement('style');
    style.id = 'rel-dynamic-styles';
    style.textContent = `
      @keyframes marker-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.8; }
      }
      @keyframes city-marker-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(212, 175, 55, 0.5), 0 4px 12px rgba(0,0,0,0.3); }
        50% { transform: scale(1.08); box-shadow: 0 0 25px rgba(212, 175, 55, 0.7), 0 4px 16px rgba(0,0,0,0.35); }
      }
      .custom-marker { background: transparent !important; border: none !important; }
      .city-marker { background: transparent !important; border: none !important; }
      .leaflet-container { background: #0A0E17 !important; font-family: 'Noto Sans SC', sans-serif; }
      .leaflet-control-zoom a {
        background: #141B2D !important;
        color: #D4AF37 !important;
        border-color: rgba(212, 175, 55, 0.3) !important;
      }
      .leaflet-control-zoom a:hover {
        background: #1E2A40 !important;
      }
      .leaflet-control-attribution {
        background: rgba(10, 14, 23, 0.8) !important;
        color: #6B7B8C !important;
        font-size: 10px !important;
      }
      .leaflet-control-attribution a { color: #B8C5D6 !important; }
      .marker-wrapper.dimmed > div:first-child {
        opacity: 0.12 !important;
        box-shadow: none !important;
        animation: none !important;
      }
      .marker-wrapper.dimmed > div:last-child {
        opacity: 0.12 !important;
        border-color: #3a3a3a !important;
      }
      .city-marker-container.small .city-marker-bg {
        animation: city-marker-pulse-small 2.5s ease-in-out infinite;
      }
      @keyframes city-marker-pulse-small {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      document.getElementById('rel-dynamic-styles')?.remove();
    };
  }, []);

  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  // Handle composer selection from city card
  const handleComposerSelectFromCard = (composerId) => {
    const composer = composers.find(c => c.id === composerId);
    if (composer && onComposerSelect) {
      onComposerSelect(composer);
    }
    setSelectedCity(null);
  };

  // Update markers when period changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    cityMarkersRef.current.forEach(marker => map.removeLayer(marker));
    cityMarkersRef.current = [];

    let filteredComposers = composers;
    if (activePeriod) {
      filteredComposers = composers.filter(c => c.period === activePeriod.id);
    }

    filteredComposers.forEach((composer) => {
      const marker = L.marker(composer.coordinates, {
        icon: createCustomIcon(false, false, false)
      });

      marker.bindTooltip(`
        <div class="marker-tooltip">
          <strong>${composer.name}</strong><br/>
          <span>${composer.birthYear}-${composer.deathYear}</span>
        </div>
      `, {
        className: 'custom-tooltip',
        direction: 'top',
        offset: [0, -12]
      });

      marker.on('click', () => {
        onComposerSelect(composer);
      });

      marker.composerId = composer.id;
      marker.addTo(map);
      markersRef.current.push(marker);
      composerMapRef.current[composer.id] = marker;
    });

    // Add city markers with special styling
    cities.forEach(city => {
      // Use different icon for cities with/without images
      const hasImage = city.image && city.image.length > 0;
      const icon = hasImage ? createCityIcon() : createSmallCityIcon();
      
      const cityMarker = L.marker(city.coords, {
        icon: icon
      });

      // Different tooltip content for cities with/without images
      const tooltipContent = hasImage
        ? `
          <div class="marker-tooltip city-tooltip">
            <strong>🎵 ${city.name}</strong><br/>
            <span>${city.nameRu}</span><br/>
            <span style="font-size: 10px; opacity: 0.7;">点击查看音乐之城</span>
          </div>
        `
        : `
          <div class="marker-tooltip city-tooltip small-city">
            <strong>♪ ${city.name}</strong><br/>
            <span>${city.nameRu}</span><br/>
            <span style="font-size: 10px; opacity: 0.7;">作曲家故乡</span>
          </div>
        `;

      cityMarker.bindTooltip(tooltipContent, {
        className: 'custom-tooltip city ' + (hasImage ? '' : 'small'),
        direction: 'top',
        offset: [0, hasImage ? -18 : -14]
      });

      // Only open CityCard for cities with images
      cityMarker.on('click', () => {
        if (city.image) {
          handleCitySelect(city);
        }
      });
      
      cityMarker.addTo(map);
      cityMarkersRef.current.push(cityMarker);
    });
  }, [activePeriod, onComposerSelect]);

  const toggleRelationshipMode = () => {
    setRelationshipMode(prev => !prev);
  };

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="leaflet-map" />
      <div className="map-overlay-tl">
        <div className="map-title">俄罗斯音乐史</div>
        <div className="map-subtitle">交互地图</div>
      </div>
      {activePeriod && (
        <div className="map-overlay-tr">
          <div 
            className="period-indicator"
            style={{ '--period-color': activePeriod.color }}
          >
            <span className="period-name">{activePeriod.name}</span>
            <span className="period-years">
              {activePeriod.startYear}-{activePeriod.endYear}
            </span>
          </div>
        </div>
      )}

      {/* Relationship Network Toggle Button */}
      <button
        className={`rel-toggle-btn ${relationshipMode ? 'active' : ''}`}
        onClick={toggleRelationshipMode}
        title={relationshipMode ? "关闭关系网" : "打开关系网"}
      >
        <svg className="rel-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="5" cy="12" r="2.5" fill="currentColor" stroke="none"/>
          <circle cx="19" cy="5" r="2.5" fill="currentColor" stroke="none"/>
          <circle cx="19" cy="19" r="2.5" fill="currentColor" stroke="none"/>
          <line x1="7.2" y1="10.5" x2="16.8" y2="6.5" strokeDasharray="3,2"/>
          <line x1="7.2" y1="13.5" x2="16.8" y2="17.5" strokeDasharray="3,2"/>
        </svg>
        关系网
      </button>

      {/* Relationship Network Panel */}
      {relationshipMode && (
        <RelationshipNetwork onClose={() => setRelationshipMode(false)} />
      )}

      {/* City Card Modal */}
      {selectedCity && (
        <CityCard 
          city={selectedCity}
          composers={composers}
          onClose={() => setSelectedCity(null)}
          onSelectComposer={handleComposerSelectFromCard}
        />
      )}

      <div className="map-instructions">
        <span>点击标记查看作曲家详情 · 点击🎵查看城市详情 · 点击"关系网"按钮查看关系网络</span>
      </div>
    </div>
  );
}
