'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Bottom sheet on mobile (matching Flutter showModalBottomSheet), centered dialog on desktop */}
            <div className={cn(
                'relative w-full bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl overflow-hidden',
                /* Mobile: bottom sheet with top rounded corners (matching Flutter BorderRadius.vertical(top: 16)) */
                'rounded-t-2xl md:rounded-[var(--radius)]',
                /* Mobile: slide up animation, Desktop: zoom in */
                'animate-in md:zoom-in-95 slide-in-from-bottom-4 duration-200',
                /* Mobile: max height 90vh, Desktop: use size prop */
                'max-h-[90vh] md:max-h-none',
                sizes[size]
            )}>
                {/* Header - matches Flutter modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Content - scrollable */}
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--bg-secondary)]/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
