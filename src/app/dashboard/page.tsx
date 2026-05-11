'use client';

import { useAuth } from '@/hooks/useAuth';
import { useKeuangan } from '@/hooks/useKeuangan';
import { useKesehatan } from '@/hooks/useKesehatan';
import { useTugas } from '@/hooks/useTugas';
import { hariIni, formatRupiah, formatTanggalID, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wallet, HeartPulse, CheckSquare, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const tgl = hariIni();

    const { totalPemasukan, totalPengeluaran, saldoBersih, loading: loadK } = useKeuangan(tgl);
    const { data: kesehatan, loading: loadKes } = useKesehatan(tgl);
    const { tugas, tugasAktif, tugasSelesai, loading: loadT } = useTugas(tgl);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const progressTugas = tugas.length > 0 ? Math.round((tugasSelesai.length / tugas.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-[var(--accent-blue)] font-bold text-sm uppercase tracking-widest mb-1">{formatTanggalID(tgl)}</p>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                        {getGreeting()}, {user?.user_metadata?.nama || user?.email?.split('@')[0]}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/keuangan">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Plus size={18} /> Transaksi
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <Link href="/dashboard/keuangan" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Saldo Bersih Hari Ini</p>
                    <h3 className={cn(
                        "text-2xl font-bold mb-4",
                        saldoBersih >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                    )}>
                        {loadK ? "..." : formatRupiah(saldoBersih)}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[var(--border)]">
                        <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase">Pemasukan</p>
                            <p className="text-sm font-bold text-[var(--accent-green)]">+{loadK ? "..." : formatRupiah(totalPemasukan)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase">Pengeluaran</p>
                            <p className="text-sm font-bold text-[var(--accent-red)]">-{loadK ? "..." : formatRupiah(totalPengeluaran)}</p>
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-xl">
                            <HeartPulse size={24} />
                        </div>
                        <Link href="/dashboard/kesehatan" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Kesehatan Hari Ini</p>
                    {loadKes ? (
                        <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">...</h3>
                    ) : kesehatan ? (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{kesehatan.berat_badan} kg</h3>
                            <div className="flex gap-4 text-xs font-medium text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1">💧 {kesehatan.air_minum} gelas</span>
                                <span className="flex items-center gap-1">😴 {kesehatan.jam_tidur} jam</span>
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            <p className="text-sm text-[var(--text-secondary)] mb-4 italic">Data belum diisi</p>
                            <Link href="/dashboard/kesehatan">
                                <Button variant="secondary" className="w-full py-2 text-xs">Isi Data</Button>
                            </Link>
                        </div>
                    )}
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[var(--accent-red-dim)] text-[var(--accent-red)] rounded-xl">
                            <CheckSquare size={24} />
                        </div>
                        <Link href="/dashboard/tugas" className="text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Tugas Hari Ini</p>
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                            {loadT ? "..." : `${tugasSelesai.length}/${tugas.length}`} Tugas
                        </h3>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase mt-1">Selesai {progressTugas}%</p>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent-red)] transition-all duration-1000 ease-out"
                            style={{ width: `${progressTugas}%` }}
                        />
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-[var(--text-secondary)]">
                            {tugasAktif.length > 0 ? `${tugasAktif.length} tugas masih aktif` : "Semua tugas selesai! 🙌"}
                        </p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-0 overflow-hidden border-[var(--border)]">
                    <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]/30">
                        <h4 className="font-bold text-sm">Tugas Utama</h4>
                        <Link href="/dashboard/tugas" className="text-xs text-[var(--accent-blue)] hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {tugasAktif.length === 0 ? (
                            <div className="p-10 text-center text-[var(--text-muted)] text-sm italic">
                                Tidak ada tugas aktif hari ini
                            </div>
                        ) : (
                            tugasAktif.slice(0, 5).map((t) => (
                                <div key={t.id} className="px-6 py-4 flex items-center gap-3 hover:bg-[var(--bg-card-hover)] transition-colors">
                                    <div className="w-4 h-4 rounded border border-[var(--border)]" />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{t.judul}</span>
                                    <span className={cn(
                                        "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                        t.prioritas === 'tinggi' ? "bg-[var(--accent-red-dim)] text-[var(--accent-red)]" :
                                            t.prioritas === 'sedang' ? "bg-[var(--accent-yellow-dim)] text-[var(--accent-yellow)]" :
                                                "bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                                    )}>
                                        {t.prioritas}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden border-[var(--border)]">
                    <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]/30">
                        <h4 className="font-bold text-sm">Aktivitas Terbaru</h4>
                        <Link href="/dashboard/keuangan" className="text-xs text-[var(--accent-blue)] hover:underline">Lihat Detail</Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {totalPemasukan === 0 && totalPengeluaran === 0 ? (
                            <div className="p-10 text-center text-[var(--text-muted)] text-sm italic">
                                Belum ada aktivitas hari ini
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[var(--text-muted)] mb-1">Perbandingan Arus Kas</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                                                <span className="text-xs font-bold text-[var(--accent-green)]">{formatRupiah(totalPemasukan)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
                                                <span className="text-xs font-bold text-[var(--accent-red)]">{formatRupiah(totalPengeluaran)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] uppercase font-bold">
                                        <span>Distribusi</span>
                                        <span>{Math.round((totalPengeluaran / (totalPemasukan || 1)) * 100)}% Rasio</span>
                                    </div>
                                    <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-[var(--accent-green)]"
                                            style={{ width: `${(totalPemasukan / (totalPemasukan + totalPengeluaran || 1)) * 100}%` }}
                                        />
                                        <div
                                            className="h-full bg-[var(--accent-red)]"
                                            style={{ width: `${(totalPengeluaran / (totalPemasukan + totalPengeluaran || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
}
