import { useEffect, useState } from 'react'
import Alert from '../../components/ui/Alert'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { contactService } from '../../services/contactService'
import type { ContactMessage } from '../../types/dashboard'

const formatDate = (value?: string) => {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      setError('')

      try {
        setMessages(await contactService.list())
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No pudimos cargar los mensajes.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  const removeMessage = async (message: ContactMessage) => {
    if (!message.id) return

    const confirmed = window.confirm(`Eliminar el mensaje de "${message.name}"?`)
    if (!confirmed) return

    setError('')
    setDeletingId(message.id)

    try {
      await contactService.remove(message.id)
      setMessages((current) => current.filter((item) => item.id !== message.id))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos eliminar el mensaje.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Consultas recibidas desde el formulario de contacto del portfolio."
        title="Mensajes"
      />

      {error && <Alert message={error} title="Error de mensajes" />}

      <Panel className="overflow-hidden">
        {isLoading ? (
          <div className="p-5 text-sm text-slate-400">Cargando mensajes...</div>
        ) : messages.length === 0 ? (
          <div className="p-5 text-sm text-slate-400">Todavia no recibiste mensajes.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {messages.map((message, index) => (
              <article className="grid gap-4 p-5" key={message.id || `${message.email}-${index}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{message.name}</p>
                    <a
                      className="text-sm text-cyan-300 hover:text-cyan-200"
                      href={`mailto:${message.email}`}
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <p className="text-xs text-slate-500">{formatDate(message.createdAt)}</p>
                    {message.id && (
                      <button
                        className="rounded-lg border border-red-300/20 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={deletingId === message.id}
                        onClick={() => removeMessage(message)}
                        type="button"
                      >
                        {deletingId === message.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

export default MessagesPage
