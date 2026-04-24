'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 时代数据
const eras = [
  {
    id: 'pre-18th',
    name: '东正教圣咏',
    period: '18世纪前',
    year: '988-1700',
    position: { x: 22, y: 42 },
    description: '俄罗斯音乐的根基可追溯至公元988年东正教传入基辅罗斯。东正教圣咏与民间口头传承的民歌共同塑造了俄罗斯音乐独特的民族性格：深沉内敛的精神性、宽广悠长的旋律线条、以及与俄语语言紧密贴合的韵律特征。',
    composers: ['博尔特尼扬斯基', '别列佐夫斯基'],
    features: ['东正教圣咏', '兹纳缅内记谱法', '俄罗斯民歌', '拜占庭调式'],
    color: '#8B6914',
    glowColor: '#D4AF37'
  },
  {
    id: '18th-century',
    name: '西风东渐',
    period: '18世纪',
    year: '1700-1800',
    position: { x: 30, y: 38 },
    description: '在彼得大帝"全盘西化"政策的推动下，意大利歌剧、德国交响乐、法国芭蕾相继传入俄罗斯。圣彼得堡和莫斯科成为欧洲音乐文化的东方重镇，为后来俄罗斯民族音乐的发展奠定了基础。',
    composers: ['别列佐夫斯基', '法伊科', '达维多夫斯基'],
    features: ['意大利歌剧', '宫廷音乐', '贵族音乐教育', '俄语歌剧萌芽'],
    color: '#1E40AF',
    glowColor: '#60A5FA'
  },
  {
    id: 'glinka-era',
    name: '格林卡时代',
    period: '19世纪上半叶',
    year: '1800-1850',
    position: { x: 35, y: 48 },
    description: '格林卡开创了俄罗斯民族音乐传统，被誉为"俄罗斯音乐之父"。他首次将俄罗斯民族音乐与西欧技法完美结合，奠定了俄罗斯古典音乐的基础，开辟了通往世界音乐舞台的道路。',
    composers: ['米哈伊尔·格林卡', '达尔戈梅日斯基'],
    features: ['民族主义音乐', '俄罗斯歌剧', '交响幻想曲', '民歌与西欧技法结合'],
    color: '#7C3AED',
    glowColor: '#A78BFA'
  },
  {
    id: 'mighty-handful',
    name: '强力集团',
    period: '19世纪中叶',
    year: '1850-1880',
    position: { x: 28, y: 40 },
    description: '以巴拉基列夫、穆索尔斯基、鲍罗丁、里姆斯基-科萨科夫、居伊为代表的"强力集团"致力于发展纯粹的俄罗斯民族音乐。他们以民族性至上、现实主义、民间音乐为本为艺术纲领。',
    composers: ['穆索尔斯基', '鲍罗丁', '里姆斯基-科萨科夫', '巴拉基列夫', '居伊'],
    features: ['强力五人集团', '民族乐派', '标题音乐', '俄罗斯歌剧'],
    color: '#DC2626',
    glowColor: '#F87171'
  },
  {
    id: 'tchaikovsky-era',
    name: '柴可夫斯基',
    period: '19世纪下半叶',
    year: '1870-1893',
    position: { x: 40, y: 50 },
    description: '柴可夫斯基是俄罗斯浪漫主义时期最伟大的作曲家，也是第一位音乐获得国际持久影响的俄罗斯作曲家。他的作品融汇民族传统与欧洲技法，将芭蕾舞剧音乐提升到交响乐的高度。',
    composers: ['柴可夫斯基', '塔涅耶夫', '格拉祖诺夫'],
    features: ['浪漫主义', '芭蕾舞剧', '交响曲', '钢琴协奏曲', '歌剧'],
    color: '#B91C1C',
    glowColor: '#FCA5A5'
  },
  {
    id: 'silver-age',
    name: '白银时代',
    period: '19世纪末-20世纪初',
    year: '1890-1920',
    position: { x: 34, y: 44 },
    description: '拉赫玛尼诺夫、斯克里亚宾等作曲家将俄罗斯浪漫主义推向新的高度。斯特拉文斯基开始探索新的音乐语言，预示了20世纪音乐的新方向。佳吉列夫的俄罗斯芭蕾舞团将俄罗斯艺术传播到全世界。',
    composers: ['拉赫玛尼诺夫', '斯克里亚宾', '斯特拉文斯基', '佳吉列夫'],
    features: ['晚期浪漫主义', '神秘主义', '原始主义', '俄罗斯芭蕾', '国际化'],
    color: '#0891B2',
    glowColor: '#22D3EE'
  },
  {
    id: 'soviet-era',
    name: '苏联时期',
    period: '20世纪',
    year: '1920-1991',
    position: { x: 42, y: 52 },
    description: '在社会主义现实主义的框架下，肖斯塔科维奇、普罗科菲耶夫、哈恰图良等作曲家创造了举世瞩目的艺术成就。尽管面临政治限制，他们仍创作出兼具艺术价值与民族特色的伟大作品。',
    composers: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良', '米亚斯科夫斯基'],
    features: ['交响曲', '芭蕾舞剧', '社会主义现实主义', '电影音乐', '协奏曲'],
    color: '#166534',
    glowColor: '#4ADE80'
  },
  {
    id: 'contemporary',
    name: '当代发展',
    period: '当代',
    year: '1991-至今',
    position: { x: 48, y: 46 },
    description: '当代俄罗斯音乐迎来多元化发展。施尼特凯、古拜杜丽娜等作曲家在国际上获得广泛认可。俄罗斯音乐学派继续保持着国际影响力，在传统与创新之间寻求平衡。',
    composers: ['施尼特凯', '古拜杜丽娜', '帕尔特', '卡列特尼科夫'],
    features: ['复风格技法', '音响探索', '简约主义', '多元化', '电子音乐'],
    color: '#9D174D',
    glowColor: '#F472B6'
  }
]

