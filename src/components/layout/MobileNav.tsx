'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, HeartPulse, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Finance', icon: Wallet, href: '/dashboard/keuangan' },
    { name: 'Health', icon: HeartPulse, href: '/dashboard/kesehatan' },
    { name: 'Tasks', icon: CheckSquare, href: '/dashboard/tugas' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-card)] border-t border-[var(--border)] flex items-center justify-around px-2 z-[40] pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all",
                            isActive ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"
                        )}
                    >
                        <item.icon size={20} className={isActive ? "animate-in zoom-in duration-300" : ""} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                        {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--accent-blue)]" />}
                    </Link>
                );
            })}
        </nav>
    );
}
