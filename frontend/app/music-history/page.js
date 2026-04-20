'use client';

import { useState } from 'react';
import Link from 'next/link';

// 时间轴数据
const timelineItems = [
  {
    id: '1',
    period: '18世纪前',
    title: '俄罗斯音乐的根基',
    subtitle: '东正教圣咏与民间传统',
    era: '奠基时期',
    summary: '追溯至公元988年东正教传入基辅罗斯，音乐传统塑造了俄罗斯音乐独特的民族性格',
    highlights: ['东正教圣咏', '兹纳缅内记谱法', '民歌口头传承'],
    keyFigures: ['博尔特尼扬斯基', '别列佐夫斯基']
  },
  {
    id: '2',
    period: '18世纪',
    title: '西风东渐',
    subtitle: '俄罗斯音乐的启蒙时代',
    era: '启蒙时代',
    summary: '彼得大帝全盘西化政策推动下，意大利歌剧、德国交响乐相继传入俄罗斯',
    highlights: ['意大利歌剧', '贵族音乐教育', '俄语歌剧萌芽'],
    keyFigures: ['法伊科', '达维多夫斯基']
  },
  {
    id: '3',
    period: '19世纪上半叶',
    title: '民族觉醒',
    subtitle: '格林卡与俄罗斯乐派的诞生',
    era: '民族觉醒',
    summary: '米哈伊尔·格林卡以卓越才华和坚定民族信念，确立俄罗斯民族音乐基本范式',
    highlights: ['格林卡', '《伊万·苏萨宁》', '《卡玛林斯卡亚》'],
    keyFigures: ['格林卡']
  },
  {
    id: '4',
    period: '19世纪下半叶',
    title: '黄金时代',
    subtitle: '强力集团与柴可夫斯基',
    era: '黄金时代',
    summary: '俄罗斯古典音乐的辉煌时期，强力集团与柴可夫斯基双峰并峙',
    highlights: ['强力集团', '柴可夫斯基', '《天鹅湖》'],
    keyFigures: ['穆索尔斯基', '鲍罗丁', '柴可夫斯基']
  },
  {
    id: '5',
    period: '19世纪末-20世纪初',
    title: '白银时代',
    subtitle: '拉赫玛尼诺夫与俄罗斯音乐的转型',
    era: '白银时代',
    summary: '斯克里亚宾神秘主义美学与拉赫玛尼诺夫抒情主义的双重辉煌',
    highlights: ['斯克里亚宾', '拉赫玛尼诺夫', '俄罗斯芭蕾舞团'],
    keyFigures: ['斯克里亚宾', '拉赫玛尼诺夫', '佳吉列夫']
  },
  {
    id: '6',
    period: '20世纪',
    title: '苏维埃之声',
    subtitle: '肖斯塔科维奇与苏联音乐',
    era: '苏维埃时期',
    summary: '在社会主义现实主义框架内，作曲家们创造了举世瞩目的艺术成就',
    highlights: ['肖斯塔科维奇', '普罗科菲耶夫', '《列宁格勒交响曲》'],
    keyFigures: ['肖斯塔科维奇', '普罗科菲耶夫', '哈恰图良']
  },
  {
    id: '7',
    period: '当代',
    title: '传承与新生',
    subtitle: '俄罗斯音乐的当代发展',
    era: '当代发展',
    summary: '苏联解体后，俄罗斯音乐在挑战与机遇中寻求新的发展道路',
    highlights: ['施尼特凯', '古拜杜丽娜', '俄罗斯钢琴学派'],
    keyFigures: ['施尼特凯', '古拜杜丽娜', '帕尔特']
  }
];

// 音符装饰SVG
const MusicalNote = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

// 五线谱装饰SVG
const StaffLines = ({ className }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1">
    <line x1="0" y1="10" x2="100" y2="10"/>
    <line x1="0" y1="20" x2="100" y2="20"/>
    <line x1="0" y1="30" x2="100" y2="30"/>
    <line x1="0" y1="40" x2="100" y2="40"/>
    <line x1="0" y1="50" x2="100" y2="50"/>
  </svg>
);

