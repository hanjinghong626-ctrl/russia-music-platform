'use client'

import { useState } from 'react'
import Link from 'next/link'

// 时代数据
const eras = [
  {
    id: 'pre-18th',
    name: '俄罗斯音乐的根基',
    period: '18世纪前',
    year: '988-1700',
    position: { x: 18, y: 35 },
    description: '俄罗斯音乐的根基可追溯至公元988年东正教传入基辅罗斯。在18世纪之前的一千余年间，俄罗斯音乐主要依托两大传统——东正教会的宗教圣咏与民间口头传承的民歌。这两种音乐形态相互交融，共同塑造了俄罗斯音乐独特的民族性格。',
    composers: ['兹纳缅内圣咏', '东正教合唱', '俄罗斯民歌'],
    features: ['兹纳缅内圣咏', '拜占庭调式', '民歌传统', '三弦琴', '古斯里琴'],
    color: '#6B4423'
  },
  {
    id: '18th-century',
    name: '西风东渐',
    period: '18世纪',
    year: '1730s-1790s',
    position: { x: 28, y: 42 },
    description: '18世纪是俄罗斯音乐从宗教附庸走向独立艺术门类的关键转型期。在彼得大帝"全盘西化"政策的推动下，意大利歌剧、德国交响乐、法国芭蕾相继传入俄罗斯，圣彼得堡和莫斯科成为欧洲音乐文化的东方重镇。',
    composers: ['马克西姆·别列佐夫斯基', '叶夫斯塔菲·法伊科', '德米特里·博尔特良斯基'],
    features: ['意大利歌剧', '宫廷音乐', '贵族音乐教育', '交响乐队'],
    color: '#1E40AF'
  },
  {
    id: 'glinka-era',
    name: '格林卡时代',
    period: '19世纪上半叶',
    year: '1800s-1850s',
    position: { x: 38, y: 50 },
    description: '格林卡开创了俄罗斯民族音乐传统，被誉为"俄罗斯音乐之父"。他首次将俄罗斯民族音乐与西欧技法完美结合，代表作《伊凡·苏萨宁》《鲁斯兰与柳德米拉》和交响幻想曲《卡玛林斯卡亚》奠定了俄罗斯古典音乐的基础。',
    composers: ['米哈伊尔·格林卡', '亚历山大·达尔戈梅日斯基'],
    features: ['民族主义音乐', '俄罗斯歌剧', '交响幻想曲', '民族音乐与西欧技法结合'],
    color: '#7C3AED'
  },
  {
    id: 'mighty-handful',
    name: '强力集团崛起',
    period: '19世纪中叶',
    year: '1860s-1880s',
    position: { x: 48, y: 58 },
    description: '以巴拉基列夫、穆索尔斯基、鲍罗丁、里姆斯基-科萨科夫、居伊为代表的"强力集团"（又称"五人团"）致力于发展纯粹的俄罗斯民族音乐。他们以民族性至上、现实主义、民间音乐为本为艺术纲领。',
    composers: ['米利·巴拉基列夫', '莫杰斯特·穆索尔斯基', '亚历山大·鲍罗丁', '尼古拉·里姆斯基-科萨科夫', '塞萨尔·居伊'],
    features: ['强力五人集团', '民族乐派', '标题音乐', '俄罗斯歌剧'],
    color: '#DC2626'
  },
  {
    id: 'tchaikovsky-era',
    name: '柴可夫斯基时代',
    period: '19世纪下半叶',
    year: '1870s-1890s',
    position: { x: 58, y: 52 },
    description: '柴可夫斯基是俄罗斯浪漫主义时期最伟大的作曲家之一，也是第一位音乐获得国际持久影响的俄罗斯作曲家。他的作品融汇民族传统与欧洲技法，开辟了通往世界音乐舞台的道路。',
    composers: ['彼得·伊里奇·柴可夫斯基', '尼古拉·里姆斯基-科萨科夫', '亚历山大·格拉祖诺夫', '谢尔盖·塔涅耶夫'],
    features: ['浪漫主义', '芭蕾舞剧', '交响曲', '钢琴协奏曲'],
    color: '#B91C1C'
  },
  {
    id: 'silver-age',
    name: '白银时代',
    period: '19世纪末-20世纪初',
    year: '1890s-1920s',
    position: { x: 68, y: 45 },
    description: '俄罗斯音乐的"白银时代"见证了民族音乐传统的国际化与现代化。拉赫玛尼诺夫、斯克里亚宾、斯特拉文斯基等作曲家将俄罗斯音乐推向世界舞台，同时探索新的音乐语言和表现形式。',
    composers: ['谢尔盖·拉赫玛尼诺夫', '亚历山大·斯克里亚宾', '亚历山大·格拉祖诺夫', '伊戈尔·斯特拉文斯基', '尼古拉·梅特纳'],
    features: ['晚期浪漫主义', '现代主义', '原始主义', '新古典主义萌芽'],
    color: '#0891B2'
  },
  {
    id: 'soviet-era',
    name: '苏联时期',
    period: '社会主义现实主义',
    year: '1920s-1980s',
    position: { x: 78, y: 38 },
    description: '苏联时期的音乐在社会主义现实主义的框架下发展，肖斯塔科维奇、普罗科菲耶夫、哈恰图良等作曲家创造了具有深远影响的音乐遗产。尽管面临政治限制，他们仍创作出兼具艺术价值与民族特色的作品。',
    composers: ['德米特里·肖斯塔科维奇', '谢尔盖·普罗科菲耶夫', '阿拉姆·哈恰图良', '尼古拉·米亚斯科夫斯基', '阿拉姆·哈恰图良'],
    features: ['社会主义现实主义', '交响曲', '芭蕾舞剧', '电影音乐'],
    color: '#166534'
  },
  {
    id: 'contemporary',
    name: '后苏联复兴',
    period: '当代发展',
    year: '1980s-至今',
    position: { x: 88, y: 32 },
    description: '后苏联时期，俄罗斯音乐迎来了多元化发展。施尼特凯、古拜杜丽娜、帕尔特等作曲家在国际上获得广泛认可，音乐创作摆脱了意识形态束缚，呈现出丰富的艺术探索。',
    composers: ['阿尔弗雷德·施尼特凯', '索菲亚·古拜杜丽娜', '阿尔沃·帕尔特', '谢尔盖·施尼特凯', '瓦伦丁·西尔维斯特罗夫'],
    features: ['现代主义', '神圣简约主义', '多元风格探索', '电子音乐'],
    color: '#9D174D'
  }
]

