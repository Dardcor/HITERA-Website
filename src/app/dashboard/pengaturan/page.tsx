'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/LanguageContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { 
    User, 
    Bell, 
    Trash2, 
    Globe, 
    LogOut,
    ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function PengaturanMenuPage() {
    const { signOut } = useAuth();
    const { t } = useTranslation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <h2 className="text-2xl font-bold mb-6">{t('settings')}</h2>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
                <Link href="/dashboard/pengaturan/profil" className="flex items-center p-4 md:px-6 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)] group">
                    <User size={24} className="text-[var(--text-primary)]" />
                    <span className="ml-4 font-medium flex-1">{t('profile')}</span>
                    <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </Link>

                <Link href="/dashboard/pengaturan/notifikasi" className="flex items-center p-4 md:px-6 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)] group">
                    <Bell size={24} className="text-[var(--text-primary)]" />
                    <span className="ml-4 font-medium flex-1">{t('notifications')}</span>
                    <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </Link>

                <Link href="/dashboard/pengaturan/kontrol-data" className="flex items-center p-4 md:px-6 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)] group">
                    <Trash2 size={24} className="text-[var(--text-primary)]" />
                    <span className="ml-4 font-medium flex-1">{t('data_control')}</span>
                    <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </Link>

                <Link href="/dashboard/pengaturan/bahasa" className="flex items-center p-4 md:px-6 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)] group">
                    <Globe size={24} className="text-[var(--text-primary)]" />
                    <span className="ml-4 font-medium flex-1">{t('language')}</span>
                    <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </Link>

                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center p-4 md:px-6 hover:bg-[var(--accent-red-dim)] transition-colors text-[var(--accent-red)]"
                >
                    <LogOut size={24} />
                    <span className="ml-4 font-medium flex-1 text-left">{t('logout')}</span>
                </button>
            </div>

            <div className="text-center pt-8 md:pt-10">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[2px] font-bold">HITERA Version 2.0.0</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 tracking-[-0.3px]">&copy; 2026 Dardcor Hitera</p>
            </div>

            <Modal 
                isOpen={showLogoutConfirm} 
                onClose={() => setShowLogoutConfirm(false)}
                title={t('logout')}
            >
                <div className="p-6">
                    <p className="text-[var(--text-secondary)] mb-6">
                        {t('logout_confirm')}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={handleLogout}
                        >
                            {t('logout')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
