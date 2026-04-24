'use client'

import { useState } from 'react'
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
  '罗斯托夫': { x: 36, y: 48 },
  '萨拉托夫': { x: 46, y: 46 },
  '阿斯特拉罕': { x: 46, y: 54 },
  '彼得罗扎沃茨克': { x: 24, y: 28 },
  '顿河畔罗斯托夫': { x: 36, y: 48 },
  '格罗兹尼': { x: 40, y: 56 },
}

// 城市别名映射
const cityAlias = {
  '顿河罗斯托夫': '罗斯托夫',
  '顿河畔罗斯托夫': '罗斯托夫',
}

// 音乐学院节点样式配置
const nodeStyles = {
  top: { color: '#FFD700', glowColor: '#FFA500', size: 12, label: '顶级' },
  famous: { color: '#1E40AF', glowColor: '#3B82F6', size: 10, label: '知名' },
  regular: { color: '#0891B2', glowColor: '#06B6D4', size: 8, label: '普通' },
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
  // 检查别名
  if (cityAlias[city]) {
    return cityCoordinates[cityAlias[city]]
  }
  return cityCoordinates[city]
}

// 音乐图标组件
function MusicNote({ x, y, size = 8 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.08">
      <ellipse cx="0" cy={size * 0.3} rx={size * 0.3} ry={size * 0.25} fill="#2F4F4F"/>
      <line x1={size * 0.25} y1={size * 0.1} x2={size * 0.25} y2={-size * 0.5} stroke="#2F4F4F" strokeWidth="1"/>
    </g>
  )
}

// 音乐学院节点组件
function SchoolNode({ school, index, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)
  const coord = getCityCoordinate(school.city)
  
  if (!coord) return null
  
  const importance = getImportance(school)
  const style = nodeStyles[importance]
  const shortName = getShortName(school.name)
  
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
        r={hovered ? style.size * 1.8 : style.size * 1.4}
        fill={style.glowColor}
        opacity={hovered ? 0.4 : 0.2}
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* 主节点 */}
      <circle
        r={hovered ? style.size * 0.9 : style.size * 0.7}
        fill={style.color}
        stroke="#fff"
        strokeWidth={hovered ? 2.5 : 2}
        style={{ transition: 'all 0.3s ease' }}
        filter="url(#schoolGlow)"
      />
      
      {/* 节点编号 */}
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
      
      {/* 悬停标签 */}
      {hovered && (
        <g transform={`translate(0, ${-style.size - 10})`}>
          <rect
            x={-24}
            y={-6}
            width={48}
            height={14}
            rx={4}
            fill={style.color}
            opacity={0.95}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={5}
            fontWeight="bold"
            fill="#fff"
          >
            {shortName}
          </text>
        </g>
      )}
    </g>
  )
}

