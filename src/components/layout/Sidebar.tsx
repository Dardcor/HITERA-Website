'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    HeartPulse,
    CheckSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
    { name: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Keuangan', icon: Wallet, href: '/dashboard/keuangan' },
    { name: 'Kesehatan', icon: HeartPulse, href: '/dashboard/kesehatan' },
    { name: 'Tugas', icon: CheckSquare, href: '/dashboard/tugas' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { signOut } = useAuth();

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-[var(--bg-card)] border-r border-[var(--border)] transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && <span className="text-xl font-bold text-[var(--accent-blue)] tracking-tighter">HITERA</span>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] border-l-2 border-[var(--accent-blue)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")} />
                            {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[var(--border)] space-y-1">
                <Link
                    href="/dashboard/pengaturan"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all group"
                >
                    <Settings size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                    {!isCollapsed && <span className="text-sm font-medium">Pengaturan</span>}
                </Link>
                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--accent-red)] hover:bg-[var(--accent-red-dim)] transition-all group"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="text-sm font-medium">Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
