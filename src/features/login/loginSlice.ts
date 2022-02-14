import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../../app/store'
import { Role } from './types'

export interface LoginState {
  currentRole: '' | Role
  token: string | null
}

const initialState: LoginState = {
  currentRole: '',
  token: null,
}

export const chooseRole = (role: Role | '') => (dispatch: AppDispatch) => {
  globalThis.localStorage.setItem('role', role)
  dispatch(selectRole(role))
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    selectRole: (state, action: PayloadAction<Role | ''>) => {
      state.currentRole = action.payload
    },
    logout: () => initialState,
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { selectRole, logout, setToken } = loginSlice.actions

export const selectLogin = (state: RootState) => state.login

export default loginSlice.reducer
