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
    position: { x: 18, y: 48 },
    description: '俄罗斯音乐的根基可追溯至公元988年东正教传入基辅罗斯。东正教圣咏与民间口头传承的民歌共同塑造了俄罗斯音乐独特的民族性格：深沉内敛的精神性、宽广悠长的旋律线条、以及与俄语语言紧密贴合的韵律特征。',
    composers: ['博尔特尼扬斯基', '别列佐夫斯基'],
    features: ['东正教圣咏', '兹纳缅内记谱法', '俄罗斯民歌', '拜占庭调式'],
    color: '#B8860B',
    glowColor: '#FFD700',
    icon: 'cross'
  },
  {
    id: '18th-century',
    name: '西风东渐',
    period: '18世纪',
    year: '1700-1800',
    position: { x: 28, y: 38 },
    description: '在彼得大帝"全盘西化"政策的推动下，意大利歌剧、德国交响乐、法国芭蕾相继传入俄罗斯。圣彼得堡和莫斯科成为欧洲音乐文化的东方重镇，为后来俄罗斯民族音乐的发展奠定了基础。',
    composers: ['别列佐夫斯基', '法伊科', '达维多夫斯基'],
    features: ['意大利歌剧', '宫廷音乐', '贵族音乐教育', '俄语歌剧萌芽'],
    color: '#1E40AF',
    glowColor: '#60A5FA',
    icon: 'opera'
  },
  {
    id: 'glinka-era',
    name: '格林卡时代',
    period: '19世纪上半叶',
    year: '1800-1850',
    position: { x: 36, y: 46 },
    description: '格林卡开创了俄罗斯民族音乐传统，被誉为"俄罗斯音乐之父"。他首次将俄罗斯民族音乐与西欧技法完美结合，奠定了俄罗斯古典音乐的基础，开辟了通往世界音乐舞台的道路。',
    composers: ['米哈伊尔·格林卡', '达尔戈梅日斯基'],
    features: ['民族主义音乐', '俄罗斯歌剧', '交响幻想曲', '民歌与西欧技法结合'],
    color: '#7C3AED',
    glowColor: '#A78BFA',
    icon: 'score'
  },
  {
    id: 'mighty-handful',
    name: '强力集团',
    period: '19世纪中叶',
    year: '1850-1880',
    position: { x: 30, y: 36 },
    description: '以巴拉基列夫、穆索尔斯基、鲍罗丁、里姆斯基-科萨科夫、居伊为代表的"强力集团"致力于发展纯粹的俄罗斯民族音乐。他们以民族性至上、现实主义、民间音乐为本为艺术纲领。',
    composers: ['穆索尔斯基', '鲍罗丁', '里姆斯基-科萨科夫', '巴拉基列夫', '居伊'],
    features: ['强力五人集团', '民族乐派', '标题音乐', '俄罗斯歌剧'],
    color: '#DC2626',
    glowColor: '#F87171',
    icon: 'group'
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
    glowColor: '#FCA5A5',
    icon: 'ballet'
  },
  {
    id: 'silver-age',
    name: '白银时代',
    period: '19世纪末-20世纪初',
    year: '1890-1920',
    position: { x: 34, y: 42 },
    description: '拉赫玛尼诺夫、斯克里亚宾等作曲家将俄罗斯浪漫主义推向新的高度。斯特拉文斯基开始探索新的音乐语言，预示了20世纪音乐的新方向。佳吉列夫的俄罗斯芭蕾舞团将俄罗斯艺术传播到全世界。',
    composers: ['拉赫玛尼诺夫', '斯克里亚宾', '斯特拉文斯基', '佳吉列夫'],
    features: ['晚期浪漫主义', '神秘主义', '原始主义', '俄罗斯芭蕾', '国际化'],
    color: '#0891B2',
    glowColor: '#22D3EE',
    icon: 'piano'
  },
  {
    id: 'soviet-era',
    name: '苏联时期',
    period: '20世纪',
    year: '1920-1991',
    position: { x: 44, y: 52 },
    description: '在社会主义现实主义的框架下，肖斯塔科维奇、普罗科菲耶夫、哈恰图良等作曲家创造了举世瞩目的艺术成就。尽管面临政治限制，他们仍创作出兼具艺术价值与民族特色的伟大作品。',
    composers: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良', '米亚斯科夫斯基'],
    features: ['交响曲', '芭蕾舞剧', '社会主义现实主义', '电影音乐', '协奏曲'],
    color: '#166534',
    glowColor: '#4ADE80',
    icon: 'symphony'
  },
  {
    id: 'contemporary',
    name: '当代发展',
    period: '当代',
    year: '1991-至今',
    position: { x: 50, y: 44 },
    description: '当代俄罗斯音乐迎来多元化发展。施尼特凯、古拜杜丽娜等作曲家在国际上获得广泛认可。俄罗斯音乐学派继续保持着国际影响力，在传统与创新之间寻求平衡。',
    composers: ['施尼特凯', '古拜杜丽娜', '帕尔特', '卡列特尼科夫'],
    features: ['复风格技法', '音响探索', '简约主义', '多元化', '电子音乐'],
    color: '#9D174D',
    glowColor: '#F472B6',
    icon: 'modern'
  }
]

