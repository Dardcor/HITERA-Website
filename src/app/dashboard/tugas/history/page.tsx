'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatTanggalID, hariIni, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Search, CheckCircle2, ListTodo } from 'lucide-react';
import { Tugas } from '@/types';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function TugasHistoryPage() {
    const [history, setHistory] = useState<Tugas[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(hariIni());
    const [toDate, setToDate] = useState(hariIni());
    const [filterStatus, setFilterStatus] = useState('Semua');
    const { user } = useAuth();
    const supabase = createClient();

    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            let query = supabase
                .from('tugas')
                .select('*')
                .eq('user_id', user.id)
                .gte('tanggal_target', fromDate)
                .lte('tanggal_target', toDate)
                .order('tanggal_target', { ascending: false });

            if (filterStatus !== 'Semua') {
                query = query.eq('status', filterStatus.toLowerCase());
            }

            const { data, error } = await query;
            if (error) throw error;
            setHistory(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const groupedTasks = history.reduce((groups: any, t) => {
        const date = t.tanggal_target;
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
        return groups;
    }, {});

    const dates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/tugas">
                    <Button variant="ghost" className="p-2 h-auto">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold">Riwayat Tugas</h2>
            </div>

            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <Input
                        label="Dari Tanggal"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <Input
                        label="Sampai Tanggal"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    <Select
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option>Semua</option>
                        <option>Selesai</option>
                        <option>Aktif</option>
                        <option>Ditunda</option>
                    </Select>
                    <Button onClick={fetchHistory} className="flex items-center gap-2">
                        <Search size={18} /> Filter
                    </Button>
                </div>
            </Card>

            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : dates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        Tidak ada riwayat tugas untuk periode ini.
                    </div>
                ) : (
                    dates.map((date) => {
                        const items = groupedTasks[date];
                        const finishedCount = items.filter((i: any) => i.status === 'selesai').length;

                        return (
                            <div key={date} className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{formatTanggalID(date)}</h3>
                                    <p className="text-[10px] font-bold text-[var(--accent-blue)]">
                                        {finishedCount}/{items.length} Selesai
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {items.map((t: Tugas) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    t.prioritas === 'tinggi' ? "bg-[var(--accent-red)]" :
                                                        t.prioritas === 'sedang' ? "bg-[var(--accent-yellow)]" :
                                                            "bg-[var(--accent-blue)]"
                                                )} />
                                                <div>
                                                    <p className={cn(
                                                        "text-sm font-bold",
                                                        t.status === 'selesai' && "line-through text-[var(--text-muted)]"
                                                    )}>{t.judul}</p>
                                                </div>
                                            </div>
                                            <Badge variant={t.status === 'selesai' ? 'success' : t.status === 'aktif' ? 'primary' : 'warning'}>
                                                {t.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
