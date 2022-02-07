import { AxiosResponse } from 'axios'
import axios from '../../config/axios'
import { wait } from '../../helpers'
import { fakePeople } from '../person/personAPI'
import { Person } from '../person/types'
import { BeforeEventProps, EventProps, eventTypes, Participant } from './types'

export const createEvent = async (
  event: BeforeEventProps,
): Promise<EventProps> => {
  // remove fields that break this...
  const data: Partial<BeforeEventProps> = { ...event }
  delete data.diet
  delete data.mainPhoto
  const response = await axios.request<
    EventProps,
    AxiosResponse<EventProps>,
    Partial<BeforeEventProps>
  >({
    method: 'post',
    url: 'frontend/events/',
    data,
  })

  axios.request

  return response.data
}

export const updateEvent = async (
  id: EventProps['id'],
  values: Partial<EventProps>,
) => {
  await wait(500)
  return {
    id,
    ...values,
  }
}

type Paginated<T> = {
  count: number
  next: null | number
  previous: null | number
  results: T[]
}

export const readLoggedUserEvents = async (): Promise<EventProps[]> => {
  const response = await axios.request<
    Paginated<EventProps & { eventType: { name: string; slug: string } }>
  >({
    method: 'get',
    url: 'frontend/organized_events/',
  })

  return response.data.results.map(result => ({
    ...result,
    eventType: (result.eventType?.slug ?? null) as keyof typeof eventTypes,
  }))
}

export const readEvent = async (id: number): Promise<EventProps> => {
  const response = await axios.request<
    EventProps & { eventType: { name: string; slug: string } }
  >({
    method: 'get',
    url: `frontend/organized_events/${id}/`,
  })

  const event = {
    ...response.data,
    team: [],
    eventType: response.data.eventType.slug as keyof typeof eventTypes,
  }

  return event
}

export const readEventParticipants = async (
  id: number,
): Promise<(Participant & Person)[]> => {
  await wait(500)
  id
  return fakeEventParticipants
}

export const addEventParticipant = async (
  eventId: number,
  participant: Participant,
) => {
  eventId
  participant
  await wait(700)
}

export const removeEventParticipant = async (
  eventId: number,
  personId: number,
) => {
  eventId
  personId
  await wait(600)
}

const fakeEventParticipants: (Participant & Person)[] = fakePeople
  .slice(0, 3)
  .map(person => ({ ...person, participated: false }))

/*
const fakeEvents: EventProps[] = range(8).map(i => ({
  id: i,
  basicPurpose: 'camp',
  eventType: 'dobrovolnicka',
  name: `Akce ${i}`,
  dateFrom: '2022-08-12',
  dateTo: '2022-08-15',
  startTime: '12:00',
  repetitions: 1,
  program: 'PsB',
  intendedFor: 'adolescents_and_adults',
  newcomerText1: '',
  newcomerText2: '',
  newcomerText3: '',
  administrativeUnit: 1,
  location: [(Math.random() - 0.5) * 180, (Math.random() - 0.5) * 360],
  locationInfo: 'here is some location info',
  targetMembers: false,
  advertiseInRoverskyKmen: false,
  advertiseInBrontoWeb: false,
  registrationMethod: 'not_required',
  entryFormUrl: '',
  registrationMethodEmail: '',
  additionalQuestion1: '',
  additionalQuestion2: '',
  additionalQuestion3: '',
  additionalQuestion4: '',
  additionalQuestion5: '',
  additionalQuestion6: '',
  additionalQuestion7: '',
  additionalQuestion8: '',
  participationFee: '0',
  ageFrom: 0,
  ageTo: 99,
  accommodation: 'accommodation',
  diet: ['vegan', 'gluten_free'],
  workingHours: 0,
  workingDays: 0,
  contactPersonName: 'asdf',
  contactPersonEmail: 'asdf@example.com',
  contactPersonTelephone: '',
  webUrl: '',
  note: '',
  responsiblePerson: 1,
  team: [2, 3, 0],
  invitationText1: 'a',
  invitationText2: 'a',
  invitationText3: 'a',
  invitationText4: 'a',
  mainPhoto: 'asdf',
  additionalPhotos: [],
  photos: [],
  feedbackLink: '',
  participantListScan: '',
  documentsScan: [],
  bankAccount: '',
  hoursWorked: 0,
  commentOnWorkDone: '',
  totalParticipants: 0,
  totalParticipantsUnder26: 0,
  participantList: [],
}))
*/
