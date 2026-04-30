'use client'  // v2.1 - 俄罗斯文化装饰升级

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// 动态导入 Leaflet 地图组件（禁用SSR，因为Leaflet需要window对象）
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">正在加载交互地图...</p>
      </div>
    </div>
  )
})

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
    features: ['民族主义音乐', '俄罗斯歌剧', '历史题材交响曲'],
    color: '#556B2F',
    glowColor: '#8FBC8F',
    icon: 'group',
    themeKey: 'russian-soul'
  },
  {
    id: 'tchaikovsky-era',
    name: '柴可夫斯基时代',
    nameRu: 'Tchaikovsky',
    period: '19世纪下半叶',
    year: '1870-1893',
    position: { x: 38, y: 42 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '柴可夫斯基将俄罗斯浪漫主义音乐推向世界巅峰，他的作品兼具民族性与国际性，成为俄罗斯音乐在全球的代言人。',
    composers: ['柴可夫斯基', '格拉祖诺夫'],
    features: ['浪漫主义芭蕾', '交响曲', '钢琴协奏曲'],
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
    description: '俄罗斯音乐的"白银时代"见证了作曲技巧的高度成熟与民族风格的多元化发展。',
    composers: ['拉赫玛尼诺夫', '斯克里亚宾', '普罗科菲耶夫'],
    features: ['晚期浪漫主义', '现代主义萌芽', '民族融合'],
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
    description: '苏联时期俄罗斯音乐经历了社会主义现实主义的洗礼，肖斯塔科维奇、哈恰图良等大师创作出兼具民族特色与国际视野的伟大作品。',
    composers: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良'],
    features: ['社会主义现实主义', '交响曲', '电影音乐'],
    color: '#8B0000',
    glowColor: '#CD5C5C',
    icon: 'symphony',
    themeKey: 'steel-rose'
  },
  {
    id: 'contemporary',
    name: '当代多元',
    nameRu: 'Contemporary',
    period: '1991至今',
    year: '1991至今',
    position: { x: 55, y: 42 },
    city: '莫斯科',
    cityRu: 'Москва',
    description: '后苏联时代俄罗斯音乐呈现多元化发展态势，电子音乐、跨界合作与世界音乐交融，展现出新时代的活力。',
    composers: ['古拜杜丽娜', '施尼特凯'],
    features: ['电子音乐', '跨界合作', '世界音乐'],
    color: '#483D8B',
    glowColor: '#9370DB',
    icon: 'modern',
    themeKey: 'steel-rose'
  }
]

// ============ 俄罗斯文化装饰组件 ============

// 1. 俄罗斯蕾丝角花装饰 (Russian Lace Corner)
const RussianLaceCorner = ({ position, size = 80, color = '#D4AF37', opacity = 0.15 }) => {
  const transforms = {
    'top-left': 'rotate(0)',
    'top-right': 'rotate(90deg)',
    'bottom-left': 'rotate(-90deg)',
    'bottom-right': 'rotate(180deg)'
  }
  
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        [position.includes('top') ? 'top' : 'bottom']: 0,
        [position.includes('left') ? 'left' : 'right']: 0,
        width: size,
        height: size,
        opacity,
        transform: transforms[position],
        transformOrigin: 'center center'
      }}
      viewBox="0 0 80 80"
    >
      {/* 蕾丝花瓣图案 */}
      <g fill="none" stroke={color} strokeWidth="0.5">
        {/* 中心花朵 */}
        <circle cx="15" cy="15" r="8" />
        <circle cx="15" cy="15" r="5" />
        <circle cx="15" cy="15" r="2" fill={color} />
        
        {/* 弧形装饰线 */}
        <path d="M 25 5 Q 35 5 40 15" />
        <path d="M 5 25 Q 5 35 15 40" />
        
        {/* 叶子装饰 */}
        <path d="M 8 8 Q 12 12 8 16" />
        <path d="M 16 8 Q 12 12 16 16" />
        
        {/* 延伸的蕾丝边 */}
        <path d="M 40 5 L 70 5" strokeDasharray="2,2" />
        <path d="M 5 40 L 5 70" strokeDasharray="2,2" />
        
        {/* 小圆点装饰 */}
        <circle cx="30" cy="5" r="1" fill={color} />
        <circle cx="45" cy="5" r="1" fill={color} />
        <circle cx="60" cy="5" r="1" fill={color} />
        <circle cx="5" cy="30" r="1" fill={color} />
        <circle cx="5" cy="45" r="1" fill={color} />
        <circle cx="5" cy="60" r="1" fill={color} />
      </g>
    </svg>
  )
}

