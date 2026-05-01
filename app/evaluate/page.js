'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

export default function EvaluatePage() {
  const [activeTab, setActiveTab] = useState('ai') // 'ai' | 'human'
  const [audioFile, setAudioFile] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [audioContext, setAudioContext] = useState(null)
  const [audioFeatures, setAudioFeatures] = useState(null)
  
  // 人工评估表单状态
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wechat: '',
    email: '',
    audio_level: '',
    target_school: '',
    description: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  // 处理文件上传
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      setError('请上传音频文件（MP3、WAV、M4A等）')
      return
    }
    
    // 验证文件大小（最大50MB）
    if (file.size > 50 * 1024 * 1024) {
      setError('文件过大，请上传小于50MB的音频')
      return
    }
    
    setAudioFile(file)
    setAudioUrl(URL.createObjectURL(file))
    setResults(null)
    setError(null)
    setAudioFeatures(null)
  }

  // 使用 Web Audio API 提取音频特征
  const extractAudioFeatures = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)()
          const arrayBuffer = e.target.result
          
          // 解码音频
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
          
          // 获取原始音频数据
          const rawData = audioBuffer.getChannelData(0)
          
          // 计算特征
          const features = calculateFeatures(rawData, audioBuffer.sampleRate)
          
          setAudioContext(ctx)
          setAudioFeatures(features)
          
          resolve(features)
        } catch (err) {
          reject(err)
        }
      }
      
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }, [])

  // 计算音频特征
  function calculateFeatures(rawData, sampleRate) {
    const bufferLength = rawData.length
    const duration = bufferLength / sampleRate
    
    // 计算 RMS（均方根）
    let sumSquares = 0
    let peak = 0
    for (let i = 0; i < bufferLength; i++) {
      const val = rawData[i]
      sumSquares += val * val
      peak = Math.max(peak, Math.abs(val))
    }
    const rms = Math.sqrt(sumSquares / bufferLength)
    
    // FFT 分析
    const fftSize = 2048
    const fftData = new Float32Array(fftSize)
    const hopSize = fftSize / 2
    
    // 简化的频谱分析
    let lowFreq = 0, midFreq = 0, highFreq = 0
    for (let i = 0; i < bufferLength; i += hopSize) {
      for (let j = 0; j < fftSize && i + j < bufferLength; j++) {
        fftData[j] = rawData[i + j]
      }
      // 简化频段计算
      const binSize = sampleRate / fftSize
      const lowEnd = Math.floor(300 / binSize)
      const midEnd = Math.floor(2000 / binSize)
      
      for (let k = 0; k < fftSize / 2; k++) {
        const mag = Math.abs(fftData[k])
        if (k < lowEnd) lowFreq += mag
        else if (k < midEnd) midFreq += mag
        else highFreq += mag
      }
    }
    
    // 归一化
    const total = lowFreq + midFreq + highFreq || 1
    const spectralBalance = {
      low: lowFreq / total,
      mid: midFreq / total,
      high: highFreq / total
    }
    
    // 估算基频
    const pitchEstimate = estimatePitch(rawData, sampleRate)
    
    return {
      duration: Math.round(duration * 10) / 10,
      sampleRate,
      rms: Math.round(rms * 1000) / 1000,
      peak: Math.round(peak * 1000) / 1000,
      spectralBalance,
      estimatedPitch: pitchEstimate,
      totalSamples: bufferLength
    }
  }

  // 估算基频
  function estimatePitch(data, sampleRate) {
    // 简化的基频检测
    const minPeriod = Math.floor(sampleRate / 800) // 最高800Hz
    const maxPeriod = Math.floor(sampleRate / 80)  // 最低80Hz
    
    let bestCorrelation = 0
    let bestPeriod = 0
    
    // 检查前10000样本
    const checkLength = Math.min(10000, data.length - maxPeriod)
    
    for (let period = minPeriod; period < maxPeriod; period++) {
      let correlation = 0
      for (let i = 0; i < checkLength; i++) {
        correlation += data[i] * data[i + period]
      }
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestPeriod = period
      }
    }
    
    if (bestPeriod > 0) {
      const frequency = sampleRate / bestPeriod
      return {
        frequency: Math.round(frequency),
        note: frequencyToNote(frequency)
      }
    }
    
    return { frequency: 0, note: '未检测到' }
  }

  // 频率转音符
  function frequencyToNote(freq) {
    if (freq < 80) return '未检测到有效音高'
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const semitone = 12 * Math.log2(freq / 440)
    const noteIndex = Math.round(semitone + 9) % 12
    const octave = Math.floor((Math.round(semitone + 9) / 12) + 4)
    return notes[noteIndex < 0 ? noteIndex + 12 : noteIndex] + octave
  }

  // 开始分析
  const handleAnalyze = async () => {
    if (!audioFile) {
      setError('请先上传音频文件')
      return
    }
    
    setAnalyzing(true)
    setError(null)
    
    try {
      // 先提取特征
      const features = await extractAudioFeatures(audioFile)
      
      // 发送到后端API
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('type', 'vocal')
      formData.append('features', JSON.stringify(features))
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '分析失败')
      }
      
      setResults({
        ...data.analysis,
        audio_features: features
      })
      
    } catch (err) {
      setError(err.message || '分析过程出错，请重试')
    } finally {
      setAnalyzing(false)
    }
  }

  // 提交人工评估申请
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/human-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '提交失败')
      }
      
      setFormSuccess(true)
      setFormData({
        name: '',
        phone: '',
        wechat: '',
        email: '',
        audio_level: '',
        target_school: '',
        description: ''
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setFormSubmitting(false)
    }
  }

  // 渲染评分条
  const ScoreBar = ({ label, score, color = 'bg-primary-500' }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{score}分</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-gray-900">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <Link href="/schools" className="text-gray-600 hover:text-gray-900">院校</Link>
              <Link href="/evaluate" className="text-primary-600 font-medium">AI评估</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">🎤 专业声乐水平评估</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            免费AI评估 + 俄罗斯专家人工点评，助您精准定位留学方向
          </p>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'ai' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🤖 AI自动评估（免费）
            </button>
            <button
              onClick={() => setActiveTab('human')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'human' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👨‍🏫 俄罗斯专家评估（付费）
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'ai' ? (
          /* AI 评估区域 */
          <div className="max-w-3xl mx-auto">
            {/* 上传区域 */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">上传您的演唱音频</h2>
              
              {/* 文件上传 */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {audioUrl ? (
                  <div className="space-y-4">
                    <div className="text-4xl">🎵</div>
                    <p className="text-gray-700 font-medium">{audioFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(audioFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setAudioFile(null)
                        setAudioUrl(null)
                        setResults(null)
                      }}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-5xl">📤</div>
                    <p className="text-gray-700">点击或拖拽上传音频文件</p>
                    <p className="text-sm text-gray-500">支持 MP3, WAV, M4A, FLAC 格式，最大 50MB</p>
                  </div>
                )}
              </div>

              {/* 音频预览 */}
              {audioUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <audio 
                    ref={audioRef}
                    src={audioUrl} 
                    controls 
                    className="w-full"
                  />
                </div>
              )}

              {/* 本地特征预览 */}
              {audioFeatures && !results && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📊 音频特征分析</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">时长：</span>
                      <span className="font-medium">{audioFeatures.duration}秒</span>
                    </div>
                    <div>
                      <span className="text-blue-600">RMS：</span>
                      <span className="font-medium">{audioFeatures.rms}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">峰值：</span>
                      <span className="font-medium">{audioFeatures.peak}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">估算音高：</span>
                      <span className="font-medium">{audioFeatures.estimatedPitch?.note || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 错误提示 */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* 分析按钮 */}
              <button
                onClick={handleAnalyze}
                disabled={!audioFile || analyzing}
                className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                  !audioFile || analyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {analyzing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    分析中...
                  </span>
                ) : '开始AI分析'}
              </button>
            </div>

            {/* 结果展示 */}
            {results && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">📋 评估结果</h2>
                  <span className="text-sm text-gray-500">
                    分析时间: {new Date(results.analyzed_at).toLocaleString('zh-CN')}
                  </span>
                </div>

                {/* 总分展示 */}
                <div className="text-center py-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-6">
                  <div className="text-6xl font-bold text-primary-600">{results.score}</div>
                  <div className="text-gray-600 mt-2">综合评分</div>
                  <div className="mt-4 text-sm text-gray-500">
                    {results.score >= 80 ? '🎓 达到专业院校报考水平' : 
                     results.score >= 60 ? '📈 具有一定基础，建议继续提升' : 
                     '💪 建议加强基础训练'}
                  </div>
                </div>

                {/* 分项评分 */}
                <div className="mb-6">
                  <ScoreBar label="🎵 音准分析" score={results.pitch_score} color="bg-blue-500" />
                  <ScoreBar label="🥁 节奏分析" score={results.rhythm_score} color="bg-green-500" />
                  <ScoreBar label="🎭 音色分析" score={results.timbre_score} color="bg-purple-500" />
                </div>

                {/* 优势与不足 */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-3">✨ 优势</h3>
                    <ul className="space-y-2">
                      {results.strengths?.map((item, idx) => (
                        <li key={idx} className="text-green-700 text-sm flex items-start">
                          <span className="mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-bold text-amber-800 mb-3">📝 提升空间</h3>
                    <ul className="space-y-2">
                      {results.weaknesses?.map((item, idx) => (
                        <li key={idx} className="text-amber-700 text-sm flex items-start">
                          <span className="mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 改进建议 */}
                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">💡 专业改进建议</h3>
                  <ul className="space-y-2">
                    {results.suggestions?.map((item, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span className="mr-2 text-primary-500">{idx + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 留学适配 */}
                <div className="p-4 bg-primary-50 rounded-lg mb-6">
                  <h3 className="font-bold text-primary-800 mb-2">🎓 俄罗斯留学适配度</h3>
                  <p className="text-primary-700 text-sm mb-3">{results.russia_fit}</p>
                  <div className="flex flex-wrap gap-2">
                    {results.suitable_schools?.map((school, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {school}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 音频信息 */}
                {results.audio_info && (
                  <div className="text-xs text-gray-400 border-t pt-4">
                    <p>音频信息：时长 {results.audio_info.duration}秒 | 采样率 {results.audio_info.sample_rate}Hz | 格式 {results.audio_info.format}</p>
                  </div>
                )}

                {/* 人工评估引导 */}
                <div className="mt-6 p-4 border border-dashed border-primary-300 rounded-lg text-center">
                  <p className="text-gray-600 mb-3">想要获得俄罗斯专家的专业点评？</p>
                  <button
                    onClick={() => setActiveTab('human')}
                    className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    申请人工评估
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 人工评估区域 */
          <div className="max-w-2xl mx-auto">
            {/* 说明 */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">👨‍🏫 俄罗斯专家人工评估</h2>
              <div className="prose prose-sm text-gray-600">
                <p className="mb-4">
                  由具有丰富教学经验的俄罗斯音乐学院教授或资深声乐教师进行专业评估，提供：
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>声乐技术细节分析</li>
                  <li>咬字与语言正音指导</li>
                  <li>情感表达与艺术处理建议</li>
                  <li>个性化学习路径规划</li>
                  <li>目标院校报考建议</li>
                </ul>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="font-medium text-primary-800">💰 费用：¥299/次</p>
                  <p className="text-sm text-primary-600 mt-1">提交申请后，24小时内客服将与您微信对接</p>
                </div>
              </div>
            </div>

            {/* 申请表单 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {formSuccess ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">申请已提交！</h3>
                  <p className="text-gray-600 mb-4">
                    我们将在24小时内添加您的微信，请注意查收
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    继续申请
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        手机号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="11位手机号"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        微信号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.wechat}
                        onChange={(e) => setFormData({...formData, wechat: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="方便客服添加"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="选填"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      当前演唱水平 <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.audio_level}
                      onChange={(e) => setFormData({...formData, audio_level: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="beginner">初学（1年以下）</option>
                      <option value="intermediate">中级（1-3年）</option>
                      <option value="advanced">高级（3-5年）</option>
                      <option value="professional">专业水平（5年以上）</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      目标院校
                    </label>
                    <input
                      type="text"
                      value={formData.target_school}
                      onChange={(e) => setFormData({...formData, target_school: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="如：莫斯科柴可夫斯基音乐学院"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      其他说明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="可以描述您的学习经历、演唱风格或想咨询的问题"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      formSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {formSubmitting ? '提交中...' : '提交评估申请'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    提交即表示同意我们的服务条款，客服将在24小时内联系您
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部 */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 俄罗斯音乐留学平台 · 专业声乐水平评估</p>
        </div>
      </footer>
    </div>
  )
}