// 音乐图标组件
function MusicIcon({ type, size = 20, color = 'currentColor' }) {
  const icons = {
    cross: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M11 2v7H4v2h7v11h2V11h7V9h-7V2z"/>
      </svg>
    ),
    opera: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C8 2 6 4 6 7c0 2 1 3 2 4l-1 9h2l.5-4h1l.5 4h2l-1-9c1-1 2-2 2-4 0-3-2-5-4-5zm0 3c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z"/>
      </svg>
    ),
    score: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M4 4v16h2v-6h8v6h2V4h-2v6H6V4H4zm6 2h6v4h-6V6z"/>
        <circle cx="7" cy="12" r="1.5"/>
        <circle cx="17" cy="12" r="1.5"/>
      </svg>
    ),
    group: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="8" cy="8" r="3"/>
        <circle cx="16" cy="8" r="3"/>
        <circle cx="12" cy="14" r="3"/>
        <path d="M4 20c0-3 2-5 4-5s3 2 4 3v2H4z"/>
        <path d="M16 20c0-3-2-5-4-5s-3 2-4 3v2h8z"/>
      </svg>
    ),
    ballet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v4l-3 2v6h2v-4h2v4h2v-4l2-2v-2l-2-2-1 2z"/>
        <path d="M8 20l-2 2M16 20l2 2"/>
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
        <path d="M12 3v18M7 6v12M17 6v12M4 9v6M20 9v6"/>
      </svg>
    ),
    modern: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 3v3M9 6v3l-4 8h2l3-6 3 6h2l-4-8V6H9z"/>
        <path d="M12 15v6" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
  return icons[type] || icons.score
}