// 2. 穹顶天际线剪影 (Cupola Skyline Silhouette)
const CupolaSkyline = ({ position = 'top', width = 200, height = 40, color = '#D4AF37', opacity = 0.1 }) => {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        [position]: 0,
        left: position === 'top' ? '50%' : undefined,
        transform: position === 'top' ? 'translateX(-50%)' : undefined,
        width,
        height,
        opacity
      }}
      viewBox="0 0 200 40"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill={color}>
        {/* 洋葱穹顶 */}
        <ellipse cx="30" cy="25" rx="12" ry="12" />
        <ellipse cx="30" cy="18" rx="8" ry="10" />
        <rect x="28" y="5" width="4" height="5" />
        <circle cx="30" cy="3" r="2" />
        
        {/* 双穹顶 */}
        <ellipse cx="60" cy="28" rx="10" ry="10" />
        <ellipse cx="60" cy="22" rx="6" ry="8" />
        <rect x="58" y="10" width="4" height="4" />
        <circle cx="60" cy="8" r="2" />
        
        {/* 高穹顶 */}
        <ellipse cx="95" cy="22" rx="15" ry="15" />
        <ellipse cx="95" cy="12" rx="10" ry="12" />
        <rect x="92" y="0" width="6" height="5" />
        <circle cx="95" cy="-2" r="3" />
        
        {/* 钟楼 */}
        <rect x="125" y="15" width="12" height="25" />
        <polygon points="125,15 131,8 137,15" />
        <rect x="128" y="5" width="6" height="5" />
        
        {/* 小穹顶群 */}
        <ellipse cx="155" cy="30" rx="8" ry="8" />
        <ellipse cx="155" cy="25" rx="5" ry="6" />
        <ellipse cx="170" cy="32" rx="6" ry="6" />
        <ellipse cx="170" cy="28" rx="4" ry="5" />
        
        {/* 远景剪影 */}
        <rect x="180" y="25" width="8" height="15" />
        <polygon points="180,25 184,20 188,25" />
      </g>
    </svg>
  )
}

// 3. 洋葱穹顶节点装饰 (Onion Dome Timeline Node)
const CupolaNode = ({ size = 24, color = '#D4AF37', opacity = 0.2 }) => (
  <svg
    className="absolute pointer-events-none"
    style={{
      width: size,
      height: size * 1.5,
      opacity
    }}
    viewBox="0 0 24 36"
  >
    <ellipse cx="12" cy="22" rx="10" ry="10" fill={color} opacity="0.6" />
    <ellipse cx="12" cy="14" rx="6" ry="8" fill={color} opacity="0.7" />
    <ellipse cx="12" cy="8" rx="3" ry="5" fill={color} opacity="0.8" />
    <rect x="10" y="0" width="4" height="4" fill={color} opacity="0.9" />
    <circle cx="12" cy="-2" r="2" fill={color} />
  </svg>
)

// 4. 斯拉夫装饰分隔线 (Slavic Ornament Divider)
const SlavicDivider = ({ width = 200, height = 20, color = '#D4AF37', opacity = 0.2 }) => (
  <svg
    className="absolute pointer-events-none"
    style={{
      width,
      height,
      opacity
    }}
    viewBox="0 0 200 20"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="30%" stopColor={color} />
        <stop offset="50%" stopColor={color} stopOpacity="0.8" />
        <stop offset="70%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    
    {/* 主线 */}
    <line x1="0" y1="10" x2="200" y2="10" stroke="url(#dividerGradient)" strokeWidth="1" />
    
    {/* 中心装饰 */}
    <circle cx="100" cy="10" r="4" fill={color} opacity="0.8" />
    <circle cx="100" cy="10" r="2" fill={color} />
    
    {/* 两侧装饰 */}
    <circle cx="80" cy="10" r="2" fill={color} opacity="0.6" />
    <circle cx="120" cy="10" r="2" fill={color} opacity="0.6" />
    
    {/* 小菱形 */}
    <polygon points="90,10 93,7 90,4 87,7" fill={color} opacity="0.5" />
    <polygon points="110,10 113,7 110,4 107,7" fill={color} opacity="0.5" />
  </svg>
)

