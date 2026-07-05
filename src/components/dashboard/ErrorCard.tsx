function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-5 text-red-100">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-red-100/75">{message}</p>
    </div>
  )
}

export default ErrorCard
