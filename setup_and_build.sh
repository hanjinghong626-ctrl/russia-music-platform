#!/bin/bash
set -e

# 配置 next.config.js
cat > next.config.js << 'EOF'
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: { workerThreads: false, cpus: 1 }
}
module.exports = nextConfig
EOF
cp next.config.js frontend/next.config.js

# 删除 API 路由
rm -rf app/api frontend/app/api

# 更新 schools/page.js
cat > app/schools/page.js << 'SCHOOLS'
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
SCHOOLS
rm -rf "app/schools/[id]"

# composers/[slug]/page.js
mkdir -p "app/music-history/composers/[slug]"
cat > "app/music-history/composers/[slug]/page.js" << 'PAGE'
import { composers } from '../../data/composers';
export async function generateStaticParams() { return composers.map(c => ({ slug: c.id })); }
export default async function Page({ params }) { const { default: ComposerDetail } = await import('./ComposerDetail'); return <ComposerDetail params={params} />; }
PAGE

cat > "app/music-history/composers/[slug]/ComposerDetail.js" << 'DETAIL'
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { composers } from '../../data/composers';
import { relationships } from '../../data/relationships';
export default function ComposerDetail({ params }) {
  const [detail, setDetail] = useState(null);
  const [composer, setComposer] = useState(null);
  const [relatedComposers, setRelatedComposers] = useState([]);
  const [loading, setLoading] = useState(true);
  const slug = params.slug;
  useEffect(() => {
    const basic = composers.find(c => c.id === slug);
    setComposer(basic);
    fetch('/data/composer-details.json').then(r => r.json()).then(data => { setDetail(data.composers?.[slug]); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);
  useEffect(() => {
    if (!slug) return;
    const related = relationships.filter(r => r.from === slug || r.to === slug).map(r => { const other = composers.find(c => c.id === (r.from === slug ? r.to : r.from)); return other ? {...other, relationType: r.type} : null; }).filter(Boolean);
    setRelatedComposers(related);
  }, [slug]);
  if (loading) return <div className="p-20 text-center">加载中...</div>;
  if (!composer) return <div className="p-20 text-center"><h2>未找到</h2><Link href="/music-history/composers">返回</Link></div>;
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4"><Link href="/music-history">← 返回</Link> | <Link href="/music-history/composers">作曲家</Link> | <span>{detail?.name_zh || composer.name}</span></header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">{detail?.name_zh || composer.name}</h1>
        <p className="text-gray-600 mb-4">{composer.nameRu} ({composer.birthYear}–{composer.deathYear})</p>
        <p className="text-gray-700">{detail?.bio_zh || composer.description}</p>
        {relatedComposers.length > 0 && <div className="mt-8"><h2 className="text-xl font-bold mb-4">相关作曲家</h2><div className="grid grid-cols-4 gap-4">{relatedComposers.slice(0,8).map(r => <Link key={r.id} href={"/music-history/composers/"+r.id} className="bg-white p-4 rounded shadow hover:shadow-md">{r.name}</Link>)}</div></div>}
      </main>
    </div>
  );
}
DETAIL

# sheet-music/[slug]/page.js
mkdir -p "app/sheet-music/[slug]"
cat > "app/sheet-music/[slug]/page.js" << 'PAGE'
export async function generateStaticParams() { return [{slug:'tchaikovsky'},{slug:'rachmaninoff'},{slug:'rimsky-korsakov'},{slug:'mussorgsky'},{slug:'borodin'},{slug:'glinka'},{slug:'prokofiev'},{slug:'shostakovich'},{slug:'scriabin'},{slug:'glazunov'},{slug:'taneev'},{slug:'medtner'},{slug:'lyapunov'},{slug:'arensky'}]; }
export default async function Page({ params }) { const { default: SheetMusicClient } = await import('./SheetMusicClient'); return <SheetMusicClient params={params} />; }
PAGE

cat > "app/sheet-music/[slug]/SheetMusicClient.js" << 'CLIENT'
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
CLIENT

# vocal-exercises/[slug]/page.js
mkdir -p "app/sheet-music/vocal-exercises/[slug]"
cat > "app/sheet-music/vocal-exercises/[slug]/page.js" << 'PAGE'
import Link from 'next/link'
const SLUGS=['abt','concone','vaccai','panofka','marchesi','seidler','lutgen','bordogni','lamperti','garcia','lablache','gretchaninoff','rachmaninoff','medtner']
export async function generateStaticParams() { return SLUGS.map(slug=>({slug})); }
async function getData() { try { const r=await fetch(new URL('/data/vocal-exercises.json',process.env.NEXT_PUBLIC_BASE_URL||'http://localhost:3000'),{cache:'force-cache'}); return r.ok?await r.json():{collections:[]}; } catch { return {collections:[]}; } }
export default async function Page({ params }) {
  const data=await getData()
  const c=data.collections?.find(x=>x.id===params.slug)
  if(!c) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div><h1 className="text-2xl">曲目不存在</h1><Link href="/sheet-music/vocal-exercises" className="text-primary-600">← 返回</Link></div></div>
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-700 text-white p-6"><Link href="/sheet-music/vocal-exercises" className="text-white/80 hover:text-white">← 练声曲库</Link><h1 className="text-2xl font-bold mt-2">{c.nameZh}</h1><p className="text-white/70">{c.nameRu}</p><div className="flex gap-4 mt-2 text-sm"><span>作曲家: {c.composerZh}</span><span>难度: {c.difficulty}</span><span>作品数: {c.pieceCount}</span></div></header>
      <main className="container mx-auto px-4 py-8"><p className="text-gray-600 mb-4">{c.description}</p><h2 className="text-xl font-bold mb-4">曲目列表</h2>{c.pieces&&c.pieces.length>0?<table className="w-full bg-white rounded shadow"><thead><tr className="bg-gray-100"><th className="p-2 text-left">#</th><th className="p-2 text-left">标题</th><th className="p-2 text-left">PDF</th></tr></thead><tbody>{c.pieces.map((p,i)=><tr key={p.id||i} className="border-t"><td className="p-2">{i+1}</td><td className="p-2">{p.title}</td><td className="p-2">{p.pdfUrl?<a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600">PDF</a>:'-'}</td></tr>)}</tbody></table>:<p>暂无曲目</p>}</main>
    </div>
  )
}
PAGE

# 同步到 frontend 目录（只复制文件，不复制目录）
cp app/schools/page.js frontend/app/schools/page.js
cp app/music-history/composers/[slug]/page.js frontend/app/music-history/composers/[slug]/page.js
cp app/music-history/composers/[slug]/ComposerDetail.js frontend/app/music-history/composers/[slug]/ComposerDetail.js
cp app/sheet-music/[slug]/page.js frontend/app/sheet-music/[slug]/page.js
cp app/sheet-music/[slug]/SheetMusicClient.js frontend/app/sheet-music/[slug]/SheetMusicClient.js
cp app/sheet-music/vocal-exercises/[slug]/page.js frontend/app/sheet-music/vocal-exercises/[slug]/page.js

echo "Setup complete"
