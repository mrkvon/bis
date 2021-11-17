import { Route, Routes } from 'react-router-dom'
import './App.css'
import GuidePost from './GuidePost'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GuidePost />} />
      <Route path="/create" element={<div>Create Event</div>} />
      <Route path="/close" element={<div>After Event</div>} />
    </Routes>
  )
}

export default App
