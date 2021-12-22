import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { sortByCount, sortCzechItem } from '../../helpers'
import { readLoggedUserEvents, selectEvents } from './eventSlice'
import { audiences, EventProps, eventTypes, programs } from './types'

const EventList = () => {
  const events = useAppSelector(selectEvents)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(readLoggedUserEvents())
  }, [dispatch])

  const columns: ColumnsType<EventProps> = [
    {
      title: 'Název',
      dataIndex: 'name',
      sorter: sortCzechItem('name'),
    },
    {
      title: 'Od',
      dataIndex: 'dateFromTo',
      render: ([date]) => new Date(date).toLocaleDateString('cs-CZ'),
    },
    {
      title: 'Do',
      dataIndex: 'dateFromTo',
      render: ([date]: EventProps['dateFromTo']) =>
        new Date(date).toLocaleDateString('cs-CZ'),
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
      title: 'Pro koho',
      dataIndex: 'intendedFor',
      render: (id: EventProps['intendedFor']) => audiences[id],
      filters: sortByCount(events.map(({ intendedFor }) => intendedFor)).map(
        id => ({
          text: audiences[id],
          value: id,
        }),
      ),
      onFilter: (value, record) => record.intendedFor === value,
    },
    {
      title: 'Akce',
      dataIndex: 'id',
      render: eventId => (
        <nav>
          <Link to={`/events/${eventId}/edit`}>
            <Button>Upravit</Button>
          </Link>
          <Link to={`/events/${eventId}/close`}>
            <Button>Uzavřít</Button>
          </Link>
          <Link to={`/events/${eventId}/participants`}>
            <Button>Přidat účastníky</Button>
          </Link>
          <Link to={`/events/create?cloneEvent=${eventId}`}>
            <Button>Klonovat</Button>
          </Link>
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
