import { useCallback, useEffect, useRef, useState } from 'react'
import GoodNotification from '../Components/Notification/GoodNotification'
import AlertNotification from '../Components/Notification/AlertNotification'
import BadNotification from '../Components/Notification/BadNotification'
import '../Components/Notification/Notification.css'
import NotificationContext from './notificationContextValue'

const DEFAULT_DURATION_MS = 3500

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timersRef = useRef({})

  const removeNotification = useCallback((id) => {
    const timer = timersRef.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timersRef.current[id]
    }

    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const notify = useCallback(
    ({ type = 'alert', message, duration = DEFAULT_DURATION_MS }) => {
      if (!message) return null

      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`

      setNotifications((prev) => [...prev, { id, type, message }])

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          removeNotification(id)
        }, duration)
      }

      return id
    },
    [removeNotification]
  )

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer))
      timersRef.current = {}
    }
  }, [])

  const notifyGood = useCallback(
    (message, duration) => notify({ type: 'good', message, duration }),
    [notify]
  )
  const notifyAlert = useCallback(
    (message, duration) => notify({ type: 'alert', message, duration }),
    [notify]
  )
  const notifyBad = useCallback(
    (message, duration) => notify({ type: 'bad', message, duration }),
    [notify]
  )

  return (
    <NotificationContext.Provider
      value={{ notify, notifyGood, notifyAlert, notifyBad, removeNotification }}
    >
      {children}
      <div className="notification-container">
        {notifications.map((item) => {
          if (item.type === 'good') {
            return <GoodNotification key={item.id}>{item.message}</GoodNotification>
          }
          if (item.type === 'bad') {
            return <BadNotification key={item.id}>{item.message}</BadNotification>
          }
          return <AlertNotification key={item.id}>{item.message}</AlertNotification>
        })}
      </div>
    </NotificationContext.Provider>
  )
}
