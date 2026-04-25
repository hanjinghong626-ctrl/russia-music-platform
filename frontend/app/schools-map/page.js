'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { schoolsData } from '../../data/schools'

// 城市坐标映射（基于地图百分比）
const cityCoordinates = {
  '莫斯科': { x: 28, y: 38 },
  '圣彼得堡': { x: 22, y: 32 },
  '新西伯利亚': { x: 68, y: 45 },
  '叶卡捷琳堡': { x: 58, y: 42 },
  '喀山': { x: 48, y: 40 },
  '符拉迪沃斯托克': { x: 92, y: 50 },
  '下诺夫哥罗德': { x: 44, y: 40 },
  '萨拉托夫': { x: 46, y: 46 },
  '阿斯特拉罕': { x: 46, y: 54 },
  '彼得罗扎沃茨克': { x: 24, y: 28 },
}

// 城市别名映射
const cityAlias = {
  '顿河罗斯托夫': '罗斯托夫',
  '顿河畔罗斯托夫': '罗斯托夫',
  '格罗兹尼': '莫斯科',
}

// 城市诗句（音乐名言）
const cityPoems = {
  '莫斯科': '柴可夫斯基的浪漫篇章',
  '圣彼得堡': '强力集团的不朽遗产',
  '新西伯利亚': '西伯利亚的音乐明珠',
  '叶卡捷琳堡': '乌拉尔山麓的乐韵',
  '喀山': '鞑靼风情的交响',
  '下诺夫哥罗德': '伏尔加河畔的旋律',
  '萨拉托夫': '俄罗斯民歌的摇篮',
  '阿斯特拉罕': '里海之滨的和声',
  '符拉迪沃斯托克': '远东第一声',
  '彼得罗扎沃茨克': '卡累利阿的湖光乐章',
}

// 音乐学院节点样式配置
const nodeStyles = {
  top: { color: '#d4af37', glowColor: '#ffd700', size: 14, label: '顶级', borderColor: '#8b7355' },
  famous: { color: '#c9a962', glowColor: '#daa520', size: 11, label: '知名', borderColor: '#8b7355' },
  regular: { color: '#9b8b6d', glowColor: '#b8a078', size: 8, label: '普通', borderColor: '#6b5b4f' },
}

// 确定院校重要性
function getImportance(school) {
  const topSchools = ['莫斯科', '圣彼得堡']
  const famousSchools = ['新西伯利亚', '叶卡捷琳堡', '喀山', '下诺夫哥罗德', '萨拉托夫', '罗斯托夫']
  
  if (topSchools.includes(school.city)) return 'top'
  if (famousSchools.includes(school.city)) return 'famous'
  return 'regular'
}

// 获取院校简称
function getShortName(name) {
  if (name.includes('柴可夫斯基')) return '柴院'
  if (name.includes('里姆斯基') || name.includes('圣彼得堡')) return '圣音'
  if (name.includes('格涅辛')) return '格涅辛'
  if (name.includes('格林卡')) return '格林卡'
  if (name.includes('拉赫玛尼诺夫')) return '拉赫院'
  if (name.includes('穆索尔斯基')) return '穆院'
  if (name.includes('索比诺夫')) return '索院'
  if (name.includes('日甘诺夫')) return '日院'
  if (name.includes('格拉祖诺夫')) return '格院'
  if (name.includes('阿斯特拉罕')) return '阿院'
  return name.slice(0, 4)
}

// 获取城市坐标
function getCityCoordinate(city) {
  if (cityAlias[city]) {
    return cityCoordinates[cityAlias[city]]
  }
  return cityCoordinates[city]
}

