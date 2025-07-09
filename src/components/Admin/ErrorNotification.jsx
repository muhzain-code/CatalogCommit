"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { errorNotifier } from "../../Services/apiErrorHandler"

const ErrorNotification = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsubscribe = errorNotifier.subscribe((event) => {
      const notification = {
        id: Date.now() + Math.random(),
        ...event.detail,
      }

      setNotifications((prev) => [...prev, notification])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    })

    return unsubscribe
  }, [])

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationStyles = (type) => {
    switch (type) {
      case "error":
      case "unauthorized":
      case "forbidden":
      case "server_error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: AlertCircle,
          iconColor: "text-red-500",
        }
      case "warning":
      case "validation":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
        }
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-500",
        }
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: Info,
          iconColor: "text-blue-500",
        }
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const styles = getNotificationStyles(notification.type)
        const Icon = styles.icon

        return (
          <div
            key={notification.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 max-w-md shadow-lg animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${styles.iconColor} mt-0.5`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${styles.text}`}>{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`${styles.iconColor} hover:opacity-75 transition-opacity`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ErrorNotification
