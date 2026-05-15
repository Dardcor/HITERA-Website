'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatTanggalID, hariIni, nowWIB, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Search, Droplet, Moon, Clipboard } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { DataKesehatan } from '@/types';
import Link from 'next/link';

export default function KesehatanHistoryPage() {
    const [history, setHistory] = useState<DataKesehatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState(hariIni());
    const [preset, setPreset] = useState('Minggu');
    const { user } = useAuth();
    const supabase = createClient();
    const { t } = useTranslation();

    const presetMap: Record<string, string> = {
        'Semua': t('filter_all'),
        'Minggu': t('week'),
        'Bulan': t('month'),
        'Tahun': t('year'),
    };

    const applyPreset = useCallback((p: string) => {
        const now = nowWIB();
        const today = hariIni();
        let from = '';

        switch (p) {
            case 'Minggu':
                const d7 = new Date(now);
                d7.setDate(d7.getDate() - 7);
                from = d7.toISOString().split('T')[0];
                break;
            case 'Bulan':
                const d30 = new Date(now);
                d30.setMonth(d30.getMonth() - 1);
                from = d30.toISOString().split('T')[0];
                break;
            case 'Tahun':
                const d365 = new Date(now);
                d365.setFullYear(d365.getFullYear() - 1);
                from = d365.toISOString().split('T')[0];
                break;
            default: 
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
            const { data, error } = await supabase
                .from('kesehatan')
                .select('*')
                .eq('user_id', user.id)
                .gte('tanggal', fromDate)
                .lte('tanggal', toDate)
                .order('tanggal', { ascending: false });

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
    }, [user, fromDate, toDate]);

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            {}
            <div className="flex items-center gap-3 md:gap-4 -ml-2 md:ml-0">
                <Link href="/dashboard/kesehatan" className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-[var(--text-primary)]" />
                </Link>
                <h2 className="text-[20px] md:text-2xl font-bold text-[var(--text-primary)]">{t('health_history')}</h2>
            </div>

            {}
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
                            {presetMap[p] || p}
                        </button>
                    );
                })}
            </div>

            {}
            <Card className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 items-end">
                    <Input
                        label={t('from_date')}
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setPreset('');
                        }}
                    />
                    <Input
                        label={t('to_date')}
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setPreset('');
                        }}
                    />
                    <Button onClick={fetchHistory} className="flex items-center justify-center gap-2 py-3 md:py-2 col-span-2 md:col-span-1">
                        <Search size={18} /> {t('search')}
                    </Button>
                </div>
            </Card>

            {/* History List */}
            <div className="space-y-3.5 mt-2">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-28 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : history.length === 0 ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        {t('no_health_history_period')}
                    </div>
                ) : (
                    history.map((h) => (
                        <Card key={h.id} className="p-4 md:p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px]">{formatTanggalID(h.tanggal)}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                                    <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                                        <Droplet size={14} className="text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase">Air Minum</p>
                                        <p className="text-sm font-bold">{h.air_minum || '0'} <span className="text-[10px] font-normal opacity-70">gls</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                                    <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                                        <Moon size={14} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase">Jam Tidur</p>
                                        <p className="text-sm font-bold">{h.jam_tidur || '0'} <span className="text-[10px] font-normal opacity-70">jam</span></p>
                                    </div>
                                </div>
                            </div>

                            {h.catatan && (
                                <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border)] border-dashed">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clipboard size={12} className="text-amber-500" />
                                        <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase">Catatan</p>
                                    </div>
                                    <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">{h.catatan}</p>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
