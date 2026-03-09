const MOCK_VIDEOS = [
  {
    id: "1",
    title: "特斯拉自动驾驶宣传片",
    description: "为特斯拉中国区制作的自动驾驶功能展示视频",
    thumbnail: "https://picsum.photos/seed/vid1/640/360",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "广告宣传",
    tags: ["汽车", "自动驾驶", "科技"],
    duration: 180,
    views: 12500,
    created_at: "2026-02-15",
    user_id: "1",
  },
];

const MOCK_USER = {
  id: "1",
  name: "张伟",
  avatar: "https://picsum.photos/seed/user1/200/200",
  bio: "资深视频剪辑师",
  skills: ["Premiere", "After Effects"],
  video_count: 1,
};

const MOCK_CATEGORIES = ["广告宣传", "产品展示", "游戏", "文化", "金融", "短视频", "纪录片"];

// 生产环境从GitHub获取视频列表
const USE_MOCK = false;

const REPO_OWNER = 'Rascal0814';
const REPO_NAME = 'framesmith';
const BRANCH = 'main';

let githubToken = '';

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

// Base64编码支持中文
function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

export const api = {
  getVideos: async (category = '') => {
    if (USE_MOCK) {
      return category 
        ? MOCK_VIDEOS.filter(v => v.category === category)
        : MOCK_VIDEOS;
    }
    
    try {
      const token = getToken();
      if (!token) {
        return MOCK_VIDEOS;
      }
      
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos.json`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(base64ToUtf8(data.content));
        return category 
          ? content.videos.filter(v => v.category === category)
          : content.videos || [];
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
    
    // 1. 上传视频文件 - 使用英文文件名
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `video_${timestamp}.${ext}`;
    const content = await fileToBase64(file);
    
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
    
    // 检查文件是否存在
    let sha = null;
    try {
      const checkResp = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
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
    
    let videosList = [];
    let videosSha = null;
    try {
      const listResp = await fetch(videosUrl, { headers: { 'Authorization': `token ${token}` } });
      if (listResp.ok) {
        const listData = await listResp.json();
        videosSha = listData.sha;
        videosList = JSON.parse(base64ToUtf8(listData.content)).videos || [];
      }
    } catch (e) {}
    
    const newVideo = {
      id: String(videosList.length + 1),
      title: metadata.title,
      description: metadata.description,
      thumbnail: `https://picsum.photos/seed/${timestamp}/640/360`,
      video_url: videoUrl,
      category: metadata.category,
      tags: metadata.tags || [],
      duration: metadata.duration || 60,
      views: 0,
      created_at: new Date().toISOString().split('T')[0],
      user_id: "1"
    };
    
    videosList.push(newVideo);
    
    const videosContent = utf8ToBase64(JSON.stringify({ videos: videosList }, null, 2));
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
    }
    
    return newVideo;
  },

  getUser: async (id) => MOCK_USER,

  getCategories: async () => MOCK_CATEGORIES
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
