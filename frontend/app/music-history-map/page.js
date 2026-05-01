'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import composersData from '../../data/composers.json'

// 时代数据
const eras = [
  {
    id: 'pre-18th',
    name: '东正教圣咏',
    nameRu: ' Orthodox Chant',
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
    icon: 'cross'
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
    icon: 'violin'
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
    icon: 'score'
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
    icon: 'group'
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
    icon: 'ballet'
  },
  {
    id: 'silver-age',
    name: '白银时代',
    nameRu: 'Silver Age',
    period: '19世纪末-20世纪初',
    year: '1890-1920',
    position: { x: 42, y: 44 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '拉赫玛尼诺夫、斯克里亚宾等作曲家将俄罗斯浪漫主义推向新的高度。斯特拉文斯基开始探索新的音乐语言。',
    composers: ['拉赫玛尼诺夫', '斯克里亚宾', '斯特拉文斯基'],
    features: ['晚期浪漫主义', '神秘主义', '原始主义'],
    color: '#708090',
    glowColor: '#B0C4DE',
    icon: 'piano'
  },
  {
    id: 'soviet-era',
    name: '苏联时期',
    nameRu: 'Soviet Era',
    period: '20世纪',
    year: '1920-1991',
    position: { x: 48, y: 46 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '在社会主义现实主义的框架下，肖斯塔科维奇、普罗科菲耶夫等作曲家创造了举世瞩目的艺术成就。',
    composers: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良'],
    features: ['交响曲', '芭蕾舞剧', '电影音乐'],
    color: '#8B0000',
    glowColor: '#CD5C5C',
    icon: 'symphony'
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
    icon: 'modern'
  }
]

// 时期筛选选项
const periodFilters = [
  { id: 'all', name: '全部', nameRu: 'Все', color: '#666' },
  { id: 'classical', name: '古典时期', nameRu: 'Классический', color: '#8B7355' },
  { id: 'foundation', name: '民族音乐奠基', nameRu: 'Закладка', color: '#4A7C59' },
  { id: 'golden', name: '民族乐派繁荣', nameRu: 'Расцвет', color: '#6B8E23' },
  { id: 'late_romantic', name: '晚期浪漫', nameRu: 'Поздний', color: '#708090' },
  { id: 'soviet', name: '苏联时期', nameRu: 'Советский', color: '#8B0000' },
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
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
      </svg>
    )
  }
  return icons[type] || icons.score
}

// 套娃装饰组件
function Matryoshka({ x, y, size = 24 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.15">
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
function Balalaika({ x, y, size = 18 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.12">
      <polygon points={`0,${-size * 0.8} ${size * 0.25},${size * 0.2} ${-size * 0.25},${size * 0.2}`} fill="#8B4513"/>
      <rect x={-size * 0.06} y={-size * 0.8} width={size * 0.12} height={size * 0.5} fill="#D2691E"/>
      <circle cx="0" cy={size * 0.35} r={size * 0.25} fill="#DEB887"/>
      <line x1="0" y1={-size * 0.3} x2="0" y2={-size * 0.8} stroke="#F5DEB3" strokeWidth="0.8"/>
      <line x1={-size * 0.06} y1={-size * 0.3} x2={-size * 0.06} y2={-size * 0.8} stroke="#F5DEB3" strokeWidth="0.8"/>
      <line x1={size * 0.06} y1={-size * 0.3} x2={size * 0.06} y2={-size * 0.8} stroke="#F5DEB3" strokeWidth="0.8"/>
    </g>
  )
}

// 教堂剪影装饰
function ChurchSilhouette({ x, y, size = 20 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1">
      <polygon points={`0,${-size} ${size * 0.4},${-size * 0.6} ${size * 0.4},0 ${-size * 0.4},0 ${-size * 0.4},${-size * 0.6}`} fill="#4A4A4A"/>
      <polygon points={`0,${-size * 1.2} ${size * 0.15},${-size} ${-size * 0.15},${-size}`} fill="#5A5A5A"/>
      <circle cx="0" cy={-size * 1.15} r={size * 0.08} fill="#D4AF37"/>
      <rect x={-size * 0.15} y={-size * 0.3} width={size * 0.3} height={size * 0.3} fill="#3A3A3A"/>
    </g>
  )
}

// 白桦树装饰
function BirchTree({ x, y, size = 15 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1">
      <rect x={-size * 0.05} y={0} width={size * 0.1} height={size * 0.6} fill="#F5F5DC"/>
      <circle cx="0" cy={-size * 0.2} r={size * 0.35} fill="#228B22"/>
      <circle cx={-size * 0.15} cy={-size * 0.1} r={size * 0.25} fill="#2E8B2E"/>
      <circle cx={size * 0.15} cy={-size * 0.15} r={size * 0.28} fill="#3CB371"/>
    </g>
  )
}

// 五线谱装饰
function MusicStaff({ x, y, width = 30 }) {
  const lineSpacing = 2.5
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.08">
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="0" y1={i * lineSpacing} x2={width} y2={i * lineSpacing} stroke="#2F4F4F" strokeWidth="0.8"/>
      ))}
      <circle cx="5" cy="3" r="2" fill="#2F4F4F"/>
      <circle cx="12" cy="6" r="2" fill="#2F4F4F"/>
      <circle cx="20" cy="4" r="2" fill="#2F4F4F"/>
      <circle cx="26" cy="2" r="2" fill="#2F4F4F"/>
    </g>
  )
}

