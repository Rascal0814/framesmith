import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

function VideoCard({ video }) {
  const videoRef = useRef(null)
  const [duration, setDuration] = useState(video.duration || 0)
  
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
            setDuration(Math.round(e.target.duration))
          }}
        />
        {duration > 0 && <span className="duration">{formatDuration(duration)}</span>}
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
