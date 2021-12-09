import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Entity } from '../../types'
import * as api from './eventAPI'
import { BeforeEventProps, EventProps } from './types'

export interface EventState {
  entities: Entity<EventProps>
}

const initialState: EventState = {
  entities: { byId: {}, allIds: [] },
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

export const readLoggedUserEvents = createAsyncThunk(
  'event/readLoggedUserEvents',
  async () => {
    return await api.readLoggedUserEvents()
  },
)

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
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
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload
        Object.assign(state.entities.byId[updatedEvent.id], updatedEvent)
      }),
})

const selectNumberParam = (_: RootState, param: number) => param
const selectEventDict = (state: RootState) => state.event.entities.byId

export const selectEvent = createSelector(
  selectNumberParam,
  selectEventDict,
  (param, eventDict) => eventDict[param],
)

export default eventSlice.reducer
