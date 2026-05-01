import './globals.css';

export const metadata = {
  title: '俄罗斯音乐史交互地图 | Russia Music Platform',
  description: '沉浸式俄罗斯音乐史时空漫游体验，用音乐的方式打开俄罗斯音乐的千年历史',
  keywords: '俄罗斯音乐史, 柴可夫斯基, 格林卡, 俄罗斯作曲家, 俄罗斯音乐留学',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0A0E17" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♪</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
