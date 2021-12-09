import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Entity } from '../../types'
import * as api from './eventAPI'
import { Event } from './types'

export interface EventState {
  entities: Entity<Event>
}

const initialState: EventState = {
  entities: { byId: {}, allIds: [] },
}

export const createEvent = createAsyncThunk(
  'event/create',
  async (event: Event) => {
    return await api.createEvent(event)
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
      }),
})

export default eventSlice.reducer