// 俄罗斯地图SVG组件 - 精美艺术版
function RussianMapSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="starfieldGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a237e" stopOpacity="1"/>
          <stop offset="40%" stopColor="#0d1b2a" stopOpacity="1"/>
          <stop offset="100%" stopColor="#000510" stopOpacity="1"/>
        </radialGradient>
        <linearGradient id="europeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d5a45" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#4a6741" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#5d7052" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="asiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b7355" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#a08060" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#c4a574" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a52" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#0f2940" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#1a3a52" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="25%" stopColor="#B8860B"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="75%" stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#81d4fa" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0.3"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
        </filter>
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b8b7a" stopOpacity="0.8"/>
          <stop offset="60%" stopColor="#6b6b5a" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4a4a3a" stopOpacity="1"/>
        </linearGradient>
        <radialGradient id="cityGlow">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9"/>
          <stop offset="40%" stopColor="#FFA500" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect x="0" y="0" width="200" height="120" fill="url(#starfieldGradient)"/>
      
      <g opacity="0.6">
        {[[15, 8], [25, 15], [45, 5], [60, 12], [80, 8], [95, 18], [110, 6], [125, 14], [140, 9], [155, 16], [170, 7], [185, 13], [30, 25], [70, 22], [100, 28], [130, 20], [160, 24], [20, 35], [50, 32], [85, 38]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.4} fill="#fff" opacity={0.5}/>
        ))}
      </g>
      
      <rect x="0" y="0" width="200" height="120" fill="#f5e6d3" opacity="0.03"/>
      <ellipse cx="12" cy="58" rx="8" ry="4" fill="url(#waterGradient)" opacity="0.6"/>
      <ellipse cx="8" cy="52" rx="5" ry="3" fill="url(#waterGradient)" opacity="0.5"/>
      
      <g filter="url(#softShadow)">
        <path d="M 8 25 Q 12 20, 18 22 Q 25 24, 32 22 Q 40 20, 48 23 Q 55 26, 60 30 Q 65 34, 62 40 Q 58 46, 52 48 Q 46 50, 42 52 Q 38 54, 34 52 Q 30 50, 26 48 Q 22 46, 20 50 Q 18 54, 15 58 Q 12 62, 10 60 Q 8 58, 6 54 Q 4 50, 6 45 Q 8 40, 8 35 Q 7 30, 8 25 Z" fill="url(#europeGradient)" stroke="url(#goldBorder)" strokeWidth="0.5" opacity="0.95"/>
        <path d="M 60 30 Q 68 28, 75 32 Q 80 35, 78 40 Q 75 44, 70 42 Q 65 40, 62 40 Q 65 34, 60 30 Z" fill="#6b7055" stroke="#9a9080" strokeWidth="0.3" opacity="0.9"/>
        <path d="M 75 32 Q 85 28, 95 30 Q 105 32, 115 28 Q 125 25, 135 28 Q 145 31, 155 28 Q 165 25, 175 28 Q 185 30, 192 26 Q 196 28, 195 32 Q 193 38, 190 42 Q 187 48, 185 52 Q 183 58, 180 62 Q 177 66, 174 70 Q 171 74, 168 72 Q 165 68, 162 64 Q 159 60, 156 56 Q 153 52, 150 48 Q 147 44, 144 40 Q 141 36, 138 32 Q 135 28, 132 24 Q 128 20, 125 16 Q 122 14, 120 10 Q 118 8, 115 6 Q 112 4, 108 6 Q 105 8, 102 12 Q 98 16, 95 20 Q 92 24, 88 28 Q 84 32, 80 34 Q 76 36, 75 32 Z" fill="url(#asiaGradient)" stroke="url(#goldBorder)" strokeWidth="0.5" opacity="0.9"/>
        <path d="M 175 22 Q 182 20, 188 22 Q 192 26, 190 32 Q 186 36, 182 34 Q 178 30, 175 26 Q 173 23, 175 22 Z" fill="#7a6b55" stroke="#9a8a70" strokeWidth="0.3" opacity="0.9"/>
        <path d="M 188 12 Q 194 10, 198 12 Q 200 16, 198 20 Q 194 22, 190 20 Q 188 16, 188 12 Z" fill="#6b5b45" stroke="#8a7a60" strokeWidth="0.3" opacity="0.85"/>
        <path d="M 168 36 Q 172 34, 176 36 Q 178 40, 176 44 Q 172 46, 168 44 Q 165 40, 168 36 Z" fill="#6a7a5a" stroke="#8a9a7a" strokeWidth="0.25" opacity="0.85"/>
      </g>
      
      <g filter="url(#glow)" opacity="0.7">
        <path d="M 62 40 L 65 36 L 68 39 L 71 35 L 74 38 L 77 34 L 80 37 L 83 33 L 86 36 L 85 40 Z" fill="url(#mountainGradient)" stroke="#5a5a4a" strokeWidth="0.2"/>
      </g>
      <g filter="url(#glow)" opacity="0.6">
        <path d="M 95 48 L 97 44 L 100 47 L 103 43 L 106 46 L 109 42 L 112 45 L 115 48 Z" fill="url(#mountainGradient)" stroke="#5a5a4a" strokeWidth="0.2"/>
      </g>
      
      <path d="M 35 25 Q 40 30, 45 38 Q 50 46, 48 54 Q 46 60, 44 66" fill="none" stroke="url(#riverGradient)" strokeWidth="1.2" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M 90 35 Q 95 40, 100 50 Q 105 58, 108 68" fill="none" stroke="url(#riverGradient)" strokeWidth="1" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M 115 28 Q 118 38, 120 50 Q 122 62, 120 75" fill="none" stroke="url(#riverGradient)" strokeWidth="1.1" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M 135 30 Q 138 45, 140 60 Q 142 75, 138 90" fill="none" stroke="url(#riverGradient)" strokeWidth="1" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M 28 42 Q 32 45, 36 48 Q 38 52, 36 56" fill="none" stroke="url(#riverGradient)" strokeWidth="0.8" strokeLinecap="round" filter="url(#glow)"/>
      
      {/* 莫斯科 - 圣瓦西里大教堂 */}
      <g transform="translate(38, 46)" filter="url(#softShadow)">
        <rect x="-3" y="0" width="6" height="1.5" fill="#c9a961" opacity="0.9"/>
        <rect x="-2.5" y="-1" width="5" height="1" fill="#e74c3c" opacity="0.9"/>
        <ellipse cx="-1.5" cy="-2.5" rx="1" ry="1.5" fill="#e74c3c" opacity="0.95"/>
        <ellipse cx="-1.5" cy="-3" rx="0.6" ry="0.8" fill="#c9a961"/>
        <ellipse cx="0" cy="-2.2" rx="0.9" ry="1.3" fill="#3498db" opacity="0.95"/>
        <ellipse cx="0" cy="-2.6" rx="0.5" ry="0.7" fill="#c9a961"/>
        <ellipse cx="1.5" cy="-2.5" rx="1" ry="1.5" fill="#e74c3c" opacity="0.95"/>
        <ellipse cx="1.5" cy="-3" rx="0.6" ry="0.8" fill="#c9a961"/>
        <path d="M 0 -4.5 L -0.3 -3.5 L 0.3 -3.5 Z" fill="#c9a961"/>
      </g>
      
      {/* 圣彼得堡 - 伊萨基辅大教堂 */}
      <g transform="translate(26, 36)" filter="url(#softShadow)">
        <rect x="-4" y="0" width="8" height="0.8" fill="#d4d4d4" opacity="0.9"/>
        <ellipse cx="0" cy="-1.5" rx="2.5" ry="1.5" fill="#e8e8e8" opacity="0.95"/>
        <ellipse cx="0" cy="-2" rx="1.2" ry="0.8" fill="#c9a961"/>
        <rect x="-3.5" y="-1" width="0.5" height="1" fill="#d0d0d0" opacity="0.8"/>
        <rect x="-2" y="-1" width="0.5" height="1" fill="#d0d0d0" opacity="0.8"/>
        <rect x="1.5" y="-1" width="0.5" height="1" fill="#d0d0d0" opacity="0.8"/>
        <rect x="3" y="-1" width="0.5" height="1" fill="#d0d0d0" opacity="0.8"/>
        <path d="M 0 -3 L -0.4 -2 L 0.4 -2 Z" fill="#c9a961"/>
      </g>
      
      <g transform="translate(24, 38)" filter="url(#glow)">
        <path d="M 0 0 L -0.8 2 L 0.8 2 Z" fill="#c9a961" opacity="0.9"/>
        <path d="M 0 -2 L -0.4 0 L 0.4 0 Z" fill="#d4af37" opacity="0.95"/>
        <circle cx="0" cy="-2.5" r="0.3" fill="#d4af37"/>
      </g>
      
      <g transform="translate(40, 48)" filter="url(#softShadow)">
        <rect x="-1.5" y="-3" width="3" height="3" fill="#c9a961" opacity="0.85"/>
        <path d="M -1.5 -3 L 0 -4.5 L 1.5 -3 Z" fill="#e74c3c" opacity="0.9"/>
        <rect x="-0.3" y="-2" width="0.6" height="1" fill="#4a4a4a" opacity="0.7"/>
      </g>
      
      <g transform="translate(18, 50)" filter="url(#softShadow)">
        <rect x="-2" y="-1" width="4" height="1" fill="#f5f5dc" opacity="0.9"/>
        <ellipse cx="0" cy="-2" rx="1.5" ry="1" fill="#f5f5dc" opacity="0.95"/>
        <ellipse cx="0" cy="-2.5" rx="0.6" ry="0.5" fill="#c9a961"/>
        <circle cx="-1" cy="-2.8" r="0.3" fill="#c9a961"/>
        <circle cx="1" cy="-2.8" r="0.3" fill="#c9a961"/>
      </g>
      
      <g transform="translate(95, 55)" filter="url(#glow)">
        <rect x="-1" y="-2" width="2" height="2" fill="#8a8a8a" opacity="0.7"/>
        <rect x="-0.5" y="-2.5" width="1" height="0.5" fill="#6a6a6a"/>
      </g>
      
      <g transform="translate(165, 42)" filter="url(#glow)">
        <path d="M 0 0 L -1 1.5 L 1 1.5 Z" fill="#3498db" opacity="0.7"/>
        <rect x="-0.5" y="-1" width="1" height="1" fill="#7a8a9a" opacity="0.6"/>
      </g>
      
      <g filter="url(#glow)" opacity="0.4">
        <circle cx="38" cy="46" r="2" fill="url(#cityGlow)"/>
        <circle cx="26" cy="36" r="1.8" fill="url(#cityGlow)"/>
        <circle cx="40" cy="48" r="1.5" fill="url(#cityGlow)"/>
        <circle cx="18" cy="50" r="1.5" fill="url(#cityGlow)"/>
      </g>
      
      <g fontFamily="Georgia, serif" fontSize="2.5" fill="#f5e6d3" opacity="0.85">
        <text x="38" y="53" textAnchor="middle" fontWeight="bold">Москва</text>
        <text x="26" y="42" textAnchor="middle" fontWeight="bold">Санкт-Петербург</text>
        <text x="40" y="55" textAnchor="middle" fontSize="2">Москва</text>
        <text x="18" y="57" textAnchor="middle">Киев</text>
        <text x="95" y="62" textAnchor="middle" fontStyle="italic">Новосибирск</text>
        <text x="165" y="48" textAnchor="middle" fontStyle="italic">Владивосток</text>
        <text x="140" y="65" textAnchor="middle" fontStyle="italic">Якутск</text>
      </g>
    </svg>
  )
}

