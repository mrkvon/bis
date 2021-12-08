import { useAppSelector } from './app/hooks'
import { selectLogin } from './features/login/loginSlice'
import { Link } from 'react-router-dom'

const Header = () => {
  const { currentRole, isLoggedIn } = useAppSelector(selectLogin)
  return (
    <header className="pl-6 pr-6 h-16 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl font-extrabold">
          Brontosaurus Panel{' '}
          {currentRole === 'org'
            ? 'Organizátora'
            : currentRole === 'mem'
            ? 'Člena'
            : 'Uživatele'}
        </h1>
      </Link>
      {isLoggedIn && <nav>Uživatel</nav>}
    </header>
  )
}

export default Header
