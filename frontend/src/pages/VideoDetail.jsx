import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../api'

function VideoDetail() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    setLoading(true)
    try {
      const data = await api.getVideo(id)
      setVideo(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const formatViews = (views) => {
    if (views >= 10000) return (views / 10000).toFixed(1) + '万'
    return views
  }

  if (loading) return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="loading">加载中...</div>
      </main>
    </div>
  )

  if (!video || video.error) return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="loading">视频不存在</div>
      </main>
    </div>
  )

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="video-detail">
          <div className="video-player">
            <video controls poster={video.thumbnail}>
              <source src={video.video_url} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
          </div>
          
          <div className="video-content">
            <h1>{video.title}</h1>
            
            <div className="video-stats">
              <span>{video.views}播放</span>
              <span>•</span>
              <span>{video.created_at}</span>
              <span>•</span>
              <span>{video.category}</span>
            </div>

            <div className="video-description">
              <h3>作品描述</h3>
              <p>{video.description}</p>
            </div>

            <div className="video-tags">
              <h3>标签</h3>
              <div className="tags">
                {video.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VideoDetail
