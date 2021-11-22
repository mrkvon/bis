import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import * as api from './loginAPI'
import { Credentials, Role } from './types'

export interface LoginState {
  isLoggedIn: boolean
  username: string
  roles: Role[]
  currentRole: '' | Role
  isPending: boolean
}

const initialState: LoginState = {
  isLoggedIn: false,
  isPending: false,
  username: '',
  roles: [],
  currentRole: '',
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
  reducers: {
    chooseRole: (state, action: PayloadAction<Role | ''>) => {
      state.currentRole = action.payload
    },
  },
  extraReducers: builder =>
    builder
      .addCase(login.fulfilled, (state, action) => {
        // if user has only one available role, it will be picked
        // otherwise we won't assign any and user will have to do it
        const currentRole =
          action.payload.roles.length === 1 ? action.payload.roles[0] : ''
        return { ...action.payload, isPending: false, currentRole }
      })
      .addCase(login.pending, state => {
        state.isPending = true
      })
      .addCase(login.rejected, state => {
        state.isPending = false
      }),
})

export const { chooseRole } = loginSlice.actions

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
