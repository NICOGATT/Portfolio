import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import ToastContainer from '../components/ui/ToastContainer'

type ToastType = 'success' | 'error'

type Toast = {
  id: number
  type: ToastType
  title: string
  message?: string
}

type ToastContextValue = {
  showToast: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toastDuration = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, type, title, message }])
      timers.current.set(id, setTimeout(() => dismiss(id), toastDuration))
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer onDismiss={dismiss} toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider.')
  }
  return context
}
