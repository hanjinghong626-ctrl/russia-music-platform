# 俄罗斯音乐留学平台

专业的俄罗斯音乐学院申请平台，为您提供全面的俄罗斯音乐留学信息咨询服务。

## 📁 项目结构

```
俄罗斯音乐留学平台/
├── frontend/                    # Next.js 前端项目
│   ├── app/                     # App Router 页面
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   ├── globals.css          # 全局样式
│   │   ├── schools/             # 院校列表页
│   │   │   └── page.tsx
│   │   └── api/                 # API 路由
│   │       └── schools/
│   │           └── route.ts
│   ├── components/              # React 组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SchoolCard.tsx
│   │   └── SearchFilter.tsx
│   ├── lib/                     # 工具库
│   │   └── api.ts
│   ├── types/                   # TypeScript 类型
│   │   └── index.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── backend/                     # Python FastAPI 后端项目
│   ├── main.py                  # 应用入口
│   ├── config.py                # 配置管理
│   ├── routers/                 # API 路由
│   │   ├── __init__.py
│   │   └── schools.py
│   ├── services/                # 业务服务
│   │   ├── __init__.py
│   │   └── feishu.py
│   ├── models/                  # 数据模型
│   │   ├── __init__.py
│   │   └── school.py
│   ├── utils/                   # 工具函数
│   │   ├── __init__.py
│   │   └── helpers.py
│   └── requirements.txt
│
├── deploy/                      # 部署配置
│   ├── vercel.json              # Vercel 前端部署配置
│   └── railway.toml             # Railway 后端部署配置
│
└── README.md                    # 项目说明文档
```

## 🚀 本地运行

### 前置要求

- Node.js 18+
- Python 3.11+
- npm 或 yarn

### 1. 启动后端服务

```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入飞书应用凭证

# 启动服务
uvicorn main:app --reload --port 8000
```

后端服务将在 http://localhost:8000 运行，API 文档访问 http://localhost:8000/docs

### 2. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 http://localhost:3000 运行

### 3. 配置环境变量

在 `backend/.env` 文件中配置：

```env
# 飞书应用凭证（必填）
FEISHU_APP_ID=cli_xxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# 飞书多维表格（可选，已预设）
FEISHU_APP_TOKEN=CqwBbnJ5xa9SbTsRfGnc3Ar7nLh
FEISHU_TABLE_ID=tblommDyseaVLP8Q
```

在 `frontend/.env.local` 文件中配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📦 部署

### 前端部署到 Vercel

1. **方式一：GitHub 导入**

   - 将代码推送到 GitHub 仓库
   - 登录 [Vercel](https://vercel.com)
   - 点击 "Import Project"
   - 选择仓库并导入
   - 配置环境变量 `NEXT_PUBLIC_API_URL`

2. **方式二：Vercel CLI**

   ```bash
   cd frontend
   npm i -g vercel
   vercel login
   vercel
   ```

3. **vercel.json 配置**

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "env": {
       "NEXT_PUBLIC_API_URL": "https://your-backend.railway.app"
     }
   }
   ```

### 后端部署到 Railway

1. **方式一：GitHub 导入**

   - 将代码推送到 GitHub 仓库
   - 登录 [Railway](https://railway.app)
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择仓库
   - 添加环境变量

2. **方式二：Railway CLI**

   ```bash
   npm i -g @railway/cli
   railway login
   cd backend
   railway init
   railway up
   ```

3. **配置环境变量**

   在 Railway 项目设置中添加：
   - `FEISHU_APP_ID`: 飞书应用 ID
   - `FEISHU_APP_SECRET`: 飞书应用密钥
   - `FEISHU_APP_TOKEN`: CqwBbnJ5xa9SbTsRfGnc3Ar7nLh
   - `FEISHU_TABLE_ID`: tblommDyseaVLP8Q

## 🔧 飞书配置

### 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 `App ID` 和 `App Secret`

### 配置权限

在飞书开放平台的应用后台，需要开通以下权限：

- `drive:drive:readonly` - 读取云文档
- `drive:table:readonly` - 读取多维表格

### 多维表格字段

建议多维表格包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 院校名称 | 文本 | 必填 |
| 英文名称 | 文本 | 可选 |
| 城市 | 文本 | 必填 |
| 院校类型 | 文本 | 必填 |
| 排名 | 数字 | 可选 |
| 建校年份 | 数字 | 可选 |
| 简介 | 文本 | 可选 |
| 学费 | 文本 | 如 "5000-8000" |
| 语言要求 | 文本 | 如 "俄语" |
| 专业 | 文本 | 多个用逗号分隔 |
| 入学要求 | 文本 | 可选 |
| 联系方式 | 文本 | 可选 |
| 官网 | 文本 | 可选 |
| 亮点 | 文本 | 可选 |
| 推荐 | 单选 | 可选（是/否） |

## 🌐 API 文档

后端服务启动后，访问：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/schools` | 获取院校列表 |
| GET | `/api/schools/{id}` | 获取院校详情 |
| GET | `/api/schools/cities/list` | 获取城市列表 |
| GET | `/api/schools/types/list` | 获取类型列表 |

### 筛选参数

```
GET /api/schools?city=莫斯科&school_type=国立音乐学院&search=音乐
```

## 🛠️ 技术栈

### 前端

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

### 后端

- Python 3.11
- FastAPI
- 飞书开放平台 SDK (lark-oapi)
- Pydantic

## 📝 开发指南

### 添加新页面

在 `frontend/app/` 下创建新目录，例如 `app/about/page.tsx`

### 添加新 API

在 `backend/routers/` 下创建新路由文件

### 修改飞书数据源

编辑 `backend/services/feishu.py` 中的字段映射

## 📄 License

MIT License