// 音符飘浮装饰
function FloatingNote({ x, y, size = 10 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.06">
      <ellipse cx="0" cy={size * 0.3} rx={size * 0.3} ry={size * 0.25} fill="#2F4F4F"/>
      <line x1={size * 0.25} y1={size * 0.1} x2={size * 0.25} y2={-size * 0.5} stroke="#2F4F4F" strokeWidth="1.2"/>
      <path d={`M ${size * 0.25} ${-size * 0.5} Q ${size * 0.5} ${-size * 0.3} ${size * 0.25} ${-size * 0.1}`} fill="none" stroke="#2F4F4F" strokeWidth="1"/>
    </g>
  )
}

// 时代节点组件
function EraNode({ era, index, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <g
      transform={`translate(${era.position.x}, ${era.position.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(era)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <circle
        r={hovered ? 8 : 6}
        fill={era.glowColor}
        opacity={hovered ? 0.4 : 0.25}
        style={{ transition: 'all 0.3s ease' }}
      />
      <circle
        r={hovered ? 5 : 4}
        fill={era.color}
        stroke={era.glowColor}
        strokeWidth={hovered ? 2 : 1.5}
        style={{ transition: 'all 0.3s ease' }}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={hovered ? 7 : 6}
        fontWeight="bold"
        fill="#fff"
        style={{ transition: 'all 0.3s ease' }}
      >
        {index + 1}
      </text>
      
      {hovered && (
        <g transform={`translate(0, -18)`}>
          <rect
            x={-24}
            y={-8}
            width={48}
            height={16}
            rx={4}
            fill={era.color}
            opacity={0.95}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={5}
            fontWeight="bold"
            fill="#fff"
          >
            {era.name}
          </text>
        </g>
      )}
    </g>
  )
}

// 作曲家标记点组件
function ComposerMarker({ composer, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  // 根据重要性设置标记大小
  const size = composer.importance === 'core' ? 3 : composer.importance === 'important' ? 2.2 : 1.5
  
  return (
    <g
      transform={`translate(${composer.position[0]}, ${composer.position[1]})`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(composer)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 外圈光晕 */}
      <circle
        r={hovered ? size + 2 : isSelected ? size + 3 : size + 1.5}
        fill={composer.glowColor}
        opacity={hovered || isSelected ? 0.6 : 0.3}
        style={{ transition: 'all 0.3s ease' }}
      />
      {/* 主圆点 */}
      <circle
        r={size}
        fill={composer.color}
        stroke={composer.glowColor}
        strokeWidth={hovered || isSelected ? 1 : 0.5}
        style={{ transition: 'all 0.3s ease' }}
      />
      {/* 中心白点 */}
      <circle
        r={size * 0.3}
        fill="#fff"
        opacity={0.9}
      />
      
      {/* 悬停时显示名字 */}
      {(hovered || isSelected) && (
        <g transform={`translate(0, ${-size - 3})`}>
          <rect
            x={-composer.name_zh.length * 1.5}
            y={-4}
            width={composer.name_zh.length * 3}
            height={8}
            rx={2}
            fill={composer.color}
            opacity={0.95}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={4}
            fontWeight="bold"
            fill="#fff"
          >
            {composer.name_zh}
          </text>
        </g>
      )}
    </g>
  )
}

// 俄罗斯3D地形地图SVG组件
function RussianMapSVG({ composers, selectedPeriod, onComposerClick, selectedComposer }) {
  // 根据时期筛选作曲家
  const filteredComposers = selectedPeriod === 'all' 
    ? composers 
    : composers.filter(c => c.period === selectedPeriod)
  
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A6741"/>
          <stop offset="20%" stopColor="#5D7052"/>
          <stop offset="35%" stopColor="#7A8B5D"/>
          <stop offset="50%" stopColor="#9B8B6D"/>
          <stop offset="70%" stopColor="#B8A078"/>
          <stop offset="85%" stopColor="#C9B896"/>
          <stop offset="100%" stopColor="#D4C4A8"/>
        </linearGradient>
        
        <linearGradient id="europeTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3D5A45"/>
          <stop offset="40%" stopColor="#4A6741"/>
          <stop offset="70%" stopColor="#5D7052"/>
          <stop offset="100%" stopColor="#6B8052"/>
        </linearGradient>
        
        <linearGradient id="siberiaTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A8B5D"/>
          <stop offset="50%" stopColor="#9B8B6D"/>
          <stop offset="100%" stopColor="#B8A078"/>
        </linearGradient>
        
        <linearGradient id="farEastTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9B896"/>
          <stop offset="100%" stopColor="#D4C4A8"/>
        </linearGradient>
        
        <filter id="terrainShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#2D2D2D" floodOpacity="0.4"/>
        </filter>
        
        <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <pattern id="mountainPattern" patternUnits="userSpaceOnUse" width="8" height="4">
          <path d="M0 4 L2 0 L4 3 L6 0 L8 4" fill="none" stroke="#6B6B5A" strokeWidth="0.3" opacity="0.5"/>
        </pattern>
        
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8C8D8"/>
          <stop offset="50%" stopColor="#8BB8C8"/>
          <stop offset="100%" stopColor="#A8C8D8"/>
        </linearGradient>
        
        <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
        </linearGradient>
        
        <radialGradient id="cityPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#FFA500" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect x="0" y="0" width="100" height="70" fill="#E8E8E8"/>
      
      <ellipse cx="5" cy="38" rx="4" ry="3" fill="url(#waterGradient)" opacity="0.6"/>
      <ellipse cx="10" cy="50" rx="3" ry="2" fill="url(#waterGradient)" opacity="0.5"/>
      
      <g filter="url(#terrainShadow)">
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24 Q 30 26, 32 28 Q 34 30, 33 34 Q 32 38, 30 40 Q 28 42, 26 44 Q 24 46, 22 48 Q 20 50, 18 52 Q 16 54, 14 54 Q 12 54, 10 52 Q 8 50, 7 46 Q 6 42, 5 38 Q 4 34, 4 30 Q 4 26, 5 22 Q 5 20, 5 18 Z"
          fill="url(#europeTerrain)"
          stroke="#4A6741"
          strokeWidth="0.8"
          opacity="0.95"
        />
        
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        
        <path 
          d="M 28 48 Q 32 46, 34 48 Q 36 52, 34 56 Q 32 58, 30 56 Q 28 54, 28 48 Z"
          fill="#5D7052"
          stroke="#4A6741"
          strokeWidth="0.5"
          opacity="0.9"
        />
        
        <g opacity="0.85">
          <path 
            d="M 36 24 Q 40 22, 44 24 Q 48 26, 52 28 Q 54 30, 52 34 Q 50 36, 48 34 Q 46 32, 44 34 Q 42 36, 40 38 Q 38 36, 36 34 Q 34 32, 36 28 Q 36 26, 36 24 Z"
            fill="#7A8B5D"
            stroke="#6B7B4D"
            strokeWidth="0.6"
          />
          <path 
            d="M 38 26 L 40 24 L 42 26 L 44 23 L 46 26 L 48 24 L 50 26"
            fill="none"
            stroke="#8A8A7A"
            strokeWidth="0.3"
          />
        </g>
        
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30 Q 96 32, 95 36 Q 94 40, 92 44 Q 90 48, 88 50 Q 86 52, 84 54 Q 82 56, 80 58 Q 78 60, 76 62 Q 74 64, 72 64 Q 70 64, 68 62 Q 66 60, 64 58 Q 62 56, 60 54 Q 58 52, 56 50 Q 54 48, 52 46 Q 50 44, 48 42 Q 46 40, 44 38 Q 42 36, 40 34 Q 38 32, 36 30 Q 38 26, 40 24 Q 44 20, 48 18 Q 50 17, 52 18 Z"
          fill="url(#siberiaTerrain)"
          stroke="#8B7B5D"
          strokeWidth="0.7"
          opacity="0.9"
        />
        
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.4"
        />
        
        <path 
          d="M 88 26 Q 92 24, 95 26 Q 98 28, 99 32 Q 100 36, 99 40 Q 98 44, 96 48 Q 94 52, 92 54 Q 90 56, 88 58 Q 86 60, 84 60 Q 82 58, 84 54 Q 86 50, 88 46 Q 90 42, 90 38 Q 90 34, 88 30 Q 88 28, 88 26 Z"
          fill="url(#farEastTerrain)"
          stroke="#B8A878"
          strokeWidth="0.6"
          opacity="0.85"
        />
        
        <path 
          d="M 92 38 Q 96 36, 99 38 Q 100 42, 99 46 Q 97 48, 94 46 Q 92 44, 92 40 Q 92 38, 92 38 Z"
          fill="#C9B896"
          stroke="#B8A878"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        <path 
          d="M 94 30 Q 98 28, 100 30 Q 100 34, 98 36 Q 95 36, 94 34 Q 94 32, 94 30 Z"
          fill="#C9B896"
          stroke="#B8A878"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        <path 
          d="M 86 58 Q 90 56, 94 58 Q 96 62, 94 66 Q 90 68, 86 66 Q 84 62, 86 58 Z"
          fill="#D4C4A8"
          stroke="#C4B498"
          strokeWidth="0.4"
          opacity="0.85"
        />
      </g>
      
      <g opacity="0.4">
        <path d="M 18 30 Q 22 38, 26 48 Q 30 56, 28 62" fill="none" stroke="#6BA3B8" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M 40 28 Q 45 38, 50 50 Q 54 58, 52 66" fill="none" stroke="#6BA3B8" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M 60 24 Q 65 36, 70 50 Q 74 60, 72 68" fill="none" stroke="#6BA3B8" strokeWidth="0.6" strokeLinecap="round"/>
        <path d="M 80 30 Q 84 42, 86 56 Q 87 64, 85 70" fill="none" stroke="#6BA3B8" strokeWidth="0.5" strokeLinecap="round"/>
      </g>
      
      {cities.map((city, idx) => (
        <g key={idx} transform={`translate(${city.x}, ${city.y})`}>
          <circle r={city.type === 'major' ? 2.5 : 1.5} fill="url(#cityPulse)" opacity="0.6"/>
          <circle r={city.type === 'major' ? 1.2 : 0.8} fill="#2D2D2D" stroke="#FFD700" strokeWidth={city.type === 'major' ? 0.4 : 0.3}/>
          <text 
            y={city.type === 'major' ? -4 : -3}
            textAnchor="middle"
            fontSize={city.type === 'major' ? 2.2 : 1.8}
            fontWeight={city.type === 'major' ? 'bold' : 'normal'}
            fill="#2D2D2D"
          >
            {city.name}
          </text>
          <text 
            y={city.type === 'major' ? -1.5 : -0.5}
            textAnchor="middle"
            fontSize={city.type === 'major' ? 1.5 : 1.2}
            fill="#4A4A4A"
            opacity="0.7"
          >
            {city.nameRu}
          </text>
        </g>
      ))}
      
      <g transform="translate(45, 31)" opacity="0.6">
        <text textAnchor="middle" fontSize="2" fill="#5A5A5A" fontStyle="italic">Урал</text>
        <path d="M -3 1 L 0 -1 L 3 1" fill="none" stroke="#6B6B5A" strokeWidth="0.3"/>
      </g>
    </svg>
  )
}

// 详情弹窗组件
function DetailModal({ era, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 50%, #d8d8d8 100%)', border: '1px solid rgba(200, 200, 200, 0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${era.color}, ${era.glowColor})` }}/>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${era.glowColor} 0%, ${era.color} 100%)` }}
            >
              <MusicIcon type={era.icon} size={40} color="#fff"/>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: era.color }}>{era.name}</h2>
              <p className="text-gray-500 text-lg">{era.nameRu}</p>
              <p className="text-gray-400 text-sm mt-1">{era.period} · {era.year}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-700 font-medium">{era.city}</span>
            <span className="text-gray-400">({era.cityRu})</span>
          </div>
          
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{era.description}</p>
          
          <div className="mb-5">
            <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: era.color }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              代表作曲家
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.composers.map((composer, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: `${era.color}15`, border: `1px solid ${era.color}40`, color: era.color }}
                >
                  {composer}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: era.color }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              音乐特征
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.features.map((feature, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-600 border border-gray-300">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <Link 
            href={`/music-history/${era.id}`} 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md"
            style={{ background: `linear-gradient(135deg, ${era.color} 0%, ${era.glowColor} 100%)`, color: '#fff' }}
          >
            查看完整文章
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
        
        <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${era.glowColor}, transparent)` }}/>
      </div>
    </div>
  )
}

