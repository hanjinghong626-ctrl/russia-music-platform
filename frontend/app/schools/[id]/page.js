'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Tab 配置 - 俄罗斯风格图标
const TABS = [
  { id: 'intro', label: '院校简介', icon: '🏛️' },
  { id: 'departments', label: '院系设置', icon: '🎓' },
  { id: 'majors', label: '招生专业', icon: '📚' },
  { id: 'contact', label: '联系方式', icon: '📞' },
]

// 面包屑导航组件
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-gray-500 hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

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
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500">正在加载...</p>
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
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🎭</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">院校不存在</h1>
          <Link href="/schools" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回院校列表
          </Link>
        </div>
      </div>
    )
  }

  const basicInfo = details?.basicInfo
  const isTchaikovsky = school.name?.includes('柴可夫斯基') || params.id === 'chaikovsky'

  // 根据院校名称获取图标
  const getSchoolIcon = () => {
    if (isTchaikovsky) return '🎹'
    if (school.name?.includes('圣彼得堡')) return '🎻'
    if (school.name?.includes('格涅辛')) return '🎷'
    return '🎵'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center shadow-md">
              <span className="text-white text-xl">♪</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">俄罗斯音乐留学</span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary-700 transition-colors font-medium">
              首页
            </Link>
            <Link href="/schools" className="text-primary-700 font-semibold">
              院校
            </Link>
          </div>
        </div>
      </nav>

      {/* 面包屑 */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '院校', href: '/schools' },
            { label: school.name }
          ]} />
        </div>
      </div>

      {/* 头部区域 - 俄罗斯红蓝渐变 */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-accent-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="heroPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#fff"/>
              <path d="M0 10 L20 10 M10 0 L10 20" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#heroPattern)"/>
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 text-[180px] opacity-5 transform translate-x-1/4 -translate-y-1/4">
          {getSchoolIcon()}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl">
              <span className="text-5xl">{getSchoolIcon()}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{school.name}</h1>
              {school.name_en && <p className="text-primary-200 text-lg mb-1 italic">{school.name_en}</p>}
              {school.name_ru && <p className="text-primary-300 text-sm">{school.name_ru}</p>}
              <div className="flex flex-wrap gap-3 mt-5">
                <span className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {school.type}
                </span>
                <span className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm border border-white/20 flex items-center gap-1">
                  📍 {school.city || '莫斯科'}
                </span>
                {school.ranking && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-gold-400 to-gold-500 text-primary-900 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                    <span>★</span> QS 第{school.ranking}名
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 导航 - 俄罗斯风格 */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary-700 border-primary-600 bg-primary-50/50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
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
      <main className="container mx-auto px-4 py-8 tab-content">
        {/* 院校简介 Tab */}
        {activeTab === 'intro' && (
          <div className="space-y-6">
            {basicInfo && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-md">🏛️</span>
                  院校简介
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {basicInfo.description || school.description}
                </p>
              </div>
            )}

            {basicInfo && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-md">📋</span>
                  基本信息
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: '建校时间', value: basicInfo.established || school.established || '-' },
                    { label: '首任院长', value: basicInfo.firstDean || '-' },
                    { label: '办学性质', value: basicInfo.type || school.type || '-' },
                    { label: '主管部门', value: basicInfo.department || '-' },
                    { label: '学制', value: basicInfo.duration || '-' },
                    { label: '办学地址', value: basicInfo.address || school.address || '-' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                      <div className="text-gray-400 text-sm mb-1">{item.label}</div>
                      <div className="text-gray-900 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 优势专业 */}
            {school.majors && school.majors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center text-white shadow-md">⭐</span>
                  优势专业
                </h2>
                <div className="flex flex-wrap gap-3">
                  {school.majors.map((major, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-xl text-sm font-medium border border-primary-200">
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 著名校友 */}
            {school.alumni && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">🎭</span>
                  著名校友
                </h2>
                <p className="text-gray-600 leading-relaxed">{school.alumni}</p>
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
                  <div key={dept.id || index} className="card-hover bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{dept.name}</h3>
                        <p className="text-sm text-primary-600 mb-3 italic">{dept.name_ru}</p>
                        {dept.departments && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-700 mb-1">教研室设置：</p>
                            <p className="leading-relaxed bg-gray-50 p-3 rounded-lg">{dept.departments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🎓</span>
                </div>
                <p className="text-gray-500 text-lg">暂无院系设置信息</p>
              </div>
            )}
          </div>
        )}

        {/* 招生专业 Tab */}
        {activeTab === 'majors' && (
          <div className="space-y-6">
            {details?.majors && details.majors.length > 0 ? (
              <div>
                {Object.entries(details.majorsByFaculty || {}).map(([faculty, majors]) => (
                  <div key={faculty} className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full" />
                      {faculty}
                    </h3>
                    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">招生代码</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">专业名称</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">俄语名称</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {majors.map((major, idx) => (
                            <tr key={major.id || idx} className="hover:bg-primary-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 rounded-lg text-sm font-mono font-medium border border-primary-200">
                                  {major.code}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">{major.name}</td>
                              <td className="px-6 py-4 text-gray-500 italic">{major.name_ru}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📚</span>
                </div>
                <p className="text-gray-500 text-lg">暂无招生专业信息</p>
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
                  <div key={contact.id || index} className="card-hover bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                        📍
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
                        {contact.description && (
                          <p className="text-sm text-gray-500 mb-4">{contact.description}</p>
                        )}
                        <div className="space-y-3">
                          {contact.address && (
                            <div className="flex items-start gap-3">
                              <span className="text-gray-400 mt-0.5">📌</span>
                              <span className="text-gray-600 text-sm">{contact.address}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-start gap-3">
                              <span className="text-gray-400 mt-0.5">📞</span>
                              <span className="text-gray-600 text-sm">{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-start gap-3">
                              <span className="text-gray-400 mt-0.5">✉️</span>
                              <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.note && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 border-l-3 border-primary-300">
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
              <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📞</span>
                </div>
                <p className="text-gray-500 text-lg">暂无联系方式信息</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 右侧悬浮卡片 */}
      <div className="fixed right-4 bottom-4 lg:right-8 lg:bottom-8 z-30">
        <div className="bg-white rounded-2xl shadow-elegant-lg p-4 space-y-3 w-64 border border-gray-100">
          {school.website && (
            <>
              <a
                href={basicInfo?.website?.link || school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-elegant flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
              >
                <span>🌐</span>
                <span>访问官网（俄语）</span>
              </a>
              <a
                href={`https://translate.google.com/translate?sl=ru&tl=zh-CN&u=${encodeURIComponent(basicInfo?.website?.link || school.website)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-elegant flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                <span>🇨🇳</span>
                <span>翻译版官网</span>
              </a>
            </>
          )}
          <Link
            href="/schools"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回院校列表
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-10 mt-16">
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
