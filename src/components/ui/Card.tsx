import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

export const Card = ({ className, hoverable, children, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                'bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] p-5 shadow-[var(--shadow)] transition-colors',
                hoverable && 'hover:bg-[var(--bg-card-hover)] cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