// 指南针组件
function CompassRose() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="absolute bottom-4 right-4 opacity-70">
      <defs>
        <linearGradient id="compassGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="none" stroke="url(#compassGold)" strokeWidth="1" opacity="0.6"/>
      <circle cx="30" cy="30" r="24" fill="none" stroke="url(#compassGold)" strokeWidth="0.5" opacity="0.4"/>
      <path d="M 30 5 L 33 25 L 30 20 L 27 25 Z" fill="#D4AF37"/>
      <path d="M 30 55 L 33 35 L 30 40 L 27 35 Z" fill="#8B7355"/>
      <path d="M 55 30 L 35 33 L 40 30 L 35 27 Z" fill="#8B7355"/>
      <path d="M 5 30 L 25 33 L 20 30 L 25 27 Z" fill="#8B7355"/>
      <circle cx="30" cy="30" r="3" fill="#D4AF37"/>
      <circle cx="30" cy="30" r="1.5" fill="#fff"/>
      <text x="30" y="12" textAnchor="middle" fill="#D4AF37" fontSize="5" fontFamily="Georgia">N</text>
      <text x="30" y="54" textAnchor="middle" fill="#8B7355" fontSize="5" fontFamily="Georgia">S</text>
      <text x="52" y="31" textAnchor="middle" fill="#8B7355" fontSize="5" fontFamily="Georgia">E</text>
      <text x="8" y="31" textAnchor="middle" fill="#8B7355" fontSize="5" fontFamily="Georgia">W</text>
    </svg>
  )
}