// 俄罗斯3D地形地图SVG组件
function RussianMapSVG({ schools, onSchoolClick, activeSchool }) {
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
        
        <filter id="schoolGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
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
      </defs>
      
      {/* 背景 */}
      <rect x="0" y="0" width="100" height="70" fill="#E8E8E8"/>
      
      {/* 里海 */}
      <ellipse cx="5" cy="38" rx="4" ry="3" fill="url(#waterGradient)" opacity="0.6"/>
      <ellipse cx="10" cy="50" rx="3" ry="2" fill="url(#waterGradient)" opacity="0.5"/>
      
      {/* 俄罗斯领土 - 带阴影 */}
      <g filter="url(#terrainShadow)">
        {/* 欧洲部分 */}
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24 Q 30 26, 32 28 Q 34 30, 33 34 Q 32 38, 30 40 Q 28 42, 26 44 Q 24 46, 22 48 Q 20 50, 18 52 Q 16 54, 14 54 Q 12 54, 10 52 Q 8 50, 7 46 Q 6 42, 5 38 Q 4 34, 4 30 Q 4 26, 5 22 Q 5 20, 5 18 Z"
          fill="url(#europeTerrain)"
          stroke="#4A6741"
          strokeWidth="0.8"
          opacity="0.95"
        />
        
        {/* 高光效果 */}
        <path 
          d="M 5 18 Q 8 16, 12 17 Q 16 18, 18 20 Q 22 22, 26 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        
        {/* 克里米亚半岛 */}
        <path 
          d="M 28 48 Q 32 46, 34 48 Q 36 52, 34 56 Q 32 58, 30 56 Q 28 54, 28 48 Z"
          fill="#5D7052"
          stroke="#4A6741"
          strokeWidth="0.5"
          opacity="0.9"
        />
        
        {/* 乌拉尔山脉 */}
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
        
        {/* 西伯利亚 */}
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30 Q 96 32, 95 36 Q 94 40, 92 44 Q 90 48, 88 50 Q 86 52, 84 54 Q 82 56, 80 58 Q 78 60, 76 62 Q 74 64, 72 64 Q 70 64, 68 62 Q 66 60, 64 58 Q 62 56, 60 54 Q 58 52, 56 50 Q 54 48, 52 46 Q 50 44, 48 42 Q 46 40, 44 38 Q 42 36, 40 34 Q 38 32, 36 30 Q 38 26, 40 24 Q 44 20, 48 18 Q 50 17, 52 18 Z"
          fill="url(#siberiaTerrain)"
          stroke="#8B7B5D"
          strokeWidth="0.7"
          opacity="0.9"
        />
        
        {/* 西伯利亚高光 */}
        <path 
          d="M 52 18 Q 58 16, 65 18 Q 72 20, 78 22 Q 84 24, 88 26 Q 92 28, 94 30"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.4"
        />
        
        {/* 远东地区 */}
        <path 
          d="M 88 26 Q 92 24, 95 26 Q 98 28, 99 32 Q 100 36, 99 40 Q 98 44, 96 48 Q 94 52, 92 54 Q 90 56, 88 58 Q 86 60, 84 60 Q 82 58, 84 54 Q 86 50, 88 46 Q 90 42, 90 38 Q 90 34, 88 30 Q 88 28, 88 26 Z"
          fill="url(#farEastTerrain)"
          stroke="#B8A878"
          strokeWidth="0.6"
          opacity="0.85"
        />
        
        {/* 勘察加半岛 */}
        <path 
          d="M 92 38 Q 96 36, 99 38 Q 100 42, 99 46 Q 97 48, 94 46 Q 92 44, 92 40 Q 92 38, 92 38 Z"
          fill="#C9B896"
          stroke="#B8A878"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        {/* 萨哈林岛 */}
        <path 
          d="M 94 30 Q 98 28, 100 30 Q 100 34, 98 36 Q 95 36, 94 34 Q 94 32, 94 30 Z"
          fill="#C9B896"
          stroke="#B8A878"
          strokeWidth="0.4"
          opacity="0.85"
        />
        
        {/* 楚科奇半岛 */}
        <path 
          d="M 86 58 Q 90 56, 94 58 Q 96 62, 94 66 Q 90 68, 86 66 Q 84 62, 86 58 Z"
          fill="#D4C4A8"
          stroke="#C4B498"
          strokeWidth="0.4"
          opacity="0.85"
        />
      </g>
      
      {/* 河流 */}
      <g opacity="0.4">
        <path d="M 18 30 Q 22 38, 26 48 Q 30 56, 28 62" fill="none" stroke="#6BA3B8" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M 40 28 Q 45 38, 50 50 Q 54 58, 52 66" fill="none" stroke="#6BA3B8" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M 60 24 Q 65 36, 70 50 Q 74 60, 72 68" fill="none" stroke="#6BA3B8" strokeWidth="0.6" strokeLinecap="round"/>
        <path d="M 80 30 Q 84 42, 86 56 Q 87 64, 85 70" fill="none" stroke="#6BA3B8" strokeWidth="0.5" strokeLinecap="round"/>
      </g>
      
      {/* 主要城市标注 */}
      <g opacity="0.7">
        {Object.entries(cityCoordinates).slice(0, 6).map(([city, coord]) => (
          <g key={city} transform={`translate(${coord.x}, ${coord.y})`}>
            <circle r={2} fill="#2D2D2D" stroke="#FFD700" strokeWidth="0.4"/>
            <text 
              y={-4}
              textAnchor="middle"
              fontSize={2.2}
              fontWeight="bold"
              fill="#2D2D2D"
            >
              {city}
            </text>
          </g>
        ))}
      </g>
      
      {/* 音乐学院节点 */}
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
      <MusicNote x={30} y={35} size={10}/>
      <MusicNote x={50} y={42} size={8}/>
      <MusicNote x={70} y={38} size={12}/>
      <MusicNote x={40} y={50} size={7}/>
      <MusicNote x={85} y={45} size={9}/>
      
      {/* 乌拉尔山脉标注 */}
      <g transform="translate(45, 31)" opacity="0.6">
        <text textAnchor="middle" fontSize="2" fill="#5A5A5A" fontStyle="italic">Урал</text>
        <path d="M -3 1 L 0 -1 L 3 1" fill="none" stroke="#6B6B5A" strokeWidth="0.3"/>
      </g>
    </svg>
  )
}

