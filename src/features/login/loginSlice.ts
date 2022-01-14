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

export const logoutEffect = (dispatch: AppDispatch) => {
  api.logout()
  dispatch(loginSlice.actions.logout())
}

export const chooseRole = (role: Role | '') => (dispatch: AppDispatch) => {
  globalThis.localStorage.setItem('role', role)
  dispatch(selectRole(role))
}

export const init = createAsyncThunk('login/init', async () => {
  try {
    return await api.init()
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
    logout: () => initialState,
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
        isAnyOf(init.fulfilled, init.rejected, login.rejected),
        state => {
          state.isPending = false
        },
      ),
})

export const { selectRole, logout } = loginSlice.actions

export const selectLogin = (state: RootState) => state.login
export const selectIsLoggedIn = createSelector(
  selectLogin,
  login => login.isLoggedIn,
)
export const selectIsPending = createSelector(
  selectLogin,
  login => login.isPending,
)

export const selectLoggedUserId = createSelector(
  selectLogin,
  login => login.userId,
)

export default loginSlice.reducer