// 5. 穹顶暗角效果 (Cupola Vignette Overlay)
const CupolaVignette = ({ intensity = 0.6 }) => (
  <div
    className="absolute inset-0 pointer-events-none z-20"
    style={{
      background: `
        radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,${intensity}) 100%),
        linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%),
        linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%)
      `
    }}
  />
)

// 6. 金色拱形装饰框 (Golden Arch Frame)
const GoldenArchFrame = ({ color = '#D4AF37', opacity = 0.15 }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-10"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="archGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={opacity} />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    
    {/* 顶部拱形装饰 */}
    <path
      d="M 0 0 Q 50 -5 100 0 L 100 8 Q 50 3 0 8 Z"
      fill="url(#archGradient)"
    />
    
    {/* 底部拱形装饰 */}
    <path
      d="M 0 100 Q 50 95 100 100 L 100 92 Q 50 97 0 92 Z"
      fill="url(#archGradient)"
    />
    
    {/* 左侧装饰 */}
    <path
      d="M 0 0 Q -5 50 0 100 L 8 100 Q 3 50 8 0 Z"
      fill="url(#archGradient)"
    />
    
    {/* 右侧装饰 */}
    <path
      d="M 100 0 Q 105 50 100 100 L 92 100 Q 97 50 92 0 Z"
      fill="url(#archGradient)"
    />
  </svg>
)

// 7. 赫赫洛马波浪线 (Gergely Wave Pattern)
const GergelyWave = ({ position = 'bottom', width = '100%', height = 30, color = '#D4AF37', opacity = 0.15 }) => {
  const isBottom = position === 'bottom'
  
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        [position]: 0,
        width,
        height,
        opacity
      }}
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
    >
      <path
        d={`
          M 0 ${isBottom ? 0 : 30}
          Q 25 ${isBottom ? 15 : 15} 50 ${isBottom ? 5 : 25}
          Q 75 ${isBottom ? 15 : 15} 100 ${isBottom ? 0 : 30}
          Q 125 ${isBottom ? 15 : 15} 150 ${isBottom ? 5 : 25}
          Q 175 ${isBottom ? 15 : 15} 200 ${isBottom ? 0 : 30}
          Q 225 ${isBottom ? 15 : 15} 250 ${isBottom ? 5 : 25}
          Q 275 ${isBottom ? 15 : 15} 300 ${isBottom ? 0 : 30}
          Q 325 ${isBottom ? 15 : 15} 350 ${isBottom ? 5 : 25}
          Q 375 ${isBottom ? 15 : 15} 400 ${isBottom ? 0 : 30}
        `}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      
      {/* 波浪线上的装饰点 */}
      <circle cx="0" cy={isBottom ? 0 : 30} r="2" fill={color} />
      <circle cx="100" cy={isBottom ? 0 : 30} r="2" fill={color} />
      <circle cx="200" cy={isBottom ? 0 : 30} r="2" fill={color} />
      <circle cx="300" cy={isBottom ? 0 : 30} r="2" fill={color} />
      <circle cx="400" cy={isBottom ? 0 : 30} r="2" fill={color} />
    </svg>
  )
}

