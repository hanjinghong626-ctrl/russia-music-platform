'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// 主题色配置
const themeColors = {
  'orthodox': {
    primary: '#8B7355',
    accent: '#1E3A5F',
    glow: '#D4A574'
  },
  'russian-soul': {
    primary: '#D4AF37',
    accent: '#8B0000',
    glow: '#FFD700'
  },
  'steel-rose': {
    primary: '#6B5B95',
    accent: '#FF4444',
    glow: '#9370DB'
  }
}

// 时代数据 - 7个核心时期
const eras = [
  {
    id: 'pre-18th',
    name: '东正教圣咏',
    nameRu: 'Orthodox Chant',
    period: '18世纪前',
    year: '988-1700',
    position: { x: 12, y: 42 },
    city: '基辅',
    cityRu: 'Киев',
    description: '俄罗斯音乐的根基可追溯至公元988年东正教传入基辅罗斯。东正教圣咏与民间口头传承的民歌共同塑造了俄罗斯音乐独特的民族性格。',
    composers: ['博尔特尼扬斯基', '别列佐夫斯基'],
    features: ['东正教圣咏', '兹纳缅内记谱法', '俄罗斯民歌'],
    color: '#8B7355',
    glowColor: '#D4A574',
    icon: 'cross',
    themeKey: 'orthodox'
  },
  {
    id: '18th-century',
    name: '西风东渐',
    nameRu: 'Western Influence',
    period: '18世纪',
    year: '1700-1800',
    position: { x: 22, y: 35 },
    city: '圣彼得堡',
    cityRu: 'Санкт-Петербург',
    description: '在彼得大帝"全盘西化"政策的推动下，意大利歌剧、德国交响乐、法国芭蕾相继传入俄罗斯。',
    composers: ['别列佐夫斯基', '法伊科'],
    features: ['意大利歌剧', '宫廷音乐', '贵族音乐教育'],
    color: '#4A7C59',
    glowColor: '#7CB68A',
    icon: 'violin',
    themeKey: 'russian-soul'
  },
  {
    id: 'glinka-era',
    name: '格林卡时代',
    nameRu: 'Glinka Era',
    period: '19世纪上半叶',
    year: '1800-1850',
    position: { x: 32, y: 40 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '格林卡开创了俄罗斯民族音乐传统，被誉为"俄罗斯音乐之父"，奠定了俄罗斯古典音乐的基础。',
    composers: ['米哈伊尔·格林卡', '达尔戈梅日斯基'],
    features: ['民族主义音乐', '俄罗斯歌剧', '交响幻想曲'],
    color: '#6B8E23',
    glowColor: '#9ACD32',
    icon: 'score',
    themeKey: 'russian-soul'
  },
  {
    id: 'mighty-handful',
    name: '强力集团',
    nameRu: 'Mighty Handful',
    period: '19世纪中叶',
    year: '1850-1880',
    position: { x: 28, y: 38 },
    city: '圣彼得堡',
    cityRu: 'Санкт-Петербург',
    description: '以巴拉基列夫、穆索尔斯基、鲍罗丁、里姆斯基-科萨科夫为代表的"强力集团"致力于发展纯粹的俄罗斯民族音乐。',
    composers: ['穆索尔斯基', '鲍罗丁', '里姆斯基-科萨科夫'],
    features: ['强力五人集团', '民族乐派', '标题音乐'],
    color: '#556B2F',
    glowColor: '#8FBC8F',
    icon: 'group',
    themeKey: 'russian-soul'
  },
  {
    id: 'tchaikovsky-era',
    name: '柴可夫斯基',
    nameRu: 'Tchaikovsky',
    period: '19世纪下半叶',
    year: '1870-1893',
    position: { x: 38, y: 42 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '柴可夫斯基是俄罗斯浪漫主义时期最伟大的作曲家，将芭蕾舞剧音乐提升到交响乐的高度。',
    composers: ['柴可夫斯基', '塔涅耶夫'],
    features: ['浪漫主义', '芭蕾舞剧', '交响曲', '钢琴协奏曲'],
    color: '#8B4513',
    glowColor: '#CD853F',
    icon: 'ballet',
    themeKey: 'russian-soul'
  },
  {
    id: 'silver-age',
    name: '白银时代',
    nameRu: 'Silver Age',
    period: '19世纪末-20世纪初',
    year: '1890-1917',
    position: { x: 42, y: 44 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '拉赫玛尼诺夫、斯克里亚宾等作曲家将俄罗斯浪漫主义推向新的高度。斯特拉文斯基开始探索新的音乐语言。',
    composers: ['拉赫玛尼诺夫', '斯克里亚宾', '斯特拉文斯基'],
    features: ['晚期浪漫主义', '神秘主义', '原始主义'],
    color: '#708090',
    glowColor: '#B0C4DE',
    icon: 'piano',
    themeKey: 'steel-rose'
  },
  {
    id: 'soviet-era',
    name: '苏联时期',
    nameRu: 'Soviet Era',
    period: '1917-1991',
    year: '1917-1991',
    position: { x: 48, y: 46 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '在社会主义现实主义的框架下，肖斯塔科维奇、普罗科菲耶夫等作曲家创造了举世瞩目的艺术成就。',
    composers: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良'],
    features: ['交响曲', '芭蕾舞剧', '电影音乐'],
    color: '#8B0000',
    glowColor: '#CD5C5C',
    icon: 'symphony',
    themeKey: 'steel-rose'
  },
  {
    id: 'contemporary',
    name: '当代发展',
    nameRu: 'Contemporary',
    period: '当代',
    year: '1991-至今',
    position: { x: 55, y: 42 },
    city: '新西伯利亚',
    cityRu: 'Новосибирск',
    description: '当代俄罗斯音乐迎来多元化发展。施尼特凯、古拜杜丽娜等作曲家在国际上获得广泛认可。',
    composers: ['施尼特凯', '古拜杜丽娜'],
    features: ['复风格技法', '音响探索', '多元化'],
    color: '#483D8B',
    glowColor: '#9370DB',
    icon: 'modern',
    themeKey: 'steel-rose'
  }
]

// 城市数据
const cities = [
  { name: '莫斯科', nameRu: 'Москва', x: 38, y: 42, type: 'major' },
  { name: '圣彼得堡', nameRu: 'Санкт-Петербург', x: 24, y: 36, type: 'major' },
  { name: '新西伯利亚', nameRu: 'Новосибирск', x: 72, y: 48, type: 'major' },
  { name: '叶卡捷琳堡', nameRu: 'Екатеринбург', x: 58, y: 44, type: 'major' },
  { name: '喀山', nameRu: 'Казань', x: 48, y: 40, type: 'major' },
  { name: '符拉迪沃斯托克', nameRu: 'Владивосток', x: 92, y: 52, type: 'major' },
  { name: '基辅', nameRu: 'Киев', x: 12, y: 44, type: 'major' },
  { name: '索契', nameRu: 'Сочи', x: 30, y: 56, type: 'major' },
  { name: '加里宁格勒', nameRu: 'Калининград', x: 8, y: 34, type: 'minor' },
]

// 获取当前主题色
const getThemeColor = (themeKey) => themeColors[themeKey] || themeColors['russian-soul']

// 音乐图标组件
function MusicIcon({ type, size = 20, color = 'currentColor' }) {
  const icons = {
    cross: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M11 2v7H4v2h7v11h2V11h7V9h-7V2z"/>
      </svg>
    ),
    violin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <ellipse cx="12" cy="15" rx="5" ry="6"/>
        <path d="M12 9V3M9 3h6M12 9c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z"/>
      </svg>
    ),
    score: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <rect x="3" y="4" width="18" height="16" rx="1"/>
        <line x1="7" y1="8" x2="7" y2="16" stroke="white" strokeWidth="1"/>
        <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="1"/>
        <line x1="17" y1="8" x2="17" y2="16" stroke="white" strokeWidth="1"/>
        <circle cx="7" cy="10" r="1" fill="white"/>
        <circle cx="12" cy="12" r="1" fill="white"/>
        <circle cx="17" cy="11" r="1" fill="white"/>
      </svg>
    ),
    group: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="8" cy="8" r="2.5"/>
        <circle cx="16" cy="8" r="2.5"/>
        <circle cx="12" cy="14" r="2.5"/>
        <path d="M4 20c0-2.5 1.8-4 4-4s3 1.5 4 2.5v1.5H4z"/>
        <path d="M20 20c0-2.5-1.8-4-4-4s-3 1.5-4 2.5v1.5h8z"/>
      </svg>
    ),
    ballet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v4l-3 2v6h2v-4h2v4h2v-4l2-2v-2l-2-2-1 2z"/>
      </svg>
    ),
    piano: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <rect x="2" y="6" width="20" height="12" rx="1"/>
        <rect x="3" y="7" width="2" height="6" fill="#fff"/>
        <rect x="6" y="7" width="2" height="6" fill="#fff"/>
        <rect x="11" y="7" width="2" height="6" fill="#fff"/>
        <rect x="14" y="7" width="2" height="6" fill="#fff"/>
        <rect x="19" y="7" width="2" height="6" fill="#fff"/>
      </svg>
    ),
    symphony: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 3v18M7 6v12M17 6v12M4 9v6M20 9v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    modern: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 3v5M9 8v3l-4 8h2l3-6 3 6h2l-4-8V8H9z"/>
        <path d="M12 14v7" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
  return icons[type] || icons.score
}

