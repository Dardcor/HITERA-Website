'use client';

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function KontrolDataPage() {
    const { deleteAllData } = useSettings();
    const { success, error: toastError } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useTranslation();

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            await deleteAllData();
            success(t('data_deleted_success'));
            setShowConfirm(false);
        } catch (err) {
            toastError(t('data_delete_failed'));
        }
        setIsDeleting(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">{t('data_control')}</h2>
            </div>

            <div className="border border-[var(--accent-red-dim)] rounded-xl bg-[var(--bg-card)] p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[var(--accent-red-dim)] rounded-lg text-[var(--accent-red)]">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--accent-red)]">{t('danger_zone')}</h3>
                </div>
                
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    {t('danger_zone_desc')}
                </p>

                <Button 
                    variant="danger" 
                    className="w-full font-bold"
                    onClick={() => setShowConfirm(true)}
                >
                    {t('delete_all_data')}
                </Button>
            </div>

            <Modal 
                isOpen={showConfirm} 
                onClose={() => setShowConfirm(false)}
                title={t('delete_all_data')}
            >
                <div className="p-6">
                    <p className="text-[var(--text-secondary)] mb-6">
                        {t('delete_confirm_message')}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowConfirm(false)}
                            disabled={isDeleting}
                        >
                            {t('cancel')}
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={handleDeleteAll}
                            isLoading={isDeleting}
                        >
                            {t('delete_all')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