// 比例尺组件
function ScaleBar() {
  return (
    <svg width="100" height="20" viewBox="0 0 100 20" className="absolute bottom-4 left-4 opacity-60">
      <defs>
        <linearGradient id="scaleGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#B8860B"/>
        </linearGradient>
      </defs>
      <rect x="0" y="8" width="100" height="4" fill="url(#scaleGold)" opacity="0.7"/>
      <rect x="0" y="8" width="25" height="4" fill="#0d1b2a"/>
      <rect x="50" y="8" width="25" height="4" fill="#0d1b2a"/>
      <line x1="0" y1="6" x2="0" y2="14" stroke="#D4AF37" strokeWidth="0.5"/>
      <line x1="25" y1="6" x2="25" y2="14" stroke="#D4AF37" strokeWidth="0.5"/>
      <line x1="50" y1="6" x2="50" y2="14" stroke="#D4AF37" strokeWidth="0.5"/>
      <line x1="75" y1="6" x2="75" y2="14" stroke="#D4AF37" strokeWidth="0.5"/>
      <line x1="100" y1="6" x2="100" y2="14" stroke="#D4AF37" strokeWidth="0.5"/>
      <text x="0" y="20" textAnchor="middle" fill="#f5e6d3" fontSize="3" fontFamily="Georgia">0</text>
      <text x="50" y="20" textAnchor="middle" fill="#f5e6d3" fontSize="3" fontFamily="Georgia">500</text>
      <text x="100" y="20" textAnchor="middle" fill="#f5e6d3" fontSize="3" fontFamily="Georgia">1000 km</text>
    </svg>
  )
}

