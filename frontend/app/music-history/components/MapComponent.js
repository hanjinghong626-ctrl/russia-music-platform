'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { composers } from '../data/composers';
import { cities } from '../data/cities';
import { periods } from '../data/periods';
import { relationships, relationshipConfig } from '../data/relationships';
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

// Arrow head SVG for relationship lines
const createArrowHead = (color) => {
  return L.divIcon({
    className: 'arrow-head',
    html: `<svg width="12" height="10" viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 L12 5 L0 10 Z" fill="${color}" opacity="0.85"/>
    </svg>`,
    iconSize: [12, 10],
    iconAnchor: [12, 5]
  });
};

// Calculate bezier curve control point
const getBezierPoints = (start, end, offset = 0) => {
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.001) return [start, start, end];
  
  const midX = (start.lng + end.lng) / 2;
  const midY = (start.lat + end.lat) / 2;
  const perpX = -dy / dist;
  const perpY = dx / dist;
  const curveStrength = Math.min(dist * 0.2, 15);
  
  const ctrlX = midX + perpX * curveStrength + offset;
  const ctrlY = midY + perpY * curveStrength + offset;
  
  return [
    { lat: start.lat, lng: start.lng },
    { lat: ctrlY, lng: ctrlX },
    { lat: end.lat, lng: end.lng }
  ];
};

