'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EvaluatePage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    setFile(uploadedFile)
    setLoading(true)
    setResult(null)

    // 模拟分析
    setTimeout(() => {
      setResult({
        overall: 85,
        pitch: 88,
        rhythm: 82,
        timbre: 85,
        strengths: ['音准稳定性良好', '节奏感较强', '音色饱满'],
        suggestions: ['建议加强高音区练习', '注意气息控制', '可以尝试更多曲目风格'],
        level: '中级',
        recommendation: '建议申请柴可夫斯基音乐学院预科'
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center">
                <span className="text-white text-xl">♪</span>
              </div>
              <span className="font-bold text-gray-900">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary-700">首页</Link>
              <Link href="/schools" className="text-gray-600 hover:text-primary-700">院校</Link>
              <Link href="/evaluate" className="text-primary-700 font-semibold">AI评估</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎤</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI音乐水平评估</h1>
            <p className="text-gray-500">上传您的演唱音频，获取专业的AI水平分析</p>
          </div>

          {/* 上传区域 */}
          {!result && (
            <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 mb-8">
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📁</span>
                  </div>
                  <p className="text-gray-600 mb-2">点击或拖拽上传音频文件</p>
                  <p className="text-sm text-gray-400">支持 MP3、WAV、M4A 格式，最大 50MB</p>
                </div>
                <input type="file" className="hidden" accept=".mp3,.wav,.m4a" onChange={handleUpload} />
              </label>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-gray-600">正在分析中，请稍候...</p>
            </div>
          )}

          {/* 分析结果 */}
          {result && !loading && (
            <div className="space-y-6">
              {/* 综合评分 */}
              <div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-2xl p-8 text-white text-center">
                <p className="text-white/80 mb-2">综合评分</p>
                <p className="text-6xl font-bold mb-2">{result.overall}</p>
                <p className="text-white/60">分</p>
              </div>

              {/* 分项评分 */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">分项评分</h3>
                <div className="space-y-4">
                  {[
                    { label: '音准', score: result.pitch, color: 'from-green-500 to-green-600' },
                    { label: '节奏', score: result.rhythm, color: 'from-blue-500 to-blue-600' },
                    { label: '音色', score: result.timbre, color: 'from-purple-500 to-purple-600' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold">{item.score}分</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 优势与建议 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-500">✓</span> 优势分析
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-gray-600 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-amber-500">💡</span> 改进建议
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-gray-600 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 留学建议 */}
              <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl p-6 border border-gold-200">
                <h3 className="font-bold text-gray-900 mb-2">🎓 留学建议</h3>
                <p className="text-gray-600">{result.recommendation}</p>
              </div>

              {/* 人工评估入口 */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">需要更专业的评估？</h3>
                <p className="text-gray-600 mb-4">我们的俄罗斯专家团队可为您提供一对一的专业评估服务</p>
                <Link href="/evaluate/apply" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all">
                  申请人工评估
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* 重新评估 */}
              <button onClick={() => { setResult(null); setFile(null) }} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                重新评估
              </button>
            </div>
          )}

          {/* 提示 */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <span className="text-amber-500 text-xl">💡</span>
            <p className="text-sm text-amber-800">提示：AI分析仅供参考，如有疑问可申请人工专业评估</p>
          </div>
        </div>
      </main>
    </div>
  )
}
