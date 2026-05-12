'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, HeartPulse, CheckSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'HOME', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'FINANCE', icon: Wallet, href: '/dashboard/keuangan' },
    { name: 'HEALTH', icon: HeartPulse, href: '/dashboard/kesehatan' },
    { name: 'TASKS', icon: CheckSquare, href: '/dashboard/tugas' },
    { name: 'SETTING', icon: Settings, href: '/dashboard/pengaturan' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border)] flex items-center justify-around z-[40]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-0.5 py-2.5 min-w-[60px] transition-all",
                            isActive ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"
                        )}
                    >
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold tracking-[-0.5px]">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
