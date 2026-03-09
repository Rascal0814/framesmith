# SampleHub - 视频作品展示平台

一个专为视频剪辑师打造的在线作品展示平台，帮助你向面试官和客户展示过往的优秀作品。

## 🌟 特性

- 🎬 视频作品画廊 - 网格展示所有作品
- 📺 视频详情页 - 播放视频、查看描述和标签
- 📤 作品管理 - 通过GitHub管理视频文件
- 👤 个人主页 - 展示剪辑师个人资料和技能

## 🚀 快速部署到 GitHub Pages

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待自动部署完成

### 3. 上传视频

将你的视频文件放到 `frontend/public/videos/` 目录：

```
frontend/public/videos/
├── demo.mp4          # 视频文件
├── thumb-1.jpg       # 缩略图
├── thumb-2.jpg
└── avatar.jpg        # 用户头像
```

然后提交推送：

```bash
# 添加视频文件
git add frontend/public/videos/
git commit -m "Add sample videos"
git push
```

GitHub Actions 会自动重新部署！

## 本地开发

### 1. 启动后端 (Go)

```bash
cd backend
go run main.go
```

后端运行在 http://localhost:8080

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

### 3. 访问

- 前端: http://localhost:5173
- 后端: http://localhost:8080

## 📁 项目结构

```
framesmith/
├── .github/workflows/deploy.yml  # 自动部署配置
├── backend/
│   └── main.go                   # Go API 服务
├── frontend/
│   ├── public/videos/           # 视频文件目录
│   └── src/                    # 前端代码
└── README.md
```

## ⚙️ 工作原理

1. **视频存储**: 视频文件直接放在 `frontend/public/videos/` 目录
2. **版本控制**: 视频文件通过 Git 进行版本管理
3. **自动部署**: 推送到 main 分支时，GitHub Actions 自动构建并部署到 Pages
4. **访问方式**: 视频通过静态文件方式访问，无需后端服务器

## 🔧 自定义

- 修改 `backend/main.go` 中的演示数据
- 修改 `frontend/src/App.jsx` 中的 UI 文字和样式
- 在 `frontend/public/videos/` 中添加你自己的视频

---
