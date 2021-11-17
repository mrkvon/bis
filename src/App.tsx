import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Link to="/create">Nová akce</Link>
          </div>
        }
      />
      <Route path="/create" element={<div>Create Event</div>} />
      <Route path="/close" element={<div>After Event</div>} />
    </Routes>
  )
}

export default App
