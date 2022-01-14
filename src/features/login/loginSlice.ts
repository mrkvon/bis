import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../../app/store'
import * as api from './loginAPI'
import { Credentials, Role } from './types'

export interface LoginState {
  isLoggedIn: boolean
  userId: number
  roles: Role[]
  currentRole: '' | Role
  isPending: boolean
}

const initialState: LoginState = {
  isLoggedIn: false,
  isPending: false,
  userId: -1,
  roles: [],
  currentRole: '',
}

export const login = createAsyncThunk(
  'login/login',
  async (credentials: Credentials, { dispatch }) => {
    await api.login(credentials)
    dispatch(init())
  },
)

export const chooseRole =
  (role: Role | '') => async (dispatch: AppDispatch) => {
    globalThis.localStorage.setItem('role', role)
    dispatch(selectRole(role))
  }

export const init = createAsyncThunk('login/init', async () => {
  try {
    const me = await api.init()
    // get the role selected by user
    const savedRole =
      (globalThis.localStorage.getItem('role') as Role | '') ?? ''

    const currentRole: Role | '' =
      savedRole && me.roles.includes(savedRole)
        ? savedRole
        : me.roles.length === 1
        ? me.roles[0]
        : ''
    return {
      ...me,
      currentRole,
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'refresh token not found') {
      return null
    }

    throw error
  }
})

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    selectRole: (state, action: PayloadAction<Role | ''>) => {
      state.currentRole = action.payload
    },
  },
  extraReducers: builder =>
    builder
      .addCase(init.fulfilled, (state, action) => {
        if (action.payload) {
          const { userId, roles, currentRole } = action.payload
          return {
            isLoggedIn: true,
            userId,
            roles,
            currentRole,
            isPending: false,
          }
        }
      })
      .addMatcher(isAnyOf(init.pending, login.pending), state => {
        state.isPending = true
      })
      .addMatcher(
        isAnyOf(init.fulfilled, login.fulfilled, init.rejected, login.rejected),
        state => {
          state.isPending = false
        },
      ),
})

export const { selectRole } = loginSlice.actions

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
