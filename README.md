# SampleHub - 视频作品展示平台

一个专为视频剪辑师打造的在线作品展示平台，帮助你向面试官和客户展示过往的优秀作品。

## 🌟 特性

- 🎬 视频作品画廊 - 网格展示所有作品
- 📺 视频详情页 - 播放视频、查看描述和标签
- 📤 作品管理 - 直接在 GitHub 仓库添加视频文件
- 👤 个人主页 - 展示剪辑师个人资料和技能

## 🚀 快速部署到 GitHub Pages

1. 推送代码到 GitHub
2. 在仓库设置中启用 Pages (选择 GitHub Actions)
3. 自动部署完成后访问

## 📤 添加新视频

把视频文件放到 `frontend/public/videos/` 目录：

```
frontend/public/videos/
├── demo.mp4          # 视频文件
├── thumb-1.jpg       # 缩略图
├── thumb-2.jpg
└── avatar.jpg        # 用户头像
```

然后修改 `frontend/src/api/index.js` 中的 `MOCK_VIDEOS` 数组，添加视频信息：

```javascript
{
  id: "4",
  title: "新作品",
  description: "描述",
  thumbnail: "/videos/thumb-4.jpg",
  video_url: "/videos/demo.mp4",
  category: "广告宣传",
  tags: ["标签1", "标签2"],
  duration: 120,
  views: 0,
  created_at: "2026-03-09",
  user_id: "1",
}
```

提交推送后自动部署！

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

## 📁 项目结构

```
framesmith/
├── .github/workflows/     # GitHub Actions 自动部署
├── frontend/              # React 前端
│   ├── public/videos/   # 视频文件目录
│   └── src/            # 前端代码
└── README.md
```

## 🔧 技术栈

- React + Vite + React Router
- 纯静态部署，无需后端服务器

## ⚙️ 自动部署

每次推送到 main 分支，GitHub Actions 会自动构建并部署到 Pages。

---