// 音符形状的标记
function NoteMarker({ x, y, size = 24, color = '#D4AF37', isActive = false, pulse = false }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 脉动光环 */}
      {pulse && (
        <circle 
          cx="0" 
          cy="0" 
          r={size * 0.8} 
          fill="none" 
          stroke={color} 
          strokeWidth="2"
          className="pulse-ring"
          style={{ transformOrigin: 'center' }}
        />
      )}
      {/* 音符形状 SVG */}
      <g transform={`scale(${size / 24})`}>
        <ellipse cx="12" cy="18" rx="6" ry="4" fill={color} transform="rotate(-20 12 18)"/>
        <rect x="16" y="4" width="2" height="14" fill={color}/>
        <path d="M18 4 Q 22 8 20 12" stroke={color} strokeWidth="2" fill="none"/>
      </g>
      {/* 发光效果 */}
      {isActive && (
        <circle 
          cx="0" 
          cy="0" 
          r={size * 0.6} 
          fill={color} 
          opacity="0.3"
          className="glow-pulse"
        />
      )}
    </g>
  )
}

// 城市标记
function CityMarker({ x, y, size = 20, color = '#D4AF37', isActive = false }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 外层光环 */}
      {isActive && (
        <>
          <circle cx="0" cy="0" r={size * 1.5} fill="none" stroke={color} strokeWidth="1" opacity="0.3" className="city-pulse"/>
          <circle cx="0" cy="0" r={size * 2} fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" className="city-pulse delay-1"/>
        </>
      )}
      {/* 内层光点 */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.4} 
        fill={color}
        opacity={isActive ? 1 : 0.5}
        className={isActive ? 'city-glow' : ''}
      />
      {/* 十字光晕 */}
      <g opacity={isActive ? 0.6 : 0.3}>
        <line x1={-size} y1="0" x2={-size * 0.5} y2="0" stroke={color} strokeWidth="0.5"/>
        <line x1={size * 0.5} y1="0" x2={size} y2="0" stroke={color} strokeWidth="0.5"/>
        <line x1="0" y1={-size} x2="0" y2={-size * 0.5} stroke={color} strokeWidth="0.5"/>
        <line x1="0" y1={size * 0.5} x2="0" y2={size} stroke={color} strokeWidth="0.5"/>
      </g>
    </g>
  )
}

