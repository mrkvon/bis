import { wait } from '../../helpers'
import { BeforeEventProps, EventProps } from './types'

export const createEvent = async (
  event: BeforeEventProps,
): Promise<EventProps> => {
  await wait(500)
  return {
    ...(event as EventProps) /* TODO this is just a lazy fix. Should return full event data (or figure out a better way) */,
    id: Math.random(),
  }
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

export const readLoggedUserEvents = async (): Promise<EventProps[]> => {
  await wait(500)
  return []
}
