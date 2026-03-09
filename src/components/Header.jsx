import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [isOwner, setIsOwner] = useState(() => {
    return localStorage.getItem('is_owner') === 'true'
  })
  
  useEffect(() => {
    const handleStorage = () => {
      setIsOwner(localStorage.getItem('is_owner') === 'true')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">SampleHub</span>
        </Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/profile/1">个人主页</Link>
          {isOwner && (
            <>
              <Link to="/manage">作品管理</Link>
              <Link to="/categories">分类管理</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
