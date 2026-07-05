import type { ReactNode } from 'react'

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 ${className}`}>
      {children}
    </section>
  )
}

export default Panel
