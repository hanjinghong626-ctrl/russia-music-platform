'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import '../sheet-music.css'

const VOICE_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'solo', label: '独唱' },
  { id: 'ensemble', label: '重唱/合唱' },
]

const TAG_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'transpose', label: '🔄 移调版' },
  { id: 'allkeys', label: '🎹 全调性' },
]

function getVoiceCategory(voiceType) {
  if (!voiceType) return 'solo'
  const vt = voiceType.toLowerCase()
  if (vt.includes('дуэт') || vt.includes('хор') || vt.includes('ансамбль')) return 'ensemble'
  return 'solo'
}

function getVoiceTag(voiceType) {
  if (!voiceType) return null
  const vt = voiceType
  if (vt.includes('дуэт')) return { label: '二重唱', cls: 'sm-tag-ensemble' }
  if (vt.includes('детского хора')) return { label: '儿童合唱', cls: 'sm-tag-chorus' }
  if (vt.includes('хор без сопровождения') || vt.includes('хор без аккомпанемента'))
    return { label: '无伴奏合唱', cls: 'sm-tag-chorus' }
  if (vt.includes('хор') || vt.includes('для хора'))
    return { label: '合唱', cls: 'sm-tag-chorus' }
  return { label: vt, cls: 'sm-tag-voice' }
}

function groupWorksByOpus(works) {
  const groups = {}
  const opusOrder = []
  works.forEach((work) => {
    const opusRaw = work.opus || 'без опуса'
    const opusBase = opusRaw.split(' №')[0] || opusRaw
    if (!groups[opusBase]) {
      groups[opusBase] = { label: opusBase, works: [] }
      opusOrder.push(opusBase)
    }
    groups[opusBase].works.push(work)
  })
  return opusOrder.map((key) => groups[key])
}

