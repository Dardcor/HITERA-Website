import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
    const variants = {
        primary: "bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]",
        secondary: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
        success: "bg-[var(--accent-green-dim)] text-[var(--accent-green)]",
        danger: "bg-[var(--accent-red-dim)] text-[var(--accent-red)]",
        warning: "bg-[var(--accent-yellow-dim)] text-[var(--accent-yellow)]",
        outline: "border border-[var(--border)] text-[var(--text-muted)]",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                variants[variant],
                className
            )}
            {...props}
        />
    );
};
