import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api, getIsOwner } from '../api'

function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    if (!getIsOwner()) {
      navigate('/profile/1')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const data = await api.getCategories()
    setCategories(data)
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newCategory.trim()) return
    if (categories.includes(newCategory)) {
      setMessage('分类已存在')
      return
    }
    try {
      await api.saveCategories([...categories, newCategory.trim()])
      setMessage('添加成功')
      setNewCategory('')
      loadData()
    } catch (e) {
      setMessage('添加失败: ' + e.message)
    }
  }

  const handleDelete = async (cat) => {
    if (!confirm(`确定删除分类 "${cat}" 吗？`)) return
    try {
      await api.saveCategories(categories.filter(c => c !== cat))
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
        <main className="main-content"><div className="loading">加载中...</div></main>
      </div>
    )
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <h1>分类管理</h1>
          {message && <div style={{marginBottom: '20px', color: '#ff6b6b'}}>{message}</div>}
          
          <Link to="/profile/1" style={{display: 'inline-block', marginBottom: '20px'}}>← 返回个人主页</Link>
          
          <div style={{background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px'}}>添加分类</h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)} 
                placeholder="新分类名称"
                onKeyPress={e => e.key === 'Enter' && handleAdd()}
                style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'white'}} 
              />
              <button onClick={handleAdd} style={{padding: '12px 24px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>添加</button>
            </div>
          </div>
          
          <div style={{background: 'var(--bg-card)', padding: '20px', borderRadius: '12px'}}>
            <h3 style={{marginBottom: '15px'}}>现有分类 ({categories.length})</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {categories.map(cat => (
                <div key={cat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-primary)',
                  padding: '10px 15px',
                  borderRadius: '20px'
                }}>
                  <span>{cat}</span>
                  <button 
                    onClick={() => handleDelete(cat)}
                    style={{background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '18px'}}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {categories.length === 0 && <p style={{color: '#888'}}>暂无分类</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Categories
