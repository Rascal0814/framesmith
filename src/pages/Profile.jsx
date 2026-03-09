import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import VideoCard from '../components/VideoCard'
import { api } from '../api'

function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [userData, videosData] = await Promise.all([
        api.getUser(id),
        api.getVideos()
      ])
      setUser(userData)
      setVideos(videosData.filter(v => v.user_id === id))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="loading">加载中...</div>
      </main>
    </div>
  )

  if (!user || user.error) return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="loading">用户不存在</div>
      </main>
    </div>
  )

  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="profile-page">
          <div className="profile-header">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{user.video_count}</span>
                  <span className="stat-label">作品</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{videos.reduce((acc, v) => acc + v.views, 0)}</span>
                  <span className="stat-label">总播放</span>
                </div>
              </div>
              <div className="skills">
                {user.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-videos">
            <h2>我的作品</h2>
            <div className="video-grid">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
