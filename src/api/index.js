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

const USE_MOCK = false;
const REPO_OWNER = 'Rascal0814';
const REPO_NAME = 'framesmith';
const BRANCH = 'main';

let githubToken = '';
let isOwner = false;

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
}

export const setToken = async (token) => {
  githubToken = token;
  localStorage.setItem('github_token', token);
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}` }
    });
    if (response.ok) {
      const user = await response.json();
      isOwner = user.login === REPO_OWNER;
      localStorage.setItem('is_owner', isOwner ? 'true' : 'false');
    }
  } catch (e) {
    isOwner = false;
  }
  return isOwner;
};

export const getToken = () => {
  if (!githubToken) {
    githubToken = localStorage.getItem('github_token') || '';
  }
  return githubToken;
};

export const getIsOwner = () => {
  if (!isOwner) {
    isOwner = localStorage.getItem('is_owner') === 'true';
  }
  return isOwner;
};

export const logout = () => {
  githubToken = '';
  isOwner = false;
  localStorage.removeItem('github_token');
  localStorage.removeItem('is_owner');
};

export const api = {
  getVideos: async (category = '') => {
    if (USE_MOCK) {
      return category ? MOCK_VIDEOS.filter(v => v.category === category) : MOCK_VIDEOS;
    }
    try {
      // 使用raw URL不需要认证
      const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/public/videos.json`;
      const response = await fetch(url);
      if (response.ok) {
        const content = await response.json();
        return category ? content.videos.filter(v => v.category === category) : content.videos || [];
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

  deleteVideo: async (id) => {
    const token = getToken();
    if (!token || !getIsOwner()) throw new Error('无权限');
    const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/public/videos.json`;
    const resp = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
    const data = await resp.json();
    const sha = data.sha;
    const content = JSON.parse(base64ToUtf8(data.content));
    const video = content.videos.find(v => v.id === id);
    if (!video) throw new Error('视频不存在');
    const fileName = video.video_url.split('/').pop();
    if (fileName) {
      const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
      try {
        const fileResp = await fetch(fileUrl, { headers: { 'Authorization': `token ${token}` } });
        if (fileResp.ok) {
          const fileData = await fileResp.json();
          await fetch(fileUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `delete: ${fileName}`, sha: fileData.sha })
          });
        }
      } catch (e) {}
    }
    content.videos = content.videos.filter(v => v.id !== id);
    const newContent = utf8ToBase64(JSON.stringify(content, null, 2));
    await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `delete video ${id}`, content: newContent, sha })
    });
    return { success: true };
  },

  uploadToGitHub: async (file, metadata) => {
    const token = getToken();
    if (!token) throw new Error('请先输入 GitHub Token');
    if (!getIsOwner()) throw new Error('无权限上传');
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `video_${timestamp}.${ext}`;
    const content = await fileToBase64(file);
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
    let sha = null;
    try {
      const checkResp = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
      if (checkResp.ok) {
        const existing = await checkResp.json();
        sha = existing.sha;
      }
    } catch (e) {}
    const body = { message: `upload: ${fileName}`, content, branch: BRANCH };
    if (sha) body.sha = sha;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '视频上传失败');
    }
    const result = await response.json();
    const videoUrl = result.content.download_url;
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
      thumbnail: metadata.thumbnail || `https://picsum.photos/seed/${timestamp}/640/360`,
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
    const videosBody = { message: 'update: videos.json', content: videosContent, branch: BRANCH };
    if (videosSha) videosBody.sha = videosSha;
    await fetch(videosUrl, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(videosBody)
    });
    return newVideo;
  },

  getUser: async (id) => MOCK_USER,

  getCategories: async () => {
    if (USE_MOCK) return MOCK_CATEGORIES;
    try {
      const token = getToken();
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/categories.json`;
      const response = await fetch(url, { headers: token ? { 'Authorization': `token ${token}` } : {} });
      if (response.ok) {
        const data = await response.json();
        return JSON.parse(base64ToUtf8(data.content)).categories || MOCK_CATEGORIES;
      }
    } catch (e) {}
    return MOCK_CATEGORIES;
  },

  saveCategories: async (categories) => {
    const token = getToken();
    if (!token || !getIsOwner()) throw new Error('无权限');
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/categories.json`;
    let sha = null;
    try {
      const resp = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
      if (resp.ok) {
        const data = await resp.json();
        sha = data.sha;
      }
    } catch (e) {}
    const content = utf8ToBase64(JSON.stringify({ categories }, null, 2));
    const body = { message: 'update: categories', content, branch: BRANCH };
    if (sha) body.sha = sha;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('保存失败');
    return categories;
  },

  updateVideo: async (id, updates) => {
    const token = getToken();
    if (!token || !getIsOwner()) throw new Error('无权限');
    const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/public/videos.json`;
    const resp = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
    const data = await resp.json();
    const sha = data.sha;
    const content = JSON.parse(base64ToUtf8(data.content));
    const videoIndex = content.videos.findIndex(v => v.id === id);
    if (videoIndex === -1) throw new Error('视频不存在');
    content.videos[videoIndex] = { ...content.videos[videoIndex], ...updates };
    const newContent = utf8ToBase64(JSON.stringify(content, null, 2));
    await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `update video ${id}`, content: newContent, sha })
    });
    return content.videos[videoIndex];
  }
};

