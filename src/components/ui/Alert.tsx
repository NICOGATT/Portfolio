type AlertProps = {
  title: string
  message: string
}

function Alert({ message, title }: AlertProps) {
  return (
    <div className="rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-red-200/80">{message}</p>
    </div>
  )
}

export default Alert
