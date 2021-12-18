import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { Entity } from '../../types'
import { Person } from './types'
import * as api from './personAPI'
import { RootState } from '../../app/store'
import { readEventParticipants } from '../event/eventSlice'
import { addEventParticipant } from '../event/eventSlice'

export interface PersonState {
  entities: Entity<Person>
  inProgress: boolean
}

const initialState: PersonState = {
  entities: { byId: {}, allIds: [] },
  inProgress: false,
}

export const searchPeople = createAsyncThunk(
  'person/search',
  async (query: string) => {
    return await api.searchPeople(query)
  },
)

export const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(searchPeople.pending, state => {
        state.inProgress = true
      })
      .addCase(searchPeople.fulfilled, (state, action) => {
        const foundPeople = action.payload

        foundPeople.forEach(person => {
          state.entities.byId[person.id] = person
          if (!state.entities.allIds.includes(person.id))
            state.entities.allIds.push(person.id)
        })

        state.inProgress = false
      })
      .addCase(searchPeople.rejected, state => {
        state.inProgress = false
      })
      .addCase(readEventParticipants.fulfilled, (state, action) => {
        const { participants } = action.payload
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        participants.forEach(({ participated, ...person }) => {
          state.entities.byId[person.id] = person
          if (!state.entities.allIds.includes(person.id)) {
            state.entities.allIds.push(person.id)
          }
        })
      })
      .addCase(addEventParticipant.fulfilled, (state, action) => {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          participant: { participated, ...person },
        } = action.payload

        if (!state.entities.allIds.includes(person.id)) {
          state.entities.allIds.push(person.id)
          state.entities.byId[person.id] = person
        }
      })
  },
})

const selectStringParam = (_: RootState, param: string) => param
const selectUsers = (state: RootState) =>
  Object.values(state.person.entities.byId)

export const selectSearchUsers = createSelector(
  selectStringParam,
  selectUsers,
  (query, users) => {
    if (query.length === 0) return [] as Person[]

    return users.filter(user =>
      Object.values(user)
        .filter<string>((value): value is string => typeof value === 'string')
        .some(value => value.toLowerCase().includes(query.toLowerCase())),
    )
  },
)

export const selectInProgress = (state: RootState) => state.person.inProgress

export default personSlice.reducer
