'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatRupiah, formatTanggalID, hariIni, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Wallet, Search } from 'lucide-react';
import { Transaksi } from '@/types';

export default function KeuanganHistoryPage() {
    const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(hariIni());
    const [toDate, setToDate] = useState(hariIni());
    const [filterJenis, setFilterJenis] = useState('Semua');
    const { user } = useAuth();
    const supabase = createClient();

    const fetchHistory = async () => {
        if (!user) return;
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
        fetchHistory();
    }, [user]);

    const groupedTransaksi = transaksi.reduce((groups: any, t) => {
        const date = t.tanggal;
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
        return groups;
    }, {});

    const dates = Object.keys(groupedTransaksi).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/keuangan">
                    <Button variant="ghost" className="p-2 h-auto">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
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
                        label="Jenis"
                        value={filterJenis}
                        onChange={(e) => setFilterJenis(e.target.value)}
                    >
                        <option>Semua</option>
                        <option>Pemasukan</option>
                        <option>Pengeluaran</option>
                    </Select>
                    <Button onClick={fetchHistory} className="flex items-center gap-2">
                        <Search size={18} /> Cari
                    </Button>
                </div>
            </Card>

            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : dates.length === 0 ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        Tidak ada data untuk periode ini.
                    </div>
                ) : (
                    dates.map((date) => {
                        const items = groupedTransaksi[date];
                        const dailyIncoming = items.filter((i: any) => i.jenis === 'pemasukan').reduce((s: any, i: any) => s + Number(i.jumlah), 0);
                        const dailyOutgoing = items.filter((i: any) => i.jenis === 'pengeluaran').reduce((s: any, i: any) => s + Number(i.jumlah), 0);

                        return (
                            <div key={date} className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{formatTanggalID(date)}</h3>
                                    <div className="flex gap-3 text-[10px] font-bold">
                                        <span className="text-[var(--accent-green)]">+{formatRupiah(dailyIncoming)}</span>
                                        <span className="text-[var(--accent-red)]">-{formatRupiah(dailyOutgoing)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {items.map((t: Transaksi) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    t.jenis === 'pemasukan' ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]"
                                                )} />
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">{t.kategori}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)]">{t.deskripsi || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-sm font-bold",
                                                    t.jenis === 'pemasukan' ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                                                )}>
                                                    {t.jenis === 'pemasukan' ? '+' : '-'} {formatRupiah(t.jumlah)}
                                                </p>
                                            </div>
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