// 俄罗斯地图SVG组件 - 精美版
function RussianMapSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="russiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3"/>
          <stop offset="30%" stopColor="#8B6914" stopOpacity="0.25"/>
          <stop offset="60%" stopColor="#6B4423" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#4A3520" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="borderGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6"/>
        </linearGradient>
        <radialGradient id="cityGlow">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.3"/>
        </radialGradient>
        <pattern id="decorativePattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#1E293B"/>
          <circle cx="4" cy="4" r="0.5" fill="#D4AF37" opacity="0.3"/>
        </pattern>
        <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      
      <rect x="0" y="0" width="200" height="120" fill="url(#decorativePattern)"/>
      
      <g stroke="url(#gridGradient)" strokeWidth="0.15" fill="none">
        <line x1="0" y1="20" x2="200" y2="20"/>
        <line x1="0" y1="40" x2="200" y2="40"/>
        <line x1="0" y1="60" x2="200" y2="60"/>
        <line x1="0" y1="80" x2="200" y2="80"/>
        <line x1="0" y1="100" x2="200" y2="100"/>
        <line x1="25" y1="0" x2="25" y2="120"/>
        <line x1="50" y1="0" x2="50" y2="120"/>
        <line x1="75" y1="0" x2="75" y2="120"/>
        <line x1="100" y1="0" x2="100" y2="120"/>
        <line x1="125" y1="0" x2="125" y2="120"/>
        <line x1="150" y1="0" x2="150" y2="120"/>
        <line x1="175" y1="0" x2="175" y2="120"/>
      </g>
      
      <g filter="url(#mapGlow)">
        <path 
          d="M 10 15 Q 20 10, 30 14 Q 40 16, 50 15 Q 60 14, 70 16 Q 80 18, 90 15 Q 100 14, 110 16 Q 120 17, 130 15 Q 140 14, 150 16 Q 160 18, 170 14 Q 180 12, 195 18 L 195 35 Q 190 40, 185 42 Q 180 45, 175 43 Q 170 48, 165 45 Q 160 50, 155 48 Q 150 52, 145 50 Q 140 54, 135 52 Q 130 56, 125 54 Q 120 58, 115 56 Q 110 60, 105 58 Q 100 62, 95 60 Q 90 64, 85 62 Q 80 66, 75 64 Q 70 68, 65 66 Q 60 70, 55 68 Q 50 72, 45 70 Q 40 74, 35 72 Q 30 76, 25 74 Q 20 78, 15 76 L 8 78 Q 4 72, 5 65 Q 4 55, 5 45 Q 4 35, 5 25 Q 7 18, 10 15 Z"
          fill="url(#russiaGradient)"
          stroke="#D4AF37"
          strokeWidth="0.4"
          strokeOpacity="0.6"
        />
        <path d="M 175 22 Q 180 25, 185 30 Q 188 35, 186 42 Q 183 45, 180 43 Q 177 40, 175 38 Q 172 33, 175 28 Q 176 24, 175 22 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.3" strokeOpacity="0.5"/>
        <path d="M 188 12 Q 195 15, 197 20 Q 198 25, 196 28 Q 193 26, 191 23 Q 189 18, 190 14 Q 189 12, 188 12 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.3" strokeOpacity="0.5"/>
        <path d="M 165 38 Q 168 40, 172 42 Q 175 44, 174 48 Q 171 50, 168 48 Q 165 45, 163 42 Q 162 39, 165 38 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.3" strokeOpacity="0.5"/>
        <path d="M 55 8 Q 60 6, 65 8 Q 68 10, 66 12 Q 62 11, 58 10 Q 55 9, 55 8 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.2"/>
        <path d="M 48 4 Q 52 2, 55 4 Q 56 6, 54 7 Q 51 6, 48 5 Q 47 4, 48 4 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.2"/>
        <path d="M 82 65 Q 85 62, 88 65 Q 90 68, 87 71 Q 84 70, 82 68 Q 81 66, 82 65 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.3" strokeOpacity="0.5"/>
        <path d="M 55 40 Q 58 38, 60 40 Q 59 42, 57 43 Q 55 42, 55 40 Z" fill="url(#russiaGradient)" stroke="#D4AF37" strokeWidth="0.25" strokeOpacity="0.5"/>
      </g>
      
      <g stroke="url(#riverGradient)" strokeWidth="0.4" fill="none" strokeLinecap="round">
        <path d="M 70 55 Q 75 52, 80 50 Q 85 48, 88 46 Q 92 44, 95 42" strokeDasharray="1,0.5"/>
        <path d="M 75 58 Q 80 56, 82 60" strokeDasharray="1,0.5"/>
        <path d="M 110 35 Q 115 40, 118 48 Q 120 55, 122 62" strokeDasharray="1,0.5"/>
        <path d="M 115 25 Q 118 32, 120 40 Q 122 48, 124 55" strokeDasharray="1,0.5"/>
        <path d="M 135 20 Q 140 28, 142 38 Q 145 48, 148 58" strokeDasharray="1,0.5"/>
      </g>
      
      <g>
        <circle cx="75" cy="50" r="1.2" fill="url(#cityGlow)"/>
        <circle cx="75" cy="50" r="2" fill="none" stroke="#FFD700" strokeWidth="0.2" opacity="0.5"/>
        <text x="77" y="52" fontSize="2" fill="#FFD700" opacity="0.8">莫斯科</text>
        
        <circle cx="62" cy="42" r="1.2" fill="url(#cityGlow)"/>
        <circle cx="62" cy="42" r="2" fill="none" stroke="#FFD700" strokeWidth="0.2" opacity="0.5"/>
        <text x="64" y="44" fontSize="2" fill="#FFD700" opacity="0.8">圣彼得堡</text>
        
        <circle cx="125" cy="48" r="1" fill="url(#cityGlow)"/>
        <circle cx="125" cy="48" r="1.8" fill="none" stroke="#FFD700" strokeWidth="0.2" opacity="0.5"/>
        <text x="127" y="50" fontSize="2" fill="#FFD700" opacity="0.8">新西伯利亚</text>
        
        <circle cx="105" cy="48" r="0.8" fill="url(#cityGlow)"/>
        <text x="106" y="50" fontSize="1.8" fill="#FFD700" opacity="0.7">叶卡捷琳堡</text>
        
        <circle cx="172" cy="52" r="0.8" fill="url(#cityGlow)"/>
        <text x="173" y="54" fontSize="1.8" fill="#FFD700" opacity="0.7">符拉迪沃斯托克</text>
        
        <circle cx="68" cy="58" r="0.8" fill="url(#cityGlow)"/>
        <text x="69" y="60" fontSize="1.8" fill="#FFD700" opacity="0.7">基辅</text>
        
        <circle cx="90" cy="52" r="0.7" fill="url(#cityGlow)"/>
        <text x="91" y="54" fontSize="1.6" fill="#FFD700" opacity="0.7">喀山</text>
        
        <circle cx="145" cy="32" r="0.7" fill="url(#cityGlow)"/>
        <text x="146" y="34" fontSize="1.6" fill="#FFD700" opacity="0.7">雅库茨克</text>
      </g>
      
      <rect x="2" y="2" width="196" height="116" fill="none" stroke="url(#borderGold)" strokeWidth="0.8" rx="1"/>
      <rect x="4" y="4" width="192" height="112" fill="none" stroke="#D4AF37" strokeWidth="0.3" strokeDasharray="2,1" rx="0.5"/>
      
      <g stroke="#D4AF37" strokeWidth="0.4" fill="none">
        <path d="M 2 10 L 2 2 L 10 2"/>
        <path d="M 5 12 L 5 5 L 12 5"/>
        <path d="M 198 10 L 198 2 L 190 2"/>
        <path d="M 195 12 L 195 5 L 188 5"/>
        <path d="M 2 110 L 2 118 L 10 118"/>
        <path d="M 5 108 L 5 115 L 12 115"/>
        <path d="M 198 110 L 198 118 L 190 118"/>
        <path d="M 195 108 L 195 115 L 188 115"/>
      </g>
      
      <g transform="translate(185, 105)">
        <circle r="4" fill="#1E293B" stroke="#D4AF37" strokeWidth="0.3"/>
        <path d="M 0 -3 L 1 0 L 0 1 L -1 0 Z" fill="#FFD700"/>
        <path d="M 0 3 L 1 0 L 0 -1 L -1 0 Z" fill="#B8860B"/>
        <text x="0" y="-4.5" textAnchor="middle" fontSize="2" fill="#FFD700">N</text>
      </g>
      
      <g transform="translate(10, 108)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#D4AF37" strokeWidth="0.3"/>
        <line x1="0" y1="-1" x2="0" y2="1" stroke="#D4AF37" strokeWidth="0.3"/>
        <line x1="10" y1="-0.5" x2="10" y2="0.5" stroke="#D4AF37" strokeWidth="0.2"/>
        <line x1="20" y1="-1" x2="20" y2="1" stroke="#D4AF37" strokeWidth="0.3"/>
        <text x="10" y="3" textAnchor="middle" fontSize="2" fill="#D4AF37">1000 km</text>
      </g>
    </svg>
  )
}

