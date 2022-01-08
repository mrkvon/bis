import {
  createSlice,
  current,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { createEvent } from '../event/eventSlice'

interface NotificationState {
  type: 'success' | 'error' | 'info' | 'warning' | ''
  title: string
  detail: string
  timeout: number
}

const initialState: NotificationState = {
  type: '',
  title: '',
  detail: '',
  timeout: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationState>) =>
      action.payload,
    clearNotification: (
      state,
      action: PayloadAction<NotificationState | undefined>,
    ) => {
      if (action.payload && action.payload !== current(state)) return
      return initialState
    },
  },
  extraReducers: builder =>
    builder
      .addCase(createEvent.pending, () => {
        return {
          type: 'info',
          title: 'Vytváříme akci',
          detail: '',
          timeout: 0,
        }
      })
      .addCase(createEvent.fulfilled, () => {
        return {
          type: 'success',
          title: 'Akce úspěšně vytvořena',
          detail: '',
          timeout: 5000,
        }
      })
      .addMatcher(isRejected, (_, action) => {
        return {
          type: 'error',
          title: (
            action.error.code ??
            '' + ' ' + action.error.name ??
            ''
          ).trim(),
          detail: action.error.message ?? '',
          timeout: 0,
        }
      }),
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const selectNotification = (state: RootState) => state.notification

export default notificationSlice.reducer