// 装饰性套娃
function Matryoshka({ x, y, size = 15 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.12">
      <ellipse cx="0" cy="0" rx={size * 0.4} ry={size * 0.5} fill="#c9a961" stroke="#8B6914" strokeWidth="0.3"/>
      <ellipse cx="0" cy={-size * 0.15} rx={size * 0.25} ry={size * 0.2} fill="#e74c3c"/>
      <circle cx="0" cy={-size * 0.35} r={size * 0.12} fill="#f5e6d3"/>
    </g>
  )
}

// 装饰性巴拉莱卡琴
function Balalaika({ x, y, size = 12 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.1">
      <path d={`M 0 ${size * 0.3} L ${-size * 0.25} ${-size * 0.2} L ${size * 0.25} ${-size * 0.2} Z`} fill="#8B6914" stroke="#c9a961" strokeWidth="0.3"/>
      <rect x={-size * 0.05} y={-size * 0.6} width={size * 0.1} height={size * 0.4} fill="#5D4E37"/>
      <rect x={-size * 0.08} y={-size * 0.7} width={size * 0.16} height={size * 0.12} fill="#5D4E37"/>
      <line x1="-0.05" y1={-size * 0.2} x2="-0.03" y2={size * 0.3} stroke="#d4af37" strokeWidth="0.15"/>
      <line x1="0" y1={-size * 0.2} x2="0" y2={size * 0.3} stroke="#d4af37" strokeWidth="0.15"/>
      <line x1="0.05" y1={-size * 0.2} x2="0.03" y2={size * 0.3} stroke="#d4af37" strokeWidth="0.15"/>
    </g>
  )
}

// 装饰性五线谱
function MusicStaff({ x, y, width = 30 }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.08">
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="0" y1={i * 1.5} x2={width} y2={i * 1.5} stroke="#d4af37" strokeWidth="0.3"/>
      ))}
      <ellipse cx="5" cy="3" rx="1" ry="0.8" fill="#d4af37"/>
      <line x1="6" y1="3" x2="6" y2="-1" stroke="#d4af37" strokeWidth="0.3"/>
      <ellipse cx="15" cy="4.5" rx="1" ry="0.8" fill="#d4af37"/>
      <line x1="16" y1="4.5" x2="16" y2="0.5" stroke="#d4af37" strokeWidth="0.3"/>
      <ellipse cx="25" cy="1.5" rx="1" ry="0.8" fill="#d4af37"/>
      <line x1="26" y1="1.5" x2="26" y2="-2.5" stroke="#d4af37" strokeWidth="0.3"/>
    </g>
  )
}

