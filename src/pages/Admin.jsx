import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { api, getIsOwner } from '../api'

function Admin() {
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!getIsOwner()) {
      window.location.href = '/upload'
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [videosData, categoriesData] = await Promise.all([
      api.getVideos(),
      api.getCategories()
    ])
    setVideos(videosData)
    setCategories(categoriesData)
    setLoading(false)
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`确定删除 "${title}" 吗？`)) return
    
    try {
      await api.deleteVideo(id)
      setMessage('删除成功')
      loadData()
    } catch (e) {
      setMessage('删除失败: ' + e.message)
    }
  }

  if (loading) {
    return (
      <div className="home">
        <Header />
        <main className="main-content">
          <div className="loading">加载中...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1>作品管理</h1>
          {message && <div className="message">{message}</div>}
          
          <div style={{marginTop: '20px'}}>
            <h2>作品列表 ({videos.length})</h2>
            <div style={{marginTop: '10px'}}>
              {videos.map(video => (
                <div key={video.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: 'var(--bg-card)',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <strong>{video.title}</strong>
                    <div style={{fontSize: '12px', color: '#888'}}>
                      {video.category} | {video.views}播放 | {video.created_at}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(video.id, video.title)}
                    style={{
                      background: '#ff4757',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
              ))}
              {videos.length === 0 && (
                <p style={{color: '#888'}}>暂无作品</p>
              )}
            </div>
          </div>

          <div style={{marginTop: '30px'}}>
            <h2>分类管理</h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '10px'
            }}>
              {categories.map(cat => (
                <span key={cat} style={{
                  background: 'var(--bg-card)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div style={{marginTop: '30px'}}>
            <Link to="/upload" className="submit-btn" style={{
              display: 'inline-block',
              textAlign: 'center',
              textDecoration: 'none'
            }}>
              上传新作品
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin
