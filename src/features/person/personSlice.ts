import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { Entity } from '../../types'
import { Person } from './types'
import * as api from './personAPI'
import { RootState } from '../../app/store'
import { readEvent, readEventParticipants } from '../event/eventSlice'
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
      .addCase(readEvent.fulfilled, (state, action) => {
        const { responsiblePerson, team } = action.payload
        const persons = [responsiblePerson, ...team].filter(
          a => !!a,
        ) as Person[]

        persons.forEach(person => {
          state.entities.byId[person.id] = person
          if (!state.entities.allIds.includes(person.id)) {
            state.entities.allIds.push(person.id)
          }
        })
      })
  },
})

const selectStringParam = (_: RootState, param: string) => param
const selectNumberParam = (_: RootState, param: number) => param
const selectNumberArrayParam = (_: RootState, param: number[]) => param
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

export const selectPersonDict = (state: RootState) => state.person.entities.byId

export const selectPerson = createSelector(
  selectNumberParam,
  selectPersonDict,
  (personId, personDict) => personDict[personId],
)

export const selectPeople = createSelector(
  selectNumberArrayParam,
  selectPersonDict,
  (personIds, personDict) =>
    personIds.map(id => personDict[id]).filter(a => !!a) as Person[],
)

export const selectInProgress = (state: RootState) => state.person.inProgress

export default personSlice.reducer
