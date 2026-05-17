'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/contexts/LanguageContext';
import { Wallet, HeartPulse, CheckSquare, Bell, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface NotificationHistory {
    id: string;
    tipe: 'keuangan' | 'kesehatan' | 'tugas' | 'deadline';
    pesan: string;
    is_read: boolean;
    created_at: string;
}

export default function RiwayatNotifikasiPage() {
    const { user } = useAuth();
    const supabase = createClient();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('notifikasi_history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    setNotifications(data);
                    
                    
                    const unreadIds = data.filter(n => !n.is_read).map(n => n.id);
                    if (unreadIds.length > 0) {
                        await supabase
                            .from('notifikasi_history')
                            .update({ is_read: true })
                            .in('id', unreadIds);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user, supabase]);

    const getIcon = (tipe: string, isRead: boolean) => {
        const colorClass = isRead ? 'text-[var(--text-muted)]' : 'text-[var(--accent-blue)]';
        switch (tipe) {
            case 'keuangan': return <Wallet size={24} className={colorClass} />;
            case 'kesehatan': return <HeartPulse size={24} className={colorClass} />;
            case 'tugas': return <CheckSquare size={24} className={colorClass} />;
            case 'deadline': return <Clock size={24} className="text-[var(--accent-red)]" />;
            default: return <Bell size={24} className={colorClass} />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Riwayat Notifikasi</h2>
                {!loading && notifications.length > 0 && (
                    <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                        <CheckCircle2 size={16} /> Semua dibaca
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-t-[var(--accent-blue)] border-r-[var(--accent-green)] border-b-[var(--accent-red)] border-l-[var(--accent-yellow)] rounded-full animate-spin"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20">
                    <Bell size={48} className="mx-auto text-[var(--text-muted)] mb-4 opacity-50" />
                    <p className="text-[var(--text-muted)]">Belum ada notifikasi.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <Card key={notif.id} className={`p-4 transition-colors ${notif.is_read ? 'opacity-70' : 'border-[var(--accent-blue)] bg-[var(--accent-blue-dim)]/10'}`}>
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    {getIcon(notif.tipe, notif.is_read)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-semibold capitalize ${!notif.is_read ? 'text-[var(--accent-blue)]' : ''}`}>
                                            {notif.tipe === 'deadline' ? 'Peringatan Deadline!' : notif.tipe}
                                        </h4>
                                        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-2">
                                            {(() => {
                                                let dateStr = notif.created_at;
                                                if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
                                                    dateStr += 'Z';
                                                }
                                                return format(new Date(dateStr), 'HH:mm - dd MMMM yyyy', { locale: id });
                                            })()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">{notif.pesan}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
