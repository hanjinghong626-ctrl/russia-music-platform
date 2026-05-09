import Link from 'next/link'
import '../../vocal-exercises/vocal-exercises.css'

// 加载练声曲数据
async function getVocalExercises() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/vocal-exercises.json`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch (e) {
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

// 曲目列表组件
function PieceTable({ pieces, collectionId }) {
  if (!pieces || pieces.length === 0) {
    return (
      <div className="empty-pieces">
        <p>暂无曲目列表</p>
        <a href={`https://notarhiv.ru/vokalizi/${collectionId}/spisok.html`} target="_blank" rel="noopener noreferrer" className="source-link">
          查看完整曲目 → 来源网站
        </a>
      </div>
    )
  }

  return (
    <div className="piece-table-wrapper">
      <table className="piece-table">
        <thead>
          <tr>
            <th className="col-number">#</th>
            <th className="col-title">作品标题</th>
            <th className="col-russian">俄语/原标题</th>
            <th className="col-opus">作品号</th>
            <th className="col-pdf">PDF</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece, idx) => (
            <tr key={piece.id || idx}>
              <td className="col-number">{piece.id || idx + 1}</td>
              <td className="col-title">{piece.title}</td>
              <td className="col-russian">{piece.titleRu || '-'}</td>
              <td className="col-opus">{piece.opus || '-'}</td>
              <td className="col-pdf">
                {piece.pdfUrl ? (
                  <a 
                    href={piece.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pdf-link"
                    title="在新窗口打开PDF"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span>PDF</span>
                  </a>
                ) : (
                  <span className="no-pdf">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <p className="table-note">* PDF链接指向源站notarhiv.ru，请遵守相关使用条款</p>
      </div>
    </div>
  )
}

export default async function CollectionDetailPage({ params }) {
  const data = await getVocalExercises()
  const collection = data.collections?.find(c => c.id === params.slug)
  
  if (!collection) {
    return (
      <div className="vocal-exercises-page">
        <section className="vocal-hero small">
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">曲目不存在</h1>
            <p className="hero-description">未找到对应的练声曲集</p>
          </div>
        </section>
        <div className="not-found">
          <Link href="/vocal-exercises" className="back-link">← 返回练声曲库</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="vocal-exercises-page">
      {/* Hero区域 */}
      <section className={`vocal-hero collection-hero ${getDifficultyColor(collection.difficulty)}`}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <nav className="breadcrumb">
            <Link href="/vocal-exercises">练声曲库</Link>
            <span className="separator">/</span>
            <span className="current">{collection.nameZh}</span>
          </nav>
          
          <div className="collection-hero-main">
            <div className="hero-info">
              <h1 className="hero-title">
                {collection.nameZh}
                <span className="hero-subtitle">{collection.nameRu}</span>
              </h1>
              
              <div className="hero-meta">
                <div className="meta-item">
                  <span className="meta-label">作曲家</span>
                  <span className="meta-value">{collection.composerZh} ({collection.composer})</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">生卒年</span>
                  <span className="meta-value">{collection.years}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">国籍</span>
                  <span className="meta-value">{collection.country}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">难度</span>
                  <span className={`difficulty-badge ${getDifficultyColor(collection.difficulty)}`}>
                    {collection.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="hero-description">{collection.description}</p>
              
              <div className="voice-types-section">
                <span className="section-label">适用声部</span>
                <div className="voice-type-tags">
                  {collection.voiceTypes.map((type, idx) => (
                    <span key={idx} className="voice-type-tag large">{type}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-number">{collection.pieceCount}</span>
                <span className="stat-label">收录作品</span>
              </div>
              <a 
                href={collection.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="source-link-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                源站目录
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 曲目列表 */}
      <section className="pieces-section">
        <div className="section-header">
          <h2 className="section-title">曲目列表</h2>
          <p className="section-desc">
            共 {collection.pieces?.length || 0} 首练习曲（点击PDF图标在新窗口打开）
          </p>
        </div>
        
        <PieceTable pieces={collection.pieces} collectionId={collection.id} />
      </section>

      {/* 相关推荐 */}
      <section className="related-section">
        <h2 className="section-title">其他曲集</h2>
        <div className="related-grid">
          {data.collections
            .filter(c => c.id !== collection.id)
            .slice(0, 3)
            .map(c => (
              <Link key={c.id} href={`/vocal-exercises/${c.id}`} className="related-card">
                <h3>{c.nameZh}</h3>
                <p>{c.composer}</p>
                <span className={`difficulty-badge small ${getDifficultyColor(c.difficulty)}`}>
                  {c.difficulty}
                </span>
              </Link>
            ))
          }
        </div>
      </section>

      {/* 底部导航 */}
      <nav className="page-nav">
        <Link href="/vocal-exercises" className="nav-link">← 返回练声曲库</Link>
        <Link href="/" className="nav-link">返回首页</Link>
      </nav>
    </div>
  )
}
