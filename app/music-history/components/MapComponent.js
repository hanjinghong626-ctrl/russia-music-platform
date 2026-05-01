'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { composers } from '../data/composers';
import { cities } from '../data/cities';
import { periods } from '../data/periods';
import './MapComponent.css';

// Custom gold marker icon
const createCustomIcon = (isActive = false, composer = null) => {
  const color = isActive ? '#D4AF37' : '#8B7355';
  const size = isActive ? 32 : 24;
  const innerSize = isActive ? 12 : 8;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-wrapper ${isActive ? 'active' : ''}" style="
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

// City marker icon
const createCityIcon = (importance = 3) => {
  const sizes = { 5: 28, 4: 22, 3: 18, 2: 14 };
  const size = sizes[importance] || 18;
  
  return L.divIcon({
    className: 'city-marker',
    html: `
      <div class="city-wrapper importance-${importance}" style="
        width: ${size}px;
        height: ${size}px;
      ">
        <div class="city-dot"></div>
        <div class="city-ring"></div>
      </div>
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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: 3,
      maxZoom: 12
    });

    // Add dark tile layer (CartoDB Dark Matter - free, no API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add CSS for markers
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marker-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.8; }
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
      .leaflet-control-attribution a {
        color: #B8C5D6 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when period changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    cityMarkersRef.current.forEach(marker => map.removeLayer(marker));
    cityMarkersRef.current = [];

    // Filter composers by period
    let filteredComposers = composers;
    if (activePeriod) {
      filteredComposers = composers.filter(c => c.period === activePeriod.id);
    }

    // Add composer markers
    filteredComposers.forEach((composer, index) => {
      const marker = L.marker(composer.coordinates, {
        icon: createCustomIcon(false, composer)
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

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Add city markers
    cities.forEach(city => {
      const cityMarker = L.marker(city.coordinates, {
        icon: createCityIcon(city.importance)
      });

      cityMarker.bindTooltip(`
        <div class="marker-tooltip city-tooltip">
          <strong>${city.name}</strong><br/>
          <span>${city.nameRu}</span>
        </div>
      `, {
        className: 'custom-tooltip city',
        direction: 'top',
        offset: [0, -10]
      });

      cityMarker.on('click', () => {
        onCitySelect(city);
      });

      cityMarker.addTo(map);
      cityMarkersRef.current.push(cityMarker);
    });
  }, [activePeriod, onComposerSelect, onCitySelect]);

  // Fly to composer when selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
  }, []);

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
      <div className="map-instructions">
        <span>点击标记查看作曲家详情</span>
      </div>
    </div>
  );
}
