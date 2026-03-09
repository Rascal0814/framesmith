# SampleHub - 视频作品展示平台

一个专为视频剪辑师打造的在线作品展示平台，帮助你向面试官和客户展示过往的优秀作品。

## 🌟 特性

- 🎬 视频作品画廊 - 网格展示所有作品
- 📺 视频详情页 - 播放视频、查看描述和标签
- 📤 作品管理 - 通过 GitHub 管理视频文件
- 👤 个人主页 - 展示剪辑师个人资料和技能
- 🔧 Gin 框架 - 高性能 Go Web 框架

## 🏗️ 技术栈

- **前端**: React + Vite + React Router
- **后端**: Go + Gin
- **部署**: GitHub Pages (前端) + Railway/Render (后端)

## 📁 项目结构

```
framesmith/
├── .github/workflows/     # GitHub Actions 自动部署
├── backend/               # Go 后端 (Gin)
│   ├── main.go           # 入口
│   ├── go.mod            # 依赖
│   ├── go.sum            # 依赖锁定
│   └── internal/         # 内部包
│       ├── handler/      # HTTP 处理器
│       ├── model/        # 数据模型
│       ├── router/       # 路由配置
│       └── service/      # 业务逻辑
├── frontend/             # React 前端
│   ├── public/videos/   # 视频文件目录
│   └── src/            # 前端代码
└── README.md
```

## 🚀 快速开始

### 后端 (Go + Gin)

```bash
cd backend

# 下载依赖
go mod tidy

# 运行
go run main.go

# 或编译运行
go build -o server . && ./server
```

服务运行在 http://localhost:8080

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

## 📡 API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/videos | 获取视频列表 |
| GET | /api/videos/:id | 获取视频详情 |
| POST | /api/videos | 创建视频 |
| GET | /api/users/:id | 获取用户信息 |
| GET | /api/categories | 获取分类列表 |
| GET | /health | 健康检查 |

## 🌐 部署

### 前端部署到 GitHub Pages

1. 推送代码到 GitHub
2. 在仓库设置中启用 Pages (选择 GitHub Actions)
3. 自动部署完成后访问

### 后端部署

推荐使用 Railway、Render 或 Vercel 部署 Go 后端。

## 📝 许可证

MIT
