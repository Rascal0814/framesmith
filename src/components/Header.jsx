import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

function Header() {
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
          <Link to="/profile/1">我的主页</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
