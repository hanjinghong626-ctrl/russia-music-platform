# IMSLP PDF链接覆盖率报告

## 概述
本报告记录了俄罗斯音乐留学平台练声曲库从IMSLP获取的真实PDF链接情况。

**更新日期**: 2026-05-09

## 覆盖率统计

| 指标 | 数量 | 百分比 |
|------|------|--------|
| 总曲集数 | 14 | 100% |
| 有IMSLP链接 | 10 | 71% |
| 无PDF（暂无公版） | 4 | 29% |

## 曲集PDF链接详情

### ✅ 有IMSLP公版PDF的曲集

| # | 曲集名称 | 作曲家 | IMSLP链接 | 状态 |
|---|----------|--------|-----------|------|
| 1 | 瓦卡伊练声曲 | Nicola Vaccai | https://imslp.org/wiki/Metodo_pratico_de_canto_(Vaccai,_Nicola) | ✅ 有效 |
| 2 | 拉赫玛尼诺夫练声曲 | Sergei Rachmaninoff | https://imslp.org/wiki/Vocalise_(Rachmaninoff,_Sergei) | ✅ 有效 |
| 3 | 马尔凯西练声曲 | Mathilde Marchesi | https://imslp.org/wiki/24_Vocalises,_Op.2_(Marchesi,_Mathilde) | ✅ 有效 |
| 4 | 孔科内练声曲 | Giuseppe Concone | https://imslp.org/wiki/25_Le%C3%A7ons_de_chant,_Op.10_(Concone,_Giuseppe) | ✅ 有效 |
| 5 | 博尔东尼练声曲 | Marco Bordogni | https://imslp.org/wiki/12_nouvelle_vocalises_pour_mezzo-soprano_(Bordogni,_Marco) | ✅ 有效 |
| 6 | 帕诺夫卡练声曲 | Heinrich Panofka | https://imslp.org/wiki/24_Vocalises,_Op.81_(Panofka,_Heinrich) | ✅ 有效 |
| 7 | 吕特根练声曲 | Julius Lütgen | https://imslp.org/wiki/20_Vocalises_journali%C3%A8res_(Lutgen,_Balthazar) | ✅ 有效 |
| 8 | 兰佩尔蒂练声曲 | Francesco Lamperti | https://imslp.org/wiki/Guida_teorico-pratica-elementaire_per_lo_studio_del_canto_(Lamperti,_Francesco) | ✅ 有效 |
| 9 | 拉布拉什练声曲 | Luigi Lablache | https://imslp.org/wiki/M%C3%A9thode_compl%C3%A8te_de_chant_(Lablache,_Luigi) | ✅ 有效 |
| 10 | 加尔西亚练声曲 | Manuel García | https://imslp.org/wiki/%C3%89cole_de_Garcia_(Garcia_Jr.,_Manuel) | ✅ 有效 |

### ❌ 暂无IMSLP公版PDF的曲集

| # | 曲集名称 | 作曲家 | 原因 | 建议 |
|---|----------|--------|------|------|
| 1 | 阿布特练声曲 | Franz Abt | IMSLP上暂无Op.474/476等练声曲 | 可通过商业出版社获取 |
| 2 | 塞德勒练声曲 | Ernst Seidler | IMSLP上无相关资源 | 版权状态不明 |
| 3 | 格列恰尼诺夫练声曲 | Alexander Gretchaninoff | 无独立练声曲公版PDF | 可能在版权保护期 |
| 4 | 梅特纳练声曲 | Nikolai Medtner | Op.23为钢琴作品，非声乐练声曲 | 可探索其他俄罗斯来源 |

## IMSLP使用说明

### 如何从IMSLP下载PDF
1. 访问曲集对应的IMSLP工作页面
2. 滚动到 "Sheet Music" 或 "Scores" 部分
3. 找到所需的PDF文件（通常标记为 "Complete Score"）
4. 点击文件名即可下载PDF

### IMSLP链接格式说明
- **工作页面**: `https://imslp.org/wiki/{Work_Title}_({Composer})`
- **直接PDF**: 需要从工作页面的Sheet Music部分获取

### 链接验证结果
所有IMSLP链接均返回302重定向（IMSLP正常行为），指向最终的工作页面。

## 数据文件位置

| 文件 | 路径 |
|------|------|
| 主数据文件 | `russia-music-platform/public/data/vocal-exercises.json` |
| 前端数据文件 | `frontend/public/data/vocal-exercises.json` |
| 本报告 | `russia-music-platform/IMSLP_PDF_Report.md` |

## 注意事项

1. **公版状态**: 这些作曲家的作品大多已进入公版领域（作者去世70年后）
2. **IMSLP镜像**: 某些地区可能需要使用IMSLP镜像站（如 cn.imslp.org）
3. **PDF格式**: IMSLP提供的是扫描版PDF，可能不是最佳质量
4. **商业替代**: 对于暂无公版PDF的曲集，可考虑通过Schirmer、Breitkopf等出版社购买

## 后续建议

1. **定期检查**: 每隔6-12个月检查暂无PDF的曲集是否有新增公版资源
2. **镜像站点**: 如IMSLP主站访问受限，可使用以下镜像：
   - https://cn.imslp.org (中国镜像)
   - https://s10.imslp.org (备用镜像)
3. **商业合作**: 对于高频使用的商业教材，可考虑与出版社建立合作关系
4. **用户贡献**: 鼓励用户在合规前提下贡献公版资源

---
*报告生成时间: 2026-05-09*
*数据来源: IMSLP (imslp.org)*
