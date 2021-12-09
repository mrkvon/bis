import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Entity } from '../../types'
import * as api from './eventAPI'
import { BeforeEventProps, EventProps } from './types'

export interface EventState {
  entities: Entity<EventProps>
  status: 'input' | 'saving' | 'finished'
}

const initialState: EventState = {
  entities: { byId: {}, allIds: [] },
  status: 'input',
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

export const readEvent = createAsyncThunk(
  'event/read',
  async (id: number) => await api.readEvent(id),
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
      .addCase(readEvent.fulfilled, (state, action) => {
        const event = action.payload
        state.entities.byId[event.id] = event
        if (!state.entities.allIds.includes(event.id))
          state.entities.allIds.push(event.id)
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

export const selectStatus = (state: RootState) => state.event.status

export default eventSlice.reducer
