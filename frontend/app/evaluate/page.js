'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EvaluatePage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    // 验证文件类型
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.caf', '.mov', '.mp4', '.m4v', '.3gp']
    const fileName = uploadedFile.name.toLowerCase()
    const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isValidType) {
      setError('不支持的文件格式，请上传 MP3、WAV、M4A、MOV 等常见音视频格式')
      return
    }

    // 验证文件大小 (200MB)
    if (uploadedFile.size > 200 * 1024 * 1024) {
      setError('文件过大，请上传小于200MB的音视频文件')
      return
    }

    setFile(uploadedFile)
    setLoading(true)
    setResult(null)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('audio', uploadedFile)

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '分析失败，请稍后重试')
      }

      setResult(data)
    } catch (err) {
      console.error('评估错误:', err)
      setError(err.message || '分析过程出现错误，请稍后重试')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const resetEvaluation = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setUploadProgress(0)
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

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="text-red-800 font-medium">上传失败</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* 上传区域 */}
          {!result && !error && (
            <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 mb-8">
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📁</span>
                  </div>
                  {file ? (
                    <>
                      <p className="text-primary-600 font-medium mb-2">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">点击或拖拽上传音视频文件</p>
                      <p className="text-sm text-gray-400">支持 MP3、WAV、M4A、MOV 等常见音视频格式，最大 200MB</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/*,video/*" 
                  onChange={handleUpload}
                  disabled={loading}
                />
              </label>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-gray-600 mb-4">正在分析中，请稍候...</p>
              
              {/* 上传进度条 */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {uploadProgress < 100 ? '上传音频文件...' : 'AI分析中...'}
                </p>
              </div>

              {file && (
                <div className="mt-4 text-sm text-gray-500">
                  已选择: {file.name}
                </div>
              )}
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
                <div className="mt-4 inline-block px-4 py-1 bg-white/20 rounded-full text-sm">
                  {result.level}
                </div>
              </div>

              {/* 分项评分 */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">分项评分</h3>
                <div className="space-y-4">
                  {[
                    { label: '音准', score: result.pitch, color: 'from-green-500 to-green-600', icon: '🎵' },
                    { label: '节奏', score: result.rhythm, color: 'from-blue-500 to-blue-600', icon: '🥁' },
                    { label: '音色', score: result.timbre, color: 'from-purple-500 to-purple-600', icon: '🎤' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.score}分</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 详细分析 */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">详细分析</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="font-medium text-green-800 mb-2">🎵 音准分析</p>
                    <p className="text-sm text-green-700">
                      {result.details?.pitch?.stability || '稳定性良好'}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="font-medium text-blue-800 mb-2">🥁 节奏分析</p>
                    <p className="text-sm text-blue-700">
                      {result.details?.rhythm?.tempo || '节奏感稳定'}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="font-medium text-purple-800 mb-2">🎤 音色分析</p>
                    <p className="text-sm text-purple-700">
                      {result.details?.timbre?.characteristics?.join('、') || '音色良好'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 优势与建议 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-500">✓</span> 优势分析
                  </h3>
                  <ul className="space-y-2">
                    {(result.strengths || []).map((s, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-amber-500">💡</span> 改进建议
                  </h3>
                  <ul className="space-y-2">
                    {(result.suggestions || []).map((s, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 留学建议 */}
              <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl p-6 border border-gold-200">
                <h3 className="font-bold text-gray-900 mb-2">🎓 留学建议</h3>
                <p className="text-gray-700 font-medium mb-1">{result.recommendation}</p>
                <p className="text-gray-600 text-sm mb-2">{result.school}</p>
                <div className="mt-3 p-3 bg-white/60 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">准备建议：</span>
                    {result.preparation}
                  </p>
                </div>
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
              <button 
                onClick={resetEvaluation} 
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>↻</span>
                重新评估
              </button>
            </div>
          )}

          {/* 提示 */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <span className="text-amber-500 text-xl">💡</span>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">温馨提示：</p>
              <p>• 建议上传30秒至2分钟的演唱片段以获得最佳分析效果</p>
              <p>• 音频质量越好，分析结果越准确</p>
              <p>• AI分析仅供参考，如有疑问可申请人工专业评估</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
