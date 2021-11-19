import { Route, Routes } from 'react-router-dom'
import './App.css'
import CloseEvent from './CloseEvent'
import CreateEvent from './CreateEvent'
import EventList from './EventList'
import GuidePost from './GuidePost'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GuidePost />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events/:id/close" element={<CloseEvent />} />
        <Route path="/events" element={<EventList />} />
      </Routes>
    </div>
  )
}

export default App
