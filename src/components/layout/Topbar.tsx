'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Topbar() {
    const pathname = usePathname();
    const { t } = useTranslation();

    const getPageTitle = () => {
        if (pathname.includes('/keuangan')) return t('finance');
        if (pathname.includes('/kesehatan')) return t('health');
        if (pathname.includes('/tugas')) return t('tasks');
        if (pathname.includes('/pengaturan')) return t('settings');
        return t('home');
    };

    return (
        <>
            <header className="hidden md:flex h-16 border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 md:px-8 items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-[var(--text-primary)] capitalize">{getPageTitle()}</h1>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <Link href="/dashboard/notifikasi" className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                        <Bell size={20} />
                    </Link>
                </div>
            </header>

            {pathname !== '/dashboard' && (
                <header className="md:hidden h-14 bg-[var(--bg-primary)] px-4 flex items-center justify-between sticky top-0 z-30">
                    <h1 className="text-[20px] font-bold text-[var(--text-primary)] capitalize">{getPageTitle()}</h1>
                    <Link href="/dashboard/notifikasi" className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                        <Bell size={20} />
                    </Link>
                </header>
            )}
        </>
    );
}
