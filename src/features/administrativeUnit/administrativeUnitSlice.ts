import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Entity } from '../../types'
import { AdministrativeUnit } from './types'
import * as api from './administrativeUnitAPI'
import { RootState } from '../../app/store'

interface AdministrativeUnitState {
  entities: Entity<AdministrativeUnit>
  loadingStatus: 'loading' | 'ready'
}

const initialState: AdministrativeUnitState = {
  entities: { byId: {}, allIds: [] },
  loadingStatus: 'ready',
}

export const readAdministrativeUnits = createAsyncThunk(
  'administrativeUnit/readAll',
  async () => {
    return await api.readAdministrativeUnits()
  },
)

export const administrativeUnitSlice = createSlice({
  name: 'administrativeUnit',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(readAdministrativeUnits.pending, state => {
        state.loadingStatus = 'loading'
      })
      .addCase(readAdministrativeUnits.fulfilled, (state, action) => {
        const units = action.payload
        state.loadingStatus = 'ready'
        state.entities.allIds = units.map(({ id }) => id)
        state.entities.byId = Object.fromEntries(
          units.map(unit => [unit.id, unit]),
        )
      }),
})

export const selectAdministrativeUnits = (state: RootState) =>
  Object.values(state.administrativeUnit.entities.byId)

/** TODO loadingStatus is currently unused. we need to use it or remove it */
export const selectStatus = (state: RootState) =>
  state.administrativeUnit.loadingStatus

export default administrativeUnitSlice.reducer
