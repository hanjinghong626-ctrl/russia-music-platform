'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function GlossaryPage() {
  const [glossaryData, setGlossaryData] = useState({ categories: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/glossary.json')
      .then(r => r.json())
      .then(data => {
        setGlossaryData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = glossaryData.categories || [];

  // Flatten all terms for search
  const allTerms = useMemo(() => {
    const terms = [];
    categories.forEach(cat => {
      cat.terms.forEach(term => {
        terms.push({ ...term, category: cat.name });
      });
    });
    return terms;
  }, [categories]);

  const filteredTerms = useMemo(() => {
    let result = allTerms;
    
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.zh.toLowerCase().includes(q) ||
        t.ru.toLowerCase().includes(q) ||
        (t.abbr && t.abbr.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [allTerms, searchQuery, activeCategory]);

  // Group filtered terms by category
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach(term => {
      if (!groups[term.category]) {
        groups[term.category] = [];
      }
      groups[term.category].push(term);
    });
    return groups;
  }, [filteredTerms]);

  if (loading) {
    return (
      <div className="glossary-loading">
        <div className="loading-spinner"></div>
        <p>正在加载术语库...</p>
      </div>
    );
  }

  return (
    <div className="glossary-page">
      <header className="glossary-header">
        <div className="header-content">
          <Link href="/music-history" className="back-link">
            <span className="back-arrow">←</span> 返回音乐史
          </Link>
          <h1 className="page-title">俄语音乐术语库</h1>
          <p className="page-subtitle">Русско-китайский словарь музыкальных терминов — {allTerms.length}个术语</p>
        </div>
      </header>

      <main className="glossary-main">
        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索中文或俄语术语..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="category-filters">
          <button
            className={`cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              className={`cat-btn ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
              <span className="cat-count">{cat.terms.length}</span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="results-info">
          共 {filteredTerms.length} 个术语
        </div>

        {/* Terms table by category */}
        <div className="terms-section">
          {Object.entries(groupedTerms).map(([catName, terms]) => (
            <div key={catName} className="term-group">
              <h3 className="group-title">{catName}</h3>
              <div className="terms-table">
                <div className="table-header">
                  <span className="col-zh">中文</span>
                  <span className="col-ru">Русский</span>
                  <span className="col-abbr">缩写</span>
                </div>
                {terms.map((term, i) => (
                  <div key={i} className="table-row">
                    <span className="col-zh">{term.zh}</span>
                    <span className="col-ru">{term.ru}</span>
                    <span className="col-abbr">{term.abbr || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="no-results">
            <p>未找到匹配的术语</p>
            <button className="clear-btn" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              清除筛选条件
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .glossary-page {
          min-height: 100vh;
          background: var(--color-bg-deep);
          color: var(--color-text-primary);
          font-family: 'Noto Sans SC', sans-serif;
        }

        .glossary-loading {
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
        .glossary-header {
          background: var(--color-bg-card);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding: 24px;
        }

        .header-content {
          max-width: 960px;
          margin: 0 auto;
        }

        .back-link {
          color: var(--color-primary);
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 16px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-primary-light);
        }

        .page-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 15px;
          color: var(--color-text-muted);
          font-style: italic;
        }

        /* Main */
        .glossary-main {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px;
        }

        /* Search */
        .search-section {
          margin-bottom: 20px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--color-bg-card);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0 16px;
          transition: border-color 0.2s;
        }

        .search-box:focus-within {
          border-color: var(--color-primary);
        }

        .search-icon {
          font-size: 16px;
          margin-right: 8px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-text-primary);
          font-size: 15px;
          padding: 12px 0;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .search-clear {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
        }

        /* Category filters */
        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .cat-btn {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.12);
          color: var(--color-text-secondary);
          padding: 5px 12px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
          font-family: inherit;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cat-btn:hover {
          border-color: rgba(212, 175, 55, 0.3);
          color: var(--color-primary);
        }

        .cat-btn.active {
          background: rgba(212, 175, 55, 0.15);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .cat-count {
          font-size: 10px;
          background: rgba(212, 175, 55, 0.1);
          padding: 1px 6px;
          border-radius: 8px;
          color: var(--color-text-muted);
        }

        .results-info {
          font-size: 14px;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }

        /* Terms */
        .terms-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .term-group {
          background: var(--color-bg-card);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .group-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-primary);
          padding: 14px 20px;
          background: rgba(212, 175, 55, 0.05);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .terms-table {
          width: 100%;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 80px;
          padding: 8px 20px;
          background: rgba(10, 14, 23, 0.3);
          border-bottom: 1px solid rgba(212, 175, 55, 0.06);
        }

        .table-header span {
          font-size: 12px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr 80px;
          padding: 10px 20px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.04);
          transition: background 0.15s;
        }

        .table-row:hover {
          background: rgba(212, 175, 55, 0.03);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .col-zh {
          font-size: 14px;
          color: var(--color-text-primary);
          padding-right: 12px;
        }

        .col-ru {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .col-abbr {
          font-size: 13px;
          color: var(--color-primary);
          font-weight: 500;
        }

        /* No results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: var(--color-text-muted);
        }

        .clear-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: var(--color-primary);
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 12px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 24px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr 1.5fr 60px;
            padding: 8px 12px;
          }

          .category-filters {
            gap: 4px;
          }

          .cat-btn {
            font-size: 11px;
            padding: 4px 10px;
          }
        }
      `}</style>
    </div>
  );
}