// 作曲家详情弹窗组件
function ComposerDetailModal({ composer, onClose }) {
  if (!composer) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)', border: `2px solid ${composer.color}40` }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部装饰条 */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${composer.color}, ${composer.glowColor})` }}/>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="p-6 md:p-8">
          {/* 头部信息 */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              {composer.image_url ? (
                <img 
                  src={composer.image_url}
                  alt={composer.name_zh}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg"
                  style={{ border: `3px solid ${composer.color}` }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${composer.color}40, ${composer.glowColor}20)`, border: `3px solid ${composer.color}` }}
              >
                <MusicIcon type="user" size={48} color={composer.glowColor}/>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">{composer.name_zh}</h2>
              <p className="text-lg text-gray-300 mb-1">{composer.name_ru}</p>
              <p className="text-sm text-gray-400 mb-3">{composer.full_name_zh}</p>
              <p className="text-sm text-gray-500 mb-3">{composer.full_name_ru}</p>
              
              {/* 生卒年与城市 */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: `${composer.color}30`, color: composer.glowColor }}>
                  {composer.birth_year} - {composer.death_year > 0 ? composer.death_year : '至今'}
                </span>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  📍 {composer.city_zh}
                </span>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: `${composer.color}40`, color: composer.glowColor }}>
                  {composer.period_name_zh}
                </span>
              </div>
            </div>
          </div>
          
          {/* 简介 */}
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: composer.glowColor }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              简介
            </h3>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-gray-200 leading-relaxed mb-3">{composer.bio_zh}</p>
              <p className="text-gray-400 leading-relaxed text-sm italic">{composer.bio_ru}</p>
            </div>
          </div>
          
          {/* 风格特点 */}
          {composer.style_zh && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: composer.glowColor }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                风格特点
              </h3>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-gray-200 leading-relaxed mb-2">{composer.style_zh}</p>
                <p className="text-gray-400 leading-relaxed text-sm italic">{composer.style_ru}</p>
              </div>
            </div>
          )}
          
          {/* 代表作品 */}
          {composer.key_works && composer.key_works.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: composer.glowColor }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
                代表作品
              </h3>
              <div className="grid gap-2">
                {composer.key_works.map((work, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg flex items-start gap-3"
                    style={{ backgroundColor: `${composer.color}15`, border: `1px solid ${composer.color}30` }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" 
                      style={{ backgroundColor: composer.color }}>
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{work.title_zh}</p>
                      <p className="text-gray-400 text-sm">{work.title_ru}</p>
                      {work.year && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs" 
                          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#aaa' }}>
                          {work.year}年 · {work.genre_zh || work.genre_ru}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 谱例分析 */}
          {composer.scores && composer.scores.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: composer.glowColor }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                谱例分析
              </h3>
              {composer.scores.map((score, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-white font-medium mb-2">{score.work_title_zh}</p>
                  <p className="text-gray-400 text-sm mb-2">{score.work_title_ru}</p>
                  {score.form_zh && (
                    <p className="text-sm mb-2" style={{ color: composer.glowColor }}>
                      曲式: {score.form_zh} | {score.key}
                    </p>
                  )}
                  <p className="text-gray-300 text-sm leading-relaxed">{score.analysis_zh}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 底部装饰 */}
        <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${composer.glowColor}, transparent)` }}/>
      </div>
    </div>
  )
}