// 详情弹窗组件
function DetailModal({ school, onClose }) {
  if (!school) return null
  
  const importance = getImportance(school)
  const style = nodeStyles[importance]
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 50%, #d8d8d8 100%)', border: '1px solid rgba(200, 200, 200, 0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部颜色条 */}
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${style.color}, ${style.glowColor})` }}/>
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="p-8">
          {/* 标题区域 */}
          <div className="flex items-center gap-6 mb-6">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${style.glowColor} 0%, ${style.color} 100%)` }}
            >
              <span className="text-white text-3xl">🎵</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold text-gray-800">{school.name}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: style.color }}>
                  {style.label}院校
                </span>
              </div>
              <p className="text-gray-500 text-sm">{school.name_ru || school.name_en}</p>
            </div>
          </div>
          
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-700 font-medium">{school.city}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-700 font-medium">创办于 {school.established} 年</span>
            </div>
          </div>
          
          {/* 院校简介 */}
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{school.description}</p>
          
          {/* 知名校友 */}
          {school.alumni && (
            <div className="mb-5">
              <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: style.color }}>
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
                    style={{ backgroundColor: `${style.color}15`, border: `1px solid ${style.color}40`, color: style.color }}
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
              <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: style.color }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
                专业特色
              </h3>
              <div className="flex flex-wrap gap-2">
                {school.majors.map((major, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg text-sm bg-gray-200 text-gray-600 border border-gray-300">
                    {major}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 费用信息 */}
          {(school.tuition || school.tuition_prep) && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
              <h3 className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: style.color }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                学费参考（卢布/年）
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
              style={{ background: `linear-gradient(135deg, ${style.color} 0%, ${style.glowColor} 100%)`, color: '#fff' }}
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border-2"
                style={{ borderColor: style.color, color: style.color }}
              >
                访问官网
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
          </div>
        </div>
        
        {/* 底部渐变 */}
        <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${style.glowColor}, transparent)` }}/>
      </div>
    </div>
  )
}

// 图例组件
function Legend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">院校等级</h3>
      <div className="space-y-2">
        {Object.entries(nodeStyles).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full shadow"
              style={{ backgroundColor: style.color, boxShadow: `0 0 6px ${style.glowColor}` }}
            />
            <span className="text-sm text-gray-600">{style.label}院校</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 底部学院列表组件
function SchoolList({ schools, onSchoolClick, activeSchool }) {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">全部院校（共 {schools.length} 所）</h3>
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
                  backgroundColor: activeSchool?.id === school.id ? `${style.color}20` : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${activeSchool?.id === school.id ? style.color : 'rgba(0, 0, 0, 0.1)'}`,
                  color: activeSchool?.id === school.id ? style.color : '#666'
                }}
              >
                <span 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  style={{ backgroundColor: style.color }}
                >
                  {idx + 1}
                </span>
                <span>{school.city} · {school.name.includes('（') ? school.name.split('（')[0].slice(-4) : school.name.slice(0, 6)}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 主页面组件
export default function SchoolsMapPage() {
  const [selectedSchool, setSelectedSchool] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-xl">♪</span>
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary-700 transition-colors font-medium">
                首页
              </Link>
              <Link href="/schools" className="text-gray-600 hover:text-primary-700 transition-colors font-medium">
                院校
              </Link>
              <Link href="/schools-map" className="text-primary-700 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary-600 after:to-gold-500">
                学院地图
              </Link>
              <Link href="/evaluate" className="text-gray-600 hover:text-primary-700 transition-colors font-medium flex items-center gap-1">
                <span>🎤</span>
                AI评估
              </Link>
              <Link href="/music-history-map" className="text-gray-600 hover:text-primary-700 transition-colors font-medium flex items-center gap-1">
                <span>📜</span>
                音乐史
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 标题区域 */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">俄罗斯音乐学院分布地图</h1>
          <p className="text-white/80 text-lg">探索俄罗斯顶尖音乐学府，点击地图上的标记查看详情</p>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="relative bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '500px' }}>
            <RussianMapSVG 
              schools={schoolsData} 
              onSchoolClick={setSelectedSchool}
              activeSchool={selectedSchool}
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
