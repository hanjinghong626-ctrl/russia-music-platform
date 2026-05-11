#!/usr/bin/env python3
"""
补充更多作品信息
"""
import json

# 读取更新后的数据
with open('public/data/composer-details.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 补充更多作品信息的数据库
additional_works = {
    "glinka": [
        {"title_zh": "《幻想圆舞曲》", "title_ru": "Вальс-фантазия", "year": 1839, "genre_zh": "管弦乐", "description_zh": "格林卡重要的管弦乐作品，展现其抒情才华。"}
    ],
    "balakirev": [
        {"title_zh": "《塔玛拉》", "title_ru": "Тамара", "year": 1882, "genre_zh": "交响诗", "description_zh": "东方主义风格的交响诗巨作。"},
        {"title_zh": "《第一交响曲》", "title_ru": "Симфония №1", "year": 1898, "genre_zh": "交响曲", "description_zh": "晚期创作的交响曲。"}
    ],
    "anton_rubinstein": [
        {"title_zh": "《海洋》", "title_ru": "Океан", "year": 1866, "genre_zh": "交响曲", "description_zh": "安东·鲁宾斯坦最著名的交响曲作品。"},
        {"title_zh": "《F大调钢琴协奏曲》", "title_ru": "Концерт для фортепиано", "year": 1854, "genre_zh": "协奏曲", "description_zh": "其作为钢琴家的炫技之作。"}
    ],
    "rakhmaninov": [
        {"title_zh": "《第一交响曲》e小调", "title_ru": "Симфония №1 ми минор", "year": 1895, "genre_zh": "交响曲", "description_zh": "首演失败导致作曲家精神危机。"},
        {"title_zh": "《钟声》", "title_ru": "Колокола", "year": 1913, "genre_zh": "合唱与管弦乐", "description_zh": "拉赫玛尼诺夫最著名的合唱作品之一。"},
        {"title_zh": "《音画练习曲集》", "title_ru": "Этюды-картины", "year": 1911, "genre_zh": "钢琴", "description_zh": "钢琴练习曲的巅峰之作。"}
    ],
    "stravinsky": [
        {"title_zh": "《圣诗交响曲》", "title_ru": "Symphonies of Wind Instruments", "year": 1920, "genre_zh": "管弦乐", "description_zh": "新古典主义时期的重要作品。"},
        {"title_zh": "《敦巴顿橡树园协奏曲》", "title_ru": "Dumbarton Oaks Concerto", "year": 1938, "genre_zh": "协奏曲", "description_zh": "新古典主义的室内乐杰作。"}
    ],
    "myaskovsky": [
        {"title_zh": "《第十六交响曲》", "title_ru": "Симфония №16", "year": 1936, "genre_zh": "交响曲", "description_zh": "米亚斯科夫斯基最后的重要交响曲之一。"}
    ],
    "shebalin": [
        {"title_zh": "《第二交响曲》", "title_ru": "Симфония №2", "year": 1942, "genre_zh": "交响曲", "description_zh": "二战时期创作的交响曲。"},
        {"title_zh": "《弦乐四重奏》", "title_ru": "Струнные квартеты", "year": 1938, "genre_zh": "室内乐", "description_zh": "谢巴林的室内乐代表作。"}
    ],
    "kabalevsky": [
        {"title_zh": "《第一钢琴协奏曲》", "title_ru": "Концерт для фортепиано №1", "year": 1935, "genre_zh": "协奏曲", "description_zh": "苏联钢琴协奏曲的经典。"},
        {"title_zh": "《第二钢琴协奏曲》", "title_ru": "Концерт для фортепиано №2", "year": 1945, "genre_zh": "协奏曲", "description_zh": "战后创作的协奏曲。"},
        {"title_zh": "《青少年钢琴练习曲》", "title_ru": "Пьесы для детей", "year": 1945, "genre_zh": "钢琴", "description_zh": "儿童音乐教育的经典教材。"}
    ],
    "grechaninov": [
        {"title_zh": "《第二交响曲》", "title_ru": "Симфония №2", "year": 1910, "genre_zh": "交响曲", "description_zh": "格列恰尼诺夫的重要交响作品。"},
        {"title_zh": "《弥撒》", "title_ru": "Литургия", "year": 1915, "genre_zh": "教堂音乐", "description_zh": "其最著名的东正教礼拜音乐。"}
    ],
    "glazunov": [
        {"title_zh": "《第一交响曲》", "title_ru": "Симфония №1", "year": 1882, "genre_zh": "交响曲", "description_zh": "18岁创作的交响曲，被誉为天才之作。"},
        {"title_zh": "《第三交响曲》", "title_ru": "Симфония №3", "year": 1886, "genre_zh": "交响曲", "description_zh": "格拉祖诺夫的重要交响曲。"},
        {"title_zh": "《雷蒙达》", "title_ru": "Раймонда", "year": 1888, "genre_zh": "芭蕾", "description_zh": "著名的俄罗斯芭蕾舞剧。"}
    ],
    "lyapunov": [
        {"title_zh": "《第二交响曲》", "title_ru": "Симфония №2", "year": 1900, "genre_zh": "交响曲", "description_zh": "利亚普诺夫的交响代表作。"},
        {"title_zh": "《哈萨克主题序曲》", "title_ru": "Увертюра на казахские темы", "year": 1910, "genre_zh": "管弦乐", "description_zh": "展现民族音乐传统的管弦乐作品。"}
    ],
    "metner": [
        {"title_zh": "《钢琴协奏曲》", "title_ru": "Концерт для фортепиано", "year": 1914, "genre_zh": "协奏曲", "description_zh": "梅特纳唯一的钢琴协奏曲。"},
        {"title_zh": "《戏剧配乐》", "title_ru": "Пьесы для фортепиано", "year": 1912, "genre_zh": "钢琴", "description_zh": "梅特纳的钢琴作品精选。"}
    ],
    "arensky": [
        {"title_zh": "《巴西旋律》", "title_ru": "Variations on a Theme by Tchaikovsky", "year": 1895, "genre_zh": "管弦乐", "description_zh": "基于柴可夫斯基主题的变奏曲。"},
        {"title_zh": "《巴西风格三重奏》", "title_ru": "Трио для фортепиано", "year": 1894, "genre_zh": "室内乐", "description_zh": "阿连斯基最著名的室内乐作品。"}
    ],
    "taneev": [
        {"title_zh": "《弦乐四重奏》", "title_ru": "Струнные квартеты", "year": 1900, "genre_zh": "室内乐", "description_zh": "展现塔涅耶夫对位法功力的作品。"}
    ],
    "gubaydulina": [
        {"title_zh": "《七言》", "title_ru": "Seven Words", "year": 1982, "genre_zh": "室内乐", "description_zh": "探索声音精神维度的作品。"},
        {"title_zh": "《奉献》", "title_ru": "In Croce", "year": 1979, "genre_zh": "室内乐", "description_zh": "古拜杜林娜的宗教题材作品。"}
    ],
    "silvestrov": [
        {"title_zh": "《元音乐》", "title_ru": "Metmusic", "year": 1970, "genre_zh": "管弦乐", "description_zh": "西尔维斯特罗夫元音乐理论的实践。"},
        {"title_zh": "《歌曲集》", "title_ru": "Songs", "year": 1985, "genre_zh": "声乐", "description_zh": "将浪漫主义情感与现代形式融合。"}
    ],
    "sviridov": [
        {"title_zh": "《俄罗斯主题组曲》", "title_ru": "Russian Suite", "year": 1960, "genre_zh": "管弦乐", "description_zh": "斯维里多夫的管弦乐代表作。"},
        {"title_zh": "《电影配乐》", "title_ru": "Film Scores", "year": 1955, "genre_zh": "电影音乐", "description_zh": "斯维里多夫的电影音乐杰作。"}
    ],
    "shnitke": [
        {"title_zh": "《第一小提琴协奏曲》", "title_ru": "Концерт для скрипки №1", "year": 1978, "genre_zh": "协奏曲", "description_zh": "施尼特凯最著名的小提琴作品。"},
        {"title_zh": "《中提琴协奏曲》", "title_ru": "Концерт для альта", "year": 1985, "genre_zh": "协奏曲", "description_zh": "施尼特凯的中提琴协奏曲。"}
    ],
    "khachaturian": [
        {"title_zh": "《第三交响曲》", "title_ru": "Симфония №3", "year": 1947, "genre_zh": "交响曲", "description_zh": "哈恰图良重要的交响作品。"},
        {"title_zh": "《钢琴协奏曲》", "title_ru": "Концерт для фортепиано", "year": 1936, "genre_zh": "协奏曲", "description_zh": "早期创作的钢琴协奏曲。"}
    ],
    "weinberg": [
        {"title_zh": "《第七交响曲》", "title_ru": "Симфония №7", "year": 1965, "genre_zh": "交响曲", "description_zh": "魏因贝格重要的交响曲之一。"},
        {"title_zh": "《弦乐四重奏》", "title_ru": "Струнные квартеты", "year": 1960, "genre_zh": "室内乐", "description_zh": "17部弦乐四重奏的精选。"}
    ],
    "denisov": [
        {"title_zh": "《吉他协奏曲》", "title_ru": "Концерт для гитары", "year": 1975, "genre_zh": "协奏曲", "description_zh": "杰尼索夫唯一的吉他协奏曲。"}
    ],
    "nikolai_rubinstein": [
        {"title_zh": "《第一钢琴协奏曲》", "title_ru": "Концерт для фортепиано №1", "year": 1868, "genre_zh": "协奏曲", "description_zh": "尼古拉·鲁宾斯坦的代表作品。"}
    ],
    "shchedrin": [
        {"title_zh": "《交响曲》", "title_ru": "Симфония", "year": 1968, "genre_zh": "交响曲", "description_zh": "谢德林的交响曲代表作。"},
        {"title_zh": "《钢琴协奏曲》", "title_ru": "Концерт для фортепиано", "year": 1974, "genre_zh": "协奏曲", "description_zh": "谢德林的钢琴协奏曲。"}
    ],
    "lyadov": [
        {"title_zh": "《俄罗斯民歌主题序曲》", "title_ru": "Увертюра на русские темы", "year": 1888, "genre_zh": "管弦乐", "description_zh": "利亚多夫的管弦乐代表作。"}
    ],
    "scriabin": [
        {"title_zh": "《第二钢琴奏鸣曲》", "title_ru": "Соната №2", "year": 1897, "genre_zh": "钢琴", "description_zh": "早期浪漫主义的钢琴杰作。"},
        {"title_zh": "《幻想曲》", "title_ru": "Fantasy", "year": 1900, "genre_zh": "钢琴与管弦乐", "description_zh": "与钢琴和乐队合作的幻想曲。"}
    ],
    "prokofiev": [
        {"title_zh": "《第七钢琴奏鸣曲》", "title_ru": "Соната №7", "year": 1943, "genre_zh": "钢琴", "description_zh": "战争三部曲的第三部。"},
        {"title_zh": "《战争与和平》", "title_ru": "Война и мир", "year": 1946, "genre_zh": "歌剧", "description_zh": "根据托尔斯泰小说改编的歌剧巨作。"}
    ],
    "shostakovich": [
        {"title_zh": "《第八弦乐四重奏》", "title_ru": "Струнный квартет №8", "year": 1960, "genre_zh": "室内乐", "description_zh": "DSCH动机的集中展现。"},
        {"title_zh": "《第十五交响曲》", "title_ru": "Симфония №15", "year": 1971, "genre_zh": "交响曲", "description_zh": "肖斯塔科维奇的最后一部交响曲。"}
    ]
}

# 添加补充作品
added_count = 0
for slug, works in additional_works.items():
    if slug in data['composers']:
        composer = data['composers'][slug]
        existing_titles = {w.get('title_ru', '') for w in composer.get('works', [])}
        
        for work in works:
            if work['title_ru'] not in existing_titles:
                composer.setdefault('works', []).append(work)
                existing_titles.add(work['title_ru'])
                added_count += 1

# 保存更新后的数据
with open('public/data/composer-details.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('frontend/public/data/composer-details.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"补充作品信息完成！共添加 {added_count} 部作品。")
