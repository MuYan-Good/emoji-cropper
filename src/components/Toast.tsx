import { useEffect, useCallback } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'var(--success-50)',
          border: 'var(--success-100)',
          icon: 'var(--success-500)',
        }
      case 'error':
        return {
          background: 'var(--error-50)',
          border: 'var(--error-100)',
          icon: 'var(--error-500)',
        }
      case 'warning':
        return {
          background: 'var(--warning-50)',
          border: 'var(--warning-100)',
          icon: 'var(--warning-500)',
        }
      case 'info':
        return {
          background: 'var(--info-50)',
          border: 'var(--info-100)',
          icon: 'var(--info-500)',
        }
      default:
        return {
          background: 'var(--gray-50)',
          border: 'var(--gray-200)',
          icon: 'var(--gray-500)',
        }
    }
  }

  const colors = getColors()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '280px',
        maxWidth: '400px',
      }}
    >
      <span style={{ fontSize: '20px' }}>{getIcon()}</span>
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--gray-800)',
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '18px',
          color: 'var(--gray-400)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          transition: 'all var(--transition-fast)',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--gray-600)'
          e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--gray-400)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        ✕
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message: string) => addToast(message, 'success'),
    [addToast],
  )

  const error = useCallback(
    (message: string) => addToast(message, 'error'),
    [addToast],
  )

  const warning = useCallback(
    (message: string) => addToast(message, 'warning'),
    [addToast],
  )

  const info = useCallback(
    (message: string) => addToast(message, 'info'),
    [addToast],
  )

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}

// Add missing import
import { useState } from 'react'
