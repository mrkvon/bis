import { Link } from 'react-router-dom'
import { Button } from 'antd'

/*
 * Tlačítko Po Akci se ukáže jen když budou neuzavřené akce
 *
 */
const GuidePost = () => (
  <div>
    <Link to="/create">
      <Button>Nová akce</Button>
    </Link>
    <Link to="/events/id/close">
      <Button>Po akci</Button>
    </Link>
    <Link to="/events">
      <Button>Moje akce</Button>
    </Link>
  </div>
)

export default GuidePost
