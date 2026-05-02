import Link from 'next/link'

// 首页服务端获取热门院校
async function getFeaturedSchools() {
  const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'cli_a968b3c219b9dbd3'
  const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || 'JkpPVLK9IySp24RawJ4ASgfgKX8GjLGU'
  const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN || 'CqwBbnJ5xa9SbTsRfGnc3Ar7nLh'
  const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || 'tblommDyseaVLP8Q'

  try {
    // 获取 token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    })
    const tokenData = await tokenRes.json()
    const token = tokenData.tenant_access_token

    // 获取院校列表
    const res = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    const data = await res.json()
    
    if (data.code !== 0) return []

    // 只取前3个
    return (data.data?.items || []).slice(0, 3).map((item, index) => {
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
    <div className="min-h-screen bg-white">
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
              <Link href="/music-history-map" className="text-gray-600 hover:text-gray-900">音乐史交互地图</Link>
              <Link href="/evaluate" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                AI评估
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            开启您的音乐之旅
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            汇聚俄罗斯顶尖音乐学院，提供专业的留学申请服务，让您的音乐梦想在这里起航
          </p>
          <Link
            href="/schools"
            className="inline-block bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            浏览院校
          </Link>
        </div>
      </section>

      {/* 音乐史交互地图入口 */}
      <section className="py-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
            <div className="md:flex items-center">
              <div className="md:w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 flex flex-col justify-center items-center text-white min-h-[200px]">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-center">音乐史交互地图</h3>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">探索俄罗斯音乐发展脉络</h2>
                    <p className="text-gray-600 mb-4">
                      50位作曲家的交互式时空之旅，从格林卡到肖斯塔科维奇，跨越三个世纪的俄罗斯音乐史诗
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">🕐 8个历史时期</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">🎵 50位作曲家</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">📍 9座城市</span>
                    </div>
                  </div>
                  <Link
                    href="/music-history-map"
                    className="flex-shrink-0 ml-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-md"
                  >
                    立即探索 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特点区域 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择俄罗斯音乐留学
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-semibold text-gray-900 mb-2">顶尖院校</h3>
              <p className="text-gray-600 text-sm">柴可夫斯基音乐学院、圣彼得堡音乐学院等世界名校</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">费用实惠</h3>
              <p className="text-gray-600 text-sm">相比欧美国家，留学费用更加经济实惠</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="font-semibold text-gray-900 mb-2">专业培养</h3>
              <p className="text-gray-600 text-sm">严谨的音乐教育体系，注重实践与表演</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">文化体验</h3>
              <p className="text-gray-600 text-sm">深度体验俄罗斯丰富的音乐与艺术文化</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI评估入口 */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              🤖 新功能上线
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">免费AI声乐水平评估</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              上传您的演唱音频，AI将分析音准、节奏、音色，并给出俄罗斯留学适配度评估
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI自动评估（免费）</h3>
                  <p className="text-sm text-gray-500">即时分析</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center"><span className="mr-2 text-green-500">✓</span> 音准分析</li>
                <li className="flex items-center"><span className="mr-2 text-green-500">✓</span> 节奏分析</li>
                <li className="flex items-center"><span className="mr-2 text-green-500">✓</span> 音色评估</li>
                <li className="flex items-center"><span className="mr-2 text-green-500">✓</span> 留学适配建议</li>
              </ul>
              <Link
                href="/evaluate"
                className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                立即免费评估
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">俄罗斯专家评估（付费）</h3>
                  <p className="text-sm text-gray-500">24h内微信对接</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center"><span className="mr-2 text-amber-500">✓</span> 声乐技术细节</li>
                <li className="flex items-center"><span className="mr-2 text-amber-500">✓</span> 咬字与语言正音</li>
                <li className="flex items-center"><span className="mr-2 text-amber-500">✓</span> 情感表达指导</li>
                <li className="flex items-center"><span className="mr-2 text-amber-500">✓</span> 个性化学习规划</li>
              </ul>
              <Link
                href="/evaluate?tab=human"
                className="block text-center border-2 border-amber-600 text-amber-600 py-2.5 rounded-lg hover:bg-amber-50 transition-colors font-medium"
              >
                申请专家评估 ¥299
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 莫斯科柴可夫斯基音乐学院专题 */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-center items-center text-white">
                <div className="text-7xl mb-4">🎹</div>
                <h3 className="text-2xl font-bold mb-2 text-center">莫斯科国立</h3>
                <h3 className="text-2xl font-bold mb-4 text-center">柴可夫斯基音乐学院</h3>
                <p className="text-primary-200 text-sm text-center italic mb-6">
                  Tchaikovsky Moscow State Conservatory
                </p>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">
                  俄罗斯音乐教育的最高殿堂
                </span>
              </div>
              <div className="md:w-3/5 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">莫斯科柴可夫斯基音乐学院</h2>
                  <Link
                    href="/schools/chaikovsky"
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    查看详情 →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-2 text-sm">🎓</span>
                      六大院系
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• 钢琴系</li>
                      <li>• 交响乐系</li>
                      <li>• 声乐系</li>
                      <li>• 作曲与音乐学系</li>
                      <li>• 历史与现代演奏艺术系</li>
                      <li>• 交响乐与合唱指挥系</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-2 text-sm">📚</span>
                      32个招生专业
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• 钢琴、管风琴、羽管键琴</li>
                      <li>• 弦乐、木管、铜管、打击乐</li>
                      <li>• 作曲、音乐学</li>
                      <li>• 歌剧表演、交响乐指挥</li>
                      <li>• 巴洛克时期乐器演奏</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">院校简介：</strong>
                    1866年创立，由首任院长尼古拉·鲁宾斯坦创办。彼得·伊里奇·柴可夫斯基本人曾在此任教多年，1940年被授予荣誉称号。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 院校预览 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            热门院校
          </h2>
          {featuredSchools.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredSchools.map((school) => (
                  <Link 
                    key={school.id} 
                    href={`/schools/${school.id}`}
                    className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-6xl">
                        {school.name.includes('柴可夫斯基') ? '🎹' : 
                         school.name.includes('圣彼得堡') ? '🎻' : '🎵'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                          音乐学院
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          📍 {school.city}
                        </span>
                        {school.ranking && (
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                            QS第{school.ranking}名
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{school.name_en}</p>
                      <p className="text-sm text-gray-600">{school.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/schools"
                  className="inline-block border-2 border-primary-600 text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  查看全部院校
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">加载中...</p>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🎵</span>
            <span className="font-bold">俄罗斯音乐留学平台</span>
          </div>
          <p className="text-gray-400 text-sm">
            专业音乐留学决策支持平台 | 打破信息不对称
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 Russia Music Study Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