export default function MusicHistoryPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* 顶部装饰 */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
        {/* 背景装饰 - 五线谱 */}
        <div className="absolute inset-0 opacity-10">
          <StaffLines className="w-full h-full" />
        </div>
        
        {/* 浮动音符装饰 */}
        <MusicalNote className="absolute top-10 left-10 w-8 h-8 text-gold-400 animate-float opacity-40" />
        <MusicalNote className="absolute top-20 right-20 w-6 h-6 text-gold-300 animate-float opacity-30" style={{ animationDelay: '1s' }} />
        <MusicalNote className="absolute bottom-20 left-1/4 w-5 h-5 text-gold-400 animate-float opacity-35" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center gap-3 mb-4">
            <MusicalNote className="w-8 h-8 text-gold-400" />
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wider">
              俄罗斯音乐史
            </h1>
            <MusicalNote className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            从东正教圣咏到当代新作 · 跨越千年的音乐之旅
          </p>
          <div className="mt-4 flex items-center gap-2 text-gold-300 text-sm">
            <span className="w-12 h-px bg-gold-400/50"></span>
            <span>七个历史时期 · 七段辉煌篇章</span>
            <span className="w-12 h-px bg-gold-400/50"></span>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 引言 */}
        <div className="text-center mb-12">
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            俄罗斯古典音乐拥有深厚的历史底蕴，从公元988年东正教传入基辅罗斯开始，历经千年发展，
            孕育了格林卡、柴可夫斯基、拉赫玛尼诺夫、肖斯塔科维奇等享誉世界的音乐大师。
            探索这七个辉煌时期，深入了解俄罗斯音乐的灵魂与精神。
          </p>
        </div>

        {/* 时间轴容器 */}
        <div className="relative">
          {/* 竖线 */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 via-primary-500 to-accent-600 transform md:-translate-x-1/2"></div>

          {/* 时间轴项目 */}
          <div className="space-y-8 md:space-y-12">
            {timelineItems.map((item, index) => (
              <div 
                key={item.id}
                className={`relative ${index % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'} ${
                  activeIndex === index ? 'scale-[1.02]' : ''
                } transition-all duration-300`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* 连接线 */}
                <div className={`absolute top-8 w-8 md:w-16 h-0.5 bg-gradient-to-r ${
                  index % 2 === 0 
                    ? 'from-primary-500 to-transparent md:left-auto md:right-[calc(50%+2rem)]' 
                    : 'from-transparent to-primary-500 md:right-auto md:left-[calc(50%+2rem)]'
                }`}></div>

                {/* 节点圆点 */}
                <div className={`absolute left-4 md:left-1/2 top-8 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 border-4 border-white shadow-lg transform -translate-x-1/2 z-10 flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>

                {/* 内容卡片 */}
                <div className={`ml-20 md:ml-0 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="p-6">
                    {/* 时期标签 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                        {item.period}
                      </span>
                      <span className="px-3 py-1 bg-gold-100 text-gold-700 text-sm font-medium rounded-full">
                        {item.era}
                      </span>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-xl md:text-2xl font-bold text-stone-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-stone-500 mb-4">{item.subtitle}</p>

                    {/* 简介 */}
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                      {item.summary}
                    </p>

                    {/* 亮点标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.highlights.map((highlight, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded border border-stone-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* 代表人物 */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-stone-400 text-sm">代表人物：</span>
                      <span className="text-stone-600 text-sm">{item.keyFigures.join('、')}</span>
                    </div>

                    {/* 阅读按钮 */}
                    <Link 
                      href={`/music-history/${item.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg group"
                    >
                      <span>阅读全文</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* 卡片底部装饰条 */}
                  <div className={`h-1.5 bg-gradient-to-r ${
                    index % 3 === 0 
                      ? 'from-primary-500 to-primary-600' 
                      : index % 3 === 1 
                        ? 'from-accent-500 to-accent-600' 
                        : 'from-gold-500 to-gold-600'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部终点装饰 */}
          <div className="absolute left-8 md:left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 border-4 border-white shadow-lg flex items-center justify-center">
              <MusicalNote className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 底部总结 */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl shadow-elegant">
            <MusicalNote className="w-6 h-6 text-primary-600" />
            <p className="text-stone-600">
              俄罗斯音乐历经千年发展，从东正教圣咏到当代新作，
              <br className="hidden md:block" />
              形成了独特而深厚的民族传统，至今仍在世界音乐舞台上闪耀光芒。
            </p>
            <MusicalNote className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* 返回首页链接 */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回首页</span>
        </Link>
      </div>
    </div>
  );
}
