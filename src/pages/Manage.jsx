import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api, getIsOwner } from '../api'

function Manage() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: '', tags: '' })

  useEffect(() => {
    if (!getIsOwner()) {
      navigate('/profile/1')
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

  const handleEdit = (video) => {
    setEditing(video.id)
    setForm({
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags.join(', ')
    })
  }

  const handleSave = async (id) => {
    try {
      await api.updateVideo(id, {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t)
      })
      setMessage('保存成功')
      setEditing(null)
      loadData()
    } catch (e) {
      setMessage('保存失败: ' + e.message)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ title: '', description: '', category: '', tags: '' })
  }

  if (loading) {
    return (
      <div className="home">
        <Header />
        <main className="main-content"><div className="loading">加载中...</div></main>
      </div>
    )
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1>作品管理</h1>
          {message && <div style={{marginBottom: '20px', color: '#ff6b6b'}}>{message}</div>}
          <Link to="/profile/1" style={{display: 'inline-block', marginBottom: '20px'}}>← 返回个人主页</Link>
          
          {videos.map(video => (
            <div key={video.id} style={{background: 'var(--bg-card)', borderRadius: '12px', padding: '20px', marginBottom: '15px'}}>
              {editing === video.id ? (
                <div>
                  <div style={{marginBottom: '10px'}}>
                    <label style={{display: 'block', marginBottom: '5px', color: '#888'}}>标题</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                  </div>
                  <div style={{marginBottom: '10px'}}>
                    <label style={{display: 'block', marginBottom: '5px', color: '#888'}}>描述</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                  </div>
                  <div style={{marginBottom: '10px'}}>
                    <label style={{display: 'block', marginBottom: '5px', color: '#888'}}>分类</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}}>
                      <option value="">选择分类</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div style={{marginBottom: '10px'}}>
                    <label style={{display: 'block', marginBottom: '5px', color: '#888'}}>标签（逗号分隔）</label>
                    <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} />
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => handleSave(video.id)} style={{padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>保存</button>
                    <button onClick={handleCancel} style={{padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>取消</button>
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <h3>{video.title}</h3>
                    <p style={{color: '#888', fontSize: '14px', margin: '5px 0'}}>{video.description}</p>
                    <div style={{fontSize: '12px', color: '#666'}}>
                      <span style={{background: 'var(--accent)', padding: '3px 10px', borderRadius: '10px', marginRight: '10px'}}>{video.category}</span>
                      {video.tags.map(tag => <span key={tag} style={{marginRight: '8px'}}>#{tag}</span>)}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => handleEdit(video)} style={{padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer'}}>编辑</button>
                    <button onClick={() => handleDelete(video.id, video.title)} style={{padding: '8px 16px', background: '#ff4757', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer'}}>删除</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {videos.length === 0 && <p style={{color: '#888'}}>暂无作品</p>}
        </div>
      </main>
    </div>
  )
}

export default Manage