// Draw a bezier curve as multiple line segments
const drawBezierLine = (map, start, end, color, pattern, weight = 2, offset = 0) => {
  const points = getBezierPoints(start, end, offset);
  
  const curvePoints = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const lat = (1-t)*(1-t)*points[0].lat + 2*(1-t)*t*points[1].lat + t*t*points[2].lat;
    const lng = (1-t)*(1-t)*points[0].lng + 2*(1-t)*t*points[1].lng + t*t*points[2].lng;
    curvePoints.push([lat, lng]);
  }
  
  let dashArray = null;
  if (pattern === 'dashed') dashArray = '8, 6';
  else if (pattern === 'dotted') dashArray = '3, 5';
  
  return L.polyline(curvePoints, {
    color: color,
    weight: weight,
    opacity: 0,
    dashArray: dashArray,
    className: 'relationship-line'
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
  const relationshipLinesRef = useRef([]);
  const composerMapRef = useRef({});
  
  const [relationshipMode, setRelationshipMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    mentor: true,
    influence: true,
    collaboration: true,
    opposition: true
  });
  const [selectedComposerId, setSelectedComposerId] = useState(null);
  const selectedComposerIdRef = useRef(null);
  const activeFiltersRef = useRef(activeFilters);
  const relationshipModeRef = useRef(relationshipMode);

  // Keep refs in sync with state
  useEffect(() => { selectedComposerIdRef.current = selectedComposerId; }, [selectedComposerId]);
  useEffect(() => { activeFiltersRef.current = activeFilters; }, [activeFilters]);
  useEffect(() => { relationshipModeRef.current = relationshipMode; }, [relationshipMode]);

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
      .relationship-line {
        transition: opacity 0.4s ease, stroke-width 0.2s ease;
      }
      .arrow-head { background: transparent !important; border: none !important; }
      .relationship-tooltip {
        background: #141B2D !important;
        border: 1px solid rgba(212, 175, 55, 0.4) !important;
        border-radius: 6px !important;
        padding: 6px 10px !important;
        font-family: 'Noto Sans SC', sans-serif !important;
        font-size: 12px !important;
        color: #F5F5F5 !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
        white-space: nowrap;
      }
      .relationship-tooltip::before {
        border-top-color: rgba(212, 175, 55, 0.4) !important;
      }
      .marker-wrapper.dimmed > div:first-child {
        opacity: 0.12 !important;
        box-shadow: none !important;
        animation: none !important;
      }
      .marker-wrapper.dimmed > div:last-child {
        opacity: 0.12 !important;
      }
      .marker-wrapper.highlighted > div:first-child {
        box-shadow: 0 0 16px #4A90D980 !important;
      }
      .rel-toggle-btn {
        position: absolute;
        top: 16px;
        right: 140px;
        z-index: 1001;
        background: rgba(20, 27, 45, 0.92);
        border: 1px solid rgba(212, 175, 55, 0.4);
        border-radius: 8px;
        padding: 8px 14px;
        color: #D4AF37;
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(4px);
        transition: all 0.2s ease;
      }
      .rel-toggle-btn:hover {
        background: rgba(212, 175, 55, 0.15);
        border-color: #D4AF37;
      }
      .rel-toggle-btn.active {
        background: rgba(212, 175, 55, 0.2);
        border-color: #D4AF37;
        color: #F4E4BA;
        box-shadow: 0 0 12px rgba(212, 175, 55, 0.2);
      }
      .rel-toggle-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      .relationship-panel {
        position: absolute;
        top: 58px;
        right: 140px;
        z-index: 1001;
        background: rgba(20, 27, 45, 0.95);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 10px;
        padding: 14px 16px;
        min-width: 185px;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
      }
      .relationship-panel h3 {
        font-family: 'Noto Serif SC', serif;
        font-size: 13px;
        color: #D4AF37;
        margin: 0 0 10px 0;
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        padding-bottom: 8px;
      }
      .filter-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 7px 0;
        cursor: pointer;
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 12px;
        color: #B8C5D6;
        user-select: none;
      }
      .filter-item input {
        accent-color: #D4AF37;
        cursor: pointer;
        width: 14px;
        height: 14px;
      }
      .filter-dot {
        width: 22px;
        height: 3px;
        border-radius: 2px;
        flex-shrink: 0;
      }
      .rel-legend {
        position: absolute;
        bottom: 130px;
        left: 16px;
        z-index: 1000;
        background: rgba(20, 27, 45, 0.9);
        border: 1px solid rgba(212, 175, 55, 0.2);
        border-radius: 8px;
        padding: 10px 14px;
        backdrop-filter: blur(6px);
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 11px;
        color: #B8C5D6;
      }
      .rel-legend-title {
        font-size: 11px;
        color: #6B7B8C;
        margin-bottom: 6px;
      }
      .rel-legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
      .rel-legend-line {
        width: 26px;
        height: 2px;
        border-radius: 1px;
        flex-shrink: 0;
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

  // Build composer lookup map
  useEffect(() => {
    composers.forEach(c => {
      composerMapRef.current[c.id] = c;
    });
  }, []);

  // Draw all relationship lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    relationshipLinesRef.current.forEach(layer => map.removeLayer(layer));
    relationshipLinesRef.current = [];

    console.log('[RelNet] Drawing relationship lines, total:', relationships.length);

    relationships.forEach((rel, idx) => {
      const fromComposer = composerMapRef.current[rel.from];
      const toComposer = composerMapRef.current[rel.to];
      if (!fromComposer || !toComposer) return;

      const config = relationshipConfig[rel.type];
      if (!config) return;

      const samePairCount = relationships.filter(
        r => (r.from === rel.from && r.to === rel.to) || (r.from === rel.to && r.to === rel.from)
      ).length;
      const pairIdx = relationships
        .slice(0, idx)
        .filter(r => (r.from === rel.from && r.to === rel.to) || (r.from === rel.to && r.to === rel.from))
        .length;
      const offset = samePairCount > 1 ? (pairIdx - (samePairCount - 1) / 2) * 3 : 0;

      const line = drawBezierLine(
        map,
        { lat: fromComposer.coordinates[0], lng: fromComposer.coordinates[1] },
        { lat: toComposer.coordinates[0], lng: toComposer.coordinates[1] },
        config.color,
        config.pattern,
        2,
        offset
      );

      line.relData = rel;
      line.relIdx = idx;
      line.relConfig = config;

      line.bindTooltip(`
        <div>
          <span style="color:${config.color};font-weight:600;">[${config.label}]</span>
          <span style="margin-left:5px;">${rel.label}</span>
        </div>
      `, {
        className: 'relationship-tooltip',
        direction: 'top',
        offset: [0, -5],
        opacity: 0
      });

      line.on('mouseover', () => line.setStyle({ weight: 3.5, opacity: 0.9 }));
      line.on('mouseout', () => {
        if (!line.isHighlighted) line.setStyle({ weight: 2, opacity: 0 });
      });

      line.addTo(map);
      relationshipLinesRef.current.push(line);

      if (config.arrow) {
        const endCoord = toComposer.coordinates;
        const arrowIcon = createArrowHead(config.color);
        const arrowMarker = L.marker([endCoord[0], endCoord[1]], {
          icon: arrowIcon,
          interactive: false,
          opacity: 0
        });
        arrowMarker.relLine = line;
        arrowMarker.relConfig = config;
        arrowMarker.addTo(map);
        relationshipLinesRef.current.push(arrowMarker);
      }
    });
  }, []);

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
        if (relationshipModeRef.current) {
          handleRelationshipClick(composer.id);
        }
      });

      marker.composerId = composer.id;
      marker.addTo(map);
      markersRef.current.push(marker);
    });

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

      cityMarker.on('click', () => onCitySelect(city));
      cityMarker.addTo(map);
      cityMarkersRef.current.push(cityMarker);
    });
  }, [activePeriod, onComposerSelect, onCitySelect, relationshipMode]);

  const handleRelationshipClick = (composerId) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    console.log('[RelNet] Click on composer:', composerId, 'lines:', relationshipLinesRef.current.length);

    if (selectedComposerIdRef.current === composerId) {
      // Deselect - go back to showing all lines at low opacity
      setSelectedComposerId(null);
      // Don't call resetHighlight - let the useEffect handle it
      // Just reset marker styles
      markersRef.current.forEach(marker => {
        marker.setIcon(createCustomIcon(false, false, false));
      });
      return;
    }

    setSelectedComposerId(composerId);

    const relatedIds = new Set();
    relationships.forEach(rel => {
      if (rel.from === composerId) relatedIds.add(rel.to);
      if (rel.to === composerId) relatedIds.add(rel.from);
    });

    console.log('[RelNet] Related IDs:', [...relatedIds]);

    markersRef.current.forEach(marker => {
      const cid = marker.composerId;
      if (cid === composerId) {
        marker.setIcon(createCustomIcon(true, false, false));
      } else if (relatedIds.has(cid)) {
        marker.setIcon(createCustomIcon(false, true, false));
      } else {
        marker.setIcon(createCustomIcon(false, false, true));
      }
    });

    // The useEffect with [relationshipMode, activeFilters, selectedComposerId] 
    // will handle highlighting lines when selectedComposerId changes
  };

  const resetHighlight = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(marker => {
      marker.setIcon(createCustomIcon(false, false, false));
    });
    // Line visibility is handled by the useEffect
  };

  const toggleRelationshipMode = () => {
    const newMode = !relationshipMode;
    setRelationshipMode(newMode);
    if (!newMode) {
      setSelectedComposerId(null);
      resetHighlight();
    }
  };

  // Show/hide relationship lines based on mode and selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!relationshipMode) {
      // Hide all lines when mode is off
      relationshipLinesRef.current.forEach(layer => {
        if (!layer.relData) return;
        if (layer.setStyle) layer.setStyle({ opacity: 0, weight: 2 });
        if (layer._icon) layer._icon.style.opacity = '0';
        if (layer.setOpacity) layer.setOpacity(0);
      });
      return;
    }

    if (selectedComposerId) {
      // Highlight selected composer's relationships
      const relatedIds = new Set();
      relationships.forEach(rel => {
        if (rel.from === selectedComposerId) relatedIds.add(rel.to);
        if (rel.to === selectedComposerId) relatedIds.add(rel.from);
      });

      relationshipLinesRef.current.forEach(layer => {
        if (!layer.relData) return;
        const rel = layer.relData;
        const isRelevant = rel.from === selectedComposerId || rel.to === selectedComposerId;
        const passesFilter = activeFilters[rel.type];

        if (isRelevant && passesFilter) {
          if (layer.setStyle) layer.setStyle({ opacity: 0.85, weight: 2.5 });
          if (layer._icon) layer._icon.style.opacity = '1';
          if (layer.setOpacity) layer.setOpacity(1);
          layer.isHighlighted = true;
        } else {
          if (layer.setStyle) layer.setStyle({ opacity: 0.03, weight: 1 });
          if (layer._icon) layer._icon.style.opacity = '0.03';
          if (layer.setOpacity) layer.setOpacity(0.03);
          layer.isHighlighted = false;
        }
      });
    } else {
      // Show all lines at low opacity when no composer selected
      relationshipLinesRef.current.forEach(layer => {
        if (!layer.relData) return;
        const passesFilter = activeFilters[layer.relData.type];
        if (passesFilter) {
          if (layer.setStyle) layer.setStyle({ opacity: 0.18, weight: 1.5 });
          if (layer._icon) layer._icon.style.opacity = '0.25';
          if (layer.setOpacity) layer.setOpacity(0.25);
        } else {
          if (layer.setStyle) layer.setStyle({ opacity: 0, weight: 1.5 });
          if (layer._icon) layer._icon.style.opacity = '0';
          if (layer.setOpacity) layer.setOpacity(0);
        }
        layer.isHighlighted = false;
      });
    }
  }, [relationshipMode, activeFilters, selectedComposerId]);

  const handleFilterChange = (type) => {
    const newFilters = { ...activeFilters, [type]: !activeFilters[type] };
    setActiveFilters(newFilters);
    if (selectedComposerId) {
      handleRelationshipClick(selectedComposerId);
    }
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

      {/* Relationship Network Toggle */}
      <button
        className={`rel-toggle-btn ${relationshipMode ? 'active' : ''}`}
        onClick={toggleRelationshipMode}
        title="点击切换关系网模式"
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

      {/* Relationship Filter Panel */}
      {relationshipMode && (
        <div className="relationship-panel">
          <h3>关系类型筛选</h3>
          {Object.entries(relationshipConfig).map(([type, config]) => (
            <label key={type} className="filter-item">
              <input
                type="checkbox"
                checked={activeFilters[type]}
                onChange={() => handleFilterChange(type)}
              />
              <span
                className="filter-dot"
                style={{ background: config.color, opacity: config.pattern === 'dashed' ? 0.7 : config.pattern === 'dotted' ? 0.6 : 1 }}
              />
              {config.label}
            </label>
          ))}
        </div>
      )}

      {/* Relationship Legend */}
      {relationshipMode && (
        <div className="rel-legend">
          <div className="rel-legend-title">图例</div>
          <div className="rel-legend-item">
            <span className="rel-legend-line" style={{ background: '#D4AF37' }}/>
            <span>师承 →</span>
          </div>
          <div className="rel-legend-item">
            <span className="rel-legend-line" style={{ background: '#888888', backgroundImage: 'linear-gradient(90deg, #888888 50%, transparent 50%)', backgroundSize: '8px 2px', backgroundRepeat: 'repeat-x' }}/>
            <span>影响 →</span>
          </div>
          <div className="rel-legend-item">
            <span className="rel-legend-line" style={{ background: '#4A90D9', backgroundImage: 'linear-gradient(90deg, #4A90D9 30%, transparent 30%)', backgroundSize: '5px 2px', backgroundRepeat: 'repeat-x' }}/>
            <span>合作</span>
          </div>
          <div className="rel-legend-item">
            <span className="rel-legend-line" style={{ background: '#FF4444', backgroundImage: 'linear-gradient(90deg, #FF4444 50%, transparent 50%)', backgroundSize: '8px 2px', backgroundRepeat: 'repeat-x' }}/>
            <span>对立</span>
          </div>
          <div style={{ marginTop: 8, color: '#6B7B8C', fontSize: 10 }}>
            点击作曲家展开关系网
          </div>
        </div>
      )}

      <div className="map-instructions">
        <span>
          {relationshipMode
            ? '关系网模式：点击作曲家标记查看关系 · 再次点击取消'
            : '点击标记查看作曲家详情'}
        </span>
      </div>
    </div>
  );
}