// 俄罗斯地图SVG组件
function RussianMapSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* 米色背景 */}
      <defs>
        <pattern id="mapPattern" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#F5F0E6"/>
          <circle cx="2" cy="2" r="0.3" fill="#E8DFD0"/>
        </pattern>
        <filter id="paperTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
          <feDiffuseLighting in="noise" lightingColor="#F5F0E6" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
        </filter>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B91C1C"/>
          <stop offset="50%" stopColor="#1D4ED8"/>
          <stop offset="100%" stopColor="#B91C1C"/>
        </linearGradient>
      </defs>
      
      {/* 纸张背景 */}
      <rect width="100" height="100" fill="url(#mapPattern)"/>
      
      {/* 简化俄罗斯地图轮廓 */}
      <g stroke="#8B7355" strokeWidth="0.3" fill="none" opacity="0.6">
        {/* 主要领土轮廓 */}
        <path d="M 5 15 Q 15 12, 25 18 Q 35 22, 45 20 Q 55 18, 65 22 Q 75 25, 85 20 Q 95 18, 98 25
                 L 98 40 Q 95 45, 90 48 Q 85 52, 80 50 Q 75 55, 70 52 Q 65 58, 60 55
                 Q 55 60, 50 58 Q 45 62, 40 60 Q 35 65, 30 62 Q 25 68, 20 65
                 Q 15 70, 10 68 L 5 70 Q 2 65, 3 55 Q 2 45, 3 35 Q 4 25, 5 15"
              fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 堪察加半岛 */}
        <path d="M 92 25 Q 95 28, 97 35 Q 98 40, 96 45 Q 94 42, 92 38 Q 90 32, 92 25"
              fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 楚科奇半岛 */}
        <path d="M 96 15 Q 98 18, 98 22 Q 97 25, 95 28 Q 93 25, 94 20 Q 95 16, 96 15"
              fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 克里米亚半岛 */}
        <path d="M 42 58 Q 44 56, 46 58 Q 47 60, 45 62 Q 43 61, 42 58"
              fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 加里宁格勒 */}
        <path d="M 30 38 Q 32 36, 34 38 Q 33 40, 31 40 Q 29 39, 30 38"
              fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 一些小岛和装饰 */}
        <ellipse cx="75" cy="35" rx="2" ry="1" fill="#F5E6D3" stroke="#8B7355"/>
        <ellipse cx="85" cy="32" rx="1.5" ry="0.8" fill="#F5E6D3" stroke="#8B7355"/>
        
        {/* 主要城市标记点 */}
        <g fill="#8B7355" opacity="0.5">
          {/* 莫斯科 */}
          <circle cx="38" cy="45" r="0.5"/>
          {/* 圣彼得堡 */}
          <circle cx="32" cy="38" r="0.5"/>
          {/* 新西伯利亚 */}
          <circle cx="65" cy="48" r="0.4"/>
          {/* 叶卡捷琳堡 */}
          <circle cx="55" cy="47" r="0.4"/>
          {/* 符拉迪沃斯托克 */}
          <circle cx="88" cy="52" r="0.4"/>
        </g>
      </g>
      
      {/* 装饰性经纬线 */}
      <g stroke="#C4A77D" strokeWidth="0.05" fill="none" opacity="0.3">
        <line x1="0" y1="25" x2="100" y2="25"/>
        <line x1="0" y1="45" x2="100" y2="45"/>
        <line x1="0" y1="65" x2="100" y2="65"/>
        <line x1="25" y1="0" x2="25" y2="100"/>
        <line x1="50" y1="0" x2="50" y2="100"/>
        <line x1="75" y1="0" x2="75" y2="100"/>
      </g>
      
      {/* 边框装饰 */}
      <rect x="1" y="1" width="98" height="98" fill="none" stroke="url(#borderGradient)" strokeWidth="0.4" rx="0.5"/>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="#C4A77D" strokeWidth="0.15" strokeDasharray="1 0.5"/>
    </svg>
  )
}

