import { Link } from 'react-router-dom'
import { Button } from 'antd'

const GuidePost = () => (
  <div>
    <Link to="/create">
      <Button>Nová akce</Button>
    </Link>
  </div>
)

export default GuidePost
