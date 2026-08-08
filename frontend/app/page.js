import Link from 'next/link'
import Image from 'next/image'

// 首页服务端获取热门院校
async function getFeaturedSchools() {
  const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'cli_a968b3c219b9dbd3'
  const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || 'JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU'
  const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN || 'CqwBbnJ5xa9SbTsRfGnc3Ar7nLh'
  const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || 'tblommDyseaVLP8Q'
  try {
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET }),
    })
    const tokenData = await tokenRes.json()
    const token = tokenData.tenant_access_token
    const res = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`,
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, cache: 'no-store' }
    )
    const data = await res.json()
    if (data.code !== 0) return []
    return (data.data?.items || []).slice(0, 3).map((item) => {
      const fields = item.fields || {}
      return {
        id: item.record_id,
        name: fields['院校名称（中文名）'] || '',
        name_en: fields['院校名称（英文名）'] || '',
        city: fields['所在城市'] || '',
        ranking: fields['QS排名'] || null,
        description: fields['院校简介'] || '',
      }
    })
  } catch (e) {
    return []
  }
}

export default async function HomePage() {
  const featuredSchools = await getFeaturedSchools()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 - 毛玻璃透明叠加在hero上 */}
      <nav className="nav-hero-fixed">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <span className="text-white text-lg">♪</span>
              </div>
              <span className="font-serif font-bold text-white text-lg tracking-tight">俄罗斯音乐留学</span>
            </Link>
            <div className="flex items-center space-x-7">
              <Link href="/" className="text-white font-medium text-sm border-b border-white/50 pb-0.5">首页</Link>
              <Link href="/schools" className="text-white/80 hover:text-white transition-colors text-sm font-medium">院校</Link>
              <Link href="/sheet-music" className="text-white/80 hover:text-white transition-colors text-sm font-medium">曲库</Link>
              <Link href="/music-history" className="text-white/80 hover:text-white transition-colors text-sm font-medium">音乐史</Link>
              <Link href="/evaluate" className="text-white/80 hover:text-white transition-colors text-sm font-medium">AI评估</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 莫斯科油画风 */}
      <section className="hero-moscow">
        <div className="hero-image-wrapper">
          <Image
            src="/images/hero-bg.jpg"
            alt="莫斯科红场圣瓦西里教堂"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-text-group">
            <p className="hero-russian-title">Музыка — путь к душе</p>
            <h1 className="hero-main-title">
              在莫斯科<br />开启您的<span className="text-amber-300">音乐</span>之旅
            </h1>
            <p className="hero-subtitle">
              从红场到音乐学院，从古典到未来<br className="hidden md:block" />
              您的俄罗斯音乐留学，从这里启程
            </p>
            <div className="hero-buttons">
              <Link href="/schools" className="hero-btn-primary">
                探索院校
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/music-history" className="hero-btn-secondary">
                音乐史地图
              </Link>
            </div>
          </div>
        </div>

        {/* 底部渐隐 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* 音乐史交互地图入口 */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-amber-600 to-amber-800 p-8 flex flex-col justify-center items-center text-white">
                <div className="text-7xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold mb-2 text-center">音乐史交互地图</h3>
                <p className="text-amber-200 text-sm text-center italic mb-6">
                  Interactive Music History Map
                </p>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  50+ 位作曲家 · 32 所院校
                </span>
              </div>
              <div className="md:w-3/5 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">探索俄罗斯音乐版图</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  从莫斯科到圣彼得堡，从柴可夫斯基到肖斯塔科维奇。在交互式地图上，
                  探索俄罗斯音乐的辉煌历史，了解每一位伟大作曲家的生平与作品。
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">🎵</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">50+ 作曲家</p>
                      <p className="text-xs text-gray-500">详细生平与作品</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">🏛️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">32 所院校</p>
                      <p className="text-xs text-gray-500">覆盖全俄罗斯</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">📜</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">956 术语</p>
                      <p className="text-xs text-gray-500">专业音乐词汇</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">🎭</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">歌剧专题</p>
                      <p className="text-xs text-gray-500">深度解析经典</p>
                    </div>
                  </div>
                </div>
                <Link href="/music-history" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium shadow-md">
                  开始探索
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 院校展示 - 莫斯科柴可夫斯基音乐学院 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-hero-gradient-dark p-10 flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="russianPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="#fff"/>
                      <path d="M0 10 L20 10 M10 0 L10 20" stroke="#fff" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#russianPattern)"/>
                  </svg>
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-8xl mb-6 animate-float">🎹</div>
                  <h3 className="text-2xl font-bold mb-2">莫斯科国立</h3>
                  <h3 className="text-2xl font-bold mb-4">柴可夫斯基音乐学院</h3>
                  <p className="text-white/60 text-sm italic mb-6">
                    Tchaikovsky Moscow State Conservatory
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm backdrop-blur-sm">
                    <span className="w-2 h-2 bg-gold-400 rounded-full" />
                    <span>俄罗斯音乐教育的最高殿堂</span>
                  </div>
                </div>
              </div>
              <div className="md:w-3/5 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">莫斯科柴可夫斯基音乐学院</h2>
                  <Link href="/schools/chaikovsky" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-medium shadow-md hover:shadow-lg">
                    查看详情
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-xl border border-primary-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">🎓</span>
                      六大院系
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>钢琴系</li>
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>交响乐系</li>
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>声乐系</li>
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>作曲与音乐学系</li>
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>历史与现代演奏艺术系</li>
                      <li className="flex items-center gap-2"><span className="text-primary-400">✦</span>交响乐与合唱指挥系</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-accent-50 to-white p-5 rounded-xl border border-accent-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">📚</span>
                      32个招生专业
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-center gap-2"><span className="text-accent-400">✦</span>钢琴、管风琴、羽管键琴</li>
                      <li className="flex items-center gap-2"><span className="text-accent-400">✦</span>弦乐、木管、铜管、打击乐</li>
                      <li className="flex items-center gap-2"><span className="text-accent-400">✦</span>作曲、音乐学</li>
                      <li className="flex items-center gap-2"><span className="text-accent-400">✦</span>歌剧表演、交响乐指挥</li>
                      <li className="flex items-center gap-2"><span className="text-accent-400">✦</span>巴洛克时期乐器演奏</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-600">🏆</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        <strong className="text-gray-900">院校简介：</strong>
                        1866年创立，由首任院长尼古拉·鲁宾斯坦创办。彼得·伊里奇·柴可夫斯基本人曾在此任教多年，1940年被授予荣誉称号。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 院校预览 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 title-underline">
              热门院校
            </h2>
            <p className="text-gray-500">精选俄罗斯顶尖音乐学府</p>
          </div>
          {featuredSchools.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {featuredSchools.map((school, index) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.id}`}
                    className="group card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-36 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/5" />
                      <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {school.name.includes('柴可夫斯基') ? '🎹' :
                         school.name.includes('圣彼得堡') ? '🎻' : '🎵'}
                      </span>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-white to-gold-400" />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 text-xs rounded-full font-medium">
                          音乐学院
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                          <span>📍</span> {school.city}
                        </span>
                        {school.ranking && (
                          <span className="px-3 py-1 bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 text-xs rounded-full font-medium flex items-center gap-1">
                            <span>★</span> QS第{school.ranking}名
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">{school.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 italic">{school.name_en}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{school.description}</p>
                      <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                        <span>查看详情</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/schools" className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-700 font-semibold px-8 py-4 rounded-xl hover:bg-primary-600 hover:text-white transition-all bg-white">
                  <span>查看全部院校</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <p className="text-gray-500">加载中...</p>
            </div>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-accent-900 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="footerPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill="#fff"/>
              <path d="M0 15 L30 15 M15 0 L15 30" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#footerPattern)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">♪</span>
              </div>
              <span className="font-bold text-xl">俄罗斯音乐留学平台</span>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm">🇷🇺 专业</span>
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm">📚 权威</span>
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm">🤝 可靠</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              专业音乐留学决策支持平台 | 打破信息不对称
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-accent-500 mx-auto rounded-full mb-4" />
            <p className="text-gray-500 text-xs">
              © 2026 Russia Music Study Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
