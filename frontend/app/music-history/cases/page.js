'use client';

import Link from 'next/link';
import './cases.css';

const cases = [
  {
    id: 1,
    title: '第一案',
    subtitle: '彼得堡疑云',
    subtitleRu: 'Тайна Петербурга',
    description: '1869年，圣彼得堡。一位音乐学院学生在冬宫附近被发现昏迷，手中紧握着一首未完成的乐谱。卷入此事的，是俄罗斯音乐界最耀眼的几个名字……',
    era: '19世纪·圣彼得堡',
    characters: '柴可夫斯基 · 穆索尔斯基 · 鲁宾斯坦 · 斯塔索夫 · 崔凯里尼',
    status: 'available',
    href: '/music-history/mystery',
    accent: '#d4a574',
    bgGradient: 'linear-gradient(135deg, #0f1f3a 0%, #1a2a4a 50%, #0a1628 100%)',
    icon: '🎵'
  },
  {
    id: 2,
    title: '第二案',
    subtitle: '莫斯科的回声',
    subtitleRu: 'Эхо Москвы',
    description: '莫斯科大剧院的一场首演之夜，首席女高音在演出前突然失声。剧院内外暗流涌动，音乐学院、贵族沙龙、河畔旧宅……真相藏在旋律背后。',
    era: '19世纪·莫斯科',
    characters: '拉赫玛尼诺夫 · 塔涅耶夫 · 莫杰斯特 · 冯·梅克夫人',
    status: 'available',
    href: '/music-history/mystery2',
    accent: '#8b6b4a',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2a1a1a 50%, #0a1628 100%)',
    icon: '🎭'
  },
  {
    id: 3,
    title: '第三案',
    subtitle: '即将开启',
    subtitleRu: 'Скоро...',
    description: '迷雾笼罩在俄罗斯音乐的历史深处，新的故事正在酝酿……',
    era: '待定',
    characters: '???',
    status: 'coming-soon',
    href: null,
    accent: '#4a5568',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #111827 50%, #0a0e17 100%)',
    icon: '🔒'
  }
];

export default function CasesPage() {
  return (
    <div className="cases-app">
      {/* 背景粒子 */}
      <div className="cases-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* 标题区 */}
      <header className="cases-header">
        <Link href="/music-history" className="cases-back">← 返回</Link>
        <div className="cases-title-block">
          <h1 className="cases-title">案中曲</h1>
          <p className="cases-title-ru">Дело в музыке</p>
        </div>
        <p className="cases-tagline">每一段旋律背后，都藏着一个秘密</p>
      </header>

      {/* 案件卡片 */}
      <div className="cases-grid">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={c.href || '#'}
            className={`case-card ${c.status === 'coming-soon' ? 'case-locked' : ''}`}
            style={{ '--accent': c.accent, '--bg-gradient': c.bgGradient }}
            onClick={c.status === 'coming-soon' ? (e) => e.preventDefault() : undefined}
          >
            <div className="case-card-bg" />
            <div className="case-card-content">
              <div className="case-icon">{c.icon}</div>
              <h2 className="case-title">{c.title}</h2>
              <p className="case-subtitle">{c.subtitle} <span className="case-subtitle-ru">{c.subtitleRu}</span></p>
              <p className="case-desc">{c.description}</p>
              <div className="case-meta">
                <span className="case-era">📍 {c.era}</span>
                <span className="case-characters">👤 {c.characters}</span>
              </div>
              {c.status === 'coming-soon' && (
                <div className="case-coming-badge">即将开启</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* 底部 */}
      <footer className="cases-footer">
        <p>案中曲 · 开放世界音乐剧本杀</p>
      </footer>
    </div>
  );
}
