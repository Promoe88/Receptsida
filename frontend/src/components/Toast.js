// ============================================
// Toast — Design system §9
// Centered, 90% width, max 1 visible
// Per-variant auto-dismiss: success 3s, error 5s, warning/info 4s
// 3px left border, 12px radius
// ============================================

'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANT_CONFIG = {
  success: {
    borderColor: '#2ABFBF',
    icon: CheckCircle,
    iconColor: '#2ABFBF',
    duration: 3000,
  },
  error: {
    borderColor: '#FF3B30',
    icon: AlertCircle,
    iconColor: '#FF3B30',
    duration: 5000,
  },
  warning: {
    borderColor: '#FF9500',
    icon: AlertTriangle,
    iconColor: '#FF9500',
    duration: 4000,
  },
  info: {
    borderColor: '#007AFF',
    icon: Info,
    iconColor: '#007AFF',
    duration: 4000,
  },
};

function ToastItem({ toast, onDismiss }) {
  const config = VARIANT_CONFIG[toast.variant] || VARIANT_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
      role="alert"
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        borderLeft: `3px solid ${config.borderColor}`,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
      }}
    >
      <Icon size={20} style={{ color: config.iconColor, flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <p className="text-label font-semibold text-warm-800">{toast.title}</p>
        )}
        <p className="text-label text-warm-600">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="transition-colors flex-shrink-0"
        style={{ color: '#C7C7CC' }}
        aria-label="Stäng notifikation"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [currentToast, setCurrentToast] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback((id) => {
    setCurrentToast((prev) => {
      if (!prev || prev.id !== id) return prev;
      return { ...prev, exiting: true };
    });
    setTimeout(() => {
      setCurrentToast((prev) => {
        if (prev && prev.id === id) return null;
        return prev;
      });
    }, 200);
    clearTimeout(timerRef.current);
  }, []);

  const toast = useCallback(
    ({ variant = 'info', title, message, duration }) => {
      // Clear any existing toast timer
      clearTimeout(timerRef.current);

      const id = Date.now() + Math.random();
      const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
      const autoDismiss = duration ?? config.duration;

      // Replace current toast (max 1 visible)
      setCurrentToast({ id, variant, title, message, exiting: false });

      if (autoDismiss > 0) {
        timerRef.current = setTimeout(() => dismiss(id), autoDismiss);
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
      {/* Toast container — centered, 90% width per design system */}
      {currentToast && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
          }}
        >
          <div className="pointer-events-auto">
            <ToastItem toast={currentToast} onDismiss={dismiss} />
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
