import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { sortCzechItem } from '../../helpers'
import FindOrCreatePerson from '../person/FindOrCreatePerson'
import { Person } from '../person/types'
import {
  addEventParticipant,
  readEventParticipants,
  selectEvent,
  selectEventParticipants,
} from './eventSlice'

const EventParticipants = () => {
  const dispatch = useAppDispatch()
  const params = useParams()
  const eventId = Number(params.eventId)

  useEffect(() => {
    dispatch(readEventParticipants(eventId))
  }, [dispatch, eventId])

  const event = useAppSelector(state => selectEvent(state, eventId))
  const participants = useAppSelector(state =>
    selectEventParticipants(state, eventId),
  )

  if (!event) return <span>Nenašly jsme akci</span>

  const columns: ColumnsType<Person> = [
    {
      title: 'Přezdívka',
      dataIndex: 'nickname',
      sorter: sortCzechItem('nickname'),
    },
    {
      title: 'Jméno',
      dataIndex: 'givenName',
      sorter: sortCzechItem('givenName'),
    },
    {
      title: 'Příjmení',
      dataIndex: 'familyName',
      sorter: sortCzechItem('familyName'),
    },
  ]

  const participantComponent = !participants ? (
    <span>Čekejte prosím...</span>
  ) : (
    <>
      <FindOrCreatePerson
        onPerson={person => {
          dispatch(
            addEventParticipant({
              eventId,
              participant: { ...person, participated: false },
            }),
          )
        }}
      />
      <Table<Person>
        size="small"
        columns={columns}
        dataSource={participants}
        rowKey="id"
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  )

  return (
    <>
      <header>
        <h2 className="text-2xl font-bold mb-4">
          Lidé přihlášení na akci: {event.name}
        </h2>
      </header>
      {participantComponent}
    </>
  )
}

export default EventParticipants
