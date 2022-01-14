import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Entity } from '../../types'
import {
  addEventParticipant,
  readEvent,
  readEventParticipants,
} from '../event/eventSlice'
import { init, logout, selectLoggedUserId } from '../login/loginSlice'
import * as api from './personAPI'
import { Person } from './types'

const emptyPerson: Person = {
  id: -1,
  nickname: '',
  givenName: '',
  familyName: '',
  qualifications: [],
  birthdate: '',
  nationalIdentificationNumber: '',
  permanentAddressStreet: '',
  permanentAddressCity: '',
  permanentAddressPostCode: '',
  contactAddressStreet: '',
  contactAddressCity: '',
  contactAddressPostCode: '',
  phone: '',
  email: '',
}

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
  extraReducers: builder =>
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
      .addCase(init.fulfilled, (state, action) => {
        if (action.payload) {
          const { givenName, familyName, nickname, userId } = action.payload

          if (!state.entities.allIds.includes(userId))
            state.entities.allIds.push(userId)
          if (!state.entities.byId[userId])
            state.entities.byId[userId] = { ...emptyPerson }

          Object.assign(state.entities.byId[userId], {
            givenName,
            familyName,
            nickname,
            id: userId,
          })
        }
      })
      .addCase(logout, () => initialState),
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

export const selectLoggedUser = createSelector(
  selectLoggedUserId,
  selectPersonDict,
  (userId, personDict) => personDict[userId],
)

export const selectInProgress = (state: RootState) => state.person.inProgress

export default personSlice.reducer
