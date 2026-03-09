import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import { api, getIsOwner, logout, setToken, getToken } from '../api'
import VideoCard from '../components/VideoCard'

function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [token, setTokenInput] = useState(() => getToken())
  const [message, setMessage] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    thumbnail: '',
  })
  const [videoFile, setVideoFile] = useState(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setIsOwner(getIsOwner())
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    const [userData, videosData, categoriesData] = await Promise.all([
      api.getUser(id),
      api.getVideos(),
      api.getCategories()
    ])
    setUser(userData)
    setVideos(videosData.filter(v => v.user_id === id))
    setCategories(categoriesData)
    setLoading(false)
  }

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
        window.location.href = '/framesmith/profile/1'
      } else {
        setMessage('Token 有效但你不是所有者')
      }
    } catch (e) {
      setMessage('Token 无效')
    }
  }

  const handleLogout = () => {
    logout()
    setIsOwner(false)
    setMessage('')
    window.location.href = '/framesmith/'
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!videoFile) {
      setMessage('请选择视频文件')
      return
    }
    setUploading(true)
    try {
      await api.uploadToGitHub(videoFile, {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
        thumbnail: uploadForm.thumbnail || null,
        duration: videoDuration || 60,
      })
      alert('上传成功！')
      setShowUpload(false)
      setUploadForm({ title: '', description: '', category: '', tags: '', thumbnail: '' })
      setVideoDuration(0)
      fetchData()
    } catch (e) {
      setMessage('上传失败: ' + e.message)
    }
    setUploading(false)
  }

  const handleDelete = async (videoId, title) => {
    if (!confirm(`确定删除 "${title}" 吗？`)) return
    try {
      await api.deleteVideo(videoId)
      setMessage('删除成功')
      fetchData()
    } catch (e) {
      setMessage('删除失败: ' + e.message)
    }
  }

  if (loading) {
    return (
      <div className="home">
        <Header />
        <main className="main-content"><div className="loading">加载中...</div></main>
      </div>
    )
  }

  if (!user || user.error) {
    return (
      <div className="home">
        <Header />
        <main className="main-content"><div className="loading">用户不存在</div></main>
      </div>
    )
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        {!isOwner && (
          <div style={{maxWidth: '400px', margin: '0 auto 30px', padding: '20px', background: 'var(--bg-card)', borderRadius: '12px'}}>
            <h3 style={{marginBottom: '15px'}}>我是博主？</h3>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '15px'}}>输入 GitHub Token 验证身份，验证后可管理作品</p>
            {message && <div style={{color: '#ff6b6b', marginBottom: '10px'}}>{message}</div>}
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="password" value={token} onChange={e => setTokenInput(e.target.value)} placeholder="GitHub Token" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
              <button onClick={handleVerify} style={{padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>验证</button>
            </div>
          </div>
        )}

        {isOwner && (
          <div style={{maxWidth: '400px', margin: '0 auto 30px', padding: '20px', background: 'var(--bg-card)', borderRadius: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3>博主管理</h3>
              <button onClick={handleLogout} style={{background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer'}}>退出</button>
            </div>
            <button onClick={() => setShowUpload(!showUpload)} style={{width: '100%', padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginBottom: '10px'}}>
              {showUpload ? '取消上传' : '上传新作品'}
            </button>
            {showUpload && (
              <form onSubmit={handleUpload}>
                <label style={{display: "block", marginBottom: "5px", color: "#888"}}>视频文件 *</label>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={e => {
                    setVideoFile(e.target.files[0])
                    const file = e.target.files[0]
                    if (file) {
                      const video = document.createElement("video")
                      video.preload = "metadata"
                      video.onloadedmetadata = () => setVideoDuration(Math.round(video.duration))
                      video.src = URL.createObjectURL(file)
                    }
                  }} 
                  required 
                  style={{marginBottom: "15px", width: "100%"}} 
                />
                <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files[0])} style={{marginBottom: "15px", width: "100%"}} />
                <input type="text" placeholder="标题" value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} required style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                <textarea placeholder="描述" value={uploadForm.description} onChange={e => setUploadForm({...uploadForm, description: e.target.value})} required rows={2} style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                <select value={uploadForm.category} onChange={e => setUploadForm({...uploadForm, category: e.target.value})} required style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}}>
                  <option value="">选择分类</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="text" placeholder="标签（逗号分隔）" value={uploadForm.tags} onChange={e => setUploadForm({...uploadForm, tags: e.target.value})} style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                <input type="text" placeholder="缩略图URL（可选）" value={uploadForm.thumbnail} onChange={e => setUploadForm({...uploadForm, thumbnail: e.target.value})} style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                <button type="submit" disabled={uploading} style={{width: '100%', padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>{uploading ? '上传中...' : '发布'}</button>
              </form>
            )}
          </div>
        )}

        <div className="profile-page">
          <div className="profile-header">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-stats">
                <div className="stat"><span className="stat-value">{user.video_count}</span><span className="stat-label">作品</span></div>
                <div className="stat"><span className="stat-value">{videos.reduce((acc, v) => acc + v.views, 0)}</span><span className="stat-label">总播放</span></div>
              </div>
              <div className="skills">
                {user.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
              </div>
            </div>
          </div>

          <div className="profile-videos">
            <h2>我的作品</h2>
            <div className="video-grid">
              {videos.map(video => (
                <div key={video.id} style={{position: 'relative'}}>
                  <VideoCard video={video} />
                  {isOwner && (
                    <button onClick={() => handleDelete(video.id, video.title)} style={{position: 'absolute', top: '10px', right: '10px', background: '#ff4757', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>删除</button>
                  )}
                </div>
              ))}
            </div>
            {videos.length === 0 && <p style={{color: '#888'}}>暂无作品</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
