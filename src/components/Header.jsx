import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, getIsOwner, logout } from '../api'

function Header() {
  const [isOwner, setIsOwner] = useState(false)
  
  useEffect(() => {
    setIsOwner(getIsOwner())
  }, [])
  
  const handleLogout = () => {
    logout()
    setIsOwner(false)
    window.location.href = '/'
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">SampleHub</span>
        </Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/upload">上传作品</Link>
          {isOwner && <Link to="/admin">管理</Link>}
          <Link to="/profile/1">我的主页</Link>
          {isOwner && (
            <a href="#" onClick={handleLogout} style={{color: '#ff6b6b'}}>退出</a>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
