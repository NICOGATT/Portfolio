import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function TextField({ className = '', label, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      <input
        className={`rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15 ${className}`}
        {...props}
      />
    </label>
  )
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
}

export function TextAreaField({ className = '', label, ...props }: TextAreaFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      <textarea
        className={`min-h-32 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15 ${className}`}
        {...props}
      />
    </label>
  )
}
