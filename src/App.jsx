import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import VideoDetail from './pages/VideoDetail'
import Profile from './pages/Profile'
import Manage from './pages/Manage'
import Categories from './pages/Categories'
import './App.css'

function NotFound() {
  useEffect(() => {
    window.location.href = '/'
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter basename="/framesmith/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