// 时代节点组件
function EraNode({ era, onClick, isActive }) {
  return (
    <button
      onClick={() => onClick(era)}
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-300 ease-out
        group cursor-pointer focus:outline-none
        ${isActive ? 'z-20 scale-125' : 'z-10 hover:scale-110 hover:z-15'}
      `}
      style={{ left: `${era.position.x}%`, top: `${era.position.y}%` }}
    >
      {/* 发光效果 */}
      <div 
        className={`
          absolute inset-0 rounded-full blur-md transition-opacity duration-300
          ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}
        `}
        style={{ 
          backgroundColor: era.color,
          width: '80px',
          height: '80px',
          marginLeft: '-40px',
          marginTop: '-40px'
        }}
      />
      
      {/* 节点主体 */}
      <div 
        className={`
          relative w-12 h-12 md:w-14 md:h-14 rounded-full 
          border-2 flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${isActive 
            ? 'border-white shadow-xl' 
            : 'border-white/80 group-hover:border-white'
          }
        `}
        style={{ backgroundColor: era.color }}
      >
        {/* 内圈装饰 */}
        <div className="absolute inset-1 rounded-full border border-white/30" />
        
        {/* 年份 */}
        <span className="text-white text-[8px] md:text-[9px] font-bold text-center leading-tight px-1">
          {era.year.split('-')[0]}
        </span>
        
        {/* 悬停时的年份提示 */}
        <div className={`
          absolute bottom-full mb-2 left-1/2 -translate-x-1/2
          px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none
        `} style={{ backgroundColor: era.color }}>
          {era.period}
        </div>
      </div>
      
      {/* 时代名称标签 */}
      <div 
        className={`
          absolute top-full mt-1 left-1/2 -translate-x-1/2
          text-center transition-all duration-300
          ${isActive ? 'scale-110' : ''}
        `}
      >
        <span 
          className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded"
          style={{ 
            color: era.color,
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {era.name}
        </span>
      </div>
    </button>
  )
}

// 详情弹窗组件
function EraModal({ era, onClose }) {
  if (!era) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* 弹窗主体 */}
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto
                   bg-gradient-to-br from-amber-50 to-orange-50
                   rounded-2xl shadow-2xl border-2"
        style={{ borderColor: era.color }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部装饰条 */}
        <div 
          className="h-2 w-full rounded-t-xl"
          style={{ backgroundColor: era.color }}
        />
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 
                     flex items-center justify-center text-gray-500
                     hover:bg-white hover:text-gray-700 transition-colors shadow-md"
        >
          ✕
        </button>
        
        {/* 内容区域 */}
        <div className="p-6 pt-4">
          {/* 标题区域 */}
          <div className="mb-4">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ color: era.color }}
            >
              {era.name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-full font-medium" 
                    style={{ backgroundColor: era.color + '20', color: era.color }}>
                {era.period}
              </span>
              <span className="font-medium">{era.year}</span>
            </div>
          </div>
          
          {/* 简介 */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {era.description}
            </p>
          </div>
          
          {/* 代表作曲家 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span style={{ color: era.color }}>♫</span>
              代表作曲家
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.composers.map((composer, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm font-medium
                           bg-white border shadow-sm text-gray-700"
                  style={{ borderColor: era.color + '40' }}
                >
                  {composer}
                </span>
              ))}
            </div>
          </div>
          
          {/* 音乐特征 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span style={{ color: era.color }}>♪</span>
              音乐特征
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {era.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-2 rounded-lg text-sm text-center"
                  style={{ backgroundColor: era.color + '15' }}
                >
                  <span style={{ color: era.color }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 底部装饰 */}
          <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-lg">♪</span>
              <span>俄罗斯音乐留学平台</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 时间轴组件
function Timeline() {
  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex items-center justify-start gap-1 md:gap-2 min-w-max px-4">
        {eras.map((era, idx) => (
          <div key={era.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: era.color }}
              />
              <span className="text-[8px] md:text-[10px] mt-1 text-gray-600 whitespace-nowrap">
                {era.year.split('-')[0]}
              </span>
            </div>
            {idx < eras.length - 1 && (
              <div 
                className="w-8 md:w-16 h-0.5 mx-1"
                style={{ backgroundColor: era.color + '40' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MusicHistoryMap() {
  const [selectedEra, setSelectedEra] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* 顶部导航 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-lg">♪</span>
              </div>
              <span className="font-bold text-gray-800">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">
                首页
              </Link>
              <Link href="/schools" className="text-gray-600 hover:text-red-600 transition-colors">
                院校
              </Link>
              <Link href="/music-history" className="text-red-600 font-semibold">
                音乐史地图
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主标题区域 */}
      <div className="relative py-8 md:py-12 text-center overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">♪</div>
          <div className="absolute top-20 right-20 text-5xl">♫</div>
          <div className="absolute bottom-10 left-1/4 text-4xl">♩</div>
          <div className="absolute bottom-20 right-1/3 text-5xl">♬</div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-700 via-blue-700 to-red-700 bg-clip-text text-transparent">
              俄罗斯音乐史地图
            </span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            探索从18世纪至今的俄罗斯音乐发展历程，点击地图上的时代节点了解更多
          </p>
        </div>
      </div>

      {/* 地图容器 */}
      <div className="container mx-auto px-4 mb-6">
        <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 
                        rounded-2xl shadow-xl overflow-hidden
                        border-2 border-amber-300"
             style={{ minHeight: '400px', maxHeight: '500px' }}>
          
          {/* 地图背景 */}
          <div className="absolute inset-0 opacity-30">
            <RussianMapSVG />
          </div>
          
          {/* 地图内容层 */}
          <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
            {/* 时代节点 */}
            {eras.map((era) => (
              <EraNode
                key={era.id}
                era={era}
                onClick={setSelectedEra}
                isActive={selectedEra?.id === era.id}
              />
            ))}
          </div>
          
          {/* 地图标题 */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm 
                          px-3 py-1.5 rounded-lg shadow-md">
            <span className="text-xs text-gray-600">俄罗斯联邦领土示意图</span>
          </div>
          
          {/* 导航提示 */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                          px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
            <span className="text-xs text-gray-600">点击节点探索</span>
            <span className="text-red-500">♪</span>
          </div>
        </div>
      </div>

      {/* 时间轴 */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-amber-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">时代时间轴</h3>
          <Timeline />
        </div>
      </div>

      {/* 底部说明 */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-red-600">♪</span>
            关于俄罗斯音乐史地图
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">地图说明</h4>
              <p className="text-sm text-gray-600">
                本地图展示了俄罗斯音乐从18世纪至今的八个重要时期，标注了各时代的代表作曲家和音乐特征。地图位置仅供示意，不反映精确地理信息。
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">数据来源</h4>
              <p className="text-sm text-gray-600">
                作曲家信息来源于平台维护的俄罗斯作曲家数据库，时代背景参考学术文献和音乐史著作。
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">使用建议</h4>
              <p className="text-sm text-gray-600">
                点击任意时代节点查看详细信息，了解俄罗斯音乐史的发展脉络和代表人物。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedEra && (
        <EraModal era={selectedEra} onClose={() => setSelectedEra(null)} />
      )}

      {/* 底部装饰 */}
      <footer className="bg-gradient-to-r from-red-700 via-blue-700 to-red-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/90 text-sm">
            © 2024 俄罗斯音乐留学平台 · 探索俄罗斯音乐的悠久传统
          </p>
        </div>
      </footer>
    </div>
  )
}