// 时代节点组件
function EraNode({ era, index, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: era.position.x + '%', top: era.position.y + '%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(era)}
    >
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive || isHovered ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}`}
        style={{
          background: `radial-gradient(circle, ${era.glowColor} 0%, transparent 70%)`,
          width: '50px',
          height: '50px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      <div 
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive || isHovered ? 'scale-110' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${era.glowColor} 0%, ${era.color} 100%)`,
          boxShadow: `0 0 20px ${era.glowColor}60, 0 0 40px ${era.glowColor}30, inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`,
          border: `2px solid ${era.glowColor}`
        }}
      >
        <div className="absolute inset-1 rounded-full opacity-30" style={{ background: 'rgba(255,255,255,0.1)' }}/>
        <div className="text-white z-10"><MusicIcon type={era.icon} size={20} color="#fff"/></div>
        <div 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: era.glowColor, color: era.color, boxShadow: `0 0 8px ${era.glowColor}` }}
        >
          {index + 1}
        </div>
      </div>
      
      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div 
          className="px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${era.color}ee 0%, ${era.color}99 100%)`,
            color: '#fff',
            border: `1px solid ${era.glowColor}60`,
            boxShadow: `0 0 15px ${era.glowColor}40`
          }}
        >
          {era.name}
        </div>
        <div className="w-2 h-2 rotate-45 mx-auto -mt-1" style={{ background: era.color }}/>
      </div>
      
      {isActive && (
        <div className="absolute inset-0 rounded-full animate-ping" style={{ border: `2px solid ${era.glowColor}`, animationDuration: '2s' }}/> 
      )}
    </div>
  )
}

// 详情弹窗组件
function DetailModal({ era, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)' }}/>
      
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          border: `2px solid ${era.glowColor}60`,
          boxShadow: `0 0 40px ${era.glowColor}30, 0 0 80px ${era.glowColor}15, inset 0 1px 0 rgba(255,255,255,0.1)`
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${era.glowColor}, transparent)` }}/>
        
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${era.glowColor} 0%, ${era.color} 100%)`, boxShadow: `0 0 30px ${era.glowColor}50` }}>
                <MusicIcon type={era.icon} size={32} color="#fff"/>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1" style={{ color: era.glowColor, textShadow: `0 0 20px ${era.glowColor}50` }}>{era.name}</h2>
                <p className="text-gray-400">{era.period} · {era.year}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: `${era.color}30`, color: era.glowColor, border: `1px solid ${era.glowColor}40` }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        
        <div className="h-px mx-6" style={{ background: `linear-gradient(90deg, transparent, ${era.glowColor}40, transparent)` }}/>
        
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed text-lg mb-6">{era.description}</p>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: era.glowColor }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
              代表作曲家
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.composers.map((composer, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${era.color}30 0%, ${era.glowColor}20 100%)`, border: `1px solid ${era.glowColor}50`, color: era.glowColor, boxShadow: `0 0 10px ${era.glowColor}20` }}>{composer}</span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: era.glowColor }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              音乐特征
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.features.map((feature, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg text-sm bg-gray-800/50 text-gray-300 border border-gray-700/50">{feature}</span>
              ))}
            </div>
          </div>
          
          <Link href={`/music-history/${era.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105" style={{ background: `linear-gradient(135deg, ${era.color} 0%, ${era.glowColor} 100%)`, color: '#fff', boxShadow: `0 0 25px ${era.glowColor}50` }}>
            查看完整文章
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>
        
        <div className="h-1 rounded-b-xl" style={{ background: `linear-gradient(90deg, transparent, ${era.glowColor}, transparent)` }}/>
      </div>
    </div>
  )
}

