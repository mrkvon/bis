import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import administrativeUnitReducer from '../features/administrativeUnit/administrativeUnitSlice'
import counterReducer from '../features/counter/counterSlice'
import eventReducer from '../features/event/eventSlice'
import loginReducer from '../features/login/loginSlice'
import notificationReducer from '../features/notification/notificationSlice'
import personReducer from '../features/person/personSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    person: personReducer,
    event: eventReducer,
    administrativeUnit: administrativeUnitReducer,
    notification: notificationReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
