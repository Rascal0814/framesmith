const MOCK_VIDEOS = [
  {
    id: "1",
    title: "特斯拉自动驾驶宣传片",
    description: "为特斯拉中国区制作的自动驾驶功能展示视频，包含城市道路和高速场景",
    thumbnail: "/framesmith/videos/thumb-1.jpg",
    video_url: "/framesmith/videos/demo.mp4",
    category: "广告宣传",
    tags: ["汽车", "自动驾驶", "科技"],
    duration: 180,
    views: 12500,
    created_at: "2026-02-15",
    user_id: "1",
  },
  {
    id: "2",
    title: "Nike跑步产品短片",
    description: "Nike Flyknit系列跑鞋广告，展现运动激情与产品性能",
    thumbnail: "/framesmith/videos/thumb-2.jpg",
    video_url: "/framesmith/videos/demo.mp4",
    category: "广告宣传",
    tags: ["运动", "Nike", "跑步"],
    duration: 120,
    views: 8900,
    created_at: "2026-02-10",
    user_id: "1",
  },
  {
    id: "3",
    title: "vivo X100产品视频",
    description: "vivo X100智能手机发布会开场视频，展示夜景拍摄功能",
    thumbnail: "/framesmith/videos/thumb-3.jpg",
    video_url: "/framesmith/videos/demo.mp4",
    category: "产品展示",
    tags: ["手机", "摄影", "夜景"],
    duration: 240,
    views: 15200,
    created_at: "2026-01-28",
    user_id: "1",
  },
];

const MOCK_USER = {
  id: "1",
  name: "张伟",
  avatar: "/framesmith/videos/avatar.jpg",
  bio: "资深视频剪辑师，8年从业经验，擅长广告、宣传片、短视频制作。曾服务于特斯拉、Nike、vivo等知名品牌。",
  skills: ["Premiere", "After Effects", "Final Cut Pro", "DaVinci Resolve", "C4D"],
  video_count: 3,
};

const MOCK_CATEGORIES = ["广告宣传", "产品展示", "游戏", "文化", "金融", "短视频", "纪录片"];

const API_BASE = 'http://43.143.80.123:8080/api';
const USE_MOCK = false;

export const api = {
  getVideos: async (category = '') => {
    if (USE_MOCK) {
      return category 
        ? MOCK_VIDEOS.filter(v => v.category === category)
        : MOCK_VIDEOS;
    }
    const url = category 
      ? `${API_BASE}/videos?category=${encodeURIComponent(category)}`
      : `${API_BASE}/videos`;
    const res = await fetch(url);
    return res.json();
  },

  getVideo: async (id) => {
    if (USE_MOCK) {
      return MOCK_VIDEOS.find(v => v.id === id) || { error: "Video not found" };
    }
    const res = await fetch(`${API_BASE}/videos/${id}`);
    return res.json();
  },

  createVideo: async (data) => {
    if (USE_MOCK) {
      return { ...data, id: String(MOCK_VIDEOS.length + 1) };
    }
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getUser: async (id) => {
    if (USE_MOCK) {
      return MOCK_USER;
    }
    const res = await fetch(`${API_BASE}/users/${id}`);
    return res.json();
  },

  getCategories: async () => {
    if (USE_MOCK) {
      return MOCK_CATEGORIES;
    }
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  }
};
