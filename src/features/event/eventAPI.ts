import { wait } from '../../helpers'
import { Event } from './types'

export const createEvent = async (event: Event): Promise<Event> => {
  await wait(500)
  return event
}

export const readLoggedUserEvents = async (): Promise<Event[]> => {
  await wait(500)
  return []
}
