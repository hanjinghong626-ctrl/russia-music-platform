'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/data/schools.json').then(r => r.json()).then(d => { setSchools(d.schools || []); setLoading(false) }).catch(() => setLoading(false)) }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4"><div className="container mx-auto flex items-center justify-between"><span className="text-2xl">🎵</span><div className="flex gap-6"><Link href="/" className="text-gray-600">首页</Link><Link href="/schools" className="text-primary-600 font-medium">院校</Link></div></div></nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">俄罗斯音乐学派</h1>
        <p className="text-gray-600 mb-6">了解俄罗斯各大音乐学派的历史、传承与特色</p>
        {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div></div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{schools.map(s => <div key={s.id} className="bg-white rounded-xl shadow-sm p-6"><div className="flex items-center gap-3 mb-4"><span className="text-4xl">{s.icon}</span><div><h3 className="text-xl font-bold">{s.name_zh}</h3><p className="text-sm text-gray-500">{s.name_ru}</p></div></div><p className="text-gray-600 text-sm line-clamp-3">{s.overview}</p></div>)}</div>}
      </main>
    </div>
  )
}