// 套娃装饰组件
function Matryoshka({ x, y, size = 24, opacity = 0.15 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx={size * 0.35} ry={size * 0.4} fill="#CD5C5C"/>
      <ellipse cx="0" cy={-size * 0.15} rx={size * 0.28} ry={size * 0.25} fill="#F08080"/>
      <circle cx="0" cy={-size * 0.35} r={size * 0.2} fill="#F4A460"/>
      <ellipse cx={-size * 0.12} cy={-size * 0.38} rx={size * 0.08} ry={size * 0.05} fill="#2F4F4F"/>
      <ellipse cx={size * 0.12} cy={-size * 0.38} rx={size * 0.08} ry={size * 0.05} fill="#2F4F4F"/>
      <circle cx="0" cy={-size * 0.28} r={size * 0.06} fill="#FFDAB9"/>
      <path d={`M ${-size * 0.15} ${-size * 0.25} Q 0 ${-size * 0.18} ${size * 0.15} ${-size * 0.25}`} fill="none" stroke="#8B4513" strokeWidth="0.8"/>
    </g>
  )
}

// 巴拉莱卡琴装饰组件
function Balalaika({ x, y, size = 18, opacity = 0.12 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <polygon points={`0,${-size * 0.8} ${size * 0.25},${size * 0.2} ${-size * 0.25},${size * 0.2}`} fill="#8B4513"/>
      <rect x={-size * 0.06} y={-size * 0.8} width={size * 0.12} height={size * 0.5} fill="#D2691E"/>
      <circle cx="0" cy={size * 0.35} r={size * 0.25} fill="#DEB887"/>
      <line x1="0" y1={-size * 0.3} x2="0" y2={-size * 0.8} stroke="#F5DEB3" strokeWidth="0.8"/>
    </g>
  )
}

// 教堂剪影
function ChurchSilhouette({ x, y, size = 25 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1">
      <path d={`
        M 0 ${size * 0.6}
        L ${-size * 0.4} ${size * 0.6}
        L ${-size * 0.4} ${-size * 0.1}
        L ${-size * 0.2} ${-size * 0.1}
        L ${-size * 0.2} ${-size * 0.4}
        L ${-size * 0.15} ${-size * 0.4}
        L ${-size * 0.15} ${-size * 0.6}
        L ${size * 0.15} ${-size * 0.6}
        L ${size * 0.15} ${-size * 0.4}
        L ${size * 0.2} ${-size * 0.4}
        L ${size * 0.2} ${-size * 0.1}
        L ${size * 0.4} ${-size * 0.1}
        L ${size * 0.4} ${size * 0.6}
        Z
      `} fill="#8B4513"/>
      <circle cx="0" cy={-size * 0.5} r={size * 0.08} fill="#8B4513"/>
      <path d={`M 0 ${-size * 0.58} L ${-size * 0.05} ${-size * 0.7} L ${size * 0.05} ${-size * 0.7} Z`} fill="#8B4513"/>
    </g>
  )
}

// 白桦树装饰
function BirchTree({ x, y, size = 18 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1">
      <rect x={-size * 0.05} y="0" width={size * 0.1} height={size * 0.6} fill="#D2B48C"/>
      <ellipse cx="0" cy={-size * 0.2} rx={size * 0.35} ry={size * 0.4} fill="#228B22"/>
      <ellipse cx="0" cy={-size * 0.5} rx={size * 0.25} ry={size * 0.3} fill="#228B22"/>
    </g>
  )
}