// 底部时间轴组件
function Timeline({ eras, activeEra, onEraClick }) {
  return (
    <div className="relative py-6 px-4" style={{ background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="relative h-1 mb-6">
          <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)' }}/>
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {eras.map((era, idx) => (
              <div key={era.id} className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${activeEra?.id === era.id ? 'scale-150' : 'hover:scale-125'}`} style={{ backgroundColor: era.glowColor, boxShadow: activeEra?.id === era.id ? `0 0 15px ${era.glowColor}` : 'none' }} onClick={() => onEraClick(era)}/>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {eras.map((era, idx) => (
            <button key={era.id} onClick={() => onEraClick(era)} className={`flex-shrink-0 text-center transition-all duration-300 p-2 rounded-lg ${activeEra?.id === era.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`} style={{ background: activeEra?.id === era.id ? `${era.color}30` : 'transparent' }}>
              <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300" style={{ background: activeEra?.id === era.id ? `linear-gradient(135deg, ${era.glowColor}, ${era.color})` : `${era.color}40`, color: activeEra?.id === era.id ? '#fff' : era.glowColor, boxShadow: activeEra?.id === era.id ? `0 0 15px ${era.glowColor}50` : 'none' }}>{idx + 1}</div>
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
  
  const starfieldStyle = {
    backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #fff, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 130px 80px, #fff, transparent), radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.7), transparent)',
    backgroundRepeat: 'repeat',
    backgroundSize: '250px 180px',
    opacity: 0.2
  }
  
  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 30%, #1a237e 60%, #0d1b2a 100%)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={starfieldStyle}/>
      </div>
      
      <header className="relative z-10 pt-6 pb-4 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-500/50"/>
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-500/50"/>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 30%, #F5E6D3 50%, #D4AF37 70%, #B8860B 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(212, 175, 55, 0.4)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
            俄罗斯音乐史地图
          </h1>
          
          <p className="text-lg md:text-xl mb-4" style={{ color: 'rgba(245, 230, 211, 0.7)' }}>从东正教圣咏到当代多元发展</p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500/50"/>
            <div className="w-16 h-px bg-gradient-to-r from-amber-500/50 to-amber-500"/>
            <div className="w-3 h-3 rounded-full bg-amber-500"/>
            <div className="w-16 h-px bg-gradient-to-l from-amber-500/50 to-amber-500"/>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"/>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 px-4 py-2">
        <div className="max-w-6xl mx-auto h-full">
          <div className="relative h-full">
            <div className={`relative rounded-2xl overflow-hidden h-full border-2 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 27, 42, 0.95) 50%, rgba(10, 10, 26, 0.9) 100%)', borderColor: 'rgba(212, 175, 55, 0.3)', boxShadow: '0 0 60px rgba(212, 175, 55, 0.1), 0 0 120px rgba(212, 175, 55, 0.05), inset 0 0 80px rgba(0, 0, 0, 0.4)', minHeight: '500px' }}>
              <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(212, 175, 55, 0.15)' }}/>
              
              <Matryoshka x={15} y={75} size={20}/>
              <Matryoshka x={85} y={80} size={12}/>
              <Balalaika x={10} y={25} size={15}/>
              <Balalaika x={90} y={20} size={10}/>
              <MusicStaff x={5} y={50} width={25}/>
              <MusicStaff x={170} y={65} width={20}/>
              
              <div className="relative p-4 md:p-6 lg:p-8 h-full flex flex-col">
                <div className="relative flex-1 min-h-[400px] md:min-h-[450px]">
                  <RussianMapSVG />
                  {mounted && eras.map((era, idx) => (
                    <EraNode key={era.id} era={era} index={idx} isActive={selectedEra?.id === era.id} onClick={setSelectedEra}/>
                  ))}
                  <CompassRose />
                  <ScaleBar />
                </div>
                <p className="text-center text-sm mt-4" style={{ color: 'rgba(245, 230, 211, 0.5)' }}>点击地图上的节点探索俄罗斯音乐史的各个时期</p>
              </div>
              
              <div className="h-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)' }}/>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10">
        <Timeline eras={eras} activeEra={selectedEra} onEraClick={setSelectedEra}/>
      </footer>
      
      {selectedEra && <DetailModal era={selectedEra} onClose={() => setSelectedEra(null)}/>}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes goldenGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
          50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.5); }
        }
        .golden-glow { animation: goldenGlow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
