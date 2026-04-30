import './globals.css';

export const metadata = {
  title: '俄罗斯音乐史交互地图 | Russia Music Platform',
  description: '沉浸式俄罗斯音乐史时空漫游体验',
};

// 涅瓦河铸铁栏杆花纹 - 精密曲线
function CastIronCorner() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 主卷草曲线 */}
      <path d="M0,0 C20,0 30,5 35,15 C38,22 32,30 25,28 C20,27 22,20 28,18 C34,16 38,22 35,28 C32,34 25,38 20,40 C15,42 10,38 12,32 C14,26 20,24 22,28" 
        stroke="var(--imperial-gold)" strokeWidth="0.8" fill="none" opacity="0.6"/>
      {/* 副卷草 */}
      <path d="M0,0 C10,0 18,2 24,8 C28,12 26,18 22,16 C18,14 20,8 24,6" 
        stroke="var(--imperial-gold)" strokeWidth="0.5" fill="none" opacity="0.4"/>
      {/* 中心花饰 */}
      <circle cx="28" cy="22" r="2.5" stroke="var(--imperial-gold)" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <circle cx="28" cy="22" r="1" fill="var(--imperial-gold)" opacity="0.3"/>
      {/* 外延曲线 */}
      <path d="M40,20 C45,18 52,20 55,25 C57,28 54,32 50,30 C46,28 48,24 52,22" 
        stroke="var(--imperial-gold)" strokeWidth="0.5" fill="none" opacity="0.3"/>
      {/* 叶片装饰 */}
      <path d="M50,30 C53,28 56,30 54,34 C52,38 48,36 50,30Z" 
        stroke="var(--imperial-gold)" strokeWidth="0.4" fill="var(--imperial-gold)" fillOpacity="0.08" opacity="0.4"/>
      {/* 顶部延伸线 */}
      <path d="M0,0 L15,0" stroke="var(--imperial-gold)" strokeWidth="0.3" opacity="0.3"/>
      <path d="M0,0 L0,15" stroke="var(--imperial-gold)" strokeWidth="0.3" opacity="0.3"/>
      {/* 小圆点装饰 */}
      <circle cx="8" cy="3" r="0.8" fill="var(--imperial-gold)" opacity="0.2"/>
      <circle cx="3" cy="8" r="0.8" fill="var(--imperial-gold)" opacity="0.2"/>
    </svg>
  );
}

export default function MusicHistoryLayout({ children }) {
  return (
    <>
      {children}
      {/* 帝国冬夜 - 铸铁栏杆四角装饰 */}
      <div className="imperial-corner top-left"><CastIronCorner /></div>
      <div className="imperial-corner top-right"><CastIronCorner /></div>
      <div className="imperial-corner bottom-left"><CastIronCorner /></div>
      <div className="imperial-corner bottom-right"><CastIronCorner /></div>
    </>
  );
}
