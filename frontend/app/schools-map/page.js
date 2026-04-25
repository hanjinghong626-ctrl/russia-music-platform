'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { schoolsData } from '../../data/schools'

// 动态导入 Leaflet 组件以避免 SSR 问题
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

// 城市诗句
const cityPoems = {
  '莫斯科': '柴可夫斯基的浪漫篇章',
  '圣彼得堡': '强力集团的不朽遗产',
  '新西伯利亚': '西伯利亚的音乐明珠',
  '叶卡捷琳堡': '乌拉尔山麓的乐韵',
  '喀山': '鞑靼风情的交响',
  '下诺夫哥罗德': '伏尔加河畔的旋律',
  '顿河畔罗斯托夫': '南俄草原的乐章',
  '萨拉托夫': '俄罗斯民歌的摇篮',
  '阿斯特拉罕': '里海之滨的和声',
  '彼得罗扎沃茨克': '卡累利阿的湖光乐章',
  '车里雅宾斯克': '乌拉尔的钢铁乐韵',
  '伏尔加格勒': '英雄城市的交响',
  '陶里亚蒂': '伏尔加岸边的琴声',
  '雅库茨克': '极寒之地的音符',
  '坦波夫': '拉赫玛尼诺夫的故乡',
}

// 音乐学院重要性分级
const nodeStyles = {
  top: { color: '#d4af37', glowColor: '#ffd700', size: 28, label: '顶级' },
  famous: { color: '#c9a962', glowColor: '#daa520', size: 24, label: '知名' },
  regular: { color: '#9b8b6d', glowColor: '#b8a078', size: 20, label: '普通' },
}

// 同城院校偏移量（避免标记重叠）
const cityOffsets = {}

// 获取院校重要性
function getImportance(school) {
  const topSchools = ['recvh3FPwShJIG', 'recvh3FPwSQ00c'] // 莫斯科柴院、圣彼得堡
  const famousSchools = ['recvh3FPwSYMtD', 'recvh3FPwSRCNG', 'recvh3FPwSBw1X', 'recvh3FPwSvR80', 'recvh3FPwS2BDw']
  
  if (topSchools.includes(school.id)) return 'top'
  if (famousSchools.includes(school.id)) return 'famous'
  return 'regular'
}

// 统计同城院校数量并计算偏移
function getCityOffset(school, allSchools) {
  const city = school.city
  const sameCitySchools = allSchools.filter(s => s.city === city && s.id !== school.id)
  
  if (sameCitySchools.length === 0) return { latOffset: 0, lngOffset: 0 }
  
  // 为同一城市的院校分配不同偏移
  const index = sameCitySchools.findIndex(s => s.id > school.id)
  const offsetIndex = index >= 0 ? index + 1 : 0
  
  const offsets = [
    { lat: 0.02, lng: 0.02 },
    { lat: -0.02, lng: 0.02 },
    { lat: 0.02, lng: -0.02 },
    { lat: -0.02, lng: -0.02 },
    { lat: 0.03, lng: 0 },
    { lat: -0.03, lng: 0 },
  ]
  
  return offsets[offsetIndex % offsets.length]
}

// 获取简称
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
  if (name.includes('施尼特凯')) return '施院'
  if (name.includes('波波夫')) return '合唱院'
  if (name.includes('伊波利托夫')) return '伊院'
  if (name.includes('谢列布里亚科夫')) return '谢院'
  if (name.includes('博西科夫')) return '博院'
  if (name.includes('陶里亚蒂')) return '陶院'
  if (name.includes('中央音乐')) return '中央'
  return name.slice(0, 4)
}

