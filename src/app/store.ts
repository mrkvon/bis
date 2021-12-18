import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import loginReducer from '../features/login/loginSlice'
import personReducer from '../features/person/personSlice'
import eventReducer from '../features/event/eventSlice'
import administrativeUnitReducer from '../features/administrativeUnit/administrativeUnitSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    person: personReducer,
    event: eventReducer,
    administrativeUnit: administrativeUnitReducer,
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
