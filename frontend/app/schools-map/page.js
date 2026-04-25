'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { schoolsData } from '../../data/schools'

// 动态导入 Leaflet 组件
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false, loading: () => <div className="h-[600px] flex items-center justify-center bg-gray-900 text-white">加载地图中...</div> }
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

// 城市坐标
const cityCoords = {
  '莫斯科': { lat: 55.7558, lng: 37.6173 },
  '圣彼得堡': { lat: 59.9343, lng: 30.3351 },
  '新西伯利亚': { lat: 55.0084, lng: 82.9357 },
  '叶卡捷琳堡': { lat: 56.8389, lng: 60.6057 },
  '喀山': { lat: 55.8304, lng: 49.0661 },
  '下诺夫哥罗德': { lat: 56.2967, lng: 43.9362 },
  '萨马拉': { lat: 53.1951, lng: 50.1011 },
  '鄂木斯克': { lat: 54.9914, lng: 73.3645 },
  '符拉迪沃斯托克': { lat: 43.1332, lng: 131.9113 },
  '克拉斯诺亚尔斯克': { lat: 56.0153, lng: 92.8932 },
  '车里雅宾斯克': { lat: 55.1644, lng: 61.4368 },
  '乌法': { lat: 54.7388, lng: 55.9721 },
  '顿河畔罗斯托夫': { lat: 47.2357, lng: 39.8015 },
  '彼尔姆': { lat: 58.0048, lng: 56.2292 },
  '克拉斯诺达尔': { lat: 45.0355, lng: 38.9748 },
  '萨拉托夫': { lat: 51.5336, lng: 46.0343 },
  '哈巴罗夫斯克': { lat: 48.4726, lng: 135.0580 },
  '雅罗斯拉夫尔': { lat: 57.6261, lng: 39.8845 },
  '阿斯特拉罕': { lat: 46.3498, lng: 48.0417 },
  '彼得罗扎沃茨克': { lat: 61.7877, lng: 34.3614 },
  '陶里亚蒂': { lat: 53.5078, lng: 49.4206 },
  '雅库茨克': { lat: 62.0355, lng: 129.6755 },
  '坦波夫': { lat: 52.7315, lng: 41.4447 },
  '伏尔加格勒': { lat: 48.7071, lng: 44.5170 },
}

// 院校等级
const getLevel = (school) => {
  const topSchools = ['recvh3FPwShJIG', 'recvh3FPwSQ00c']
  const famousSchools = ['recvh3FPwSYMtD', 'recvh3FPwSRCNG', 'recvh3FPwSBw1X', 'recvh3FPwSvR80', 'recvh3FPwS2BDw']
  if (topSchools.includes(school.id)) return 'top'
  if (famousSchools.includes(school.id)) return 'famous'
  return 'regular'
}

// 同城偏移
const getOffset = (school, allSchools) => {
  const sameCitySchools = allSchools.filter(s => s.city === school.city)
  const index = sameCitySchools.findIndex(s => s.id === school.id)
  const offsets = [
    { lat: 0, lng: 0 },
    { lat: 0.02, lng: 0.02 },
    { lat: -0.02, lng: 0.02 },
    { lat: 0.02, lng: -0.02 },
    { lat: -0.02, lng: -0.02 },
    { lat: 0.03, lng: 0 },
  ]
  return offsets[index % offsets.length]
}