// 时代节点组件
function EraNode({ era, onClick, isActive, index }) {
  return (
    <button
      onClick={() => onClick(era)}
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-500 ease-out cursor-pointer
        focus:outline-none group
        ${isActive ? 'z-30' : 'z-10'}
      `}
      style={{ 
        left: `${era.position.x}%`, 
        top: `${era.position.y}%`,
        animationDelay: `${index * 0.15}s`
      }}
    >
      <div 
        className="absolute w-14 h-14 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${era.glowColor} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          filter: 'blur(8px)'
        }}
      />
      <div 
        className={`
          relative w-10 h-10 rounded-full
          border-2 flex items-center justify-center
          transition-all duration-300
          group-hover:scale-125 group-hover:border-4
          ${isActive ? 'scale-125 border-4' : ''}
        `}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${era.glowColor} 0%, ${era.color} 100%)`,
          borderColor: era.glowColor,
          boxShadow: isActive 
            ? `0 0 30px ${era.glowColor}, 0 0 60px ${era.color}` 
            : `0 0 15px ${era.glowColor}40`
        }}
      >
        <div 
          className="w-4 h-4 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 100%)'
          }}
        />
      </div>
      
      <div 
        className={`
          absolute whitespace-nowrap transition-all duration-300
          ${isActive ? 'opacity-100 -translate-y-2' : 'opacity-0 group-hover:opacity-80 group-hover:-translate-y-1'}
        `}
        style={{ 
          top: '100%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          marginTop: '8px'
        }}
      >
        <span 
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ 
            backgroundColor: `${era.color}CC`,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {era.year}
        </span>
      </div>
      
      <div 
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          backgroundColor: era.glowColor,
          color: era.color,
          border: `1px solid ${era.glowColor}`
        }}
      >
        {index + 1}
      </div>
    </button>
  )
}

