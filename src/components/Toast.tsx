'use client'

import {
  createContext, useContext, useState, useCallback, useEffect,
} from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastContextValue = {
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
  warning: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const value: ToastContextValue = {
    success: (m) => push(m, 'success'),
    error:   (m) => push(m, 'error'),
    info:    (m) => push(m, 'info'),
    warning: (m) => push(m, 'warning'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(p => p.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  )
}

const CONFIG = {
  success: {
    bg: 'bg-emerald-950/90 border-emerald-700/50',
    text: 'text-emerald-100',
    icon: CheckCircle,
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-950/90 border-red-700/50',
    text: 'text-red-100',
    icon: XCircle,
    bar: 'bg-red-500',
  },
  info: {
    bg: 'bg-slate-900/90 border-slate-700/50',
    text: 'text-slate-100',
    icon: Info,
    bar: 'bg-blue-500',
  },
  warning: {
    bg: 'bg-amber-950/90 border-amber-700/50',
    text: 'text-amber-100',
    icon: AlertTriangle,
    bar: 'bg-amber-500',
  },
}

function ToastContainer({
  toasts, onDismiss,
}: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({
  toast, onDismiss,
}: { toast: Toast; onDismiss: (id: string) => void }) {
  const cfg = CONFIG[toast.type]
  const Icon = cfg.icon
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden flex items-start gap-3',
        'w-[340px] rounded-xl border backdrop-blur-md px-4 py-3 shadow-2xl',
        'transition-all duration-300',
        cfg.bg, cfg.text,
        visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      )}
    >
      {/* Progress bar */}
      <div
        className={cn('absolute bottom-0 left-0 h-0.5', cfg.bar)}
        style={{ animation: 'toast-progress 4.5s linear forwards' }}
      />
      <Icon className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
