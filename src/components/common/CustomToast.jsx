import React, { useEffect, useState, useRef } from 'react';
import { create } from 'zustand';
import { Check, AlertCircle, Info, X } from 'lucide-react';

// Custom Zustand store for toast management
export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = toast.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      type: toast.type || 'info',
      message: toast.message || '',
      description: toast.description || null,
      duration: toast.duration || 4200,
      createdAt: Date.now(),
      ...toast,
    };
    
    // Limit to latest 5 visible toasts to avoid viewport clutter
    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Exported imperative toast API matching Sonner & luxury specs
export const toast = (message, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'info',
    message,
    ...options,
  });
};

toast.success = (message, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'success',
    message,
    ...options,
  });
};

toast.error = (message, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'error',
    message,
    ...options,
  });
};

toast.info = (message, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'info',
    message,
    ...options,
  });
};

toast.warning = (message, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'warning',
    message,
    ...options,
  });
};

toast.dismiss = (id) => {
  if (id) {
    useToastStore.getState().removeToast(id);
  } else {
    useToastStore.getState().clearToasts();
  }
};

toast.promise = async (promise, { loading = 'Processing...', success, error } = {}) => {
  const id = toast(loading, { duration: Infinity });
  try {
    const result = await promise;
    toast.dismiss(id);
    const msg = typeof success === 'function' ? success(result) : (success || 'Operation completed');
    toast.success(msg);
    return result;
  } catch (err) {
    toast.dismiss(id);
    const msg = typeof error === 'function' ? error(err) : (error || err.message || 'Operation failed');
    toast.error(msg);
    throw err;
  }
};

toast.custom = (customContent, options = {}) => {
  return useToastStore.getState().addToast({
    type: 'custom',
    customContent,
    ...options,
  });
};

// Individual Toast Item with bespoke atelier styling and progress timer
function ToastItem({ toastItem, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(100);
  const isHoveredRef = useRef(false);
  const totalDuration = toastItem.duration || 4200;
  const remainingTimeRef = useRef(totalDuration);
  const lastTickRef = useRef(Date.now());

  // Trigger entrance slide/fade
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsMounted(true), 16);
    return () => clearTimeout(enterTimer);
  }, []);

  // Dismiss handler with smooth exit animation
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toastItem.id);
    }, 280);
  };

  // Progress countdown and auto-dismiss
  useEffect(() => {
    if (totalDuration === Infinity) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isExiting) {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;

        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
        setProgress((remainingTimeRef.current / totalDuration) * 100);

        if (remainingTimeRef.current <= 0) {
          clearInterval(interval);
          handleDismiss();
        }
      } else {
        lastTickRef.current = Date.now();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [totalDuration, isExiting]);

  // Custom JSX renderer if custom type
  if (toastItem.type === 'custom' && toastItem.customContent) {
    return (
      <div
        className={`pointer-events-auto transition-all duration-300 ease-out ${
          isMounted && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
        }`}
      >
        {typeof toastItem.customContent === 'function'
          ? toastItem.customContent({ dismiss: handleDismiss })
          : toastItem.customContent}
      </div>
    );
  }

  // Determine badge label and color
  let tagLabel = 'ATELIER NOTICE';
  let iconNode = <Info className="w-3.5 h-3.5" />;
  let iconBoxStyle = 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900';
  let progressColor = 'bg-neutral-900 dark:bg-white';

  if (toastItem.type === 'success') {
    tagLabel = 'CONFIRMATION';
    iconNode = <Check className="w-3.5 h-3.5 stroke-[2.5]" />;
    iconBoxStyle = 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950';
    progressColor = 'bg-neutral-900 dark:bg-white';
  } else if (toastItem.type === 'error') {
    tagLabel = 'ACTION REQUIRED';
    iconNode = <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />;
    iconBoxStyle = 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white';
    progressColor = 'bg-rose-600 dark:bg-rose-500';
  } else if (toastItem.type === 'warning') {
    tagLabel = 'ATTENTION';
    iconNode = <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />;
    iconBoxStyle = 'bg-amber-600 text-white dark:bg-amber-500 dark:text-black';
    progressColor = 'bg-amber-600 dark:bg-amber-400';
  }

  return (
    <div
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        lastTickRef.current = Date.now();
      }}
      role="alert"
      className={`pointer-events-auto w-[calc(100vw-2rem)] sm:w-[380px] max-w-[420px] relative overflow-hidden transition-all duration-300 ease-out select-none
        ${
          isMounted && !isExiting
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-12 scale-95'
        }
        bg-white dark:bg-[#121212] 
        text-neutral-900 dark:text-white 
        border border-neutral-900/15 dark:border-white/15 
        shadow-[0_16px_40px_-10px_rgba(0,0,0,0.18),0_0_1px_1px_rgba(0,0,0,0.06)] 
        dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_1px_1px_rgba(255,255,255,0.08)]
      `}
    >
      <div className="p-4 pr-3.5 flex items-start gap-3.5">
        {/* Minimalist atelier icon stamp */}
        <div className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 mt-0.5 ${iconBoxStyle}`}>
          {iconNode}
        </div>

        {/* Toast Body */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-400">
              {tagLabel}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <span className="text-[8.5px] font-mono tracking-widest text-neutral-400/90 dark:text-neutral-500 uppercase">
              CHEXY ATELIER
            </span>
          </div>

          <p className="text-[12.5px] font-light leading-snug tracking-wide text-neutral-800 dark:text-neutral-100 break-words">
            {toastItem.message}
          </p>

          {toastItem.description && (
            <p className="text-[11.5px] font-light text-neutral-500 dark:text-neutral-400 mt-1 leading-snug break-words">
              {toastItem.description}
            </p>
          )}

          {toastItem.action && (
            <button
              type="button"
              onClick={() => {
                toastItem.action.onClick?.();
                handleDismiss();
              }}
              className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
            >
              {toastItem.action.label}
            </button>
          )}
        </div>

        {/* Minimal Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hairline Progress Timer Bar */}
      {totalDuration !== Infinity && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100 dark:bg-neutral-800/80 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Custom Toaster component rendered at root
export function Toaster({ position = 'top-right' }) {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  // Position placement helper
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6 items-start';
      case 'top-center':
        return 'top-6 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-left':
        return 'bottom-6 left-6 items-start';
      case 'bottom-center':
        return 'bottom-6 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-right':
        return 'bottom-6 right-6 items-end';
      case 'top-right':
      default:
        return 'top-6 right-6 items-end';
    }
  };

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed z-[99999] flex flex-col gap-3 pointer-events-none ${getPositionClasses()}`}
    >
      {toasts.map((toastItem) => (
        <ToastItem
          key={toastItem.id}
          toastItem={toastItem}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

export default Toaster;
