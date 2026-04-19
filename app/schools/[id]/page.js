'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Tab 配置
const TABS = [
  { id: 'intro', label: '院校简介', icon: '🏛️' },
  { id: 'departments', label: '院系设置', icon: '🎓' },
  { id: 'majors', label: '招生专业', icon: '📚' },
  { id: 'contact', label: '联系方式', icon: '📞' },
]

export default function SchoolDetailPage() {
  const params = useParams()
  const [school, setSchool] = useState(null)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('intro')

  useEffect(() => {
    async function fetchData() {
      try {
        // 并行获取基础信息和详情数据
        const [schoolRes, detailsRes] = await Promise.all([
          fetch(`/api/schools/${params.id}`),
          fetch(`/api/schools/${params.id}/details`),
        ])
        
        const schoolData = await schoolRes.json()
        const detailsData = await detailsRes.json()
        
        if (schoolData.code === 0) {
          setSchool(schoolData.data)
        }
        
        if (detailsData.code === 0) {
          setDetails(detailsData.data)
        } else if (detailsData.code !== 0 && params.id !== 'chaikovsky') {
          // 非柴院院校没有详情数据时，使用基础信息
          setDetails(null)
        }
        
        if (schoolData.code !== 0) {
          setError(schoolData.message)
        }
      } catch (err) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/schools" className="text-gray-600 hover:text-gray-900">院校</Link>
          </div>
        </nav>
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/schools" className="text-gray-600 hover:text-gray-900">院校</Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">院校不存在</h1>
          <Link href="/schools" className="text-primary-600 hover:text-primary-700">
            返回院校列表
          </Link>
        </div>
      </div>
    )
  }

  const basicInfo = details?.basicInfo
  const isTchaikovsky = school.name?.includes('柴可夫斯基') || params.id === 'chaikovsky'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/schools" className="text-gray-600 hover:text-gray-900">院校</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{school.name}</span>
        </div>
      </nav>

      {/* 头部区域 */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center text-5xl">
              {isTchaikovsky ? '🎹' : 
               school.name?.includes('圣彼得堡') ? '🎻' : 
               school.name?.includes('格涅辛') ? '🎷' : '🎵'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
              {school.name_en && <p className="text-primary-200 text-lg mb-1">{school.name_en}</p>}
              {school.name_ru && <p className="text-primary-300 text-sm">{school.name_ru}</p>}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{school.type}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📍 {school.city || '莫斯科'}</span>
                {school.ranking && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium">
                    QS 第{school.ranking}名
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 院校简介 Tab */}
        {activeTab === 'intro' && (
          <div className="space-y-6">
            {basicInfo && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-3">🏛️</span>
                  院校简介
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {basicInfo.description || school.description}
                </p>
              </div>
            )}

            {basicInfo && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">📋</span>
                  基本信息
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">建校时间</div>
                    <div className="text-gray-900 font-medium">{basicInfo.established || school.established || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">首任院长</div>
                    <div className="text-gray-900 font-medium">{basicInfo.firstDean || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">办学性质</div>
                    <div className="text-gray-900 font-medium">{basicInfo.type || school.type || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">主管部门</div>
                    <div className="text-gray-900 font-medium">{basicInfo.department || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">学制</div>
                    <div className="text-gray-900 font-medium">{basicInfo.duration || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">办学地址</div>
                    <div className="text-gray-900 font-medium text-sm">{basicInfo.address || school.address || '-'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 优势专业 */}
            {school.majors && school.majors.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">⭐</span>
                  优势专业
                </h2>
                <div className="flex flex-wrap gap-2">
                  {school.majors.map((major, index) => (
                    <span key={index} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg">
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 著名校友 */}
            {school.alumni && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">🎭</span>
                  著名校友
                </h2>
                <p className="text-gray-600">{school.alumni}</p>
              </div>
            )}
          </div>
        )}

        {/* 院系设置 Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            {details?.departments && details.departments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {details.departments.map((dept, index) => (
                  <div key={dept.id || index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{dept.name}</h3>
                        <p className="text-sm text-primary-600 mb-3">{dept.name_ru}</p>
                        {dept.departments && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-700 mb-1">教研室设置：</p>
                            <p className="leading-relaxed">{dept.departments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-gray-500">暂无院系设置信息</p>
              </div>
            )}
          </div>
        )}

        {/* 招生专业 Tab */}
        {activeTab === 'majors' && (
          <div className="space-y-6">
            {details?.majors && details.majors.length > 0 ? (
              <div>
                {/* 按院系列表展示 */}
                {Object.entries(details.majorsByFaculty || {}).map(([faculty, majors]) => (
                  <div key={faculty} className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-primary-500 rounded-full mr-3"></span>
                      {faculty}
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">招生代码</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">专业名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">俄语名称</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {majors.map((major, idx) => (
                            <tr key={major.id || idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm font-mono">
                                  {major.code}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">{major.name}</td>
                              <td className="px-6 py-4 text-gray-600 italic">{major.name_ru}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500">暂无招生专业信息</p>
              </div>
            )}
          </div>
        )}

        {/* 联系方式 Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {details?.contacts && details.contacts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {details.contacts.map((contact, index) => (
                  <div key={contact.id || index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                        📍
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
                        {contact.description && (
                          <p className="text-sm text-gray-500 mb-3">{contact.description}</p>
                        )}
                        <div className="space-y-2 text-sm">
                          {contact.address && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400">📌</span>
                              <span className="text-gray-600">{contact.address}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400">📞</span>
                              <span className="text-gray-600">{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400">✉️</span>
                              <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700">
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.note && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                              {contact.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-4">📞</div>
                <p className="text-gray-500">暂无联系方式信息</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 右侧悬浮卡片 */}
      <div className="fixed right-4 bottom-4 lg:right-8 lg:bottom-8 z-20">
        <div className="bg-white rounded-xl shadow-lg p-4 space-y-3 w-64">
          {school.website && (
            <>
              <a
                href={basicInfo?.website?.link || school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-primary-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                🌐 访问官网（俄语）
              </a>
              <a
                href={`https://translate.google.com/translate?sl=ru&tl=zh-CN&u=${encodeURIComponent(basicInfo?.website?.link || school.website)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🇨🇳 翻译版官网（中文）
              </a>
            </>
          )}
          <Link
            href="/schools"
            className="block bg-gray-100 text-gray-700 text-center py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            ← 返回院校列表
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 俄罗斯音乐留学平台</p>
        </div>
      </footer>
    </div>
  )
}