// 五线谱装饰
function MusicStaff({ x, y, width = 30 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.08">
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="0" y1={i * 3} x2={width} y2={i * 3} stroke="#333" strokeWidth="0.5"/>
      ))}
    </g>
  )
}

// 漂浮音符装饰
function FloatingNote({ x, y, size = 10 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1" className="floating-note">
      <ellipse cx="0" cy="0" rx={size * 0.4} ry={size * 0.3} fill="#333" transform="rotate(-20)"/>
      <rect x={size * 0.2} y={-size * 0.8} width={size * 0.1} height={size * 0.8} fill="#333"/>
    </g>
  )
}

// 俄罗斯地图 SVG 组件
function RussianMapSVG() {
  return (
    <svg 
      viewBox="0 0 100 70" 
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    >
      <defs>
        <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D5A45"/>
          <stop offset="30%" stopColor="#5D7052"/>
          <stop offset="60%" stopColor="#8B7355"/>
          <stop offset="80%" stopColor="#C9B896"/>
          <stop offset="100%" stopColor="#D4C4A8"/>
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="0.5"/>
        </filter>
      </defs>
      
      {/* 俄罗斯领土轮廓 - 简化的俄罗斯地图 */}
      <path 
        d={`
          M 5 30
          Q 8 25 15 28
          Q 22 32 30 28
          Q 38 24 45 28
          Q 52 32 60 28
          Q 68 24 75 28
          Q 82 32 90 28
          Q 95 30 98 35
          Q 95 40 98 48
          Q 92 52 85 50
          Q 78 54 70 50
          Q 62 46 55 50
          Q 48 54 40 50
          Q 32 46 25 50
          Q 18 54 12 50
          Q 5 46 3 40
          Q 2 35 5 30
          Z
        `}
        fill="url(#terrainGradient)"
        stroke="rgba(100, 100, 100, 0.3)"
        strokeWidth="0.3"
        filter="url(#blur)"
      />
      
      {/* 主要城市标记点 */}
      {cities.map((city, idx) => (
        <circle 
          key={idx}
          cx={city.x} 
          cy={city.y} 
          r="0.8" 
          fill="#666"
          opacity="0.5"
        />
      ))}
      
      {/* 国界线暗示 */}
      <path 
        d={`M 5 35 Q 20 30 40 35 Q 60 40 80 35 Q 95 32 98 38`}
        fill="none"
        stroke="rgba(80, 80, 80, 0.2)"
        strokeWidth="0.3"
        strokeDasharray="1,1"
      />
    </svg>
  )
}

// 时期节点组件 - 升级版音符标记
function EraNode({ era, index, isActive, onClick }) {
  const theme = getThemeColor(era.themeKey)
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <g 
      className={`era-node cursor-pointer transition-all duration-500 ${isActive ? 'z-20' : 'z-10'}`}
      onClick={() => onClick(era)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        transform: isActive ? 'scale(1.3)' : 'scale(1)',
        transformOrigin: `${era.position.x}% ${era.position.y}%`
      }}
    >
      {/* 外层脉动环 - 仅活跃时显示 */}
      {isActive && (
        <circle 
          cx={era.position.x}
          cy={era.position.y}
          r="4"
          fill="none"
          stroke={era.glowColor}
          strokeWidth="2"
          opacity="0.5"
          className="pulse-ring"
        />
      )}
      
      {/* 音符形状主标记 */}
      <g transform={`translate(${era.position.x}, ${era.position.y})`}>
        {/* 发光背景 */}
        <ellipse 
          cx="0" 
          cy="1" 
          rx={isActive ? "2.5" : "2"} 
          ry={isActive ? "1.8" : "1.5"} 
          fill={era.glowColor}
          opacity={isActive ? 0.6 : 0.3}
          transform="rotate(-20)"
        />
        {/* 音符头部 */}
        <ellipse 
          cx="0" 
          cy="1" 
          rx={isActive ? "2" : "1.5"} 
          ry={isActive ? "1.5" : "1.2"} 
          fill={era.color}
          transform="rotate(-20)"
          style={{
            filter: isActive ? `drop-shadow(0 0 6px ${era.glowColor})` : 'none'
          }}
        />
        {/* 音符符干 */}
        <rect 
          x="0.8" 
          y={isActive ? "-5" : "-4"} 
          width="0.3" 
          height="5" 
          fill={era.color}
          style={{
            filter: isActive ? `drop-shadow(0 0 4px ${era.glowColor})` : 'none'
          }}
        />
        {/* 音符钩 */}
        <path 
          d={`M 1.1 ${isActive ? "-5" : "-4"} Q 2.5 ${isActive ? "-3" : "-2.5"} 1.8 ${isActive ? "-1" : "-0.5"}`}
          stroke={era.color}
          strokeWidth="0.4"
          fill="none"
          style={{
            filter: isActive ? `drop-shadow(0 0 3px ${era.glowColor})` : 'none'
          }}
        />
      </g>
      
      {/* Tooltip - 毛玻璃效果 */}
      {showTooltip && (
        <g transform={`translate(${era.position.x + 5}, ${era.position.y - 8})`}>
          <rect 
            x="-12" 
            y="-10" 
            width="24" 
            height="12" 
            rx="4"
            fill="rgba(20, 20, 30, 0.85)"
            stroke={era.color}
            strokeWidth="1"
            className="tooltip-bg"
          />
          <text 
            x="0" 
            y="-1" 
            textAnchor="middle" 
            fill="#fff" 
            fontSize="3"
            fontFamily="system-ui"
          >
            {era.name}
          </text>
        </g>
      )}
      
      {/* 活跃时显示时期标签 */}
      {isActive && (
        <g transform={`translate(${era.position.x}, ${era.position.y + 6})`}>
          <rect 
            x={-era.name.length * 1.5} 
            y="0" 
            width={era.name.length * 3} 
            height="5" 
            rx="2"
            fill={era.color}
            opacity="0.9"
          />
          <text 
            x="0" 
            y="3.5" 
            textAnchor="middle" 
            fill="#fff" 
            fontSize="2.5"
            fontFamily="system-ui"
            fontWeight="600"
          >
            {era.name}
          </text>
        </g>
      )}
    </g>
  )
}

