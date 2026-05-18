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
