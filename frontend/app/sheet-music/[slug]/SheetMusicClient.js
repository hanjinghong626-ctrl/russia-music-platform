'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
const VOICE_FILTERS = [{id:'all',label:'全部'},{id:'solo',label:'独唱'},{id:'ensemble',label:'重唱/合唱'}]
const TAG_FILTERS = [{id:'all',label:'全部'},{id:'transpose',label:'🔄'},{id:'allkeys',label:'🎹'}]
function getVoiceCategory(vt) { if(!vt) return 'solo'; const v=vt.toLowerCase(); return v.includes('дуэт')||v.includes('хор')||v.includes('ансамбль')?'ensemble':'solo'; }
export default function SheetMusicClient() {
  const params = useParams()
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)
  const [voiceFilter, setVoiceFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [search, setSearch] = useState('')
  useEffect(() => { fetch('/data/core-composers-works.json').then(r=>r.json()).then(d=>{setComposers(d.composers||[]);setLoading(false)}).catch(()=>setLoading(false)) }, [])
  const composer = useMemo(() => composers.find(c=>c.slug===params.slug)||null, [composers,params.slug])
  const filtered = useMemo(() => {
    if(!composer) return []
    let works = composer.works||[]
    if(voiceFilter!=='all') works=works.filter(w=>getVoiceCategory(w.voice_type)===voiceFilter)
    if(tagFilter==='transpose') works=works.filter(w=>w.has_transposition)
    else if(tagFilter==='allkeys') works=works.filter(w=>w.has_all_keys)
    if(search.trim()) { const q=search.toLowerCase(); works=works.filter(w=>w.title.toLowerCase().includes(q)||(w.poet&&w.poet.toLowerCase().includes(q))) }
    return works
  }, [composer,voiceFilter,tagFilter,search])
  if(loading) return <div className="p-20 text-center">加载中...</div>
  if(!composer) return <div className="p-20 text-center"><h2>未找到</h2><Link href="/sheet-music">返回曲库</Link></div>
  let idx=0
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-700 text-white p-6"><Link href="/sheet-music" className="text-white/80 hover:text-white">← 返回曲库</Link><h1 className="text-2xl font-bold mt-2">{composer.name_cn}</h1><p className="text-white/70">{composer.name_ru}</p><p className="text-sm mt-1">共 {composer.works?.length||0} 首作品</p></header>
      <div className="p-4 bg-white border-b flex gap-4 flex-wrap">{VOICE_FILTERS.map(f=><button key={f.id} className={`px-4 py-2 rounded ${voiceFilter===f.id?'bg-primary-600 text-white':'bg-gray-100'}`} onClick={()=>setVoiceFilter(f.id)}>{f.label}</button>)}<span className="border-l"></span>{TAG_FILTERS.map(f=><button key={f.id} className={`px-4 py-2 rounded ${tagFilter===f.id?'bg-primary-600 text-white':'bg-gray-100'}`} onClick={()=>setTagFilter(f.id)}>{f.label}</button>)}<input type="text" placeholder="搜索..." value={search} onChange={e=>setSearch(e.target.value)} className="px-4 py-2 border rounded"/></div>
      <main className="container mx-auto px-4 py-8"><p className="mb-4">显示 {filtered.length}/{composer.works?.length||0} 首</p>{filtered.map(w=><div key={w.opus+'-'+w.title} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center"><div><h3 className="font-medium">{++idx}. {w.title}</h3>{w.poet&&<p className="text-sm text-gray-500">{w.poet}</p>}</div><div>{w.pdf_urls&&w.pdf_urls[0]&&<a href={w.pdf_urls[0].url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">📄 乐谱</a>}</div></div>)}</main>
    </div>
  )
}
