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
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-gray-900">俄罗斯音乐留学</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <Link href="/schools" className="text-primary-600 font-medium">院校</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">俄罗斯音乐学院</h1>
          <p className="text-gray-600">浏览并筛选您感兴趣的俄罗斯音乐院校</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-medium">加载失败</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="搜索院校名称..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="w-full md:w-40">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white"
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
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-900"
                  >
                    清除
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              共找到 <span className="font-semibold text-primary-600">{filteredSchools.length}</span> 所院校
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Link 
                  key={school.id} 
                  href={`/schools/${school.id}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all"
                >
                  <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-6xl">
                      {school.name.includes('柴可夫斯基') ? '🎹' : 
                       school.name.includes('圣彼得堡') ? '🎻' : '🎵'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">{school.type}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">📍 {school.city}</span>
                      {school.ranking && (
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">QS第{school.ranking}名</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{school.name_en}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{school.description}</p>
                    {school.tuition && <p className="text-sm font-medium text-primary-600">{school.tuition}</p>}
                  </div>
                </Link>
              ))}
            </div>

            {filteredSchools.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">未找到匹配的院校</h3>
                <p className="text-gray-600">尝试调整筛选条件</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 俄罗斯音乐留学平台</p>
        </div>
      </footer>
    </div>
  )
}
