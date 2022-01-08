import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { wait } from '../../helpers'
import { clearNotification, selectNotification } from './notificationSlice'

const NotificationContainer = () => {
  const notification = useAppSelector(selectNotification)
  if (notification.type === '') return null
  return <Notification notification={notification as NotificationType} />
}

export default NotificationContainer

type NotificationType = {
  type: 'success' | 'error' | 'info' | 'warning'
  title: 'string'
  detail: string
  timeout: number
}

const Notification = ({ notification }: { notification: NotificationType }) => {
  const dispatch = useAppDispatch()

  const escFunction = useMemo(
    () => (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log(e.key)
        e.stopPropagation()
        dispatch(clearNotification())
      }
    },
    [dispatch],
  )

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [escFunction])

  useEffect(() => {
    if (notification.timeout > 0) {
      ;(async () => {
        await wait(notification.timeout)
        dispatch(clearNotification(notification))
      })()
    }
  }, [notification, dispatch])

  const color =
    notification.type === 'error'
      ? 'bg-red-500'
      : notification.type === 'success'
      ? 'bg-green-500'
      : notification.type === 'warning'
      ? 'bg-yellow-500'
      : 'bg-blue-300'

  return (
    <div
      tabIndex={0}
      title="click to close"
      className={`${color} p-4 fixed z-5000 bottom-0 bg-opacity-80 hover:bg-opacity-90 rounded-none max-h-screen w-full overflow-auto`}
    >
      <button
        className={`absolute top-3 right-3 p-1 rounded-full ${color}`}
        onClick={() => dispatch(clearNotification())}
      >
        x
      </button>
      <header>{notification.title}</header>
      <section>
        <pre>{notification.detail}</pre>
      </section>
    </div>
  )
}
