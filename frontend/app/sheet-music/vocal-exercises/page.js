import Link from 'next/link'
import './vocal-exercises.css'

// 加载练声曲数据
async function getVocalExercises() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/vocal-exercises.json`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch (e) {
    // 返回空数据
    return { collections: [], metadata: {} }
  }
}

// 获取难度等级颜色
function getDifficultyColor(difficulty) {
  if (difficulty.includes('专业') || difficulty.includes('Профессиональный')) return 'difficulty-professional'
  if (difficulty.includes('高级') || difficulty.includes('Продвинутый') || difficulty.includes('高级')) return 'difficulty-advanced'
  if (difficulty.includes('中级') || difficulty.includes('Средний')) return 'difficulty-intermediate'
  return 'difficulty-beginner'
}

// 获取声部类型图标
function getVoiceTypeIcon(voiceType) {
  const icons = {
    '女高音': '🎵',
    '女中音': '🎶',
    '女低音': '🎼',
    '男高音': '🎸',
    '男中音': '🎺',
    '男低音': '🎻'
  }
  return icons[voiceType] || '🎵'
}

// 统计信息
function StatsBar({ metadata }) {
  return (
    <div className="vocal-stats-bar">
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">{metadata.totalCollections || 14}</span>
          <span className="stat-label">曲集</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">{metadata.totalPieces || 515}+</span>
          <span className="stat-label">作品</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">6</span>
          <span className="stat-label">声部类型</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">14</span>
          <span className="stat-label">作曲家</span>
        </div>
      </div>
    </div>
  )
}

// 曲集卡片组件
function CollectionCard({ collection }) {
  return (
    <Link href={`/sheet-music/vocal-exercises/${collection.id}`} className="collection-card">
      <div className="card-header">
        <div className="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <span className={`difficulty-badge ${getDifficultyColor(collection.difficulty)}`}>
          {collection.difficulty}
        </span>
      </div>
      
      <h3 className="card-title">{collection.nameZh}</h3>
      <p className="card-subtitle">{collection.nameRu}</p>
      
      <div className="card-composer">
        <span className="composer-label">作曲家</span>
        <span className="composer-name">{collection.composerZh || collection.composer}</span>
        <span className="composer-years">({collection.years})</span>
      </div>
      
      <p className="card-description">{collection.description}</p>
      
      <div className="card-footer">
        <div className="voice-types">
          {collection.voiceTypes.slice(0, 3).map((type, idx) => (
            <span key={idx} className="voice-type-tag">{type}</span>
          ))}
          {collection.voiceTypes.length > 3 && (
            <span className="voice-type-more">+{collection.voiceTypes.length - 3}</span>
          )}
        </div>
        <div className="piece-count">
          <span className="count-number">{collection.pieceCount}</span>
          <span className="count-label">首</span>
        </div>
      </div>
      
      <div className="card-arrow">
        <span>查看详情</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  )
}

// 筛选栏组件
function FilterBar({ onFilter }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>难度</label>
        <select id="difficulty-filter" onChange={(e) => onFilter('difficulty', e.target.value)}>
          <option value="">全部</option>
          <option value="初级">初级</option>
          <option value="中级">中级</option>
          <option value="高级">高级</option>
          <option value="专业">专业</option>
        </select>
      </div>
      <div className="filter-group">
        <label>声部</label>
        <select id="voice-filter" onChange={(e) => onFilter('voice', e.target.value)}>
          <option value="">全部</option>
          <option value="女高音">女高音</option>
          <option value="女中音">女中音</option>
          <option value="男高音">男高音</option>
          <option value="男中音">男中音</option>
          <option value="男低音">男低音</option>
        </select>
      </div>
    </div>
  )
}

export default async function VocalExercisesPage() {
  const data = await getVocalExercises()
  
  return (
    <div className="vocal-exercises-page">
      {/* Hero区域 */}
      <section className="vocal-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎼</span>
            <span>声乐演唱专业</span>
          </div>
          <h1 className="hero-title">
            练声曲库
            <span className="hero-subtitle">Vocal Exercises Library</span>
          </h1>
          <p className="hero-description">
            收录从巴洛克到浪漫主义时期的经典练声曲教材，涵盖阿布特、孔科内、瓦卡伊、博尔东尼、兰佩尔蒂等大师作品。
            适合声乐学习者系统训练呼吸支持、声区统一、音色变化等核心技巧。
          </p>
          <div className="hero-tags">
            <span className="tag">柴院推荐</span>
            <span className="tag">公版作品</span>
            <span className="tag">PDF原版</span>
          </div>
        </div>
      </section>

      {/* 统计栏 */}
      <StatsBar metadata={data.metadata || {}} />

      {/* 主内容区 */}
      <section className="vocal-content">
        <div className="section-header">
          <h2 className="section-title">经典曲集</h2>
          <p className="section-desc">按声部和难度分类，系统学习声乐技巧</p>
        </div>
        
        {/* 曲集网格 */}
        <div className="collections-grid">
          {data.collections && data.collections.length > 0 ? (
            data.collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))
          ) : (
            <div className="empty-state">
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </section>

      {/* 学习指南 */}
      <section className="learning-guide">
        <div className="guide-content">
          <h2 className="guide-title">练声曲学习指南</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <div className="guide-icon">🌱</div>
              <h3>初级阶段</h3>
              <p>建议从阿布特、塞德勒练声曲开始，建立正确的呼吸支持习惯，培养音准和节奏感。</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🌿</div>
              <h3>中级阶段</h3>
              <p>孔科内、瓦卡伊、帕诺夫卡练声曲，注重声区统一和音色变化，为演唱艺术歌曲打基础。</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🌳</div>
              <h3>高级阶段</h3>
              <p>博尔东尼、拉赫玛尼诺夫练声曲，追求音乐表现力和技术精度的完美统一。</p>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🎭</div>
              <h3>专业阶段</h3>
              <p>兰佩尔蒂声乐学派教材，深入研究美声唱法的核心技巧，向专业歌唱家水平迈进。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部导航 */}
      <nav className="page-nav">
        <Link href="/sheet-music" className="nav-link">返回曲库</Link>
        <Link href="/" className="nav-link">返回首页</Link>
      </nav>
    </div>
  )
}
