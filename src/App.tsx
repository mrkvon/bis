import { Button } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks'
import CloseEvent from './features/event/CloseEvent'
import CreateEvent from './features/event/CreateEvent'
import EventList from './features/event/EventList'
import Login from './features/login/Login'
import { chooseRole, selectLogin } from './features/login/loginSlice'
import RoleSwitch from './features/login/RoleSwitch'
import GuidePost from './GuidePost'
import Header from './Header'

function App() {
  const { currentRole, isLoggedIn, isPending } = useAppSelector(selectLogin)
  const dispatch = useAppDispatch()
  return (
    <>
      <div className="min-h-screen w-full">
        <Header />
        <div className="p-6">
          {isPending ? (
            <div>Přihlašování</div>
          ) : !isLoggedIn ? (
            <Login />
          ) : currentRole === '' ? (
            <RoleSwitch />
          ) : currentRole === 'org' ? (
            <Routes>
              <Route path="/" element={<GuidePost />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/events/:id/close" element={<CloseEvent />} />
              <Route path="/events" element={<EventList />} />
            </Routes>
          ) : (
            <div className="flex items-center justify-center flex-col gap-4">
              not implemented
              <Button onClick={() => dispatch(chooseRole(''))}>Back</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
