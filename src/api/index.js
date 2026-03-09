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

// 生产环境使用mock数据
const USE_MOCK = true;

const REPO_OWNER = 'Rascal0814';
const REPO_NAME = 'framesmith';
const BRANCH = 'main';

let githubToken = '';

// 设置 Token（上传前调用）
export const setToken = (token) => {
  githubToken = token;
};

export const api = {
  getVideos: async (category = '') => {
    if (USE_MOCK) {
      return category 
        ? MOCK_VIDEOS.filter(v => v.category === category)
        : MOCK_VIDEOS;
    }
    const res = await fetch(`/api/videos`);
    return res.json();
  },

  getVideo: async (id) => {
    if (USE_MOCK) {
      return MOCK_VIDEOS.find(v => v.id === id) || { error: "Video not found" };
    }
    const res = await fetch(`/api/videos/${id}`);
    return res.json();
  },

  uploadToGitHub: async (file, onProgress) => {
    if (!githubToken) {
      throw new Error('请先输入 GitHub Token');
    }
    
    const fileName = file.name;
    const content = await fileToBase64(file);
    
    // 先检查文件是否已存在
    const existingFile = await checkFileExists(fileName);
    
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
    
    const body = {
      message: `upload: ${fileName}`,
      content: content,
      branch: BRANCH
    };
    
    if (existingFile) {
      body.sha = existingFile.sha;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '上传失败');
    }
    
    const result = await response.json();
    return {
      name: fileName,
      url: result.content.download_url,
      path: result.content.path
    };
  },

  getUser: async (id) => {
    if (USE_MOCK) {
      return MOCK_USER;
    }
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  },

  getCategories: async () => {
    if (USE_MOCK) {
      return MOCK_CATEGORIES;
    }
    const res = await fetch(`/api/categories`);
    return res.json();
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

async function checkFileExists(fileName) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/videos/${fileName}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${githubToken}`,
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // 文件不存在
  }
  return null;
}
