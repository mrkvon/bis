import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
  ThunkAction,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import administrativeUnitReducer from '../features/administrativeUnit/administrativeUnitSlice'
import loginReducer from '../features/login/loginSlice'
import notificationReducer from '../features/notification/notificationSlice'
import { brontoApi } from './services/bronto'

// https://stackoverflow.com/questions/59061161/how-to-reset-state-of-redux-store-when-using-configurestore-from-reduxjs-toolki

const appReducers = combineReducers({
  login: loginReducer,
  administrativeUnit: administrativeUnitReducer,
  notification: notificationReducer,
  [brontoApi.reducerPath]: brontoApi.reducer,
})

export type RootState = ReturnType<typeof appReducers>

// on logout clear the whole state
const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (brontoApi.endpoints.logout.matchFulfilled(action)) {
    state = {
      [brontoApi.reducerPath]: state[brontoApi.reducerPath],
    } as RootState
  }

  return appReducers(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(brontoApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

setupListeners(store.dispatch)