// 音符装饰SVG组件
function MusicNoteDecor({ x, y, size = 8, delay = 0 }) {
  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      opacity="0.15"
      style={{ animation: `noteFloat 4s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      <ellipse cx="0" cy={size * 0.3} rx={size * 0.35} ry={size * 0.28} fill="#d4af37"/>
      <line x1={size * 0.3} y1={size * 0.1} x2={size * 0.3} y2={-size * 0.6} stroke="#d4af37" strokeWidth="1.2"/>
      <path d={`M ${size * 0.3} ${-size * 0.6} Q ${size * 0.5} ${-size * 0.3}, ${size * 0.1} 0`} fill="none" stroke="#d4af37" strokeWidth="0.8"/>
    </g>
  )
}

// 印章风格城市标记
function CitySeal({ city, coord, isHovered, onHover }) {
  const poem = cityPoems[city] || `${city}的乐章`
  
  return (
    <g
      transform={`translate(${coord.x}, ${coord.y})`}
      onMouseEnter={() => onHover(city)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* 外圈光晕 */}
      <circle
        r={isHovered ? 8 : 6}
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.8"
        opacity={isHovered ? 0.6 : 0.3}
        style={{ transition: 'all 0.3s ease', filter: 'blur(1px)' }}
      />
      
      {/* 内圈 */}
      <circle
        r={isHovered ? 6 : 4.5}
        fill="rgba(61, 40, 23, 0.85)"
        stroke="#d4af37"
        strokeWidth="1.2"
        opacity={isHovered ? 1 : 0.8}
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* 城市名（中俄双语） */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isHovered ? 2.5 : 2}
        fontFamily="'Noto Serif SC', 'STSong', 'SimSun', serif"
        fill="#f5f0e6"
        fontWeight="bold"
        style={{ transition: 'all 0.3s ease' }}
      >
        {city}
      </text>
      
      {/* 悬停显示诗句 */}
      {isHovered && (
        <g transform={`translate(0, -12)`}>
          <rect
            x={-22}
            y={-4}
            width={44}
            height={10}
            rx={2}
            fill="rgba(29, 25, 20, 0.92)"
            stroke="#d4af37"
            strokeWidth="0.5"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={2.2}
            fontFamily="'Noto Serif SC', 'STSong', 'SimSun', serif"
            fill="#d4af37"
          >
            {poem}
          </text>
        </g>
      )}
    </g>
  )
}

// 音符形状音乐学院节点
function SchoolNode({ school, index, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)
  const coord = getCityCoordinate(school.city)
  
  if (!coord) return null
  
  const importance = getImportance(school)
  const style = nodeStyles[importance]
  const shortName = getShortName(school.name)
  
  // 音符SVG路径（八分音符）
  const notePath = `
    M 0 ${-style.size * 0.3}
    Q ${style.size * 0.15} ${-style.size * 0.15}, ${style.size * 0.2} ${style.size * 0.1}
    Q ${style.size * 0.25} ${style.size * 0.2}, ${style.size * 0.15} ${style.size * 0.25}
    Q ${style.size * 0.05} ${style.size * 0.25}, 0 ${style.size * 0.25}
    Q ${-style.size * 0.05} ${style.size * 0.25}, 0 ${style.size * 0.15}
    Z
  `
  
  return (
    <g
      transform={`translate(${coord.x}, ${coord.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(school)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 脉冲光环 */}
      <circle
        r={hovered ? style.size * 2.5 : style.size * 1.8}
        fill={style.glowColor}
        opacity={hovered ? 0.4 : 0.15}
        style={{ transition: 'all 0.4s ease', filter: 'blur(3px)' }}
      />
      
      {/* 外发光 */}
      <circle
        r={style.size * 1.2}
        fill="none"
        stroke={style.glowColor}
        strokeWidth={hovered ? 2 : 1.5}
        opacity={hovered ? 0.8 : 0.4}
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* 主音符 */}
      <g transform={`scale(${hovered ? 1.15 : 1})`} style={{ transition: 'transform 0.3s ease' }}>
        {/* 音符头部 */}
        <ellipse
          cx={style.size * 0.2}
          cy={style.size * 0.2}
          rx={style.size * 0.25}
          ry={style.size * 0.2}
          fill={style.color}
          stroke={style.borderColor}
          strokeWidth="1"
        />
        {/* 音符符干 */}
        <line
          x1={style.size * 0.4}
          y1={style.size * 0.2}
          x2={style.size * 0.4}
          y2={-style.size * 0.5}
          stroke={style.color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 音符符尾 */}
        <path
          d={`M ${style.size * 0.4} ${-style.size * 0.5} Q ${style.size * 0.3} ${-style.size * 0.3}, ${style.size * 0.15} ${-style.size * 0.1}`}
          fill="none"
          stroke={style.color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      
      {/* 节点编号 */}
      <circle
        cx={style.size * 0.9}
        cy={-style.size * 0.3}
        r={3}
        fill="#d4af37"
        stroke="#3d2817"
        strokeWidth="0.5"
      />
      <text
        x={style.size * 0.9}
        y={-style.size * 0.3}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={3}
        fontWeight="bold"
        fill="#3d2817"
      >
        {index + 1}
      </text>
      
      {/* 悬停标签 */}
      {hovered && (
        <g transform={`translate(0, ${-style.size - 12})`}>
          <rect
            x={-18}
            y={-5}
            width={36}
            height={12}
            rx={3}
            fill="rgba(29, 25, 20, 0.95)"
            stroke="#d4af37"
            strokeWidth="0.8"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={4}
            fontWeight="bold"
            fill="#f5f0e6"
            fontFamily="'Noto Serif SC', serif"
          >
            {shortName}
          </text>
        </g>
      )}
    </g>
  )
}

// 俄罗斯3D地形地图SVG组件
function RussianMapSVG({ schools, onSchoolClick, activeSchool, hoveredCity, onCityHover }) {
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* 深色地形渐变 */}
        <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d5016"/>
          <stop offset="25%" stopColor="#3d6b1e"/>
          <stop offset="50%" stopColor="#4a7a2a"/>
          <stop offset="75%" stopColor="#5c8a38"/>
          <stop offset="100%" stopColor="#6b9a44"/>
        </linearGradient>
        
        {/* 欧洲部分地形 */}
        <linearGradient id="europeTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d5016"/>
          <stop offset="40%" stopColor="#3d6b1e"/>
          <stop offset="70%" stopColor="#4a7a2a"/>
          <stop offset="100%" stopColor="#558b32"/>
        </linearGradient>
        
        {/* 西伯利亚地形 */}
        <linearGradient id="siberiaTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a7a2a"/>
          <stop offset="50%" stopColor="#5c8a38"/>
          <stop offset="100%" stopColor="#6b9a44"/>
        </linearGradient>
        
        {/* 远东地形 */}
        <linearGradient id="farEastTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b9a44"/>
          <stop offset="100%" stopColor="#7daa52"/>
        </linearGradient>
        
        {/* 地形阴影 */}
        <filter id="terrainShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1a2332" floodOpacity="0.5"/>
        </filter>
        
        {/* 发光效果 */}
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* 水体渐变 */}
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="50%" stopColor="#162d4a"/>
          <stop offset="100%" stopColor="#1e3a5f"/>
        </linearGradient>
        
        {/* 3D高光 */}
        <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
        
        {/* 山脉纹理 */}
        <pattern id="mountainPattern" x="0" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 4 L 2 2 L 4 3 L 6 1 L 8 4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3"/>
        </pattern>
      </defs>
      
      {/* 深色背景 */}
      <rect x="0" y="0" width="100" height="70" fill="#1a2332"/>
      
      {/* 里海 */}
      <ellipse cx="5" cy="38" rx="4" ry="3" fill="url(#waterGradient)" opacity="0.8"/>
      <ellipse cx="10" cy="50" rx="3" ry="2" fill="url(#waterGradient)" opacity="0.7"/>
      
      {/* 俄罗斯领土 - 带阴影和3D效果 */}
      <g filter="url(#terrainShadow)">
        {/* 欧洲部分 */}
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24 Q 30 26, 32 28 Q 34 30, 33 34 Q 32 38, 30 40 Q 28 42, 26 44 Q 24 46, 22 48 Q 20 50, 18 52 Q 16 54, 14 54 Q 12 54, 10 52 Q 8 50, 7 46 Q 6 42, 5 38 Q 4 34, 4 30 Q 4 26, 5 22 Q 5 20, 5 18 Z"
          fill="url(#europeTerrain)"
          stroke="#3d6b1e"
          strokeWidth="1"
          opacity="0.95"
        />
        
        {/* 高光效果 */}
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.6"
        />
        
        {/* 克里米亚半岛 */}
        <path 
          d="M 28 48 Q 32 46, 34 48 Q 36 52, 34 56 Q 32 58, 30 56 Q 28 54, 28 48 Z"
          fill="#3d6b1e"
          stroke="#2d5016"
          strokeWidth="0.6"
          opacity="0.9"
        />
        
        {/* 乌拉尔山脉 */}
        <g opacity="0.9">
          <path 
            d="M 36 24 Q 40 22, 44 24 Q 48 26, 52 28 Q 54 30, 52 34 Q 50 36, 48 34 Q 46 32, 44 34 Q 42 36, 40 38 Q 38 36, 36 34 Q 34 32, 36 28 Q 36 26, 36 24 Z"
            fill="#4a7a2a"
            stroke="#3d6b1e"
            strokeWidth="0.8"
          />
          {/* 山脉纹理 */}
          <path 
            d="M 38 26 L 40 24 L 42 26 L 44 23 L 46 26 L 48 24 L 50 26"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.4"
          />
        </g>
        
        {/* 西伯利亚 */}
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30 Q 96 32, 95 36 Q 94 40, 92 44 Q 90 48, 88 50 Q 86 52, 84 54 Q 82 56, 80 58 Q 78 60, 76 62 Q 74 64, 72 64 Q 70 64, 68 62 Q 66 60, 64 58 Q 62 56, 60 54 Q 58 52, 56 50 Q 54 48, 52 46 Q 50 44, 48 42 Q 46 40, 44 38 Q 42 36, 40 34 Q 38 32, 36 30 Q 38 26, 40 24 Q 44 20, 48 18 Q 50 17, 52 18 Z"
          fill="url(#siberiaTerrain)"
          stroke="#4a7a2a"
          strokeWidth="0.8"
          opacity="0.92"
        />
        
        {/* 西伯利亚高光 */}
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        
        {/* 远东地区 */}
        <path 
          d="M 88 26 Q 92 24, 95 26 Q 98 28, 99 32 Q 100 36, 99 40 Q 98 44, 96 48 Q 94 52, 92 54 Q 90 56, 88 58 Q 86 60, 84 60 Q 82 58, 84 54 Q 86 50, 88 46 Q 90 42, 90 38 Q 90 34, 88 30 Q 88 28, 88 26 Z"
          fill="url(#farEastTerrain)"
          stroke="#5c8a38"
          strokeWidth="0.6"
          opacity="0.88"
        />
        
        {/* 勘察加半岛 */}
        <path 
          d="M 92 38 Q 96 36, 99 38 Q 100 42, 99 46 Q 97 48, 94 46 Q 92 44, 92 40 Q 92 38, 92 38 Z"
          fill="#6b9a44"
          stroke="#5c8a38"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        {/* 萨哈林岛 */}
        <path 
          d="M 94 30 Q 98 28, 100 30 Q 100 34, 98 36 Q 95 36, 94 34 Q 94 32, 94 30 Z"
          fill="#6b9a44"
          stroke="#5c8a38"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        {/* 楚科奇半岛 */}
        <path 
          d="M 86 58 Q 90 56, 94 58 Q 96 62, 94 66 Q 90 68, 86 66 Q 84 62, 86 58 Z"
          fill="#7daa52"
          stroke="#6b9a44"
          strokeWidth="0.4"
          opacity="0.85"
        />
      </g>
      
      {/* 河流 - 深色风格 */}
      <g opacity="0.5">
        <path d="M 18 30 Q 22 38, 26 48 Q 30 56, 28 62" fill="none" stroke="#3d5a80" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M 40 28 Q 45 38, 50 50 Q 54 58, 52 66" fill="none" stroke="#3d5a80" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M 60 24 Q 65 36, 70 50 Q 74 60, 72 68" fill="none" stroke="#3d5a80" strokeWidth="0.6" strokeLinecap="round"/>
        <path d="M 80 30 Q 84 42, 86 56 Q 87 64, 85 70" fill="none" stroke="#3d5a80" strokeWidth="0.5" strokeLinecap="round"/>
      </g>
      
      {/* 城市印章标记 */}
      {Object.entries(cityCoordinates).map(([city, coord]) => (
        <CitySeal
          key={city}
          city={city}
          coord={coord}
          isHovered={hoveredCity === city}
          onHover={onCityHover}
        />
      ))}
      
      {/* 音乐学院音符节点 */}
      {schools.map((school, idx) => (
        <SchoolNode 
          key={school.id} 
          school={school} 
          index={idx}
          isActive={activeSchool?.id === school.id}
          onClick={onSchoolClick}
        />
      ))}
      
      {/* 音符装饰 */}
      <MusicNoteDecor x={25} y={28} size={10} delay={0}/>
      <MusicNoteDecor x={45} y={35} size={8} delay={0.5}/>
      <MusicNoteDecor x={65} y={32} size={12} delay={1}/>
      <MusicNoteDecor x={35} y={48} size={7} delay={1.5}/>
      <MusicNoteDecor x={80} y={40} size={9} delay={2}/>
      <MusicNoteDecor x={55} y={55} size={6} delay={2.5}/>
      <MusicNoteDecor x={15} y={42} size={8} delay={0.8}/>
      <MusicNoteDecor x={75} y={55} size={7} delay={1.2}/>
      
      {/* 乌拉尔山脉标注 */}
      <g transform="translate(45, 31)" opacity="0.5">
        <text textAnchor="middle" fontSize="2" fill="rgba(212, 175, 55, 0.6)" fontStyle="italic" fontFamily="serif">Урал</text>
        <path d="M -3 1 L 0 -1 L 3 1" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="0.3"/>
      </g>
    </svg>
  )
}

