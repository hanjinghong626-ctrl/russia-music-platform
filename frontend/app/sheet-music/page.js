'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './sheet-music.css'

export default function SheetMusicPage() {
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/core-composers-works.json')
        const data = await res.json()
        setComposers(data.composers || [])
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="sm-loading">
        <div className="sm-loading-spinner"></div>
        <p>加载曲库中...</p>
      </div>
    )
  }

  return (
    <div className="sm-page">
      {/* Header */}
      <header className="sm-header">
        <div className="sm-header-inner">
          <div className="sm-header-logo">
            <Link href="/" className="sm-back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>首页</span>
            </Link>
          </div>
          <h1 className="sm-header-title">
            <span className="sm-header-icon">🎼</span>
            俄罗斯浪漫曲集
          </h1>
          <p className="sm-header-subtitle">
            Русский романс — 俄罗斯声乐作品的乐谱资源库
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="sm-stats-bar">
        <div className="sm-stats-inner">
          <div className="sm-stat-item">
            <span className="sm-stat-num">{composers.length}</span>
            <span className="sm-stat-label">位作曲家</span>
          </div>
          <div className="sm-stat-divider"></div>
          <div className="sm-stat-item">
            <span className="sm-stat-num">
              {composers.reduce((sum, c) => sum + (c.works?.length || 0), 0)}
            </span>
            <span className="sm-stat-label">首作品</span>
          </div>
          <div className="sm-stat-divider"></div>
          <div className="sm-stat-item">
            <span className="sm-stat-num">IMSLP</span>
            <span className="sm-stat-label">乐谱来源</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="sm-main">
        {/* 练声曲库入口 - 放在作曲家卡片之前 */}
        <div className="sm-vocal-section">
          <div className="sm-vocal-header">
            <span className="sm-vocal-badge">练声曲</span>
            <h2 className="sm-vocal-title">练声曲库</h2>
            <p className="sm-vocal-subtitle">声乐练习专用曲集，从初级到专业级全覆盖</p>
          </div>
          <Link href="/sheet-music/vocal-exercises" className="sm-vocal-card">
            <div className="sm-vocal-icon">🎵</div>
            <div className="sm-vocal-content">
              <h3 className="sm-vocal-card-title">经典练声曲集</h3>
              <p className="sm-vocal-card-desc">阿布特、孔科内、瓦卡伊等大师作品，系统训练声乐技巧</p>
              <div className="sm-vocal-tags">
                <span className="sm-vocal-tag">14个曲集</span>
                <span className="sm-vocal-tag">515+首作品</span>
                <span className="sm-vocal-tag">6种声部</span>
              </div>
            </div>
            <div className="sm-vocal-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Section Title */}
        <div className="sm-section-header">
          <h2 className="sm-section-title">作曲家</h2>
          <p className="sm-section-desc">点击作曲家名字浏览其代表作品</p>
        </div>

        {/* Composer Cards */}
        <div className="sm-composers-grid">
          {composers.map((composer, index) => (
            <Link
              href={`/sheet-music/${composer.slug}`}
              key={composer.slug}
              className="sm-composer-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`sm-card-bg sm-card-bg-${index % 5}`}></div>
              <div className="sm-card-content">
                <div className="sm-card-ornament">♫</div>
                <h2 className="sm-card-name-ru">{composer.name_ru}</h2>
                <h3 className="sm-card-name-cn">{composer.name_cn}</h3>
                <p className="sm-card-years">{composer.years}</p>
                <div className="sm-card-work-count">
                  <span className="sm-count-num">{composer.works?.length || 0}</span>
                  <span className="sm-count-label">首作品</span>
                </div>
                <div className="sm-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="sm-footer">
        <p>乐谱数据来源于 IMSLP / notarhiv.ru 等公开资源，仅供学习研究使用</p>
      </footer>
    </div>
  )
}