// 详细弹窗组件 - 升级版作曲家卡片
function DetailModal({ era, onClose }) {
  const theme = getThemeColor(era.themeKey)
  const modalRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])
  
  // 经典语录
  const quotes = {
    'pre-18th': '"音乐是灵魂的语言"',
    '18th-century': '"向西学习，向东传承"',
    'glinka-era': '"创造民族的音乐，这就是我的使命"',
    'mighty-handful': '"我们不是学者，我们是俄罗斯人"',
    'tchaikovsky-era': '"音乐是最纯粹的人类情感"',
    'silver-age': '"在音乐中，我寻找无限"',
    'soviet-era': '"音乐应当震撼人心"',
    'contemporary': '"打破边界，探索未知"'
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      
      {/* 弹窗主体 */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-modal-in"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 30, 40, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
          border: `1px solid ${era.glowColor}40`
        }}
      >
        {/* 顶部金色装饰线 */}
        <div 
          className="sticky top-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${era.glowColor}, ${era.color}, ${era.glowColor}, transparent)` }}
        />
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg z-10"
          style={{ 
            background: `${era.color}20`,
            border: `1px solid ${era.glowColor}50`
          }}
        >
          <span style={{ color: era.glowColor }} className="text-xl font-light hover:glow-text">×</span>
        </button>
        
        {/* 内容区域 */}
        <div className="p-6 md:p-8">
          {/* 头部信息 */}
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${era.glowColor} 0%, ${era.color} 100%)` }}
            >
              <MusicIcon type={era.icon} size={40} color="#fff"/>
            </div>
            <div>
              <h2 
                className="text-3xl font-bold mb-1"
                style={{ 
                  color: era.glowColor,
                  fontFamily: "'Playfair Display', 'Georgia', serif"
                }}
              >
                {era.name}
              </h2>
              <p className="text-gray-400 text-lg">{era.nameRu}</p>
              <p className="text-gray-500 text-sm mt-1">{era.period} · {era.year}</p>
            </div>
          </div>
          
          {/* 城市信息 */}
          <div 
            className="flex items-center gap-2 mb-6 p-3 rounded-lg"
            style={{ backgroundColor: `${era.color}15` }}
          >
            <svg className="w-5 h-5" fill={era.glowColor} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span style={{ color: era.glowColor }} className="font-medium">{era.city}</span>
            <span className="text-gray-400">({era.cityRu})</span>
          </div>
          
          {/* 时期描述 */}
          <p className="text-gray-300 leading-relaxed text-lg mb-6">
            {era.description}
          </p>
          
          {/* 经典语录 - 引用样式 */}
          {quotes[era.id] && (
            <div 
              className="relative mb-6 p-4 rounded-lg"
              style={{ 
                background: `${era.color}10`,
                borderLeft: `3px solid ${era.glowColor}`
              }}
            >
              <p className="text-gray-300 italic text-base">
                {quotes[era.id]}
              </p>
            </div>
          )}
          
          {/* 代表作曲家 */}
          <div className="mb-5">
            <h3 
              className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{ color: era.glowColor }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              代表作曲家
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.composers.map((composer, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-md"
                  style={{ 
                    backgroundColor: `${era.color}20`, 
                    border: `1px solid ${era.glowColor}40`, 
                    color: era.glowColor 
                  }}
                >
                  {composer}
                </span>
              ))}
            </div>
          </div>
          
          {/* 音乐特征 */}
          <div className="mb-6">
            <h3 
              className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{ color: era.glowColor }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              音乐特征
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.features.map((feature, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ccc'
                  }}
                >
                  <span style={{ color: era.glowColor }}>♪</span>
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          {/* 底部金色装饰分隔线 */}
          <div className="h-px my-6" style={{ background: `linear-gradient(to right, transparent, ${era.glowColor}40, transparent)` }}/>
          
          {/* 查看完整文章链接 */}
          <Link 
            href={`/music-history/${era.id}`} 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${era.color} 0%, ${era.glowColor} 100%)`, color: '#fff' }}
          >
            查看完整文章
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

