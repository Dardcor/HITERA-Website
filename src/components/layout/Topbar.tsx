'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Topbar() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { user } = useAuth();
    const supabase = createClient();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        const checkUnread = async () => {
            const { data, error } = await supabase
                .from('notifikasi_history')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            
            if (!error && data !== null && data.length > 0 || (error == null && (data as any) === null)) {
                // Supabase head request returns null data but non-null count if count > 0 in some versions, 
                // but let's just do a normal select with limit 1 to be safe
            }
        };

        const fetchUnread = async () => {
            const { data } = await supabase
                .from('notifikasi_history')
                .select('id')
                .eq('user_id', user.id)
                .eq('is_read', false)
                .limit(1);
            
            if (data && data.length > 0) {
                setHasUnread(true);
            } else {
                setHasUnread(false);
            }
        };

        fetchUnread();
    }, [user, pathname]);

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
                    <Link href="/dashboard/notifikasi" className="relative p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                        <Bell size={20} />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
                        )}
                    </Link>
                </div>
            </header>

            {pathname !== '/dashboard' && (
                <header className="md:hidden h-14 bg-[var(--bg-primary)] px-4 flex items-center justify-between sticky top-0 z-30">
                    <h1 className="text-[20px] font-bold text-[var(--text-primary)] capitalize">{getPageTitle()}</h1>
                    <Link href="/dashboard/notifikasi" className="relative p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                        <Bell size={20} />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
                        )}
                    </Link>
                </header>
            )}
        </>
    );
}
