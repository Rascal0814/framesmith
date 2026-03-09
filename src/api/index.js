const MOCK_VIDEOS = [
  {
    id: "1",
    title: "特斯拉自动驾驶宣传片",
    description: "为特斯拉中国区制作的自动驾驶功能展示视频，包含城市道路和高速场景",
    thumbnail: "https://picsum.photos/seed/vid1/640/360",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
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
    thumbnail: "https://picsum.photos/seed/vid2/640/360",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
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
    thumbnail: "https://picsum.photos/seed/vid3/640/360",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
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
  avatar: "https://picsum.photos/seed/user1/200/200",
  bio: "资深视频剪辑师，8年从业经验，擅长广告、宣传片、短视频制作。曾服务于特斯拉、Nike、vivo等知名品牌。",
  skills: ["Premiere", "After Effects", "Final Cut Pro", "DaVinci Resolve", "C4D"],
  video_count: 3,
};

const MOCK_CATEGORIES = ["广告宣传", "产品展示", "游戏", "文化", "金融", "短视频", "纪录片"];

// 生产环境从GitHub获取视频列表
const USE_MOCK = false;

const REPO_OWNER = 'Rascal0814';
const REPO_NAME = 'framesmith';
const BRANCH = 'main';

let githubToken = '';
let cachedVideos = null;

export const setToken = (token) => {
  githubToken = token;
  localStorage.setItem('github_token', token);
};

export const getToken = () => {
  if (!githubToken) {
    githubToken = localStorage.getItem('github_token') || '';
  }
  return githubToken;
};

export const api = {
  getVideos: async (category = '') => {
    if (USE_MOCK) {
      return category 
        ? MOCK_VIDEOS.filter(v => v.category === category)
        : MOCK_VIDEOS;
    }
    
    try {
      // 从GitHub获取视频列表
      const token = getToken();
      if (!token) {
        return MOCK_VIDEOS;
      }
      
      // 获取videos.json
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos.json`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        cachedVideos = content.videos || [];
        return category 
          ? cachedVideos.filter(v => v.category === category)
          : cachedVideos;
      }
    } catch (e) {
      console.error('Failed to load videos:', e);
    }
    
    return MOCK_VIDEOS;
  },

  getVideo: async (id) => {
    const videos = await api.getVideos();
    return videos.find(v => v.id === id) || { error: "Video not found" };
  },

  uploadToGitHub: async (file, metadata) => {
    const token = getToken();
    if (!token) {
      throw new Error('请先输入 GitHub Token');
    }
    
    // 1. 上传视频文件
    const fileName = file.name;
    const content = await fileToBase64(file);
    
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
    
    // 检查文件是否已存在
    let sha = null;
    try {
      const checkResp = await fetch(url, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (checkResp.ok) {
        const existing = await checkResp.json();
        sha = existing.sha;
      }
    } catch (e) {}
    
    const body = {
      message: `upload: ${fileName}`,
      content: content,
      branch: BRANCH
    };
    if (sha) body.sha = sha;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '视频上传失败');
    }
    
    const result = await response.json();
    const videoUrl = result.content.download_url;
    
    // 2. 保存视频信息到videos.json
    const videosUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos.json`;
    
    // 获取现有列表
    let videosList = [];
    let videosSha = null;
    try {
      const listResp = await fetch(videosUrl, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (listResp.ok) {
        const listData = await listResp.json();
        videosSha = listData.sha;
        videosList = JSON.parse(atob(listData.content)).videos || [];
      }
    } catch (e) {}
    
    // 添加新视频
    const newVideo = {
      id: String(videosList.length + 1),
      title: metadata.title,
      description: metadata.description,
      thumbnail: metadata.thumbnail || `https://picsum.photos/seed/${Date.now()}/640/360`,
      video_url: videoUrl,
      category: metadata.category,
      tags: metadata.tags || [],
      duration: metadata.duration || 0,
      views: 0,
      created_at: new Date().toISOString().split('T')[0],
      user_id: "1"
    };
    
    videosList.push(newVideo);
    
    const videosContent = btoa(JSON.stringify({ videos: videosList }, null, 2));
    const videosBody = {
      message: 'update: videos.json',
      content: videosContent,
      branch: BRANCH
    };
    if (videosSha) videosBody.sha = videosSha;
    
    const updateResp = await fetch(videosUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videosBody)
    });
    
    if (!updateResp.ok) {
      const error = await updateResp.json();
      console.error('Failed to update videos.json:', error);
      // 视频已上传，只是信息保存失败
    }
    
    return newVideo;
  },

  getUser: async (id) => {
    return MOCK_USER;
  },

  getCategories: async () => {
    return MOCK_CATEGORIES;
  }
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