// 地图标记组件
function MapMarkers({ schools, onSchoolClick }) {
  const [L, setL] = useState(null)
  const [icons, setIcons] = useState({})

  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet.default)
      
      const newIcons = {}
      const sizes = { top: 32, famous: 26, regular: 22 }
      const colors = { top: '#d4af37', famous: '#c9a962', regular: '#9b8b6d' }
      
      Object.keys(sizes).forEach(level => {
        const size = sizes[level]
        const color = colors[level]
        newIcons[level] = leaflet.default.divIcon({
          html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:3px solid #1a2332;box-shadow:0 0 10px ${color};display:flex;align-items:center;justify-content:center;font-size:${size*0.5}px;">♪</div>`,
          className: 'custom-marker',
          iconSize: [size, size],
          iconAnchor: [size/2, size/2],
          popupAnchor: [0, -size/2]
        })
      })
      setIcons(newIcons)
    })
  }, [])

  if (!L || Object.keys(icons).length === 0) return null

  return (
    <>
      {schools.map((school) => {
        const coords = cityCoords[school.city] || { lat: 55.75, lng: 37.61 }
        const level = getLevel(school)
        const offset = getOffset(school, schools)
        const lat = (school.lat || coords.lat) + offset.lat
        const lng = (school.lng || coords.lng) + offset.lng
        
        return (
          <Marker
            key={school.id}
            position={[lat, lng]}
            icon={icons[level]}
            eventHandlers={{ click: () => onSchoolClick(school) }}
          >
            <Popup>
              <div style={{ minWidth: '180px', padding: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1a2332' }}>{school.name}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{school.city}</div>
                <button onClick={() => onSchoolClick(school)} style={{ width: '100%', padding: '6px 12px', backgroundColor: '#d4af37', color: '#1a2332', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>查看详情</button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

// 详情弹窗
function SchoolModal({ school, onClose }) {
  if (!school) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{school.name}</h2>
            <p className="text-sm text-gray-500">{school.city}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {school.description && <p className="text-gray-600 mb-4">{school.description}</p>}
        {school.ranking && <div className="text-sm text-amber-600 mb-4">QS 世界排名 #{school.ranking}</div>}
        <div className="flex gap-2">
          <Link href={`/schools/${school.id}`} className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-center font-medium hover:bg-amber-600 transition-colors">查看详情</Link>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">关闭</button>
        </div>
      </div>
    </div>
  )
}

// 主组件
export default function SchoolsMapPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [filter, setFilter] = useState('all')
  const mapRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    import('leaflet/dist/leaflet.css')
  }, [])

  const filteredSchools = schoolsData.filter(school => {
    if (filter === 'all') return true
    if (filter === 'top') return getLevel(school) === 'top'
    if (filter === 'famous') return getLevel(school) === 'famous' || getLevel(school) === 'top'
    return true
  })

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4 animate-pulse">♪</div>
          <div>正在加载地图...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* 顶部导航 */}
      <header className="bg-[#2d2820] border-b border-amber-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-2xl">♪</span>
            <span className="font-serif font-bold">俄罗斯音乐留学</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">首页</Link>
            <Link href="/schools" className="text-gray-300 hover:text-white transition-colors">院校</Link>
            <Link href="/schools-map" className="text-amber-400 font-medium">学院地图</Link>
            <Link href="/music-history" className="text-gray-300 hover:text-white transition-colors">音乐史</Link>
          </nav>
        </div>
      </header>

      {/* 地图区域 */}
      <div className="relative" style={{ height: 'calc(100vh - 140px)' }}>
        {mounted && (
          <MapContainer
            center={[61.5, 60.0]}
            zoom={4}
            style={{ height: '100%', width: '100%', background: '#1a2332' }}
            scrollWheelZoom={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapMarkers schools={filteredSchools} onSchoolClick={setSelectedSchool} />
          </MapContainer>
        )}
        
        {/* 地图控制 */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button onClick={() => mapRef.current?.setView([61.5, 60.0], 4)} className="px-4 py-2 bg-white/90 rounded-lg shadow-lg text-sm font-medium hover:bg-white transition-colors">🗺 恢复全貌</button>
        </div>

        {/* 筛选控制 */}
        <div className="absolute top-4 left-4 z-[1000] flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}>全部院校</button>
          <button onClick={() => setFilter('top')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'top' ? 'bg-amber-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}>顶级院校</button>
        </div>

        {/* 图例 */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 rounded-lg p-3 shadow-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">院校等级</div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600"></div><span className="text-xs text-gray-600">顶级</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-amber-500"></div><span className="text-xs text-gray-600">知名</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-200 border-2 border-amber-400"></div><span className="text-xs text-gray-600">普通</span></div>
          </div>
        </div>
      </div>

      {/* 底部院校列表 */}
      <div className="bg-[#2d2820] border-t border-amber-900/30 p-4 overflow-x-auto">
        <div className="flex gap-3 max-w-7xl mx-auto">
          {filteredSchools.slice(0, 10).map(school => (
            <button
              key={school.id}
              onClick={() => {
                setSelectedSchool(school)
                const coords = cityCoords[school.city] || { lat: 55.75, lng: 37.61 }
                mapRef.current?.setView([school.lat || coords.lat, school.lng || coords.lng], 8)
              }}
              className="flex-shrink-0 px-3 py-1.5 bg-amber-900/30 text-amber-100 rounded-lg text-sm hover:bg-amber-900/50 transition-colors whitespace-nowrap"
            >{school.name}</button>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedSchool && <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />}
    </div>
  )
}
