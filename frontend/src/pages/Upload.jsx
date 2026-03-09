import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../api'

function Upload() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    video_url: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.createVideo({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        duration: Math.floor(Math.random() * 300) + 60,
        user_id: '1'
      })
      alert('作品上传成功！')
      navigate('/')
    } catch (e) {
      alert('上传失败，请重试')
    }
    
    setSubmitting(false)
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="upload-page">
          <div className="upload-container">
            <h1>上传作品</h1>
            
            <form onSubmit={handleSubmit}>
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
                  rows={4}
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
                  placeholder="用逗号分隔标签，如：汽车, 科技, 广告"
                />
              </div>

              <div className="form-group">
                <label>视频链接</label>
                <input
                  type="url"
                  value={form.video_url}
                  onChange={e => setForm({...form, video_url: e.target.value})}
                  placeholder="输入视频URL（演示用）"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? '上传中...' : '发布作品'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Upload
