import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import * as api from './loginAPI'
import { Credentials } from './types'

export interface LoginState {
  isLoggedIn: boolean
  username: string
  roles: ('org' | 'mem')[]
  isPending: boolean
}

const initialState: LoginState = {
  isLoggedIn: false,
  isPending: false,
  username: '',
  roles: [],
}

export const login = createAsyncThunk(
  'login/login',
  async (credentials: Credentials) => {
    return await api.login(credentials)
  },
)

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(login.fulfilled, (state, action) => {
        return { ...action.payload, isPending: false }
      })
      .addCase(login.pending, state => {
        state.isPending = true
      })
      .addCase(login.rejected, state => {
        state.isPending = false
      }),
})

export const selectLogin = (state: RootState) => state.login
export const selectIsLoggedIn = createSelector(
  selectLogin,
  login => login.isLoggedIn,
)
export const selectIsPending = createSelector(
  selectLogin,
  login => login.isPending,
)

export default loginSlice.reducer
