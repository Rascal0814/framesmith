import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VideoDetail from './pages/VideoDetail'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/framesmith/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