// 时间轴组件
const Timeline = ({ eras, activeEra, onEraClick }) => (
  <div className="w-full px-4 py-3">
    <div className="max-w-4xl mx-auto">
      <div className="relative flex items-center justify-between">
        {/* 连接线 */}
        <div 
          className="absolute top-4 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)'
          }}
        />
        
        {/* 穹顶节点装饰 */}
        {eras.map((era, idx) => (
          <div key={`cupola-${era.id}`} className="absolute" style={{ left: `${(idx / (eras.length - 1)) * 100}%`, top: '12px', transform: 'translateX(-50%)' }}>
            <CupolaNode size={16} color={era.glowColor} opacity={0.15} />
          </div>
        ))}
        
        {/* 节点 */}
        {eras.map((era, idx) => (
          <button
            key={era.id}
            onClick={() => onEraClick(era)}
            className="relative z-10 group flex flex-col items-center"
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: activeEra?.id === era.id ? era.color : 'rgba(30, 30, 40, 0.8)',
                border: `2px solid ${activeEra?.id === era.id ? era.glowColor : 'rgba(255, 255, 255, 0.2)'}`,
                boxShadow: activeEra?.id === era.id ? `0 0 15px ${era.glowColor}` : 'none',
                transform: activeEra?.id === era.id ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <span className="text-white text-xs font-bold">{idx + 1}</span>
            </div>
            
            {/* 年份 */}
            <div 
              className="mt-2 text-xs whitespace-nowrap transition-colors duration-300"
              style={{
                color: activeEra?.id === era.id ? era.glowColor : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {era.year.split('-')[0]}
            </div>
            
            {/* 名称 */}
            <div 
              className="mt-1 text-xs whitespace-nowrap transition-colors duration-300 max-w-[80px] truncate"
              style={{
                color: activeEra?.id === era.id ? '#fff' : 'rgba(255, 255, 255, 0.3)'
              }}
            >
              {era.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
)

// 详情弹窗
const DetailModal = ({ era, onClose }) => (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    <div 
      className="relative w-full max-w-lg rounded-2xl p-6 animate-modal-in overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1a1a24 0%, #14141e 100%)',
        border: `1px solid ${era.glowColor}30`,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px ${era.glowColor}20`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 金色拱形装饰框 */}
      <GoldenArchFrame color={era.glowColor} opacity={0.1} />
      
      {/* 关闭按钮 */}
      <button 
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
        onClick={onClose}
      >
        <span className="text-gray-400 text-xl">×</span>
      </button>
      
      {/* 标题 */}
      <div className="mb-4 relative z-10">
        <h2 
          className="text-2xl font-bold mb-1"
          style={{ 
            color: era.glowColor,
            fontFamily: "'Playfair Display', Georgia, serif"
          }}
        >
          {era.name}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{era.period}</span>
          <span className="text-gray-600">•</span>
          <span className="text-sm" style={{ color: era.glowColor + '88' }}>
            {era.year}
          </span>
        </div>
      </div>
      
      {/* 城市标签 */}
      <div 
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
        style={{
          backgroundColor: era.color + '20',
          border: `1px solid ${era.color}40`
        }}
      >
        <span className="text-sm" style={{ color: era.glowColor }}>
          📍 {era.city}
        </span>
        <span className="text-xs text-gray-500">{era.cityRu}</span>
      </div>
      
      {/* 描述 */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {era.description}
      </p>
      
      {/* 作曲家 */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">代表作曲家</div>
        <div className="flex flex-wrap gap-2">
          {era.composers.map((composer, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: era.glowColor + '15',
                color: era.glowColor,
                border: `1px solid ${era.glowColor}30`
              }}
            >
              {composer}
            </span>
          ))}
        </div>
      </div>
      
      {/* 特征标签 */}
      <div>
        <div className="text-xs text-gray-500 mb-2">音乐特征</div>
        <div className="flex flex-wrap gap-2">
          {era.features.map((feature, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#888'
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// 主页面组件
export default function MusicHistoryMapPage() {
  const [selectedEra, setSelectedEra] = useState(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const getTheme = useCallback((themeKey) => {
    return themeColors[themeKey] || themeColors['russian-soul']
  }, [])
  
  const theme = selectedEra ? getTheme(selectedEra.themeKey) : themeColors['russian-soul']
  
  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a12 0%, #12121a 50%, #0a0a12 100%)'
      }}
    >
      {/* ============ 俄罗斯文化装饰层 ============ */}
      
      {/* 1. 四角蕾丝角花 */}
      <RussianLaceCorner position="top-left" size={100} color={theme.glowColor} opacity={0.12} />
      <RussianLaceCorner position="top-right" size={100} color={theme.glowColor} opacity={0.12} />
      <RussianLaceCorner position="bottom-left" size={80} color={theme.glowColor} opacity={0.1} />
      <RussianLaceCorner position="bottom-right" size={80} color={theme.glowColor} opacity={0.1} />
      
      {/* 导航栏 */}
      <nav className="relative z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: theme.glowColor }}
          >
            ← 返回首页
          </Link>
          <div className="text-sm text-gray-500">
            俄罗斯音乐史
          </div>
        </div>
      </nav>
      
      {/* 2. 穹顶天际线剪影 */}
      <CupolaSkyline 
        position="top" 
        width="300" 
        height="50" 
        color={theme.glowColor} 
        opacity={0.08} 
      />
      
      {/* 标题区域 */}
      <header className="relative z-20 px-4 py-6 text-center">
        <div className="max-w-6xl mx-auto">
          {/* 3. 斯拉夫装饰分隔线 */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-24" style={{ background: `linear-gradient(to right, transparent, ${theme.glowColor}80)` }} />
            <svg 
              className="w-6 h-6 mx-3 transition-all duration-500" 
              viewBox="0 0 24 24" 
              fill={theme.glowColor}
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <div className="h-px w-24" style={{ background: `linear-gradient(to left, transparent, ${theme.glowColor}80)` }} />
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
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.5 }} />
            <div className="w-20 h-px" style={{ backgroundColor: theme.glowColor, opacity: 0.3 }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.7 }} />
            <div className="w-20 h-px" style={{ backgroundColor: theme.glowColor, opacity: 0.3 }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor, opacity: 0.5 }} />
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="flex-1 relative z-20 px-4 py-2">
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
              {/* 5. 穹顶暗角效果 - 替代简单暗角 */}
              <CupolaVignette intensity={0.5} />
              
              {/* 4. 金色拱形装饰框 */}
              <GoldenArchFrame color={theme.glowColor} opacity={0.08} />
              
              {/* 内部边框装饰 */}
              <div 
                className="absolute inset-2 rounded-xl pointer-events-none z-10"
                style={{ border: `1px solid ${theme.glowColor}10` }}
              />
              
              {/* Leaflet 地图容器 */}
              <div className="relative p-4 md:p-6 lg:p-8 h-full flex flex-col z-0">
                <div 
                  className="relative rounded-xl overflow-hidden" style={{ height: "500px", minHeight: "400px" }}
                  style={{
                    border: `1px solid ${theme.glowColor}15`,
                    boxShadow: `inset 0 0 30px rgba(0, 0, 0, 0.3)`
                  }}
                >
                  {/* Leaflet 交互地图 */}
                  <MapComponent 
                    activePeriod={selectedEra}
                    onComposerSelect={() => {}}
                    onCitySelect={(city) => {
                      // 可选：根据城市筛选时期
                    }}
                    mapCenter={[60, 50]}
                    mapZoom={4}
                  />
                </div>
                
                <p className="text-center text-sm mt-4" style={{ color: theme.glowColor + '88' }}>
                  拖拽地图探索俄罗斯各地的音乐历史，点击标记查看详情
                </p>
              </div>
              
              {/* 7. 赫赫洛马波浪线 - 底部 */}
              <GergelyWave position="bottom" width="100%" height={20} color={theme.glowColor} opacity={0.1} />
              
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
      <footer className="relative z-20">
        {/* 斯拉夫装饰分隔线 - 时间轴上方 */}
        <div className="flex justify-center mb-2">
          <SlavicDivider width={300} height={15} color={theme.glowColor} opacity={0.15} />
        </div>
        <Timeline eras={eras} activeEra={selectedEra} onEraClick={setSelectedEra}/>
      </footer>
      
      {/* 详情弹窗 */}
      {selectedEra && <DetailModal era={selectedEra} onClose={() => setSelectedEra(null)} />}
      
      {/* 全局样式 */}
      <style jsx>{`
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
        
        /* 隐藏滚动条 */
        .scrollbar-hide::-webkit-scrollbar { 
          display: none; 
        }
        .scrollbar-hide { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
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
