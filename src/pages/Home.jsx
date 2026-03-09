import { useState, useEffect } from 'react'
import Header from '../components/Header'
import VideoCard from '../components/VideoCard'
import { api } from '../api'

function Home() {
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCategories().then(setCategories)
    fetchVideos()
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [selectedCategory])

  const fetchVideos = async () => {
    setLoading(true)
    const data = await api.getVideos(selectedCategory)
    setVideos(data)
    setLoading(false)
  }

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="hero">
          <h1>剪辑师作品集</h1>
          <p>展示我的视频作品集，记录每一个精彩瞬间</p>
        </div>

        <div className="category-filter">
          <button 
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
