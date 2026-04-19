import './globals.css'

export const metadata = {
  title: '俄罗斯音乐留学平台',
  description: '专业音乐留学决策支持平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