export default function SheetMusicClient() {
  const params = useParams()
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)
  const [voiceFilter, setVoiceFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [pdfPreview, setPdfPreview] = useState(null)

  useEffect(() => {
    fetch('/data/core-composers-works.json')
      .then(r => r.json())
      .then(d => { setComposers(d.composers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const composer = useMemo(() => composers.find(c => c.slug === params.slug) || null, [composers, params.slug])

  const filtered = useMemo(() => {
    if (!composer) return []
    let works = composer.works || []
    if (voiceFilter !== 'all') works = works.filter(w => getVoiceCategory(w.voice_type) === voiceFilter)
    if (tagFilter === 'transpose') works = works.filter(w => w.has_transposition)
    else if (tagFilter === 'allkeys') works = works.filter(w => w.has_all_keys)
    if (search.trim()) {
      const q = search.toLowerCase()
      works = works.filter(w => w.title.toLowerCase().includes(q) || (w.poet && w.poet.toLowerCase().includes(q)))
    }
    return works
  }, [composer, voiceFilter, tagFilter, search])

  const opusGroups = useMemo(() => groupWorksByOpus(filtered), [filtered])

  const getPdfUrl = (pdfItem) => {
    if (!pdfItem) return ''
    return typeof pdfItem === 'string' ? pdfItem : (pdfItem.url || '')
  }

  if (loading) return <div className="sm-loading"><div className="sm-loading-spinner"></div><p>加载作品列表...</p></div>
  if (!composer) return <div className="sm-empty"><div className="sm-empty-icon">🎵</div><p>未找到该作曲家</p><Link href="/sheet-music" style={{ color: '#0f766e', marginTop: 12, display: 'inline-block' }}>返回曲库</Link></div>

  let globalIndex = 0

  return (
    <div className="sm-page">
      <header className="sm-detail-header">
        <div className="sm-detail-inner">
          <div className="sm-detail-nav">
            <Link href="/">首页</Link>
            <span className="sm-detail-nav-sep">›</span>
            <Link href="/sheet-music">曲库</Link>
            <span className="sm-detail-nav-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{composer.name_cn}</span>
          </div>
          <h1 className="sm-detail-name-ru">{composer.name_ru}</h1>
          <h2 className="sm-detail-name-cn">{composer.name_cn}</h2>
          <div className="sm-detail-meta">
            <span className="sm-detail-meta-item">{composer.years}</span>
            <span className="sm-detail-meta-item">📜 共 {composer.works?.length || 0} 首作品</span>
          </div>
        </div>
      </header>

      <div className="sm-filter-bar">
        <div className="sm-filter-inner">
          <span className="sm-filter-label">声部：</span>
          {VOICE_FILTERS.map(f => (
            <button key={f.id} className={`sm-filter-btn ${voiceFilter === f.id ? 'sm-filter-btn-active' : ''}`} onClick={() => setVoiceFilter(f.id)}>{f.label}</button>
          ))}
          <span className="sm-filter-divider"></span>
          <span className="sm-filter-label">标记：</span>
          {TAG_FILTERS.map(f => (
            <button key={f.id} className={`sm-filter-btn ${tagFilter === f.id ? 'sm-filter-btn-active' : ''}`} onClick={() => setTagFilter(f.id)}>{f.label}</button>
          ))}
          <span className="sm-filter-divider"></span>
          <input type="text" placeholder="搜索标题/诗人..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', width: '160px', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#0d9488'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      <div className="sm-works-container">
        <div className="sm-results-info">显示 {filtered.length} / {composer.works?.length || 0} 首作品</div>

        {opusGroups.length === 0 ? (
          <div className="sm-empty"><div className="sm-empty-icon">🔍</div><p>没有匹配的作品</p></div>
        ) : (
          opusGroups.map(group => (
            <div key={group.label} className="sm-opus-group">
              <div className="sm-opus-header">
                <span className="sm-opus-title">{group.label}</span>
                <span className="sm-opus-count">{group.works.length} 首</span>
              </div>
              {group.works.map(work => {
                globalIndex++
                const voiceTag = getVoiceTag(work.voice_type)
                const pdfUrl = work.pdf_urls && work.pdf_urls.length > 0 ? getPdfUrl(work.pdf_urls[0]) : ''
                return (
                  <div key={`${work.opus}-${work.title}`} className="sm-work-item">
                    <span className="sm-work-num">{globalIndex}</span>
                    <div className="sm-work-main">
                      <div className="sm-work-title">{work.title}</div>
                      {work.poet && <div className="sm-work-poet">{work.poet}</div>}
                      <div className="sm-work-tags">
                        {voiceTag && <span className={`sm-tag ${voiceTag.cls}`}>{voiceTag.label}</span>}
                        {work.has_transposition && <span className="sm-tag sm-tag-transpose">🔄 移调版</span>}
                        {work.has_all_keys && <span className="sm-tag sm-tag-allkeys">🎹 全调性</span>}
                      </div>
                    </div>
                    <div className="sm-work-actions">
                      {pdfUrl && (
                        <button onClick={() => setPdfPreview({ url: pdfUrl, title: work.title })} className="sm-btn-pdf" title="查看乐谱">📄 乐谱</button>
                      )}
                      {work.text_url && (
                        <a href={work.text_url} target="_blank" rel="noopener noreferrer" className="sm-btn-lyrics">📝 歌词</a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {pdfPreview && (
        <div className="pdf-overlay" onClick={() => setPdfPreview(null)}>
          <div className="pdf-modal" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>{pdfPreview.title}</h3>
              <div className="pdf-modal-actions">
                <a href={pdfPreview.url} target="_blank" rel="noopener noreferrer" className="pdf-download-btn">⬇️ 下载PDF</a>
                <button onClick={() => setPdfPreview(null)} className="pdf-close-btn">✕</button>
              </div>
            </div>
            <div className="pdf-modal-body">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfPreview.url)}&embedded=true`}
                width="100%"
                height="100%"
                frameBorder="0"
                title={pdfPreview.title}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pdf-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdf-modal {
          width: 90vw;
          max-width: 900px;
          height: 85vh;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .pdf-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #1a1a2e;
          color: #fff;
        }
        .pdf-modal-header h3 {
          font-size: 14px;
          font-weight: 500;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 60%;
        }
        .pdf-modal-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pdf-download-btn {
          color: #4ade80;
          text-decoration: none;
          font-size: 13px;
        }
        .pdf-close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
        }
        .pdf-modal-body {
          flex: 1;
          overflow: hidden;
        }
        .pdf-modal-body iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  )
}
