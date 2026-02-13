// ============================================
// Toast — Notification system (design system)
// 4 variants: success, error, warning, info
// Slide-down animation, auto-dismiss
// ============================================

'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: {
    bg: 'bg-white',
    border: 'border-l-4 border-success',
    icon: CheckCircle,
    iconColor: 'text-success',
  },
  error: {
    bg: 'bg-white',
    border: 'border-l-4 border-danger',
    icon: XCircle,
    iconColor: 'text-danger',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-l-4 border-warning',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  info: {
    bg: 'bg-white',
    border: 'border-l-4 border-info',
    icon: Info,
    iconColor: 'text-info',
  },
};

function ToastItem({ toast, onDismiss }) {
  const style = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bg} ${style.border} rounded-xl shadow-elevated
        px-4 py-3 flex items-start gap-3 min-w-[280px] max-w-[400px]
        ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      role="alert"
    >
      <Icon size={20} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-warm-800">{toast.title}</p>
        )}
        <p className="text-sm text-warm-600">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-warm-400 hover:text-warm-600 transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const toast = useCallback(
    ({ variant = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, variant, title, message, exiting: false }]);

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (message, title) => toast({ variant: 'success', message, title }),
    [toast]
  );
  const error = useCallback(
    (message, title) => toast({ variant: 'error', message, title }),
    [toast]
  );
  const warning = useCallback(
    (message, title) => toast({ variant: 'warning', message, title }),
    [toast]
  );
  const info = useCallback(
    (message, title) => toast({ variant: 'info', message, title }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
