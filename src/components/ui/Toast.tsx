'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = (msg: string) => addToast(msg, 'success');
    const error = (msg: string) => addToast(msg, 'error');
    const info = (msg: string) => addToast(msg, 'info');
    const warning = (msg: string) => addToast(msg, 'warning');

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            'pointer-events-auto flex items-center justify-between min-w-[280px] max-w-md px-4 py-3 rounded-[var(--radius-sm)] border shadow-lg animate-in slide-in-from-bottom-4 duration-300',
                            toast.type === 'success' && 'bg-[var(--bg-card)] border-[var(--accent-green)] text-[var(--accent-green)]',
                            toast.type === 'error' && 'bg-[var(--bg-card)] border-[var(--accent-red)] text-[var(--accent-red)]',
                            toast.type === 'info' && 'bg-[var(--bg-card)] border-[var(--accent-blue)] text-[var(--accent-blue)]',
                            toast.type === 'warning' && 'bg-[var(--bg-card)] border-[var(--accent-yellow)] text-[var(--accent-yellow)]'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && <CheckCircle size={18} />}
                            {toast.type === 'error' && <AlertCircle size={18} />}
                            {toast.type === 'info' && <Info size={18} />}
                            {toast.type === 'warning' && <AlertTriangle size={18} />}
                            <span className="text-sm font-medium text-[var(--text-primary)]">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X size={14} className="text-[var(--text-muted)]" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
