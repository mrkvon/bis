import {
  audiences,
  basicPurposes,
  diets,
  eventTypes,
  programs,
  registrationMethods,
} from '../../features/event/types'
import { Nullable } from '../../types'

export type Paginated<T> = {
  count: number
  next: null | number
  previous: null | number
  results: T[]
}

export interface WhoAmIResponse {
  firstName: string
  lastName: string
  nickname: string
  isStaff: boolean
  isSuperuser: boolean
  isEventOrganizer: boolean
  id: number
}

export interface NonNullableEventResponse {
  id: number
  name: string
  dateFrom: string // YYYY-MM-dd
  dateTo: string
  program: keyof typeof programs
  indendedFor: keyof typeof audiences
  basicPurpose: keyof typeof basicPurposes
  opportunity: string
  location: {
    id: number
    name: string
    place: string
    region: string
    gpsLatitude: number | null
    gpsLongitude: number | null
  }
  ageFrom: number
  ageTo: number
  startDate: string // YYYY-MM-dd HH:mm(:ss)
  eventType: {
    name: string
    slug: keyof typeof eventTypes
  }
  responsiblePerson: string
  participationFee: string
  entryFormUrl: string
  webUrl: string
  invitationTextShort: string
  workingHours: number
  accommodation: string
  diet: Array<keyof typeof diets>
  lookingForwardToYou: string
  registrationMethod: keyof typeof registrationMethods
  administrativeUnits: number[]
  administrativeUnitName: string
  administrativeUnitWebUrl: string
  invitationText1: string
  invitationText2: string
  invitationText3: string
  invitationText4: string
  mainPhoto: string //url
  additionalPhoto1: string
  additionalPhoto2: string
  additionalPhoto3: string
  additionalPhoto4: string
  additionalPhoto5: string
  additionalPhoto6: string
  additionalQuestion1: string
  additionalQuestion2: string
  additionalQuestion3: string
  additionalQuestion4: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonTelephone: string
  publicOnWebDateFrom: string
  publicOnWebDateTo: string
  publicOnWeb: boolean
}

export type NonNullableEventRequest = Omit<NonNullableEventResponse, never>

export type EventResponse = Nullable<
  Omit<NonNullableEventResponse, 'id' | 'name'>
> &
  Pick<NonNullableEventResponse, 'id' | 'name'>

export type CreateEventRequest = Partial<
  Omit<NonNullableEventRequest, 'id' | 'name'>
> &
  Pick<NonNullableEventRequest, 'name'>

export type UpdateEventRequest = Partial<Omit<NonNullableEventRequest, 'id'>> &
  Pick<NonNullableEventRequest, 'id'>
