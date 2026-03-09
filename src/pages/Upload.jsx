import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setToken, getToken, getIsOwner, logout } from '../api'

function Header() {
  const [isOwner, setIsOwner] = useState(false)
  
  useEffect(() => {
    setIsOwner(getIsOwner())
  }, [])
  
  const handleLogout = () => {
    logout()
    setIsOwner(false)
    window.location.href = '/'
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">SampleHub</span>
        </Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          {isOwner && (
            <>
              <Link to="/upload">上传作品</Link>
              <Link to="/admin">管理</Link>
            </>
          )}
          <Link to="/profile/1">我的主页</Link>
          {isOwner && (
            <a href="#" onClick={handleLogout} style={{color: '#ff6b6b'}}>退出</a>
          )}
        </nav>
      </div>
    </header>
  )
}

function Upload() {
  const navigate = useNavigate()
  const [token, setTokenInput] = useState(() => getToken())
  const [isOwner, setIsOwner] = useState(() => getIsOwner())
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  })
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleVerify = async () => {
    if (!token) {
      setMessage('请输入 Token')
      return
    }
    setMessage('验证中...')
    try {
      const owner = await setToken(token)
      setIsOwner(owner)
      if (owner) {
        setMessage('验证成功！')
      } else {
        setMessage('Token 有效但你不是仓库所有者')
      }
    } catch (e) {
      setMessage('Token 无效')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isOwner) {
      setMessage('请先验证所有者身份')
      return
    }
    
    if (!videoFile) {
      setMessage('请选择视频文件')
      return
    }
    
    setUploading(true)
    setMessage('上传中...')

    try {
      await api.uploadToGitHub(videoFile, {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        duration: Math.floor(videoFile.duration / 1000) || 60
      })
      alert('上传成功！')
      navigate('/')
    } catch (error) {
      setMessage('上传失败: ' + error.message)
    }
    
    setUploading(false)
  }

  if (isOwner) {
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

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="upload-page">
          <div className="upload-container">
            <h1>验证身份</h1>
            <p style={{color: '#888', marginBottom: '20px'}}>
              请输入 GitHub Token 验证所有者身份
            </p>
            {message && <div className="message">{message}</div>}
            <div className="form-group">
              <label>GitHub Token *</label>
              <input
                type="password"
                value={token}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="请输入 GitHub Token"
              />
            </div>
            <button onClick={handleVerify} className="submit-btn" style={{marginBottom: '20px'}}>
              验证身份
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Upload
