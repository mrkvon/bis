import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Entity } from '../../types'
import * as personApi from '../person/personAPI'
import { Person } from '../person/types'
import * as api from './eventAPI'
import {
  BeforeEventProps,
  EventProps,
  EventWithParticipantsProps,
  Participant,
} from './types'

export interface EventState {
  entities: Entity<EventWithParticipantsProps | EventProps>
  status: 'input' | 'saving' | 'finished'
  loadingStatus: 'loading' | 'ready'
}

const initialState: EventState = {
  entities: { byId: {}, allIds: [] },
  status: 'input',
  loadingStatus: 'ready',
}

export const createEvent = createAsyncThunk(
  'event/create',
  async (event: BeforeEventProps) => {
    return await api.createEvent(event)
  },
)

export const updateEvent = createAsyncThunk(
  'event/update',
  async ({ id, ...values }: Partial<EventProps> & Pick<EventProps, 'id'>) => {
    return await api.updateEvent(id, values)
  },
)

export const readEvent = createAsyncThunk('event/read', async (id: number) => {
  const event = await api.readEvent(id)
  return {
    ...event,
    team: (
      await Promise.all(
        event.team.map(async id => await personApi.readPerson(id)),
      )
    ).filter(a => !!a) as Person[],
    responsiblePerson: await personApi.readPerson(event.responsiblePerson),
  }
})

export const readLoggedUserEvents = createAsyncThunk(
  'event/readLoggedUserEvents',
  async () => {
    return await api.readLoggedUserEvents()
  },
)

export const readEventParticipants = createAsyncThunk(
  'event/readParticipants',
  async (id: number) => {
    const participants = await api.readEventParticipants(id)
    const event = await api.readEvent(id)
    return { event, participants }
  },
)

export const addEventParticipant = createAsyncThunk(
  'event/addParticipant',
  async ({
    participant,
    eventId,
  }: {
    participant: Participant & Person
    eventId: number
  }) => {
    await api.addEventParticipant(eventId, participant)

    return { eventId, participant }
  },
)

export const removeEventParticipant = createAsyncThunk(
  'event/removeParticipant',
  async ({ personId, eventId }: { personId: number; eventId: number }) => {
    await api.removeEventParticipant(eventId, personId)

    return { eventId, personId }
  },
)

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<EventState['status']>) => {
      state.status = action.payload
    },
  },
  extraReducers: builder =>
    builder
      .addCase(createEvent.fulfilled, (state, action) => {
        const event = action.payload
        state.entities.allIds.push(event.id)
        state.entities.byId[event.id] = event
      })
      .addCase(readLoggedUserEvents.fulfilled, (state, action) => {
        const events = action.payload
        state.entities.allIds = events.map(event => event.id)
        state.entities.byId = Object.fromEntries(
          events.map(event => [event.id, event]),
        )
      })
      .addCase(updateEvent.pending, state => {
        state.status = 'saving'
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload
        Object.assign(state.entities.byId[updatedEvent.id], updatedEvent)
        state.status = 'finished'
      })
      .addCase(readEvent.pending, state => {
        state.loadingStatus = 'loading'
      })
      .addCase(readEvent.fulfilled, (state, action) => {
        const event = action.payload
        state.loadingStatus = 'ready'
        state.entities.byId[event.id] = {
          ...event,
          team: event.team.map(person => person.id),
          responsiblePerson: event.responsiblePerson?.id ?? -1,
        }
        if (!state.entities.allIds.includes(event.id))
          state.entities.allIds.push(event.id)
      })
      .addCase(readEventParticipants.fulfilled, (state, action) => {
        const { event, participants } = action.payload
        if (!state.entities.allIds.includes(event.id)) {
          state.entities.allIds.push(event.id)
        }
        state.entities.byId[event.id] = {
          ...event,
          participants: participants.map(({ id, participated }) => ({
            id,
            participated,
          })),
        }
      })
      .addCase(addEventParticipant.fulfilled, (state, action) => {
        const {
          eventId,
          participant: { id, participated },
        } = action.payload

        const participants = (
          state.entities.byId[eventId] as EventWithParticipantsProps
        ).participants

        const participant = participants.find(
          participant => participant.id === id,
        )

        if (participant) {
          participant.participated = participated
        } else {
          participants.unshift({
            id,
            participated,
          })
        }
      })
      .addCase(removeEventParticipant.fulfilled, (state, action) => {
        const { eventId, personId } = action.payload
        const event = state.entities.byId[eventId] as EventWithParticipantsProps
        event.participants = event.participants.filter(
          ({ id }) => id !== personId,
        )
      }),
})

export const { setStatus } = eventSlice.actions

const selectNumberParam = (_: RootState, param: number) => param
const selectEventDict = (state: RootState) => state.event.entities.byId

export const selectEvent = createSelector(
  selectNumberParam,
  selectEventDict,
  (param, eventDict) => eventDict[param],
)

export const selectEvents = (state: RootState) =>
  Object.values(state.event.entities.byId)

const selectPersonDict = (state: RootState) => state.person.entities.byId

export const selectEventParticipants = createSelector(
  selectEvent,
  selectPersonDict,
  (event, personDict) => {
    if (event && 'participants' in event) {
      return event.participants.map(({ id, participated }) => ({
        ...personDict[id],
        participated,
      }))
    }
  },
)

/*
selectEventParticipants: (state, eventId) => Participant[]

*/

export const selectStatus = (state: RootState) => state.event.status

export default eventSlice.reducer
