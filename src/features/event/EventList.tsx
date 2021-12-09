import { Button } from 'antd'
import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readLoggedUserEvents, selectEvents } from './eventSlice'
import { EventProps } from './types'

const EventItem: FC<{ event: EventProps }> = ({ event }) => (
  <div>
    {event.name}
    <Link to={`/events/${event.id}/close`}>
      <Button>Uzavřít</Button>
    </Link>
  </div>
)

const EventList = () => {
  const events = useAppSelector(selectEvents)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(readLoggedUserEvents())
  }, [dispatch])
  return (
    <ul>
      {events.map(event => (
        <li key={event.id}>
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  )
}

export default EventList