// 底部时间轴组件
function Timeline({ eras, activeEra, onEraClick }) {
  return (
    <div 
      className="relative py-6 px-4"
      style={{ background: 'linear-gradient(to top, rgba(240, 240, 240, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%)', borderTop: '1px solid rgba(150, 150, 150, 0.2)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative h-1 mb-6">
          <div className="absolute inset-0 rounded-full bg-gray-300"/>
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {eras.map((era, idx) => (
              <div 
                key={era.id} 
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${activeEra?.id === era.id ? 'scale-150' : 'hover:scale-125'}`} 
                style={{ backgroundColor: era.color, boxShadow: activeEra?.id === era.id ? `0 0 10px ${era.glowColor}` : 'none' }} 
                onClick={() => onEraClick(era)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between gap-1 overflow-x-auto pb-2">
          {eras.map((era, idx) => (
            <button 
              key={era.id} 
              onClick={() => onEraClick(era)} 
              className={`flex-shrink-0 text-center transition-all duration-300 p-2 rounded-lg ${activeEra?.id === era.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
              style={{ background: activeEra?.id === era.id ? `${era.color}20` : 'transparent' }}
            >
              <div 
                className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300" 
                style={{ background: activeEra?.id === era.id ? `linear-gradient(135deg, ${era.glowColor}, ${era.color})` : `${era.color}40`, color: activeEra?.id === era.id ? '#fff' : era.color }}
              >
                {idx + 1}
              </div>
              <p className="text-xs font-medium text-gray-700 whitespace-nowrap">{era.period}</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">{era.year}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 图例组件
function Legend({ selectedPeriod, onPeriodChange }) {
  return (
    <div className="absolute bottom-4 left-4 p-3 rounded-lg z-20 flex flex-col gap-3" 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(200, 200, 200, 0.5)', maxWidth: '200px' }}>
      {/* 地形渐变 */}
      <div>
        <h4 className="text-xs font-bold text-gray-600 mb-2">地形渐变</h4>
        <div className="flex items-center gap-1">
          <div className="w-20 h-3 rounded" style={{ background: 'linear-gradient(to right, #3D5A45, #5D7052, #9B8B6D, #C9B896, #D4C4A8)' }}/>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">欧洲</span>
          <span className="text-xs text-gray-500">远东</span>
        </div>
      </div>
      
      {/* 作曲家重要性 */}
      <div>
        <h4 className="text-xs font-bold text-gray-600 mb-2">作曲家</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <span className="text-xs text-gray-500">重要</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-700"></div>
            <span className="text-xs text-gray-500">核心</span>
          </div>
        </div>
      </div>
      
      {/* 时期筛选 */}
      <div>
        <h4 className="text-xs font-bold text-gray-600 mb-2">时期筛选</h4>
        <div className="flex flex-wrap gap-1">
          {periodFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onPeriodChange(filter.id)}
              className={`px-2 py-1 rounded text-xs transition-all ${selectedPeriod === filter.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              style={{ 
                backgroundColor: selectedPeriod === filter.id ? filter.color : 'transparent',
                border: `1px solid ${selectedPeriod === filter.id ? filter.color : '#ddd'}`
              }}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 主页面组件
export default function MusicHistoryMapPage() {
  const [selectedEra, setSelectedEra] = useState(null)
  const [selectedComposer, setSelectedComposer] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [mounted, setMounted] = useState(false)
  const [showComposers, setShowComposers] = useState(true)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const composers = composersData.composers || []
  
  // 根据时期筛选作曲家
  const filteredComposers = selectedPeriod === 'all' 
    ? composers 
    : composers.filter(c => c.period === selectedPeriod)
  
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E0E0E0' }}>
      <div className="fixed top-4 left-4 z-10">
        <Matryoshka x={0} y={0} size={30}/>
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
      
      <header className="relative z-10 pt-8 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-400"/>
            <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-400"/>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight text-gray-800">
            俄罗斯音乐史地图
          </h1>
          
          <p className="text-lg md:text-xl mb-4 text-gray-600">
            从东正教圣咏到当代多元发展 · {composers.length}位作曲家
          </p>
          
          <p className="text-sm text-gray-500">
            История русской музыки
          </p>
          
          {/* 切换按钮 */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setShowComposers(!showComposers)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showComposers 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              {showComposers ? '🎵 作曲家标记已显示' : '🎵 显示作曲家标记'}
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-gray-400"/>
            <div className="w-20 h-px bg-gray-300"/>
            <div className="w-3 h-3 rounded-full bg-gray-500"/>
            <div className="w-20 h-px bg-gray-300"/>
            <div className="w-2 h-2 rounded-full bg-gray-400"/>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 px-4 py-2">
        <div className="max-w-6xl mx-auto h-full">
          <div className="relative h-full">
            <div 
              className={`relative rounded-2xl overflow-hidden h-full transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}
              style={{ background: 'linear-gradient(145deg, #f5f5f5 0%, #e8e8e8 50%, #dcdcdc 100%)', border: '1px solid rgba(180, 180, 180, 0.5)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 60px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(150, 150, 150, 0.2)' }}/>
              
              <Matryoshka x={20} y={75} size={25}/>
              <Matryoshka x={85} y={80} size={18}/>
              <Balalaika x={15} y={25} size={20}/>
              <Balalaika x={88} y={22} size={14}/>
              <ChurchSilhouette x={92} y={70} size={22}/>
              <BirchTree x={8} y={60} size={18}/>
              <BirchTree x={75} y={15} size={15}/>
              <MusicStaff x={8} y={45} width={30}/>
              <MusicStaff x={85} y={55} width={25}/>
              <FloatingNote x={25} y={15} size={10}/>
              <FloatingNote x={70} y={18} size={8}/>
              <FloatingNote x={45} y={12} size={9}/>
              
              <div className="relative p-4 md:p-6 lg:p-8 h-full flex flex-col">
                <div className="relative flex-1 min-h-[400px] md:min-h-[450px]">
                  <RussianMapSVG 
                    composers={filteredComposers} 
                    selectedPeriod={selectedPeriod}
                    onComposerClick={setSelectedComposer}
                    selectedComposer={selectedComposer}
                  />
                  
                  {/* 时代节点 */}
                  {mounted && eras.map((era, idx) => (
                    <EraNode 
                      key={era.id} 
                      era={era} 
                      index={idx} 
                      isActive={selectedEra?.id === era.id} 
                      onClick={setSelectedEra}
                    />
                  ))}
                  
                  {/* 作曲家标记点 */}
                  {mounted && showComposers && filteredComposers.map((composer) => (
                    <ComposerMarker 
                      key={composer.id}
                      composer={composer}
                      isSelected={selectedComposer?.id === composer.id}
                      onClick={setSelectedComposer}
                    />
                  ))}
                  
                  <Legend selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
                </div>
                
                <p className="text-center text-sm mt-4 text-gray-500">
                  点击地图上的节点探索俄罗斯音乐史的各个时期 · 点击作曲家标记查看详情
                </p>
              </div>
              
              <div className="h-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(150, 150, 150, 0.3), transparent)' }}/>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10">
        <Timeline eras={eras} activeEra={selectedEra} onEraClick={setSelectedEra}/>
      </footer>
      
      {selectedEra && <DetailModal era={selectedEra} onClose={() => setSelectedEra(null)}/>}
      {selectedComposer && <ComposerDetailModal composer={selectedComposer} onClose={() => setSelectedComposer(null)}/>}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
