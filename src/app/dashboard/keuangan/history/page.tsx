'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatRupiah, formatTanggalID, hariIni, nowWIB, cn, formatTanggalSingkat } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Search, Wallet } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Transaksi } from '@/types';

export default function KeuanganHistoryPage() {
    const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState(hariIni());
    const [filterJenis, setFilterJenis] = useState('Semua');
    const [preset, setPreset] = useState('Minggu');
    const { user } = useAuth();
    const supabase = createClient();
    const { t, dateFnsLocale } = useTranslation();

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
            let query = supabase
                .from('transaksi')
                .select('*')
                .eq('user_id', user.id)
                .gte('tanggal', fromDate)
                .lte('tanggal', toDate)
                .order('tanggal', { ascending: false })
                .order('created_at', { ascending: false });

            if (filterJenis !== 'Semua') {
                query = query.eq('jenis', filterJenis.toLowerCase());
            }

            const { data, error } = await query;
            if (error) throw error;
            setTransaksi(data || []);
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
    }, [user, fromDate, toDate, filterJenis]);

    const groupedTransaksi = transaksi.reduce((groups: any, tItem) => {
        const date = tItem.tanggal;
        if (!groups[date]) groups[date] = [];
        groups[date].push(tItem);
        return groups;
    }, {});

    const dates = Object.keys(groupedTransaksi).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-3 md:gap-4 -ml-2 md:ml-0">
                <Link href="/dashboard/keuangan" className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-[var(--text-primary)]" />
                </Link>
                <h2 className="text-[20px] md:text-2xl font-bold text-[var(--text-primary)]">{t('transaction_history')}</h2>
            </div>

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

            <Card className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-end">
                    <Input
                        label={t('from_date')}
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setPreset('');
                        }}
                        className="text-xs sm:text-sm"
                    />
                    <Input
                        label={t('to_date')}
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setPreset('');
                        }}
                        className="text-xs sm:text-sm"
                    />
                    <Select
                        label={t('type_filter')}
                        value={filterJenis}
                        onChange={(e) => setFilterJenis(e.target.value)}
                        className="text-xs sm:text-sm"
                    >
                        <option>Semua</option>
                        <option>Pemasukan</option>
                        <option>Pengeluaran</option>
                    </Select>
                    <Button onClick={fetchHistory} className="flex items-center justify-center gap-2 py-3 md:py-2 col-span-2 md:col-span-1">
                        <Search size={18} /> {t('search')}
                    </Button>
                </div>
            </Card>

            <div className="space-y-6 md:space-y-8 mt-2">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : dates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        {t('no_data_period')}
                    </div>
                ) : (
                    dates.map((date) => {
                        const items = groupedTransaksi[date];
                        const dailyIncoming = items.filter((i: any) => i.jenis === 'pemasukan').reduce((s: any, i: any) => s + Number(i.jumlah), 0);
                        const dailyOutgoing = items.filter((i: any) => i.jenis === 'pengeluaran').reduce((s: any, i: any) => s + Number(i.jumlah), 0);

                        return (
                            <div key={date} className="space-y-2.5">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px]">{formatTanggalID(date, dateFnsLocale)}</h3>
                                    <div className="flex gap-2.5 text-[10px] font-bold">
                                        <span className="text-[var(--accent-green)]">+{formatRupiah(dailyIncoming)}</span>
                                        <span className="text-[var(--accent-red)]">-{formatRupiah(dailyOutgoing)}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    {items.map((tItem: Transaksi) => {
                                        const isPemasukan = tItem.jenis === 'pemasukan';
                                        return (
                                            <div key={tItem.id} className="flex items-center gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full shrink-0",
                                                    isPemasukan ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{tItem.kategori}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)] truncate">{tItem.deskripsi || '-'}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className={cn(
                                                        "text-sm font-bold",
                                                        isPemasukan ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                                                    )}>
                                                        {isPemasukan ? '+' : '-'} {formatRupiah(tItem.jumlah)}
                                                    </p>
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
