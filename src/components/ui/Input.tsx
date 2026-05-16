'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-[var(--text-muted)] ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        className={cn(
                            'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                            isPassword && 'pr-10',
                            error && 'border-[var(--accent-red)] focus:border-[var(--accent-red)]',
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                </div>
                {error && <p className="text-[10px] text-[var(--accent-red)] ml-1 font-medium">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-[var(--text-muted)] ml-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-[var(--accent-red)] focus:border-[var(--accent-red)]',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-[10px] text-[var(--accent-red)] ml-1 font-medium">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }>(
    ({ className, label, error, children, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-medium text-[var(--text-muted)] ml-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-[var(--accent-red)] focus:border-[var(--accent-red)]',
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="text-[10px] text-[var(--accent-red)] ml-1 font-medium">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
