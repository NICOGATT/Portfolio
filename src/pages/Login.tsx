import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

type AuthMode = 'login' | 'register'

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }

  return fallback
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [numero, setNumero] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
    setSuccessMessage('')
  }

  const submitLogin = async () => {
    await login(email, password)
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    navigate(from || '/admin', { replace: true })
  }

  const submitRegister = async () => {
    await authService.register({
      nombre,
      email,
      password,
      numero
    })

    setPassword('')
    setMode('login')
    setSuccessMessage('Cuenta creada correctamente. Ahora inicia sesion para entrar al panel.')
  }

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await submitLogin()
      } else {
        await submitRegister()
      }
    } catch (error) {
      const fallback =
        mode === 'login' ? 'No pudimos iniciar sesion.' : 'No pudimos crear la cuenta.'
      setError(getErrorMessage(error, fallback))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.12),transparent_30%)]" />
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div className="max-w-2xl">
          <Link className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200" to="/">
            Volver al portfolio
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 text-sm font-black text-slate-950">
              ND
            </span>
            <div>
              <p className="font-semibold text-white">Portfolio Admin</p>
              <p className="text-xs text-slate-500">Private control panel</p>
            </div>
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Admin privado
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Gestiona proyectos, tecnologias e imagenes desde un panel profesional.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-400">
            El login guarda el JWT, valida rol admin y deja la autorizacion centralizada para
            que las pantallas internas solo se ocupen del negocio.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-white">JWT</p>
              <p className="mt-1">Sesion segura</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-white">Admin</p>
              <p className="mt-1">Rol validado</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-white">CRUD</p>
              <p className="mt-1">Contenido centralizado</p>
            </div>
          </div>
        </div>

        <form
          className="rounded-lg border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
          onSubmit={submitAuth}
        >
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-slate-950/80 p-1">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
              onClick={() => changeMode('login')}
              type="button"
            >
              Iniciar sesion
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === 'register'
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
              onClick={() => changeMode('register')}
              type="button"
            >
              Registrarse
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-cyan-300">Bienvenido</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {mode === 'login'
                ? 'Usa tu usuario admin para entrar al dashboard.'
                : 'Crea una cuenta y luego inicia sesion.'}
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {mode === 'register' && (
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Nombre
                <input
                  autoComplete="name"
                  className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15"
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Tu nombre"
                  required
                  type="text"
                  value={nombre}
                />
              </label>
            )}

            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Email
              <input
                autoComplete="email"
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@email.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Password
              <input
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tu password"
                required
                type="password"
                value={password}
              />
            </label>

            {mode === 'register' && (
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Telefono
                <input
                  autoComplete="tel"
                  className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15"
                  onChange={(event) => setNumero(event.target.value)}
                  placeholder="Tu telefono"
                  required
                  type="tel"
                  value={numero}
                />
              </label>
            )}
          </div>

          {successMessage && (
            <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              <p className="font-semibold">Registro completo</p>
              <p className="mt-1 text-emerald-100/80">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mt-5">
              <Alert
                message={error}
                title={mode === 'login' ? 'No pudimos entrar' : 'No pudimos registrarte'}
              />
            </div>
          )}

          <button
            className="mt-6 w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading
              ? mode === 'login'
                ? 'Validando...'
                : 'Creando cuenta...'
              : mode === 'login'
                ? 'Entrar al dashboard'
                : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
