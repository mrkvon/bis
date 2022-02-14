import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import CsvDownloader from 'react-csv-downloader'
import { useParams } from 'react-router-dom'
import {
  useGetEventParticipantsQuery,
  useGetOrganizedEventQuery,
} from '../../app/services/bronto'
import { sortCzechItem } from '../../helpers'
import FindOrCreatePerson from '../person/FindOrCreatePerson'
import { Person } from '../person/types'
import { generatePdf } from './participantsPdf'

const EventParticipants = () => {
  const params = useParams()
  const eventId = Number(params.eventId)

  const eventQuery = useGetOrganizedEventQuery(eventId)

  const { data: participants } = useGetEventParticipantsQuery(eventId)

  if (!eventQuery.isSuccess || !eventQuery.data) return null

  const event = eventQuery.data

  const csvColumns = [
    {
      id: 'givenName',
      displayName: 'Jméno',
    },
    {
      id: 'familyName',
      displayName: 'Příjmení',
    },
    {
      id: 'nickname',
      displayName: 'Přezdívka',
    },
    { id: 'email', displayName: 'email' },
  ]

  const participantsToCSV = () => {
    if (participants) {
      return participants?.map(
        ({ nickname, givenName, familyName, email }) => ({
          givenName,
          familyName,
          nickname,
          email,
        }),
      )
    } else {
      return []
    }
  }

  const generateAndSavePdf = () => {
    console.log(event)
    const doc = generatePdf(participants || [], event)
    doc.save(`Lidé přihlášení na akci: ${event.name}`)
  }

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
    {
      title: 'Akce',
      dataIndex: 'id',
      render: personId => (
        <Button
          onClick={() => {
            alert('remove event participant ' + personId)
            /*
            dispatch(
              removeEventParticipant({
                personId,
                eventId,
              }),
            )
            */
          }}
        >
          Smazat
        </Button>
      ),
    },
  ]

  const participantComponent = !participants ? (
    <span>Čekejte prosím...</span>
  ) : (
    <>
      <FindOrCreatePerson
        onPerson={person => {
          alert('add event participant ' + person.id)
          /*
          dispatch(
            addEventParticipant({
              eventId,
              participant: { ...person, participated: false },
            }),
          )
          */
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
        <CsvDownloader
          filename={`Lidé přihlášení na akci: ${event.name}`}
          datas={participantsToCSV}
          columns={csvColumns}
          disabled={!participants || participants.length === 0}
        >
          <Button>stáhnout do excelu</Button>
        </CsvDownloader>
        <Button onClick={generateAndSavePdf}>stáhnout do pdf</Button>
      </header>
      {participantComponent}
    </>
  )
}

export default EventParticipants
