import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { sortByCount, sortCzechItem } from '../../helpers'
import { readLoggedUserEvents, selectEvents } from './eventSlice'
import { EventProps, eventTypes, programs } from './types'

const EventList = () => {
  const events = useAppSelector(selectEvents)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(readLoggedUserEvents())
  }, [dispatch])

  // Let's figure out which actions to allow
  // /events?edit - edit event, manage participants
  // /events?close - close event with closing form
  // /events?clone - clone: create event with data copied from another event
  const [searchParams] = useSearchParams()
  const requestedActions = Array.from(searchParams.keys())
  const availableActions = ['edit', 'close', 'clone']
  let actions = availableActions.filter(action =>
    requestedActions.includes(action),
  )

  actions = actions.length === 0 ? availableActions : actions

  const columns: ColumnsType<EventProps> = [
    {
      title: 'Od',
      dataIndex: 'dateFrom',
      render: (date: EventProps['dateFrom']) =>
        date ? new Date(date).toLocaleDateString('cs-CZ') : '',
      sorter: (a, b) => (a?.dateFrom ?? '').localeCompare(b.dateFrom),
    },
    {
      title: 'Do',
      dataIndex: 'dateTo',
      render: (date: EventProps['dateTo']) =>
        date ? new Date(date).toLocaleDateString('cs-CZ') : '',
      sorter: (a, b) => (a?.dateFrom ?? '').localeCompare(b.dateFrom),
    },
    {
      title: 'Název',
      dataIndex: 'name',
      sorter: sortCzechItem('name'),
    },
    {
      title: 'Pořádá',
      dataIndex: 'administrativeUnit',
    },
    {
      title: 'Typ',
      dataIndex: 'eventType',
      render: (id: EventProps['eventType']) => eventTypes[id],
      filters: sortByCount(events.map(({ eventType }) => eventType)).map(
        id => ({
          text: eventTypes[id],
          value: id,
        }),
      ),
      onFilter: (value, record) => record.eventType === value,
    },
    {
      title: 'Program',
      dataIndex: 'program',
      render: (id: EventProps['program']) => programs[id],
      filters: sortByCount(events.map(({ program }) => program)).map(id => ({
        text: programs[id],
        value: id,
      })),
      onFilter: (value, record) => record.program === value,
    },
    {
      title: 'Místo',
      dataIndex: 'location',
    },
    {
      title: 'Účastníci',
      // TODO sometimes we may need to count this from participant list
      dataIndex: 'totalParticipants',
    },
    {
      title: 'Účastníci do 26 let',
      // TODO this should be a percentage
      dataIndex: 'totalParticipantsUnder26',
    },
    {
      title: 'Odpracovaných hodin',
      dataIndex: 'hoursWorked',
    },
    {
      title: 'Akce',
      dataIndex: 'id',
      render: eventId => (
        <nav>
          {actions.includes('edit') && (
            <Link to={`/events/${eventId}/edit`}>
              <Button>Upravit</Button>
            </Link>
          )}
          {actions.includes('close') && (
            <Link to={`/events/${eventId}/close`}>
              <Button>Uzavřít</Button>
            </Link>
          )}
          {actions.includes('edit') && (
            <Link to={`/events/${eventId}/participants`}>
              <Button>Přidat účastníky</Button>
            </Link>
          )}
          {actions.includes('clone') && (
            <Link to={`/events/create?cloneEvent=${eventId}`}>
              <Button>Klonovat</Button>
            </Link>
          )}
        </nav>
      ),
    },
  ]

  return (
    <Table<EventProps>
      size="small"
      columns={columns}
      dataSource={events}
      rowKey="id"
      pagination={{ hideOnSinglePage: true }}
    />
  )
}

export default EventList
