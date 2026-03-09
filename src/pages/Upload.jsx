import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setToken, getToken } from '../api'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">SampleHub</span>
        </Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/upload">上传作品</Link>
          <Link to="/profile/1">我的主页</Link>
        </nav>
      </div>
    </header>
  )
}

function Upload() {
  const navigate = useNavigate()
  const [token, setTokenInput] = useState(() => getToken())
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbFile, setThumbFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setMessage('请输入 GitHub Token')
      return
    }
    
    if (!videoFile) {
      setMessage('请选择视频文件')
      return
    }
    
    setToken(token)
    localStorage.setItem('github_token', token)
    
    setUploading(true)
    setMessage('上传中...')

    try {
      // 上传视频并保存信息
      const video = await api.uploadToGitHub(videoFile, {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        duration: Math.floor(videoFile.duration / 1000) || 60,
        thumbnail: thumbFile ? await fileToDataUrl(thumbFile) : null
      })
      
      alert(`上传成功！\n标题: ${video.title}\n视频已添加到作品列表！`)
      navigate('/')
    } catch (error) {
      setMessage('上传失败: ' + error.message)
    }
    
    setUploading(false)
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="upload-page">
          <div className="upload-container">
            <h1>上传作品</h1>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>GitHub Token *</label>
                <input
                  type="password"
                  value={token}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="请输入 GitHub Token"
                  required
                />
              </div>
              <div className="form-group">
                <label>视频文件 *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => setVideoFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="form-group">
                <label>作品标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="给你的作品起个名字"
                  required
                />
              </div>
              <div className="form-group">
                <label>作品描述 *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="描述一下这个作品..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>分类 *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  required
                >
                  <option value="">选择分类</option>
                  <option value="广告宣传">广告宣传</option>
                  <option value="产品展示">产品展示</option>
                  <option value="游戏">游戏</option>
                  <option value="文化">文化</option>
                  <option value="金融">金融</option>
                  <option value="短视频">短视频</option>
                  <option value="纪录片">纪录片</option>
                </select>
              </div>
              <div className="form-group">
                <label>标签</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({...form, tags: e.target.value})}
                  placeholder="用逗号分隔标签"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={uploading}>
                {uploading ? '上传中...' : '上传到GitHub'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default Upload
