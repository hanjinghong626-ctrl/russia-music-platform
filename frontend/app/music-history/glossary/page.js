'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import './glossary.css';

export default function GlossaryPage() {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/encyclopedia_unified.json');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setData(json);
        setEntries(json.entries || []);
      } catch (e) {
        console.error('Failed to load encyclopedia:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter entries based on search and category
  const filteredEntries = useMemo(() => {
    let result = entries;

    if (selectedCategory) {
      result = result.filter(e => e.category_zh === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(e =>
        e.ru.toLowerCase().includes(q) ||
        e.zh.toLowerCase().includes(q) ||
        e.definition_zh.toLowerCase().includes(q) ||
        (e.definition_ru && e.definition_ru.toLowerCase().includes(q))
      );
    }

    return result;
  }, [entries, searchQuery, selectedCategory]);

  // Get entry by id for cross-ref display
  const getEntryById = useMemo(() => {
    const map = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [entries]);

  const handleCrossRefClick = useCallback((entryId) => {
    const entry = getEntryById[entryId];
    if (entry) {
      setActiveEntry(entry);
      // Scroll to entry in list
      const el = document.getElementById(`entry-${entryId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-flash');
        setTimeout(() => el.classList.remove('highlight-flash'), 2000);
      }
    }
  }, [getEntryById]);

  const handleEntryClick = useCallback((entry) => {
    setActiveEntry(entry);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setActiveEntry(null);
  }, []);

  if (loading) {
    return (
      <div className="glossary-loading">
        <div className="loading-spinner"></div>
        <p>正在加载知识库...</p>
      </div>
    );
  }

  const categoryTree = data?.category_tree || {};
  const categoryGroups = data?.category_groups || [];
  const stats = data?.stats || {};

  return (
    <div className="glossary-page">
      {/* Header */}
      <header className="glossary-header">
        <div className="header-left">
          <a href="/" className="back-link">← 返回首页</a>
          <div className="header-title">
            <h1>俄罗斯音乐百科</h1>
            <p className="header-subtitle">Русская музыкальная энциклопедия</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-num">{stats.total_entries || entries.length}</span>
            <span className="stat-label">词条</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{Object.keys(categoryTree).length}</span>
            <span className="stat-label">分类</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{stats.cross_references?.entries_with_refs || 0}</span>
            <span className="stat-label">有交叉引用</span>
          </div>
        </div>
      </header>

      <div className="glossary-body">
        {/* Left sidebar - Category navigation */}
        <aside className="glossary-sidebar">
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="搜索术语..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Category groups */}
          <div className="category-section">
            <h3 className="section-title">分类导航</h3>
            <button
              className={`group-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(null); setSelectedGroup(null); }}
            >
              全部词条
              <span className="count">{entries.length}</span>
            </button>

            {categoryGroups.map((group, gi) => (
              <div key={gi} className="category-group">
                <button
                  className={`group-header ${selectedGroup === group.group ? 'expanded' : ''}`}
                  onClick={() => setSelectedGroup(selectedGroup === group.group ? null : group.group)}
                >
                  <span className="group-icon">{group.icon}</span>
                  <span className="group-name">{group.group}</span>
                  <span className="group-count">{group.total_entries}</span>
                </button>
                {selectedGroup === group.group && (
                  <div className="group-categories">
                    {group.categories.map((cat, ci) => {
                      const treeEntry = categoryTree[cat];
                      return (
                        <button
                          key={ci}
                          className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        >
                          {cat}
                          <span className="count">{treeEntry?.count || 0}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Learning paths */}
          {data?.learning_paths && (
            <div className="learning-section">
              <h3 className="section-title">学习路径</h3>
              <p className="section-hint">按分类推荐由浅入深的阅读顺序</p>
              <select
                className="path-select"
                onChange={(e) => {
                  const cat = e.target.value;
                  if (cat && data.learning_paths[cat]) {
                    setSelectedCategory(cat);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>选择分类查看学习路径</option>
                {Object.keys(data.learning_paths).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </aside>

        {/* Main content - Entry list */}
        <main className="glossary-main">
          <div className="main-toolbar">
            <span className="result-count">
              {selectedCategory ? `${selectedCategory} · ` : ''}
              {filteredEntries.length} 条结果
              {searchQuery && ` (搜索: "${searchQuery}")`}
            </span>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
              >卡片</button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >列表</button>
            </div>
          </div>

          <div className={`entries-container ${viewMode}`}>
            {filteredEntries.length === 0 ? (
              <div className="no-results">
                <p>未找到匹配的词条</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                  清除筛选
                </button>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  id={`entry-${entry.id}`}
                  className={`entry-card quality-${entry.quality} ${activeEntry?.id === entry.id ? 'active' : ''}`}
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className="entry-header">
                    <span className="entry-ru">{entry.ru}</span>
                    <span className="entry-zh">{entry.zh}</span>
                    <span className={`quality-badge quality-${entry.quality}`}>
                      {entry.quality === 'expert' ? '专家' :
                       entry.quality === 'full' ? '完整' :
                       entry.quality === 'detailed' ? '详细' : '基础'}
                    </span>
                  </div>
                  <div className="entry-category">{entry.category_zh}</div>
                  <div className="entry-definition">
                    {entry.definition_zh.length > 200
                      ? entry.definition_zh.slice(0, 200) + '...'
                      : entry.definition_zh}
                    {entry.definition_zh.length > 200 && (
                      <button
                        className="read-more"
                        onClick={(e) => { e.stopPropagation(); handleEntryClick(entry); }}
                      >展开全文</button>
                    )}
                  </div>

                  {/* Cross references */}
                  {entry.cross_refs && entry.cross_refs.length > 0 && (
                    <div className="cross-refs">
                      <span className="refs-label">相关术语：</span>
                      <div className="refs-tags">
                        {entry.cross_refs.slice(0, 8).map(refId => {
                          const refEntry = getEntryById[refId];
                          if (!refEntry) return null;
                          return (
                            <button
                              key={refId}
                              className="ref-tag"
                              onClick={(e) => { e.stopPropagation(); handleCrossRefClick(refId); }}
                            >
                              {refEntry.zh}
                            </button>
                          );
                        })}
                        {entry.cross_refs.length > 8 && (
                          <span className="ref-more">+{entry.cross_refs.length - 8} 更多</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Russian definition preview */}
                  {entry.definition_ru && (
                    <div className="entry-ru-def">
                      <span className="ru-label">RU:</span>
                      <span className="ru-text">
                        {entry.definition_ru.length > 120
                          ? entry.definition_ru.slice(0, 120) + '...'
                          : entry.definition_ru}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Detail panel overlay */}
      {activeEntry && (
        <div className="detail-overlay" onClick={handleCloseDetail}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <button className="detail-close" onClick={handleCloseDetail}>✕</button>

            <div className="detail-header">
              <h2 className="detail-ru">{activeEntry.ru}</h2>
              <h3 className="detail-zh">{activeEntry.zh}</h3>
              <div className="detail-meta">
                <span className="detail-category">{activeEntry.category_zh}</span>
                <span className={`quality-badge quality-${activeEntry.quality}`}>
                  {activeEntry.quality === 'expert' ? '专家级' :
                   activeEntry.quality === 'full' ? '完整' :
                   activeEntry.quality === 'detailed' ? '详细' : '基础'}
                </span>
                <span className="detail-id">#{activeEntry.id}</span>
              </div>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h4>中文释义</h4>
                <p className="detail-definition">{activeEntry.definition_zh}</p>
              </div>

              {activeEntry.definition_ru && (
                <div className="detail-section">
                  <h4>俄语原文</h4>
                  <p className="detail-ru-text">{activeEntry.definition_ru}</p>
                </div>
              )}

              {/* Cross references */}
              {activeEntry.cross_refs && activeEntry.cross_refs.length > 0 && (
                <div className="detail-section">
                  <h4>相关术语 ({activeEntry.cross_refs.length})</h4>
                  <div className="detail-refs">
                    {activeEntry.cross_refs.map(refId => {
                      const refEntry = getEntryById[refId];
                      if (!refEntry) return null;
                      return (
                        <button
                          key={refId}
                          className="detail-ref-btn"
                          onClick={() => {
                            setActiveEntry(refEntry);
                            const el = document.getElementById(`entry-${refId}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                        >
                          <span className="ref-ru">{refEntry.ru}</span>
                          <span className="ref-zh">{refEntry.zh}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back references */}
              {activeEntry.back_refs && activeEntry.back_refs.length > 0 && (
                <div className="detail-section">
                  <h4>被以下术语引用 ({activeEntry.back_refs.length})</h4>
                  <div className="detail-refs">
                    {activeEntry.back_refs.map(refId => {
                      const refEntry = getEntryById[refId];
                      if (!refEntry) return null;
                      return (
                        <button
                          key={refId}
                          className="detail-ref-btn back-ref"
                          onClick={() => {
                            setActiveEntry(refEntry);
                            const el = document.getElementById(`entry-${refId}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                        >
                          <span className="ref-ru">{refEntry.ru}</span>
                          <span className="ref-zh">{refEntry.zh}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
