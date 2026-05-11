'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatTanggalID, hariIni, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Search, Scale, Droplet, Moon, Footprints, Activity } from 'lucide-react';
import { DataKesehatan } from '@/types';
import Link from 'next/link';

export default function KesehatanHistoryPage() {
    const [history, setHistory] = useState<DataKesehatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(hariIni());
    const [toDate, setToDate] = useState(hariIni());
    const { user } = useAuth();
    const supabase = createClient();

    const fetchHistory = async () => {
        if (!user) return;
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
        fetchHistory();
    }, [user]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/kesehatan">
                    <Button variant="ghost" className="p-2 h-auto">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold">Riwayat Kesehatan</h2>
            </div>

            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
                    <Button onClick={fetchHistory} className="flex items-center gap-2">
                        <Search size={18} /> Tampilkan
                    </Button>
                </div>
            </Card>

            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : history.length === 0 ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        Tidak ada riwayat kesehatan untuk periode ini.
                    </div>
                ) : (
                    history.map((h) => (
                        <Card key={h.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="min-w-[140px]">
                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Tanggal</p>
                                <h4 className="text-sm font-bold text-[var(--accent-blue)]">{formatTanggalID(h.tanggal)}</h4>
                            </div>

                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4">
                                <div className="text-center">
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">Berat</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{h.berat_badan || '-'} kg</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">Air</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{h.air_minum || '-'} gls</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">Tidur</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{h.jam_tidur || '-'} jam</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">Langkah</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{h.langkah_kaki || '-'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">T. Darah</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{h.tekanan_darah || '-'}</p>
                                </div>
                            </div>

                            <div className="md:max-w-[200px] border-t md:border-t-0 md:border-l border-[var(--border)] pt-3 md:pt-0 md:pl-6">
                                <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1">Catatan</p>
                                <p className="text-[11px] text-[var(--text-secondary)] italic line-clamp-2">{h.catatan || 'Tidak ada catatan.'}</p>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
