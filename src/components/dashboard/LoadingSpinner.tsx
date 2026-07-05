type LoadingSpinnerProps = {
  title?: string
  detail?: string
}

function LoadingSpinner({
  title = 'Cargando',
  detail = 'Validando token y permisos...'
}: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-lg border border-white/10 bg-slate-950/55">
      <div className="flex flex-col items-center gap-4">
        <span className="h-11 w-11 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-100">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{detail}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