// 时间轴组件 - 升级版
function Timeline({ eras, activeEra, onEraClick }) {
  const scrollContainerRef = useRef(null)
  const theme = activeEra ? getThemeColor(activeEra.themeKey) : themeColors['russian-soul']
  
  // iPad触控滚动优化
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    
    let isDown = false
    let startX
    let scrollLeft
    
    const mouseDown = (e) => {
      isDown = true
      container.classList.add('cursor-grabbing')
      startX = e.pageX - container.offsetLeft
      scrollLeft = container.scrollLeft
    }
    
    const mouseLeave = () => {
      isDown = false
      container.classList.remove('cursor-grabbing')
    }
    
    const mouseUp = () => {
      isDown = false
      container.classList.remove('cursor-grabbing')
    }
    
    const mouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 2
      container.scrollLeft = scrollLeft - walk
    }
    
    container.addEventListener('mousedown', mouseDown)
    container.addEventListener('mouseleave', mouseLeave)
    container.addEventListener('mouseup', mouseUp)
    container.addEventListener('mousemove', mouseMove)
    
    return () => {
      container.removeEventListener('mousedown', mouseDown)
      container.removeEventListener('mouseleave', mouseLeave)
      container.removeEventListener('mouseup', mouseUp)
      container.removeEventListener('mousemove', mouseMove)
    }
  }, [])
  
  return (
    <div 
      className="relative py-6 px-4"
      style={{ 
        background: 'linear-gradient(to top, rgba(20, 20, 30, 0.95) 0%, rgba(30, 30, 40, 0.9) 100%)',
        borderTop: `1px solid ${theme.glowColor}30`
      }}
    >
      {/* 顶部金色渐变线 */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${theme.glowColor} 50%, transparent 100%)` }}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* 时间轴主线条 - 金色渐变 */}
        <div className="relative mb-8">
          {/* 金色渐变底线 */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, transparent 0%, ${theme.glowColor}40 10%, ${theme.glowColor} 50%, ${theme.glowColor}40 90%, transparent 100%)`
            }}
          />
          
          {/* 时期节点连接点 */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {eras.map((era, idx) => (
              <div 
                key={era.id}
                className={`relative transition-all duration-500 cursor-pointer group
                  ${activeEra?.id === era.id ? 'scale-125' : 'hover:scale-110'}`}
                onClick={() => onEraClick(era)}
              >
                {/* 金色连接点 */}
                <div 
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                    ${activeEra?.id === era.id ? 'shadow-lg' : 'group-hover:shadow-md'}`}
                  style={{ 
                    backgroundColor: activeEra?.id === era.id ? era.glowColor : `${era.glowColor}60`,
                    boxShadow: activeEra?.id === era.id ? `0 0 12px ${era.glowColor}` : 'none'
                  }}
                />
                {/* 点击区域扩大 */}
                <div className="absolute inset-0 -m-3" />
              </div>
            ))}
          </div>
        </div>
        
        {/* 时期标签 - 可滚动 */}
        <div 
          ref={scrollContainerRef}
          className="flex justify-between gap-2 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.glowColor}40 transparent`
          }}
        >
          {eras.map((era, idx) => (
            <button 
              key={era.id} 
              onClick={() => onEraClick(era)} 
              className={`flex-shrink-0 text-center transition-all duration-500 p-3 rounded-xl min-w-[100px]
                ${activeEra?.id === era.id ? 'translate-y-1 scale-105' : 'opacity-70 hover:opacity-100 hover:-translate-y-0.5'}`}
              style={{ 
                background: activeEra?.id === era.id ? `${era.color}25` : 'transparent',
                border: activeEra?.id === era.id ? `1px solid ${era.glowColor}50` : '1px solid transparent'
              }}
            >
              <div 
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-base font-bold mb-2 transition-all duration-300 shadow-md" 
                style={{ 
                  background: activeEra?.id === era.id ? `linear-gradient(135deg, ${era.glowColor}, ${era.color})` : `${era.color}40`,
                  color: activeEra?.id === era.id ? '#fff' : era.glowColor,
                  boxShadow: activeEra?.id === era.id ? `0 0 15px ${era.glowColor}60` : 'none'
                }}
              >
                {idx + 1}
              </div>
              <p 
                className="text-sm font-semibold whitespace-nowrap"
                style={{ 
                  color: activeEra?.id === era.id ? era.glowColor : '#9ca3af',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                {era.name}
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap mt-0.5">{era.period}</p>
              <p className="text-xs text-gray-600 whitespace-nowrap">{era.year}</p>
            </button>
          ))}
        </div>
        
        {/* 底部装饰 */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${theme.glowColor}40)` }}/>
          <span style={{ color: theme.glowColor, opacity: 0.6 }} className="text-xs">♪</span>
          <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${theme.glowColor}40)` }}/>
        </div>
      </div>
    </div>
  )
}

