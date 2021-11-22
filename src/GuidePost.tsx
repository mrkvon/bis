import { Link } from 'react-router-dom'
import { Button } from 'antd'

/*
 * Tlačítko Po Akci se ukáže jen když budou neuzavřené akce
 *
 */
const GuidePost = () => (
  <div className="grid grid-cols-2 gap-4">
    <Link to="/create">
      <Button className="h-32 w-32">Nová akce</Button>
    </Link>
    <Link to="/events/id/close">
      <Button className="h-32 w-32">Po akci</Button>
    </Link>
    <Link to="/events">
      <Button className="h-32 w-32">Moje akce</Button>
    </Link>
  </div>
)

export default GuidePost
