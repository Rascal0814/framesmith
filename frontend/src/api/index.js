const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:8080/api';

export const api = {
  // 获取视频列表
  getVideos: async (category = '') => {
    const url = category 
      ? `${API_BASE}/videos?category=${encodeURIComponent(category)}`
      : `${API_BASE}/videos`;
    const res = await fetch(url);
    return res.json();
  },

  // 获取视频详情
  getVideo: async (id) => {
    const res = await fetch(`${API_BASE}/videos/${id}`);
    return res.json();
  },

  // 创建视频
  createVideo: async (data) => {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 获取用户信息
  getUser: async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`);
    return res.json();
  },

  // 获取分类
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  }
};