// 图例组件
function Legend({ activeEra }) {
  const theme = activeEra ? getThemeColor(activeEra.themeKey) : themeColors['russian-soul']
  
  return (
    <div 
      className="absolute bottom-4 left-4 p-3 rounded-lg z-20 backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(20, 20, 30, 0.85)',
        border: `1px solid ${theme.glowColor}30`
      }}
    >
      <h4 className="text-xs font-bold mb-2" style={{ color: theme.glowColor }}>地形渐变</h4>
      <div className="flex items-center gap-1">
        <div className="w-20 h-3 rounded" style={{ background: 'linear-gradient(to right, #3D5A45, #5D7052, #9B8B6D, #C9B896, #D4C4A8)' }}/>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">欧洲</span>
        <span className="text-xs text-gray-400">远东</span>
      </div>
    </div>
  )
}

// 主页面组件 - 升级版
export default function MusicHistoryMapPage() {
  const [selectedEra, setSelectedEra] = useState(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const theme = selectedEra ? getThemeColor(selectedEra.themeKey) : themeColors['russian-soul']
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#14141e' }}
    >
      {/* 粒子效果背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1" style={{ borderColor: theme.glowColor }}/>
        <div className="particle particle-2" style={{ borderColor: theme.glowColor }}/>
        <div className="particle particle-3" style={{ borderColor: theme.glowColor }}/>
        <div className="particle particle-4" style={{ borderColor: theme.glowColor }}/>
        <div className="particle particle-5" style={{ borderColor: theme.glowColor }}/>
      </div>
      
      {/* 装饰元素 */}
      <div className="fixed top-4 left-4 z-10">
        <Matryoshka x={0} y={0} size={30} opacity={0.2}/>
      </div>
      <div className="fixed top-8 right-8 z-10">
        <ChurchSilhouette x={0} y={0} size={25}/>
      </div>
      <div className="fixed top-16 left-20 z-10">
        <FloatingNote x={0} y={0} size={12}/>
      </div>
      <div className="fixed top-4 right-20 z-10">
        <MusicStaff x={0} y={0} width={35}/>
      </div>
      
      {/* 顶部导航栏 */}
      <header 
        className="relative z-10 pt-8 pb-6 px-4"
        style={{ borderBottom: `1px solid ${theme.glowColor}20` }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* 装饰线 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-24" style={{ background: `linear-gradient(to right, transparent, ${theme.glowColor})` }}/>
            <svg 
              className="w-6 h-6 transition-all duration-500 hover:rotate-180" 
              viewBox="0 0 24 24" 
              fill={theme.glowColor}
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <div className="h-px w-24" style={{ background: `linear-gradient(to left, transparent, ${theme.glowColor})` }}/>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
            style={{ 
              color: theme.glowColor,
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: `0 0 40px ${theme.glowColor}30`
            }}
          >
            俄罗斯音乐史地图
          </h1>
          
          <p className="text-lg md:text-xl mb-4" style={{ color: theme.primary + 'cc' }}>
            从东正教圣咏到当代多元发展
          </p>
          
          <p className="text-sm" style={{ color: theme.glowColor + '88' }}>
            История русской музыки
          </p>
          
          {/* 底部装饰 */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.5 }}/>
            <div className="w-20 h-px" style={{ backgroundColor: theme.glowColor, opacity: 0.3 }}/>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.7 }}/>
            <div className="w-20 h-px" style={{ backgroundColor: theme.glowColor, opacity: 0.3 }}/>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.5 }}/>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="flex-1 relative z-10 px-4 py-2">
        <div className="max-w-6xl mx-auto h-full">
          <div className="relative h-full">
            <div 
              className={`relative rounded-2xl overflow-hidden h-full transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}
              style={{ 
                background: 'linear-gradient(145deg, #1a1a24 0%, #14141e 50%, #101018 100%)',
                border: `1px solid ${theme.glowColor}20`,
                boxShadow: `0 10px 40px rgba(0, 0, 0, 0.3), 0 0 60px ${theme.glowColor}10, inset 0 0 100px rgba(0, 0, 0, 0.2)`
              }}
            >
              {/* 暗角效果 */}
              <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.5), inset 0 0 80px rgba(0, 0, 0, 0.3)'
                }}
              />
              
              {/* 内部边框装饰 */}
              <div 
                className="absolute inset-2 rounded-xl pointer-events-none"
                style={{ border: `1px solid ${theme.glowColor}10` }}
              />
              
              {/* 装饰元素 */}
              <Matryoshka x={20} y={75} size={25} opacity={0.15}/>
              <Matryoshka x={85} y={80} size={18} opacity={0.12}/>
              <Balalaika x={15} y={25} size={20} opacity={0.1}/>
              <Balalaika x={88} y={22} size={14} opacity={0.08}/>
              <ChurchSilhouette x={92} y={70} size={22}/>
              <BirchTree x={8} y={60} size={18}/>
              <BirchTree x={75} y={15} size={15}/>
              <MusicStaff x={8} y={45} width={30}/>
              <MusicStaff x={85} y={55} width={25}/>
              <FloatingNote x={25} y={15} size={10}/>
              <FloatingNote x={70} y={18} size={8}/>
              <FloatingNote x={45} y={12} size={9}/>
              
              {/* 地图涟漪动画 - 初始化时 */}
              {mounted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="ripple-origin" style={{ backgroundColor: theme.glowColor }}/>
                </div>
              )}
              
              <div className="relative p-4 md:p-6 lg:p-8 h-full flex flex-col">
                <div className="relative flex-1 min-h-[400px] md:min-h-[450px]">
                  <RussianMapSVG />
                  
                  {/* 城市标记 */}
                  {cities.map((city, idx) => (
                    <CityMarker
                      key={idx}
                      x={city.x}
                      y={city.y}
                      size={city.type === 'major' ? 18 : 12}
                      color={theme.glowColor}
                      isActive={selectedEra?.city === city.name}
                    />
                  ))}
                  
                  {/* 时期节点 */}
                  {mounted && eras.map((era, idx) => (
                    <EraNode 
                      key={era.id} 
                      era={era} 
                      index={idx} 
                      isActive={selectedEra?.id === era.id} 
                      onClick={setSelectedEra}
                    />
                  ))}
                  
                  <Legend activeEra={selectedEra}/>
                </div>
                
                <p className="text-center text-sm mt-4" style={{ color: theme.glowColor + '88' }}>
                  点击地图上的节点探索俄罗斯音乐史的各个时期
                </p>
              </div>
              
              {/* 底部装饰线 */}
              <div 
                className="h-px"
                style={{ background: `linear-gradient(to right, transparent, ${theme.glowColor}30, transparent)` }}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* 时间轴 */}
      <footer className="relative z-10">
        <Timeline eras={eras} activeEra={selectedEra} onEraClick={setSelectedEra}/>
      </footer>
      
      {/* 详情弹窗 */}
      {selectedEra && <DetailModal era={selectedEra} onClose={() => setSelectedEra(null)} />}
      
      {/* 全局样式 */}
      <style jsx>{`
        /* 渐入动画 */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        
        /* 模态框动画 */
        @keyframes modalIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in { animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* 脉动环动画 */
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .pulse-ring {
          animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        
        /* 城市标记脉动 */
        @keyframes cityPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
        .city-pulse {
          animation: cityPulse 3s ease-in-out infinite;
        }
        .city-pulse.delay-1 {
          animation-delay: 1.5s;
        }
        
        /* 城市光晕 */
        @keyframes cityGlow {
          0%, 100% {
            filter: drop-shadow(0 0 4px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 10px currentColor);
          }
        }
        .city-glow {
          animation: cityGlow 2s ease-in-out infinite;
        }
        
        /* 浮动音符动画 */
        @keyframes floatNote {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
            opacity: 0.2;
          }
        }
        .floating-note {
          animation: floatNote 4s ease-in-out infinite;
        }
        
        /* 发光文字 */
        @keyframes glowText {
          0%, 100% {
            text-shadow: 0 0 5px currentColor;
          }
          50% {
            text-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
          }
        }
        .glow-text:hover {
          animation: glowText 1s ease-in-out infinite;
        }
        
        /* 涟漪动画 */
        @keyframes rippleOut {
          0% {
            transform: scale(0);
            opacity: 0.3;
          }
          100% {
            transform: scale(15);
            opacity: 0;
          }
        }
        .ripple-origin {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: rippleOut 2s ease-out forwards;
        }
        
        /* Tooltip 背景动画 */
        @keyframes tooltipIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tooltip-bg {
          animation: tooltipIn 0.2s ease-out forwards;
        }
        
        /* 隐藏滚动条 */
        .scrollbar-hide::-webkit-scrollbar { 
          display: none; 
        }
        .scrollbar-hide { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        
        /* 粒子效果 */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0.15;
          animation: float 20s linear infinite;
        }
        
        .particle-1 {
          left: 10%;
          top: 20%;
          animation-duration: 25s;
        }
        .particle-2 {
          left: 30%;
          top: 60%;
          animation-duration: 30s;
          animation-delay: 5s;
        }
        .particle-3 {
          left: 50%;
          top: 40%;
          animation-duration: 20s;
          animation-delay: 10s;
        }
        .particle-4 {
          left: 70%;
          top: 80%;
          animation-duration: 35s;
          animation-delay: 15s;
        }
        .particle-5 {
          left: 90%;
          top: 30%;
          animation-duration: 28s;
          animation-delay: 8s;
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 50px) rotate(90deg);
          }
          50% {
            transform: translate(50px, 100px) rotate(180deg);
          }
          75% {
            transform: translate(-50px, 50px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        
        /* 加载动画 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

