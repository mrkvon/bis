import { Button } from 'antd'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useAppDispatch, useAppSelector } from './app/hooks'
import CloseEvent from './CloseEvent'
import CreateEvent from './CreateEvent'
import EventList from './EventList'
import Login from './features/login/Login'
import { chooseRole, selectLogin } from './features/login/loginSlice'
import RoleSwitch from './features/login/RoleSwitch'
import GuidePost from './GuidePost'

function App() {
  const { currentRole, isLoggedIn, isPending } = useAppSelector(selectLogin)
  const dispatch = useAppDispatch()
  if (isPending) return <div>Přihlašování</div>
  if (!isLoggedIn) return <Login />
  if (currentRole === '') return <RoleSwitch />
  if (currentRole === 'org')
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
  else
    return (
      <div
        className="bg-yellow-200 flex items-center justify-center w-screen h-screen flex-col gap-4
      "
      >
        not implemented
        <Button onClick={() => dispatch(chooseRole(''))}>Back</Button>
      </div>
    )
}

export default App
