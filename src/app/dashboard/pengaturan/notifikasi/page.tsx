'use client';

import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, Loader2, Wallet, HeartPulse, CheckSquare, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useState, useRef } from 'react';

export default function NotifikasiPage() {
    const { settings, loading, updateSettings } = useSettings();
    const { error: toastError } = useToast();
    const { t } = useTranslation();

    const NotificationCard = ({ 
        title, 
        description, 
        icon: Icon, 
        fieldEnabled, 
        fieldTime,
        defaultTime 
    }: { 
        title: string, 
        description: string, 
        icon: any, 
        fieldEnabled: 'keuangan_notif_enabled' | 'kesehatan_notif_enabled' | 'tugas_notif_enabled',
        fieldTime: 'keuangan_notif_time' | 'kesehatan_notif_time' | 'tugas_notif_time',
        defaultTime: string 
    }) => {
        const isEnabled = settings[fieldEnabled] ?? false;
        let timeValue = settings[fieldTime] ?? defaultTime;
        if (timeValue.length > 5) timeValue = timeValue.substring(0, 5); // ensure HH:mm

        const inputRef = useRef<HTMLInputElement>(null);

        const handleToggle = async (enabled: boolean) => {
            try {
                await updateSettings({ [fieldEnabled]: enabled });
            } catch (err) {
                toastError(t('notification_update_failed') || 'Gagal mengubah pengaturan notifikasi');
            }
        };

        const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                await updateSettings({ [fieldTime]: e.target.value });
            } catch (err) {
                toastError(t('notification_update_failed') || 'Gagal mengubah jam notifikasi');
            }
        };

        return (
            <Card className="mb-4 overflow-hidden border border-[var(--border)]">
                <div className="p-4 flex items-start gap-3">
                    <Icon size={28} className="text-[var(--text-primary)] mt-1" />
                    <div className="flex-1">
                        <h3 className="font-bold text-[var(--text-primary)] text-base">{title}</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
                    </div>
                </div>
                
                <div className="h-[1px] bg-[var(--border)] w-full"></div>
                
                <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-[var(--text-primary)]">Aktifkan</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[var(--bg-secondary)] border border-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-blue)]"></div>
                    </label>
                </div>
                
                {isEnabled && (
                    <>
                        <div className="h-[1px] bg-[var(--border)] w-full"></div>
                        <div 
                            className="px-4 py-4 flex items-center justify-between group cursor-pointer relative"
                            onClick={() => {
                                try {
                                    inputRef.current?.showPicker();
                                } catch (e) {
                                    inputRef.current?.focus();
                                }
                            }}
                        >
                            <span className="text-sm text-[var(--text-primary)]">Jam Notifikasi</span>
                            <div className="flex items-center gap-1">
                                <input 
                                    ref={inputRef}
                                    type="time" 
                                    value={timeValue}
                                    onChange={handleTimeChange}
                                    className="bg-transparent text-sm font-semibold text-[var(--accent-blue)] outline-none cursor-pointer"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <ChevronRight size={16} className="text-[var(--text-muted)]" />
                            </div>
                        </div>
                    </>
                )}
            </Card>
        );
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">{t('notifications')}</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-[var(--accent-blue)]" />
                </div>
            ) : (
                <div className="space-y-4">
                    <NotificationCard 
                        title="Keuangan" 
                        description="Pengingat untuk mencatat keuangan harian" 
                        icon={Wallet}
                        fieldEnabled="keuangan_notif_enabled"
                        fieldTime="keuangan_notif_time"
                        defaultTime="08:00"
                    />
                    <NotificationCard 
                        title="Kesehatan" 
                        description="Pengingat untuk mencatat kesehatan harian" 
                        icon={HeartPulse}
                        fieldEnabled="kesehatan_notif_enabled"
                        fieldTime="kesehatan_notif_time"
                        defaultTime="09:00"
                    />
                    <NotificationCard 
                        title="Tugas" 
                        description="Pengingat untuk mengecek daftar tugas" 
                        icon={CheckSquare}
                        fieldEnabled="tugas_notif_enabled"
                        fieldTime="tugas_notif_time"
                        defaultTime="07:00"
                    />
                </div>
            )}
        </div>
    );
}
