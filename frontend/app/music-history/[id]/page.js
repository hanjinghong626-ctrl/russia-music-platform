'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { musicHistoryData } from '../../../data/music-history';

// 音符装饰
const MusicalNote = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

// 解析Markdown并渲染为HTML（简化版）
function parseMarkdown(markdown) {
  let html = markdown;
  
  // 移除开头的摘要部分
  html = html.replace(/^## 摘要\n[\s\S]*?\n---\n/m, '');
  
  // 标题处理
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-800 mt-10 mb-4 pb-2 border-b border-gray-200">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-700 mt-8 mb-3">$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-medium text-gray-600 mt-6 mb-2">$1</h4>');
  
  // 列表处理
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600 leading-relaxed">$1</li>');
  html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 my-4 text-gray-600">$&</ul>');
  
  // 表格处理（简化）
  html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter(h => h.trim());
    const rowData = rows.trim().split('\n').map(row => 
      row.split('|').filter(c => c.trim())
    );
    
    let tableHtml = '<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse"><thead><tr>';
    headers.forEach(h => {
      tableHtml += `<th class="px-4 py-3 bg-gray-100 border border-gray-200 text-left text-sm font-semibold text-gray-700">${h.trim()}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    rowData.forEach((row, i) => {
      tableHtml += `<tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`;
      row.forEach(cell => {
        tableHtml += `<td class="px-4 py-3 border border-gray-200 text-sm text-gray-600">${cell.trim()}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });
  
  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
  
  // 斜体
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  
  // 分割线
  html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-200" />');
  
  // 引用块
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-600">$1</blockquote>');
  
  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto text-sm"><code>$2</code></pre>');
  
  // 段落处理（确保换行）
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<') || para.trim() === '') {
      return para;
    }
    return `<p class="text-gray-600 leading-relaxed mb-4">${para}</p>`;
  }).join('');
  
  // 清理多余换行
  html = html.replace(/\n/g, '<br />');
  html = html.replace(/<br \/>\s*(<[hlt])/g, '$1');
  html = html.replace(/(<\/[hlt][^>]*>)\s*<br \/>/g, '$1');
  
  return html;
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id;
    const foundArticle = musicHistoryData.find(item => item.id === id);
    setArticle(foundArticle);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">文章未找到</h1>
          <Link href="/music-history" className="text-primary-600 hover:text-primary-700">
            返回时间轴
          </Link>
        </div>
      </div>
    );
  }

  const htmlContent = parseMarkdown(article.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/music-history"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回时间轴</span>
          </Link>
          <span className="text-sm text-gray-400">
            {musicHistoryData.findIndex(item => item.id === article.id) + 1} / {musicHistoryData.length}
          </span>
        </div>
      </div>

      {/* 文章头部 */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* 装饰音符 */}
          <div className="flex justify-center gap-4 mb-6">
            <MusicalNote className="w-6 h-6 text-gold-400 opacity-60" />
            <MusicalNote className="w-6 h-6 text-gold-400 opacity-40" />
            <MusicalNote className="w-6 h-6 text-gold-400 opacity-60" />
          </div>
          
          {/* 时期标签 */}
          <div className="flex justify-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {article.period}
            </span>
            <span className="px-4 py-1.5 bg-gold-500/90 rounded-full text-sm font-medium text-gray-900">
              {article.era}
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {article.title}
          </h1>
          <p className="text-xl text-white/80 text-center mb-6">
            {article.subtitle}
          </p>

          {/* 关键词 */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {article.keywords.split('；').map((keyword, i) => (
              <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                {keyword}
              </span>
            ))}
          </div>

          {/* 分隔线 */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="w-16 h-px bg-white/30"></div>
            <MusicalNote className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-px bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* 文章摘要 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              摘要
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-card p-6 md:p-10">
          {/* 章节导航 */}
          <nav className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              本章内容
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['时期概述', '音乐特点', '代表人物', '历史影响', '结论'].map((section, i) => (
                <span key={i} className="text-sm text-gray-600 py-1 px-2 bg-white rounded border border-gray-200">
                  {section}
                </span>
              ))}
            </div>
          </nav>

          {/* 亮点卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
              <h4 className="text-sm font-semibold text-primary-700 mb-3">核心亮点</h4>
              <div className="flex flex-wrap gap-2">
                {article.highlights.map((highlight, i) => (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-primary-700 border border-primary-200">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gold-50 rounded-xl p-5 border border-gold-100">
              <h4 className="text-sm font-semibold text-gold-700 mb-3">代表人物</h4>
              <div className="space-y-2">
                {article.keyFigures.map((figure, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                    <span className="text-gray-700">{figure.name}</span>
                    <span className="text-gray-400 text-sm">— {figure.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 正文 */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* 底部装饰 */}
          <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
            <MusicalNote className="w-5 h-5 text-primary-400" />
            <MusicalNote className="w-5 h-5 text-gold-400" />
            <MusicalNote className="w-5 h-5 text-accent-400" />
          </div>
        </article>
      </div>

      {/* 相关文章导航 */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">探索更多时期</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const currentIndex = musicHistoryData.findIndex(item => item.id === article.id);
              const prevArticle = currentIndex > 0 ? musicHistoryData[currentIndex - 1] : null;
              const nextArticle = currentIndex < musicHistoryData.length - 1 ? musicHistoryData[currentIndex + 1] : null;
              
              return (
                <>
                  {prevArticle && (
                    <Link 
                      href={`/music-history/${prevArticle.id}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-500">上一时期</p>
                        <p className="font-medium text-gray-700">{prevArticle.title}</p>
                      </div>
                    </Link>
                  )}
                  {nextArticle && (
                    <Link 
                      href={`/music-history/${nextArticle.id}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group md:col-start-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-500">下一时期</p>
                        <p className="font-medium text-gray-700">{nextArticle.title}</p>
                      </div>
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 返回顶部 & 返回时间轴 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Link 
          href="/music-history"
          className="w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
          title="返回时间轴"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
          title="返回顶部"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