// 详情弹窗组件
function DetailModal({ era, onClose }) {
  if (!era) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>
      
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: `2px solid ${era.glowColor}`,
          boxShadow: `0 0 40px ${era.glowColor}40, 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="h-2 w-full rounded-t-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${era.glowColor}, transparent)`
          }}
        />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${era.glowColor} 0%, ${era.color} 100%)`,
                  boxShadow: `0 0 20px ${era.glowColor}40`
                }}
              >
                {eras.findIndex(e => e.id === era.id) + 1}
              </div>
              <div>
                <h2 
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: era.glowColor }}
                >
                  {era.name}
                </h2>
                <p className="text-gray-400 text-sm">{era.period} · {era.year}</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            {era.description}
          </p>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              代表作曲家
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.composers.map((composer, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm"
                  style={{
                    backgroundColor: `${era.color}30`,
                    border: `1px solid ${era.glowColor}40`,
                    color: era.glowColor
                  }}
                >
                  {composer}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              音乐特征
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded text-sm bg-gray-800/50 text-gray-300 border border-gray-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <Link
            href={`/music-history/${era.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${era.color} 0%, ${era.glowColor} 100%)`,
              color: '#fff',
              boxShadow: `0 0 20px ${era.glowColor}40`
            }}
          >
            查看完整文章
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
        
        <div 
          className="h-1 w-full rounded-b-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${era.glowColor}, transparent)`
          }}
        />
      </div>
    </div>
  )
}

