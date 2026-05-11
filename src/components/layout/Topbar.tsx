'use client';

import { usePathname } from 'next/navigation';
import { Menu, User as UserIcon, Bell } from 'lucide-react';
import { formatTanggalID, hariIni } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

export default function Topbar({ user }: { user: User }) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.includes('/keuangan')) return 'Keuangan';
        if (pathname.includes('/kesehatan')) return 'Kesehatan';
        if (pathname.includes('/tugas')) return 'Daftar Tugas';
        return 'Ringkasan';
    };

    return (
        <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-[var(--text-secondary)]">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden lg:block text-right mr-2">
                    <p className="text-xs text-[var(--text-muted)] font-medium">{formatTanggalID(hariIni())}</p>
                </div>

                <button className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-[var(--border)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                            {user.user_metadata?.nama || user.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Premium</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-blue)]">
                        <UserIcon size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
}