// 毛玻璃详情弹窗组件
function DetailModal({ school, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
  }, [])
  
  if (!school) return null
  
  const importance = getImportance(school)
  const style = nodeStyles[importance]
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'rgba(26, 35, 50, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ 
          background: 'linear-gradient(145deg, rgba(61, 40, 23, 0.95) 0%, rgba(45, 30, 15, 0.95) 50%, rgba(35, 25, 12, 0.95) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部装饰条 */}
        <div 
          className="h-1.5"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        />
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="#d4af37" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="p-8">
          {/* 标题区域 */}
          <div className="flex items-center gap-6 mb-6">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
                border: '2px solid rgba(212, 175, 55, 0.5)'
              }}
            >
              <span className="text-4xl">♪</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 
                  className="text-3xl font-bold"
                  style={{ 
                    fontFamily: "'Noto Serif SC', 'STSong', 'SimSun', serif",
                    color: '#f5f0e6'
                  }}
                >
                  {school.name}
                </h2>
                <span 
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: 'rgba(212, 175, 55, 0.2)', 
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#d4af37'
                  }}
                >
                  {style.label}院校
                </span>
              </div>
              <p style={{ color: 'rgba(245, 240, 230, 0.6)' }}>{school.name_ru || school.name_en}</p>
            </div>
          </div>
          
          {/* 城市诗句引用 */}
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(45, 80, 22, 0.2)',
              borderLeft: '3px solid #d4af37'
            }}
          >
            <p 
              className="text-lg italic"
              style={{ 
                fontFamily: "'Noto Serif SC', 'STSong', serif",
                color: '#d4af37'
              }}
            >
              "{cityPoems[school.city] || '音乐之美，跨越时空'}"
            </p>
          </div>
          
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <svg className="w-5 h-5" fill="#d4af37" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span style={{ color: '#f5f0e6', fontWeight: 500 }}>{school.city}</span>
            </div>
            <div 
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <svg className="w-5 h-5" fill="#d4af37" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span style={{ color: '#f5f0e6', fontWeight: 500 }}>创办于 {school.established} 年</span>
            </div>
          </div>
          
          {/* 院校简介 */}
          <p 
            className="leading-relaxed text-lg mb-6"
            style={{ color: 'rgba(245, 240, 230, 0.85)' }}
          >
            {school.description}
          </p>
          
          {/* 知名校友 */}
          {school.alumni && (
            <div className="mb-5">
              <h3 
                className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: '#d4af37' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
                知名校友
              </h3>
              <div className="flex flex-wrap gap-2">
                {school.alumni.split('、').map((alumni, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: 'rgba(212, 175, 55, 0.15)', 
                      border: '1px solid rgba(212, 175, 55, 0.3)', 
                      color: '#d4af37' 
                    }}
                  >
                    {alumni}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 专业特色 */}
          {school.majors && (
            <div className="mb-6">
              <h3 
                className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: '#d4af37' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
                专业特色
              </h3>
              <div className="flex flex-wrap gap-2">
                {school.majors.map((major, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      color: 'rgba(245, 240, 230, 0.8)'
                    }}
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 费用信息 */}
          {(school.tuition || school.tuition_prep) && (
            <div 
              className="mb-6 p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h3 
                className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2"
                style={{ color: '#d4af37' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                学费参考（卢布/年）
              </h3>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'rgba(245, 240, 230, 0.8)' }}>
                {school.tuition_prep && <span>预科：{Number(school.tuition_prep).toLocaleString()}</span>}
                {school.tuition && <span>本科/硕士：{Number(school.tuition).toLocaleString()}</span>}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4">
            <Link 
              href={`/schools/${school.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md"
              style={{ 
                background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)', 
                color: '#1a2332',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              查看详情
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  border: '2px solid #d4af37', 
                  color: '#d4af37',
                  backgroundColor: 'transparent'
                }}
              >
                访问官网
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
          </div>
        </div>
        
        {/* 底部装饰条 */}
        <div 
          className="h-1"
          style={{ background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.6), transparent)' }}
        />
      </div>
    </div>
  )
}

// 图例组件 - 古风样式
function Legend() {
  return (
    <div 
      className="absolute bottom-4 left-4 rounded-xl p-4 shadow-lg"
      style={{ 
        backgroundColor: 'rgba(29, 25, 20, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <h3 
        className="text-sm font-semibold mb-3"
        style={{ 
          color: '#d4af37',
          fontFamily: "'Noto Serif SC', serif"
        }}
      >
        院校等级
      </h3>
      <div className="space-y-2">
        {Object.entries(nodeStyles).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            {/* 音符图标 */}
            <svg width="16" height="16" viewBox="0 0 16 16">
              <ellipse cx="5" cy="10" rx="3" ry="2.5" fill={style.color} stroke={style.borderColor} strokeWidth="0.5"/>
              <line x1="8" y1="10" x2="8" y2="3" stroke={style.color} strokeWidth="2" strokeLinecap="round"/>
              <path d="M 8 3 Q 6 5, 5 6" fill="none" stroke={style.color} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: 'rgba(245, 240, 230, 0.8)' }}>{style.label}院校</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 底部学院列表组件 - 古风样式
function SchoolList({ schools, onSchoolClick, activeSchool }) {
  return (
    <div style={{ backgroundColor: 'rgba(29, 25, 20, 0.95)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <div className="container mx-auto px-4 py-6">
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ 
            color: '#f5f0e6',
            fontFamily: "'Noto Serif SC', serif"
          }}
        >
          全部院校（共 {schools.length} 所）
        </h3>
        <div className="flex flex-wrap gap-3">
          {schools.map((school, idx) => {
            const importance = getImportance(school)
            const style = nodeStyles[importance]
            return (
              <button
                key={school.id}
                onClick={() => onSchoolClick(school)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSchool?.id === school.id ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: activeSchool?.id === school.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeSchool?.id === school.id ? 'rgba(212, 175, 55, 0.6)' : 'rgba(212, 175, 55, 0.2)'}`,
                  color: activeSchool?.id === school.id ? '#d4af37' : 'rgba(245, 240, 230, 0.7)'
                }}
              >
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: style.color, color: '#1a2332' }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {school.city} · {school.name.includes('（') ? school.name.split('（')[0].slice(-4) : school.name.slice(0, 6)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 底部控制栏组件
function BottomControlBar() {
  const controls = [
    { icon: '⊕', label: '恢复全貌' },
    { icon: '⚡', label: '院校筛选' },
    { icon: '📜', label: '音乐史迹' },
    { icon: '★', label: '我的收藏' },
  ]
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ 
        backgroundColor: 'rgba(29, 25, 20, 0.92)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          {controls.map((control, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all hover:scale-105"
              style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#d4af37'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'
              }}
            >
              <span className="text-lg">{control.icon}</span>
              <span style={{ fontFamily: "'Noto Serif SC', serif" }}>{control.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 主页面组件
export default function SchoolsMapPage() {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [hoveredCity, setHoveredCity] = useState(null)
  
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#1a2332' }}
    >
      {/* 全局样式 */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');
        
        @keyframes noteFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-8px) rotate(5deg); opacity: 0.25; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* 导航栏 */}
      <nav 
        className="sticky top-0 z-50 border-b"
        style={{ 
          backgroundColor: 'rgba(29, 25, 20, 0.95)',
          borderColor: 'rgba(212, 175, 55, 0.2)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.4)'
                }}
              >
                <span className="text-2xl" style={{ color: '#d4af37' }}>♪</span>
              </div>
              <span 
                className="font-bold text-lg tracking-tight"
                style={{ color: '#f5f0e6' }}
              >
                俄罗斯音乐留学
              </span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="transition-colors font-medium"
                style={{ color: 'rgba(245, 240, 230, 0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 240, 230, 0.7)'}
              >
                首页
              </Link>
              <Link 
                href="/schools" 
                className="transition-colors font-medium"
                style={{ color: 'rgba(245, 240, 230, 0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 240, 230, 0.7)'}
              >
                院校
              </Link>
              <Link 
                href="/schools-map" 
                className="font-semibold relative"
                style={{ color: '#d4af37' }}
              >
                学院地图
                <span 
                  className="absolute -bottom-1 left-0 w-full h-0.5"
                  style={{ background: 'linear-gradient(to right, #d4af37, #ffd700)' }}
                />
              </Link>
              <Link 
                href="/evaluate" 
                className="flex items-center gap-1 transition-colors font-medium"
                style={{ color: 'rgba(245, 240, 230, 0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 240, 230, 0.7)'}
              >
                <span>🎤</span>
                AI评估
              </Link>
              <Link 
                href="/music-history-map" 
                className="flex items-center gap-1 transition-colors font-medium"
                style={{ color: 'rgba(245, 240, 230, 0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 240, 230, 0.7)'}
              >
                <span>📜</span>
                音乐史
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 标题区域 */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(45, 80, 22, 0.3) 0%, rgba(26, 35, 50, 0) 100%)'
        }}
      >
        {/* 装饰性音符 */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <span className="absolute text-8xl" style={{ top: '10%', left: '5%', animation: 'noteFloat 6s ease-in-out infinite' }}>♪</span>
          <span className="absolute text-6xl" style={{ top: '20%', right: '10%', animation: 'noteFloat 5s ease-in-out infinite', animationDelay: '1s' }}>♫</span>
          <span className="absolute text-7xl" style={{ bottom: '20%', left: '15%', animation: 'noteFloat 7s ease-in-out infinite', animationDelay: '2s' }}>♩</span>
          <span className="absolute text-5xl" style={{ bottom: '10%', right: '20%', animation: 'noteFloat 6s ease-in-out infinite', animationDelay: '0.5s' }}>♪</span>
        </div>
        
        <div className="container mx-auto px-4 py-10 text-center relative z-10">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-3 animate-fade-in-up"
            style={{ 
              fontFamily: "'Noto Serif SC', 'STSong', 'SimSun', serif",
              color: '#f5f0e6',
              textShadow: '0 2px 20px rgba(212, 175, 55, 0.3)'
            }}
          >
            音乐山河
          </h1>
          <p 
            className="text-xl md:text-2xl mb-2 animate-fade-in-up"
            style={{ 
              fontFamily: "'Noto Serif SC', serif",
              color: '#d4af37',
              animationDelay: '0.2s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            跨越欧亚 乐韵千秋
          </p>
          <p 
            className="text-base animate-fade-in-up"
            style={{ 
              color: 'rgba(245, 240, 230, 0.6)',
              animationDelay: '0.4s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            探索俄罗斯顶尖音乐学府，点击地图上的音符标记查看详情
          </p>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="relative">
        <div 
          className="container mx-auto px-4 py-6"
          style={{ paddingBottom: '80px' }}
        >
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              height: '550px',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 100px rgba(45, 80, 22, 0.1)'
            }}
          >
            {/* 地图边缘羽化效果 */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{ 
                boxShadow: 'inset 0 0 80px rgba(26, 35, 50, 0.8)',
                borderRadius: '1rem'
              }}
            />
            
            <RussianMapSVG 
              schools={schoolsData} 
              onSchoolClick={setSelectedSchool}
              activeSchool={selectedSchool}
              hoveredCity={hoveredCity}
              onCityHover={setHoveredCity}
            />
            <Legend />
          </div>
        </div>
      </div>

      {/* 院校列表 */}
      <SchoolList 
        schools={schoolsData}
        onSchoolClick={setSelectedSchool}
        activeSchool={selectedSchool}
      />

      {/* 底部控制栏 */}
      <BottomControlBar />

      {/* 详情弹窗 */}
      {selectedSchool && (
        <DetailModal 
          school={selectedSchool} 
          onClose={() => setSelectedSchool(null)} 
        />
      )}
    </div>
  )
}
