#!/usr/bin/env python3
"""
爬取 belcanto.ru 作曲家数据
"""
import json
import time
import re
from typing import Dict, List, Optional

# 作曲家slug映射表（处理belcanto.ru与我们的slug不一致的情况）
SLUG_MAPPING = {
    "rimsky_korsakov": "rimsky",
    "rakhmaninov": "rachmaninoff",  # 尝试可能的变体
}

def get_belcanto_slug(slug: str) -> str:
    """获取belcanto.ru对应的slug"""
    return SLUG_MAPPING.get(slug, slug)

def extract_composer_info(content: str, slug: str) -> Dict:
    """从页面内容提取作曲家信息"""
    info = {
        "slug": slug,
        "belcanto_url": f"https://www.belcanto.ru/{get_belcanto_slug(slug)}.html",
        "raw_content": content,
        "extracted": {}
    }
    
    # 提取基础信息
    birth_match = re.search(r'Дата рождения\s+([^\n]+)', content)
    death_match = re.search(r'Дата смерти\s+([^\n]+)', content)
    profession_match = re.search(r'Профессия\s+([^\n]+)', content)
    country_match = re.search(r'Страна\s+([^\n]+)', content)
    
    if birth_match:
        info["extracted"]["birth_date"] = birth_match.group(1).strip()
    if death_match:
        info["extracted"]["death_date"] = death_match.group(1).strip()
    if profession_match:
        info["extracted"]["profession"] = profession_match.group(1).strip()
    if country_match:
        info["extracted"]["country"] = country_match.group(1).strip()
    
    # 提取姓名（俄语）
    name_match = re.search(r'#\s+([^\n#]+)', content)
    if name_match:
        info["extracted"]["name_ru"] = name_match.group(1).strip()
    
    # 提取作品列表链接
    works_link_match = re.search(r'Список сочинений[^\]]+\]([^\]]+\])', content)
    if works_link_match:
        info["extracted"]["works_list_url"] = f"https://www.belcanto.ru{works_link_match.group(1).strip('.')}"
    
    return info

# 50位作曲家slug列表
COMPOSER_SLUGS = [
    "glinka", "dargomyzhsky", "balakirev", "cui", "borodin",
    "mussorgsky", "rimsky_korsakov", "tchaikovsky", "anton_rubinstein",
    "bortnyansky", "rakhmaninov", "scriabin", "stravinsky", "prokofiev",
    "shostakovich", "berezovsky", "pashkevich", "kavelin", "gurilyov",
    "lyapunov", "nezhdanova", "sobinov", "sokolovsky", "shalyapin",
    "alyabyev", "vedel", "verstovsky", "varlamov", "fomin",
    "kozlovsky", "lyadov", "taneev", "glazunov", "metner",
    "arensky", "ippolitov_ivanov", "myaskovsky", "shebalin", "weinberg",
    "denisov", "gliere", "grechaninov", "nikolai_rubinstein", "khachaturian",
    "shnitke", "gubaydulina", "silvestrov", "shchedrin", "sviridov", "kabalevsky"
]

if __name__ == "__main__":
    print(f"总共有 {len(COMPOSER_SLUGS)} 位作曲家需要爬取")
    print("\n作曲家slug列表：")
    for i, slug in enumerate(COMPOSER_SLUGS, 1):
        belcanto_slug = get_belcanto_slug(slug)
        print(f"{i:2d}. {slug} -> {belcanto_slug}")
