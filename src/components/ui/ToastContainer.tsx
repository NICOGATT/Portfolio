import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

type Toast = {
  id: number
  type: 'success' | 'error'
  title: string
  message?: string
}

type ToastContainerProps = {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

function ToastContainer({ onDismiss, toasts }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'

        return (
          <button
            className={`animate-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 text-left shadow-xl shadow-black/40 backdrop-blur transition ${
              isSuccess
                ? 'border-emerald-300/25 bg-slate-900/95'
                : 'border-red-300/25 bg-slate-900/95'
            }`}
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            type="button"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                isSuccess ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
              }`}
            >
              {isSuccess ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-white">{toast.title}</span>
              {toast.message && <span className="mt-0.5 block text-sm text-slate-400">{toast.message}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ToastContainer
