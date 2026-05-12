'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatTanggalID, hariIni, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Search, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import { Tugas } from '@/types';
import Link from 'next/link';

export default function TugasHistoryPage() {
    const [history, setHistory] = useState<Tugas[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState(hariIni());
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [preset, setPreset] = useState('Minggu');
    const { user } = useAuth();
    const supabase = createClient();

    const applyPreset = useCallback((p: string) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        let from = '';

        const d = new Date();
        switch (p) {
            case 'Minggu':
                d.setDate(d.getDate() - 7);
                from = d.toISOString().split('T')[0];
                break;
            case 'Bulan':
                d.setMonth(d.getMonth() - 1);
                from = d.toISOString().split('T')[0];
                break;
            case 'Tahun':
                d.setFullYear(d.getFullYear() - 1);
                from = d.toISOString().split('T')[0];
                break;
            default: // Semua
                from = '2020-01-01';
        }

        setPreset(p);
        setFromDate(from);
        setToDate(today);
    }, []);

    useEffect(() => {
        applyPreset('Minggu');
    }, [applyPreset]);

    const fetchHistory = async () => {
        if (!user || !fromDate) return;
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
        if (user && fromDate) {
            fetchHistory();
        }
    }, [user, fromDate, toDate, filterStatus]);

    const groupedTasks = history.reduce((groups: any, t) => {
        const date = t.tanggal_target;
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
        return groups;
    }, {});

    const dates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 md:gap-4 -ml-2 md:ml-0">
                <Link href="/dashboard/tugas" className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-[var(--text-primary)]" />
                </Link>
                <h2 className="text-[20px] md:text-2xl font-bold text-[var(--text-primary)]">Riwayat Tugas</h2>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {['Semua', 'Minggu', 'Bulan', 'Tahun'].map((p) => {
                    const isSelected = preset === p;
                    return (
                        <button
                            key={p}
                            onClick={() => applyPreset(p)}
                            className={cn(
                                "px-4 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap",
                                isSelected
                                    ? "bg-[var(--accent-blue)] text-[var(--bg-primary)] border-[var(--accent-blue)]"
                                    : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-muted)]"
                            )}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Filter Card */}
            <Card className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-end">
                    <Input
                        label="Dari"
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setPreset('');
                        }}
                    />
                    <Input
                        label="Sampai"
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setPreset('');
                        }}
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
                    <Button onClick={fetchHistory} className="flex items-center justify-center gap-2 py-3 md:py-2 col-span-2 md:col-span-1">
                        <Search size={18} /> Filter
                    </Button>
                </div>
            </Card>

            {/* History List Grouped by Date */}
            <div className="space-y-6 md:space-y-8 mt-2">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
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
                            <div key={date} className="space-y-2.5">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px]">{formatTanggalID(date)}</h3>
                                    <p className="text-[10px] font-bold text-[var(--accent-blue)]">
                                        {finishedCount}/{items.length} Selesai
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    {items.map((t: Tugas) => {
                                        const isSelesai = t.status === 'selesai';
                                        return (
                                            <div key={t.id} className={cn(
                                                "flex items-center gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl transition-all",
                                                isSelesai && "opacity-60"
                                            )}>
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full shrink-0",
                                                    t.prioritas === 'tinggi' ? "bg-[var(--accent-red)]" :
                                                        t.prioritas === 'sedang' ? "bg-[var(--accent-yellow)]" :
                                                            "bg-[var(--accent-blue)]"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm font-bold truncate",
                                                        isSelesai && "line-through text-[var(--text-muted)]"
                                                    )}>{t.judul}</p>
                                                    {t.deskripsi && (
                                                        <p className="text-[10px] text-[var(--text-muted)] truncate">{t.deskripsi}</p>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    {isSelesai ? (
                                                        <CheckCircle2 size={16} className="text-[var(--accent-green)]" />
                                                    ) : (
                                                        <Clock size={16} className="text-[var(--text-muted)]" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
