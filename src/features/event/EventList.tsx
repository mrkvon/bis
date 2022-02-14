import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Link, useSearchParams } from 'react-router-dom'
import {
  brontoApi,
  useGetOrganizedEventsQuery,
} from '../../app/services/bronto'
import { sortByCount, sortCzechItem } from '../../helpers'
import { NullableEventProps, eventTypes, programs } from './types'

const EventList = () => {
  const { isLoading, data } = useGetOrganizedEventsQuery()
  const { data: administrativeUnits = [] } =
    brontoApi.useGetAdministrativeUnitsQuery()
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

  if (isLoading || !data) return <>Stahujeme data</>
  const events = data.results

  const columns: ColumnsType<NullableEventProps> = [
    {
      title: 'Od',
      dataIndex: 'dateFrom',
      render: (date: NullableEventProps['dateFrom']) =>
        date ? new Date(date).toLocaleDateString('cs-CZ') : '',
      sorter: (a, b) => (a?.dateFrom ?? '').localeCompare(b?.dateFrom ?? ''),
    },
    {
      title: 'Do',
      dataIndex: 'dateTo',
      render: (date: NullableEventProps['dateTo']) =>
        date ? new Date(date).toLocaleDateString('cs-CZ') : '',
      sorter: (a, b) => (a?.dateFrom ?? '').localeCompare(b?.dateFrom ?? ''),
    },
    {
      title: 'Název',
      dataIndex: 'name',
      sorter: sortCzechItem('name'),
    },
    {
      title: 'Pořádá',
      dataIndex: 'administrativeUnit',
      render: (id: number) =>
        id !== null && administrativeUnits.find(unit => id === unit.id)?.name,
    },
    {
      title: 'Typ',
      dataIndex: 'eventType',
      render: (id: NullableEventProps['eventType']) =>
        id !== null && eventTypes[id],
      filters: sortByCount(
        // collect eventTypes and get rid of nulls
        events.flatMap(({ eventType }) =>
          eventType !== null ? [eventType] : [],
        ),
      ).map(id => ({
        text: eventTypes[id],
        value: id,
      })),
      onFilter: (value, record) => record.eventType === value,
    },
    {
      title: 'Program',
      dataIndex: 'program',
      render: (id: NullableEventProps['program']) =>
        id === null ? '' : programs[id],
      filters: sortByCount(
        events.flatMap(({ program }) => (program !== null ? [program] : [])),
      ).map(id => ({
        text: programs[id],
        value: id,
      })),
      onFilter: (value, record) => record.program === value,
    },
    {
      title: 'Místo',
      dataIndex: 'location',
      render: (location: NullableEventProps['location']) =>
        location && location.name,
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
    <Table<NullableEventProps>
      size="small"
      columns={columns}
      dataSource={events}
      rowKey="id"
      pagination={{ hideOnSinglePage: true }}
    />
  )
}

export default EventList
