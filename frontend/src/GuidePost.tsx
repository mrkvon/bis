import { Button } from 'antd'
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

/*
 * Tlačítko Po Akci se ukáže jen když budou neuzavřené akce
 *
 */
const GuidePost = () => {
  const [isNewEventSubmenuOpen, setIsNewEventSubmenuOpen] = useState(false)

  // Close the New event submenu when pressing Escape
  const closeSubmenuOnEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsNewEventSubmenuOpen(false)
    }
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', closeSubmenuOnEsc, false)

    return () => {
      document.removeEventListener('keydown', closeSubmenuOnEsc, false)
    }
  }, [closeSubmenuOnEsc])

  return (
    <div className="flex justify-between items-end gap-20">
      <nav className="grid grid-cols-2 gap-4">
        {isNewEventSubmenuOpen ? (
          <div className="flex flex-col gap-4 justify-evenly">
            <Link to="/events/create">
              <Button className="h-8 w-32 bg-yellow-300">
                Úplně nová akce
              </Button>
            </Link>
            <Link to="/events?clone">
              <Button className="h-8 w-32 bg-yellow-300">Klonovat akci</Button>
            </Link>
          </div>
        ) : (
          <Button
            onClick={() => setIsNewEventSubmenuOpen(true)}
            className="h-32 w-32 bg-yellow-200"
          >
            Nová akce
          </Button>
        )}
        <Link to="/events?edit">
          <Button className="h-32 w-32 bg-green-200 rounded-full">
            Upravit akci
          </Button>
        </Link>
        <Link to="/events?close">
          <Button className="h-32 w-32 bg-indigo-200">Po akci</Button>
        </Link>
        <Link to="">
          <Button className="h-32 w-32 bg-red-200 rounded-lg">Neco</Button>
        </Link>
      </nav>
      <nav className="mt-10 grid grid-cols-2 gap-4">
        <Link to="/events">
          <Button className="w-32">Moje akce</Button>
        </Link>
      </nav>
    </div>
  )
}

export default GuidePost
