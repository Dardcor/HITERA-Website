'use client';

import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NotifikasiPage() {
    const { settings, loading, updateSettings } = useSettings();
    const { error: toastError } = useToast();

    const handleToggle = async (enabled: boolean) => {
        try {
            await updateSettings({ notifikasi_enabled: enabled });
        } catch (err) {
            toastError('Gagal memperbarui notifikasi');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">Notifikasi</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-[var(--accent-blue)]" />
                </div>
            ) : (
                <Card className="p-4 md:p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Notifikasi Pengingat</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Aktifkan untuk menerima notifikasi pengingat</p>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.notifikasi_enabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-blue)]"></div>
                    </label>
                </Card>
            )}
        </div>
    );
}