// 底部时间轴组件
function Timeline({ eras, activeEra, onEraClick }) {
  return (
    <div className="relative bg-gradient-to-t from-slate-900/95 to-transparent py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-6">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {eras.map((era, idx) => (
              <div 
                key={era.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeEra?.id === era.id ? 'scale-150' : 'hover:scale-125'
                }`}
                style={{
                  backgroundColor: era.glowColor,
                  boxShadow: activeEra?.id === era.id ? `0 0 15px ${era.glowColor}` : 'none'
                }}
                onClick={() => onEraClick(era)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {eras.map((era, idx) => (
            <button
              key={era.id}
              onClick={() => onEraClick(era)}
              className={`
                flex-shrink-0 text-center transition-all duration-300
                ${activeEra?.id === era.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}
              `}
            >
              <div 
                className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2"
                style={{
                  backgroundColor: activeEra?.id === era.id ? era.glowColor : `${era.color}50`,
                  color: activeEra?.id === era.id ? era.color : era.glowColor
                }}
              >
                {idx + 1}
              </div>
              <p className="text-xs font-medium text-white/90 whitespace-nowrap">{era.period}</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">{era.year}</p>
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
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)'
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #D4AF37, transparent),
            radial-gradient(2px 2px at 40px 70px, #fff, transparent),
            radial-gradient(1px 1px at 90px 40px, #D4AF37, transparent),
            radial-gradient(2px 2px at 130px 80px, #fff, transparent),
            radial-gradient(1px 1px at 160px 120px, #D4AF37, transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 150px',
          opacity: 0.15
        }}/>
      </div>
      
      <header className="relative z-10 pt-8 pb-4 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500/50"/>
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500/50"/>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%)',
                textShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
              }}
            >
              俄罗斯音乐史地图
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-2">
            从东正教圣咏到现代主义
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-amber-500/50"/>
            <div className="w-16 h-px bg-gradient-to-r from-amber-500/50 to-transparent"/>
            <div className="w-2 h-2 rounded-full bg-amber-500"/>
            <div className="w-16 h-px bg-gradient-to-l from-amber-500/50 to-transparent"/>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"/>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div 
              className={`
                relative rounded-2xl overflow-hidden
                border-2 transition-all duration-1000
                ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderColor: '#D4AF3740',
                boxShadow: '0 0 60px rgba(212, 175, 55, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="p-4 md:p-6 lg:p-8">
                <div className="relative aspect-[16/10] md:aspect-[16/9]">
                  <RussianMapSVG />
                  
                  {mounted && eras.map((era, idx) => (
                    <EraNode 
                      key={era.id}
                      era={era}
                      index={idx}
                      isActive={selectedEra?.id === era.id}
                      onClick={setSelectedEra}
                    />
                  ))}
                </div>
              </div>
              
              <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"/>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              点击地图上的节点探索俄罗斯音乐史的各个时期
            </p>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 border-t border-amber-500/20">
        <Timeline 
          eras={eras}
          activeEra={selectedEra}
          onEraClick={setSelectedEra}
        />
      </footer>
      
      {selectedEra && (
        <DetailModal 
          era={selectedEra} 
          onClose={() => setSelectedEra(null)} 
        />
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
