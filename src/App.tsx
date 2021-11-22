import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useAppSelector } from './app/hooks'
import CloseEvent from './CloseEvent'
import CreateEvent from './CreateEvent'
import EventList from './EventList'
import Login from './features/login/Login'
import { selectIsLoggedIn, selectIsPending } from './features/login/loginSlice'
import GuidePost from './GuidePost'

function App() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const isPending = useAppSelector(selectIsPending)
  if (isPending) return <div>Přihlašování</div>
  if (!isLoggedIn) return <Login />
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