// 音符 SVG 图标组件
function MusicNoteIcon({ importance, isActive }) {
  const style = nodeStyles[importance]
  const size = isActive ? style.size * 1.2 : style.size
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" style={{ filter: `drop-shadow(0 0 8px ${style.glowColor})` }}>
      {/* 音符头部 */}
      <ellipse cx="8" cy="26" rx="7" ry="5" fill={style.color} stroke="#1a2332" strokeWidth="1.5"/>
      {/* 音符符干 */}
      <line x1="14" y1="24" x2="14" y2="4" stroke={style.color} strokeWidth="3" strokeLinecap="round"/>
      {/* 音符符尾 */}
      <path d="M14 4 Q10 10, 6 12" fill="none" stroke={style.color} strokeWidth="3" strokeLinecap="round"/>
      {/* 高光 */}
      <ellipse cx="6" cy="25" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}

// 创建 Leaflet 图标
let musicIconCache = {}
function createMusicIcon(importance, isActive) {
  const key = `${importance}-${isActive}`
  if (musicIconCache[key]) return musicIconCache[key]
  
  const style = nodeStyles[importance]
  const size = isActive ? style.size * 1.2 : style.size
  const color = style.color
  
  const svgString = `
    <svg width="${size}" height="${size * 1.3}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 6px ${style.glowColor});">
      <ellipse cx="8" cy="26" rx="7" ry="5" fill="${color}" stroke="#1a2332" stroke-width="1.5"/>
      <line x1="14" y1="24" x2="14" y2="4" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 4 Q10 10, 6 12" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="6" cy="25" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  `
  
  const icon = L.divIcon({
    html: svgString,
    className: 'music-marker',
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3 / 2],
    popupAnchor: [0, -size]
  })
  
  musicIconCache[key] = icon
  return icon
}

