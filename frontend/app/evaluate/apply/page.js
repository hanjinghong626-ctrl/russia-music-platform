'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    wechat: '',
    level: '',
    goal: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // 模拟提交
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功</h2>
          <p className="text-gray-600 mb-6">我们将在24小时内通过微信联系您</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center">
              <span className="text-white text-xl">♪</span>
            </div>
            <span className="font-bold text-gray-900">俄罗斯音乐留学</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">申请人工评估</h1>
            <p className="text-gray-500">由俄罗斯剧院演员、音乐学院教授提供专业评估</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号 *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="请输入手机号"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">微信号 *</label>
                <input
                  type="text"
                  required
                  value={form.wechat}
                  onChange={(e) => setForm({...form, wechat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="请输入微信号"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">演唱水平</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({...form, level: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="">请选择</option>
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                  <option value="professional">专业</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标院校</label>
                <input
                  type="text"
                  value={form.goal}
                  onChange={(e) => setForm({...form, goal: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="例如：莫斯科柴可夫斯基音乐学院"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">补充说明</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="请描述您的学习背景、评估需求等"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50"
                >
                  {loading ? '提交中...' : '提交申请'}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                咨询费用：¥299/次 | 24小时内客服联系您
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
