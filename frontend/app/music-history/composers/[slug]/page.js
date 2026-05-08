'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { composers } from '../../data/composers';
import { relationships } from '../../data/relationships';

export default function ComposerDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [detail, setDetail] = useState(null);
  const [composer, setComposer] = useState(null);
  const [relatedComposers, setRelatedComposers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find basic composer data
    const basic = composers.find(c => c.id === slug);
    setComposer(basic || null);

    // Fetch detailed data
    fetch('/data/composer-details.json')
      .then(r => r.json())
      .then(data => {
        const d = data.composers[slug];
        setDetail(d || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    // Find related composers from relationships
    const related = relationships
      .filter(r => r.from === slug || r.to === slug)
      .map(r => {
        const otherId = r.from === slug ? r.to : r.from;
        const otherComposer = composers.find(c => c.id === otherId);
        return otherComposer ? {
          ...otherComposer,
          relationType: r.type,
          relationLabel: r.label
        } : null;
      })
      .filter(Boolean);
    setRelatedComposers(related);
  }, [slug]);

  if (loading) {
    return (
      <div className="composer-detail-loading">
        <div className="loading-spinner"></div>
        <p>正在加载作曲家资料...</p>
      </div>
    );
  }

  if (!composer) {
    return (
      <div className="composer-detail-loading">
        <h2>未找到该作曲家</h2>
        <Link href="/music-history/composers" className="back-link">返回作曲家列表</Link>
      </div>
    );
  }

  const displayName = detail?.name_zh || composer.name;
  const displayRu = detail?.name_ru || composer.nameRu;
  const bio = detail?.bio_zh || composer.description;
  const bioRu = detail?.bio_ru || composer.bioRu;
  const styleText = detail?.style_zh || composer.style;
  const works = detail?.works || composer.works?.map(w => ({
    title_zh: w.title,
    title_ru: w.titleRu,
    year: w.year,
    genre_zh: '',
    genre_ru: '',
    description_zh: ''
  })) || [];
  const period = detail?.period_zh || '';
  const school = detail?.school_zh || composer.school || '';
  const birthPlace = detail?.birth_place_zh || composer.birthPlace?.city || '';
  const birthPlaceRu = detail?.birth_place_ru || '';
  const historicalPosition = detail?.historical_position || '';
  const mentorOf = detail?.mentor_of || [];
  const influencedBy = detail?.influenced_by || [];
  const keyIdeas = detail?.key_ideas || [];
  const source = detail?.source || '';

  return (
    <div className="composer-detail-page">
      <header className="detail-header">
        <div className="header-content">
          <Link href="/music-history" className="back-link">
            <span className="back-arrow">←</span> 返回音乐史
          </Link>
          <nav className="detail-breadcrumb">
            <Link href="/music-history">音乐史</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/music-history/composers">作曲家</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{displayName}</span>
          </nav>
        </div>
      </header>

      <main className="detail-main">
        {/* Hero Section */}
        <section className="composer-hero">
          <div className="hero-portrait">
            {composer.portrait ? (
              <img 
                src={composer.portrait} 
                alt={displayName}
                className="portrait-image"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div className="portrait-placeholder" style={{ display: composer.portrait ? 'none' : 'flex' }}>
              <span className="portrait-icon">♪</span>
            </div>
          </div>
          <div className="hero-info">
            <h1 className="composer-name-zh">{displayName}</h1>
            <p className="composer-name-ru">{displayRu}</p>
            <div className="composer-meta">
              <span className="meta-item">
                <span className="meta-label">生卒年</span>
                <span className="meta-value">{composer.birthYear}—{composer.deathYear}</span>
              </span>
              {period && (
                <span className="meta-item">
                  <span className="meta-label">时期</span>
                  <span className="meta-value">{period}</span>
                </span>
              )}
              {school && (
                <span className="meta-item">
                  <span className="meta-label">学派</span>
                  <span className="meta-value">{school}</span>
                </span>
              )}
              {birthPlace && (
                <span className="meta-item">
                  <span className="meta-label">出生地</span>
                  <span className="meta-value">{birthPlace}{birthPlaceRu && <span className="ru-text"> ({birthPlaceRu})</span>}</span>
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="detail-section">
          <h2 className="section-title">生平简介</h2>
          <div className="section-content">
            <p className="bio-text">{bio}</p>
            {bioRu && <p className="bio-text-ru">{bioRu}</p>}
          </div>
        </section>

        {/* Style & Historical Position */}
        <section className="detail-section">
          <h2 className="section-title">风格定位与历史地位</h2>
          <div className="section-content">
            <div className="style-block">
              <h3 className="sub-title">风格特征</h3>
              <p>{styleText}</p>
            </div>
            {historicalPosition && (
              <div className="style-block">
                <h3 className="sub-title">历史地位</h3>
                <p>{historicalPosition}</p>
              </div>
            )}
            {keyIdeas.length > 0 && (
              <div className="style-block">
                <h3 className="sub-title">核心命题</h3>
                <div className="idea-tags">
                  {keyIdeas.map((idea, i) => (
                    <span key={i} className="idea-tag">{idea}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Works */}
        <section className="detail-section">
          <h2 className="section-title">主要作品</h2>
          <div className="section-content">
            <div className="works-list">
              {works.map((work, i) => (
                <div key={i} className="work-card">
                  <div className="work-header">
                    <h4 className="work-title">{work.title_zh}</h4>
                    {work.title_ru && <span className="work-title-ru">{work.title_ru}</span>}
                  </div>
                  <div className="work-meta">
                    {work.year && <span className="work-year">{work.year}</span>}
                    {work.genre_zh && <span className="work-genre">{work.genre_zh}</span>}
                  </div>
                  {work.description_zh && (
                    <p className="work-description">{work.description_zh}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lineage & Relationships */}
        {(mentorOf.length > 0 || influencedBy.length > 0 || relatedComposers.length > 0) && (
          <section className="detail-section">
            <h2 className="section-title">师承与关系</h2>
            <div className="section-content">
              {influencedBy.length > 0 && (
                <div className="lineage-block">
                  <h3 className="sub-title">受影响于</h3>
                  <div className="lineage-items">
                    {influencedBy.map((item, i) => (
                      <span key={i} className="lineage-chip lineage-in">{item}</span>
                    ))}
                  </div>
                </div>
              )}
              {mentorOf.length > 0 && (
                <div className="lineage-block">
                  <h3 className="sub-title">师承/影响</h3>
                  <div className="lineage-items">
                    {mentorOf.map((item, i) => (
                      <span key={i} className="lineage-chip lineage-out">{item}</span>
                    ))}
                  </div>
                </div>
              )}
              {relatedComposers.length > 0 && (
                <div className="lineage-block">
                  <h3 className="sub-title">关系网络</h3>
                  <div className="related-grid">
                    {relatedComposers.map((rc, i) => (
                      <Link 
                        key={i} 
                        href={`/music-history/composers/${rc.id}`}
                        className="related-card"
                      >
                        <span className="related-name">{rc.name}</span>
                        <span className="related-relation">{rc.relationLabel}</span>
                        <span className={`relation-type type-${rc.relationType}`}>
                          {rc.relationType === 'mentor' ? '师承' : 
                           rc.relationType === 'influence' ? '影响' : 
                           rc.relationType === 'collaboration' ? '合作' : '对立'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Source */}
        {source && (
          <section className="detail-section source-section">
            <h2 className="section-title">信息来源</h2>
            <div className="section-content">
              <p className="source-text">{source}</p>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .composer-detail-page {
          min-height: 100vh;
          background: var(--color-bg-deep);
          color: var(--color-text-primary);
          font-family: 'Noto Sans SC', sans-serif;
        }

        .composer-detail-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-deep);
          color: var(--color-text-primary);
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(212, 175, 55, 0.2);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .detail-header {
          background: var(--color-bg-card);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding: 16px 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .back-link {
          color: var(--color-primary);
          text-decoration: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-primary-light);
        }

        .back-arrow {
          font-size: 18px;
        }

        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .detail-breadcrumb a {
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .detail-breadcrumb a:hover {
          color: var(--color-primary);
        }

        .breadcrumb-sep {
          color: var(--color-text-muted);
        }

        .breadcrumb-current {
          color: var(--color-primary);
        }

        /* Main */
        .detail-main {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        /* Hero */
        .composer-hero {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          margin-bottom: 48px;
        }

        .hero-portrait {
          width: 200px;
          height: 260px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid rgba(212, 175, 55, 0.2);
          background: var(--color-bg-card);
        }

        .portrait-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portrait-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(30,58,95,0.3));
        }

        .portrait-icon {
          font-size: 64px;
          color: var(--color-primary);
          opacity: 0.5;
        }

        .hero-info {
          flex: 1;
        }

        .composer-name-zh {
          font-family: 'Noto Serif SC', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .composer-name-ru {
          font-size: 18px;
          color: var(--color-text-secondary);
          margin-bottom: 20px;
          font-style: italic;
        }

        .composer-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(212, 175, 55, 0.05);
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .meta-label {
          font-size: 12px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .meta-value {
          font-size: 14px;
          color: var(--color-text-primary);
        }

        .ru-text {
          color: var(--color-text-muted);
          font-style: italic;
        }

        /* Sections */
        .detail-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::before {
          content: '◆';
          font-size: 12px;
          color: var(--color-primary);
        }

        .section-content {
          padding-left: 20px;
        }

        /* Bio */
        .bio-text {
          font-size: 16px;
          line-height: 1.8;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }

        .bio-text-ru {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text-muted);
          font-style: italic;
        }

        /* Style blocks */
        .style-block {
          margin-bottom: 20px;
        }

        .sub-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-primary-light);
          margin-bottom: 8px;
        }

        .style-block p {
          font-size: 15px;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }

        .idea-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .idea-tag {
          background: rgba(212, 175, 55, 0.1);
          color: var(--color-primary);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* Works */
        .works-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .work-card {
          background: rgba(20, 27, 45, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          padding: 16px;
          transition: border-color 0.2s;
        }

        .work-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .work-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 6px;
        }

        .work-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .work-title-ru {
          font-size: 13px;
          color: var(--color-text-muted);
          font-style: italic;
        }

        .work-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }

        .work-year {
          font-size: 13px;
          color: var(--color-primary);
        }

        .work-genre {
          font-size: 13px;
          color: var(--color-text-muted);
          background: rgba(212, 175, 55, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .work-description {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        /* Lineage */
        .lineage-block {
          margin-bottom: 20px;
        }

        .lineage-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .lineage-chip {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
        }

        .lineage-in {
          background: rgba(30, 58, 95, 0.3);
          color: var(--color-secondary-blue);
          border: 1px solid rgba(30, 58, 95, 0.5);
        }

        .lineage-out {
          background: rgba(212, 175, 55, 0.1);
          color: var(--color-primary);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .related-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(20, 27, 45, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          padding: 10px 14px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .related-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }

        .related-name {
          font-size: 14px;
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .related-relation {
          font-size: 12px;
          color: var(--color-text-muted);
          flex: 1;
          text-align: right;
        }

        .relation-type {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .type-mentor {
          background: rgba(212, 175, 55, 0.15);
          color: var(--color-primary);
        }

        .type-influence {
          background: rgba(136, 136, 136, 0.15);
          color: var(--color-text-muted);
        }

        .type-collaboration {
          background: rgba(74, 144, 217, 0.15);
          color: #4A90D9;
        }

        .type-opposition {
          background: rgba(255, 68, 68, 0.15);
          color: #FF4444;
        }

        /* Source */
        .source-section .section-content {
          background: rgba(20, 27, 45, 0.5);
          border-radius: 8px;
          padding: 16px;
          border-left: 3px solid var(--color-primary);
        }

        .source-text {
          font-size: 14px;
          color: var(--color-text-muted);
          line-height: 1.6;
          font-style: italic;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .composer-hero {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .hero-portrait {
            width: 160px;
            height: 210px;
          }

          .composer-name-zh {
            font-size: 28px;
          }

          .composer-meta {
            justify-content: center;
          }

          .section-content {
            padding-left: 0;
          }

          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