// 院校详情弹窗
function DetailModal({ school, onClose }) {
  const importance = getImportance(school)
  const style = nodeStyles[importance]
  
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])
  
  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
        style={{ 
          backgroundColor: 'rgba(29, 25, 20, 0.98)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          animation: 'fadeInUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div 
          className="relative px-6 py-5"
          style={{ background: `linear-gradient(135deg, ${style.color}22 0%, transparent 100%)` }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
          >
            ✕
          </button>
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${style.color}33`, border: `2px solid ${style.color}` }}
            >
              <span className="text-3xl" style={{ filter: `drop-shadow(0 0 4px ${style.glowColor})` }}>♪</span>
            </div>
            <div className="flex-1">
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: '#f5f0e6', fontFamily: "'Noto Serif SC', serif" }}
              >
                {school.name}
              </h3>
              {school.name_ru && (
                <p className="text-sm opacity-70" style={{ color: '#d4af37' }}>
                  {school.name_ru}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${style.color}33`, color: style.color, border: `1px solid ${style.color}66` }}
            >
              {style.label}院校
            </span>
            <span className="text-sm" style={{ color: 'rgba(245, 240, 230, 0.6)' }}>
              {school.city}
            </span>
            {school.ranking && (
              <span className="text-sm" style={{ color: 'rgba(245, 240, 230, 0.6)' }}>
                · QS #{school.ranking}
              </span>
            )}
          </div>
        </div>
        
        {/* 内容 */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 240, 230, 0.85)' }}>
            {school.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {school.established && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <div className="text-xs opacity-60 mb-1">创立年份</div>
                <div className="font-semibold" style={{ color: '#d4af37' }}>{school.established}</div>
              </div>
            )}
            {school.language_req && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <div className="text-xs opacity-60 mb-1">语言要求</div>
                <div className="font-semibold" style={{ color: '#d4af37' }}>{school.language_req}</div>
              </div>
            )}
            {school.tuition && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <div className="text-xs opacity-60 mb-1">学费/年</div>
                <div className="font-semibold" style={{ color: '#d4af37' }}>₽{Number(school.tuition).toLocaleString()}</div>
              </div>
            )}
            {school.living_cost && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <div className="text-xs opacity-60 mb-1">生活费/月</div>
                <div className="font-semibold" style={{ color: '#d4af37' }}>₽{Number(school.living_cost).toLocaleString()}</div>
              </div>
            )}
          </div>
          
          {school.majors && school.majors.length > 0 && (
            <div>
              <div className="text-xs opacity-60 mb-2">优势专业</div>
              <div className="flex flex-wrap gap-2">
                {school.majors.map((major, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {school.alumni && (
            <div>
              <div className="text-xs opacity-60 mb-2">知名校友</div>
              <div className="text-sm" style={{ color: 'rgba(245, 240, 230, 0.7)' }}>
                {school.alumni}
              </div>
            </div>
          )}
        </div>
        
        {/* 底部 */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl text-center font-medium transition-all hover:scale-[1.02]"
            style={{ 
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.4)'
            }}
          >
            访问官网 →
          </a>
        </div>
      </div>
    </div>
  )
}

// 图例组件
function Legend() {
  return (
    <div 
      className="absolute top-4 right-4 z-[400] p-4 rounded-xl"
      style={{ 
        backgroundColor: 'rgba(29, 25, 20, 0.95)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="text-xs font-semibold mb-3" style={{ color: '#d4af37' }}>院校等级</div>
      <div className="space-y-2">
        {Object.entries(nodeStyles).map(([key, style]) => (
          <div key={key} className="flex items-center gap-2">
            <span style={{ color: style.color, fontSize: '16px' }}>♪</span>
            <span className="text-xs" style={{ color: 'rgba(245, 240, 230, 0.8)' }}>{style.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
        <div className="text-xs" style={{ color: 'rgba(245, 240, 230, 0.5)' }}>
          共 {schoolsData.length} 所院校
        </div>
      </div>
    </div>
  )
}

// 底部院校列表
function SchoolList({ schools, onSchoolClick, activeSchool }) {
  return (
    <div style={{ backgroundColor: 'rgba(29, 25, 20, 0.95)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <div className="container mx-auto px-4 py-4">
        <h3 
          className="text-base font-semibold mb-3"
          style={{ color: '#f5f0e6', fontFamily: "'Noto Serif SC', serif" }}
        >
          全部院校（共 {schools.length} 所）
        </h3>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {schools.map((school, idx) => {
            const importance = getImportance(school)
            const style = nodeStyles[importance]
            return (
              <button
                key={school.id}
                onClick={() => onSchoolClick(school)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                  activeSchool?.id === school.id ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: activeSchool?.id === school.id ? 'rgba(212, 175, 55, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeSchool?.id === school.id ? 'rgba(212, 175, 55, 0.6)' : 'rgba(212, 175, 55, 0.2)'}`,
                  color: activeSchool?.id === school.id ? '#d4af37' : 'rgba(245, 240, 230, 0.7)'
                }}
              >
                <span 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: style.color, color: '#1a2332' }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {school.city} · {getShortName(school.name)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 底部控制栏
function BottomControlBar({ mapRef }) {
  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([61.5, 60.0], 4)
    }
  }
  
  const controls = [
    { icon: '⊕', label: '恢复全貌', action: handleResetView },
    { icon: '⚡', label: '院校筛选', action: () => {} },
    { icon: '📜', label: '音乐史迹', action: () => {} },
    { icon: '★', label: '我的收藏', action: () => {} },
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
              onClick={control.action}
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

// 地图标记点组件
function MapMarkers({ schools, activeSchool, onSchoolClick }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  // 等待 Leaflet 加载
  const L = window.L
  if (!L) return null
  
  return (
    <>
      {schools.map((school, index) => {
        const importance = getImportance(school)
        const offset = getCityOffset(school, schools)
        const lat = school.lat + offset.lat
        const lng = school.lng + offset.lng
        const isActive = activeSchool?.id === school.id
        
        return (
          <Marker
            key={school.id}
            position={[lat, lng]}
            icon={createMusicIcon(importance, isActive)}
            eventHandlers={{
              click: () => onSchoolClick(school)
            }}
          >
            <Popup>
              <div style={{ 
                minWidth: '200px',
                fontFamily: "'Noto Serif SC', serif"
              }}>
                <div className="font-bold text-base mb-1" style={{ color: '#1a2332' }}>
                  {school.name}
                </div>
                <div className="text-xs opacity-70 mb-2" style={{ color: '#333' }}>
                  {school.city}
                </div>
                <div className="text-sm mb-2" style={{ color: '#555' }}>
                  {school.description?.slice(0, 60)}...
                </div>
                {school.ranking && (
                  <div className="text-xs" style={{ color: '#c9a962' }}>
                    QS 世界排名 #{school.ranking}
                  </div>
                )}
                <button
                  onClick={() => onSchoolClick(school)}
                  className="mt-2 px-3 py-1 rounded text-xs"
                  style={{ backgroundColor: '#d4af37', color: '#1a2332' }}
                >
                  查看详情 →
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

// 主页面组件
export default function SchoolsMapPage() {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleSchoolClick = useCallback((school) => {
    setSelectedSchool(school)
    // 移动地图到对应位置
    if (mapRef.current && school.lat && school.lng) {
      const offset = getCityOffset(school, schoolsData)
      mapRef.current.setView([school.lat + offset.lat, school.lng + offset.lng], 8, {
        animate: true,
        duration: 0.5
      })
    }
  }, [])
  
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#1a2332' }}
    >
      {/* 全局样式 */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        /* Leaflet 自定义样式 */
        .leaflet-container {
          background: #1a2332 !important;
          font-family: 'Noto Serif SC', serif;
        }
        
        .leaflet-popup-content-wrapper {
          background: rgba(29, 25, 20, 0.98) !important;
          border-radius: 12px !important;
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
        }
        
        .leaflet-popup-tip {
          background: rgba(29, 25, 20, 0.98) !important;
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
        }
        
        .leaflet-popup-content {
          margin: 12px 14px !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(29, 25, 20, 0.95) !important;
          color: #d4af37 !important;
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(212, 175, 55, 0.2) !important;
        }
        
        .music-marker {
          background: transparent !important;
          border: none !important;
        }
        
        /* 隐藏 Leaflet 版权信息 */
        .leaflet-control-attribution {
          background: rgba(29, 25, 20, 0.8) !important;
          color: rgba(245, 240, 230, 0.5) !important;
          font-size: 10px !important;
        }
        
        .leaflet-control-attribution a {
          color: #d4af37 !important;
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
        <div className="container mx-auto px-4 py-8 text-center relative z-10">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ 
              fontFamily: "'Noto Serif SC', serif",
              color: '#f5f0e6',
              textShadow: '0 2px 20px rgba(212, 175, 55, 0.3)'
            }}
          >
            音乐山河
          </h1>
          <p 
            className="text-lg md:text-xl mb-2"
            style={{ 
              fontFamily: "'Noto Serif SC', serif",
              color: '#d4af37'
            }}
          >
            跨越欧亚 乐韵千秋
          </p>
          <p 
            className="text-sm"
            style={{ color: 'rgba(245, 240, 230, 0.6)' }}
          >
            探索俄罗斯顶尖音乐学府，点击地图上的音符标记查看详情
          </p>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="relative" style={{ paddingBottom: '80px' }}>
        <div 
          className="container mx-auto px-4 py-4"
        >
          {!mounted ? (
            <div 
              className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ 
                height: '600px',
                backgroundColor: 'rgba(29, 25, 20, 0.95)',
                border: '2px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse" style={{ color: '#d4af37' }}>♪</div>
                <div style={{ color: 'rgba(245, 240, 230, 0.6)' }}>正在加载地图...</div>
              </div>
            </div>
          ) : (
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ 
                height: '600px',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
              }}
            >
              <MapContainer
                center={[61.5, 60.0]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapMarkers 
                  schools={schoolsData}
                  activeSchool={selectedSchool}
                  onSchoolClick={handleSchoolClick}
                />
                <Legend />
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* 院校列表 */}
      <SchoolList 
        schools={schoolsData}
        onSchoolClick={handleSchoolClick}
        activeSchool={selectedSchool}
      />

      {/* 底部控制栏 */}
      <BottomControlBar mapRef={mapRef} />

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
