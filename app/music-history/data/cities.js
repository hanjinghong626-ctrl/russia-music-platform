export const cities = [
  {
    id: 'moscow',
    name: '莫斯科',
    nameRu: 'Москва',
    nameEn: 'Moscow',
    description: '俄罗斯音乐文化的核心之城。莫斯科音乐学院培养了柴可夫斯基、斯克里亚宾、拉赫玛尼诺夫等大师；大剧院见证了无数歌剧与芭蕾的辉煌首演。',
    descriptionRu: 'Сердце русской музыкальной культуры. Московская консерватория воспитала Чайковского, Скрябина, Рахманинова; Большой театр видел премьеры великих опер и балетов.',
    image: '/cities/moscow.png',
    musicLandmarks: [
      { name: '莫斯科音乐学院', nameRu: 'Московская консерватория', desc: '1866年创立，俄罗斯最高音乐学府，柴可夫斯基曾在此任教' },
      { name: '大剧院', nameRu: 'Большой театр', desc: '世界顶级歌剧芭蕾剧院，《叶甫盖尼·奥涅金》《天鹅湖》首演于此' },
      { name: '柴可夫斯基音乐厅', nameRu: 'Концертный зал имени Чайковского', desc: '莫斯科爱乐乐团驻地，以卓越声学著称' },
      { name: '格林卡音乐文化博物馆', nameRu: 'Всероссийское музейное объединение музыкальной культуры им. М.И.Глинки', desc: '收藏俄罗斯最丰富的音乐文物' }
    ],
    coords: [55.7558, 37.6173],
    composers: ['tchaikovsky', 'scriabin', 'rakhmaninov', 'shostakovich', 'prokofiev', 'myaskovsky', 'nikolai_rubinstein']
  },
  {
    id: 'stpetersburg',
    name: '圣彼得堡',
    nameRu: 'Санкт-Петербург',
    nameEn: 'Saint Petersburg',
    description: '俄罗斯音乐的摇篮。格林卡在此开创俄罗斯歌剧传统，强力集团在此改写音乐史，斯特拉文斯基从这里走向世界。白夜之城，音符流淌在涅瓦河畔。',
    descriptionRu: 'Колыбель русской музыки. Глинка открыл русскую оперную традицию, Могучая кучка переписала историю музыки, Стравинский отсюда вышел на мировую арену.',
    image: '/cities/stpetersburg.png',
    musicLandmarks: [
      { name: '马林斯基剧院', nameRu: 'Мариинский театр', desc: '俄罗斯歌剧与芭蕾的圣殿，《鲍里斯·戈杜诺夫》《火鸟》首演于此' },
      { name: '圣彼得堡音乐学院', nameRu: 'Санкт-Петербургская консерватория', desc: '1862年创立，俄罗斯第一所音乐学院，强力集团成员曾在此任教' },
      { name: '爱乐大厅', nameRu: 'Большой зал Петербургской филармонии', desc: '俄罗斯最古老的音乐厅，肖斯塔科维奇在此首演多部交响曲' },
      { name: '冬宫/艾尔米塔什', nameRu: 'Эрмитаж', desc: '帝国时代的音乐生活中心，宫廷音乐会与歌剧首演的举办地' }
    ],
    coords: [59.9343, 30.3351],
    composers: ['glinka', 'mussorgsky', 'rimsky_korsakov', 'borodin', 'cui', 'balakirev', 'stravinsky', 'glazunov', 'taneev', 'lyadov']
  }
];
