import { Route, Routes } from 'react-router-dom'
import './App.css'
import CreateEvent from './CreateEvent'
import GuidePost from './GuidePost'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GuidePost />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/close" element={<div>After Event</div>} />
      </Routes>
    </div>
  )
}

export default App
