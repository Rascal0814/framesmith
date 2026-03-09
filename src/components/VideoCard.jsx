import { Link } from 'react-router-dom'
import { useRef } from 'react'

function VideoCard({ video }) {
  const videoRef = useRef(null)
  
  const formatViews = (views) => {
    if (views >= 10000) return (views / 10000).toFixed(1) + '万'
    return views
  }

  return (
    <Link to={`/video/${video.id}`} className="video-card">
      <div className="video-thumbnail">
        <video 
          ref={videoRef}
          src={video.video_url} 
          muted 
          playsInline 
          onLoadedMetadata={e => {
            video.duration = Math.round(e.target.duration)
          }}
        />
      </div>
      <div className="video-info">
        <h3>{video.title}</h3>
        <p className="video-desc">{video.description}</p>
        <div className="video-meta">
          <span className="category-tag">{video.category}</span>
          <span className="views">{formatViews(video.views)}播放</span>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
