'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  // 从 API 获取数据
  useEffect(() => {
    async function fetchSchools() {
      try {
        const response = await fetch('/api/schools')
        const data = await response.json()
        if (data.code === 0) {
          setSchools(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchSchools()
  }, [])

  // 获取所有城市
  const cities = [...new Set(schools.map(s => s.city).filter(Boolean))]

  // 筛选院校
  const filteredSchools = schools.filter(school => {
    const matchSearch = search === '' || 
      school.name.toLowerCase().includes(search.toLowerCase()) ||
      school.name_en.toLowerCase().includes(search.toLowerCase())
    const matchCity = cityFilter === '' || school.city === cityFilter
    return matchSearch && matchCity
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-xl">♪</span>
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary-700 transition-colors font-medium">
                首页
              </Link>
              <Link href="/schools" className="text-primary-700 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary-600 after:to-gold-500">
                院校
              </Link>
              <Link href="/evaluate" className="text-gray-600 hover:text-primary-700 transition-colors font-medium flex items-center gap-1">
                <span>🎤</span>
                AI评估
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-accent-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="headerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#fff"/>
              <path d="M0 10 L20 10 M10 0 L10 20" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#headerPattern)"/>
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 text-[200px] opacity-5 transform translate-x-1/4 -translate-y-1/4">♪</div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">俄罗斯音乐学院</h1>
          <p className="text-white/80 text-lg">探索俄罗斯顶尖音乐学府，开启您的艺术之旅</p>
        </div>
      </div>

      {/* 页面内容 */}
      <main className="container mx-auto px-4 py-10">
        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索院校名称..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="w-full md:w-44 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="">全部城市</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            {(search || cityFilter) && (
              <button
                onClick={() => { setSearch(''); setCityFilter('') }}
                className="px-5 py-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-500">正在加载院校数据...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="font-medium text-red-800 mb-1">加载失败</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                共找到 <span className="font-bold text-primary-600 text-lg">{filteredSchools.length}</span> 所院校
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school, index) => (
                <Link 
                  key={school.id} 
                  href={`/schools/${school.id}`}
                  className="group card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="h-32 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/5" />
                    <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {school.name.includes('柴可夫斯基') ? '🎹' : 
                       school.name.includes('圣彼得堡') ? '🎻' : 
                       school.name.includes('格涅辛') ? '🎷' : '🎵'}
                    </span>
                    {/* 顶部装饰线 */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-white to-gold-400" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 text-xs rounded-full font-medium">
                        {school.type}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                        📍 {school.city}
                      </span>
                      {school.ranking && (
                        <span className="px-3 py-1 bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 text-xs rounded-full font-medium flex items-center gap-1">
                          ★ QS第{school.ranking}名
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{school.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 italic">{school.name_en}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{school.description}</p>
                    {school.tuition && (
                      <p className="text-sm font-semibold bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                        {school.tuition}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                      <span>查看详情</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredSchools.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到匹配的院校</h3>
                <p className="text-gray-500 mb-4">尝试调整筛选条件</p>
                <button
                  onClick={() => { setSearch(''); setCityFilter('') }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
              <span className="text-white text-xl">♪</span>
            </div>
            <span className="font-bold">俄罗斯音乐留学平台</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Russia Music Study Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
