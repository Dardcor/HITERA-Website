'use client';

import { useAuth } from '@/hooks/useAuth';
import { useKeuangan } from '@/hooks/useKeuangan';
import { useKesehatan } from '@/hooks/useKesehatan';
import { useTugas } from '@/hooks/useTugas';
import { hariIni, formatRupiah, formatTanggalID, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wallet, HeartPulse, CheckSquare, Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const tgl = hariIni();

    const { totalPemasukan, totalPengeluaran, totalSaldo, loading: loadK } = useKeuangan(tgl);
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
        <div className="space-y-8 md:space-y-8 animate-in fade-in duration-500">
            {/* Header - matches Flutter AppBar style on mobile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {/* Mobile: small date like Flutter (11px, blue, bold, tracking) */}
                    <p className="text-[11px] md:text-sm text-[var(--accent-blue)] font-bold uppercase tracking-[1.5px] md:tracking-widest mb-1">{formatTanggalID(tgl)}</p>
                    {/* Mobile: 20px greeting like Flutter */}
                    <h2 className="text-xl md:text-3xl font-bold text-[var(--text-primary)]">
                        {getGreeting()}, {user?.user_metadata?.nama || user?.email?.split('@')[0]}
                    </h2>
                </div>
                {/* Hide Transaksi button on mobile - Flutter doesn't have this */}
                <div className="hidden md:flex gap-2">
                    <Link href="/dashboard/keuangan">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Plus size={18} /> Transaksi
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Summary Cards - Single column on mobile (matching Flutter ListView), 3-col on desktop */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-6">
                {/* === KEUANGAN CARD === */}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-xl">
                            <Wallet size={22} className="md:hidden" />
                            <Wallet size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/keuangan" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">Saldo Anda Sekarang</p>
                    <h3 className={cn(
                        "text-[22px] md:text-2xl font-extrabold mb-3 md:mb-4",
                        totalSaldo >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                    )}>
                        {loadK ? "..." : formatRupiah(totalSaldo)}
                    </h3>
                    <div className="h-px bg-[var(--border)] mb-3" />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Pemasukan</p>
                            <p className="text-[13px] font-bold text-[var(--accent-green)]">+{loadK ? "..." : formatRupiah(totalPemasukan)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Pengeluaran</p>
                            <p className="text-[13px] font-bold text-[var(--accent-red)]">-{loadK ? "..." : formatRupiah(totalPengeluaran)}</p>
                        </div>
                    </div>
                </Card>

                {/* === KESEHATAN CARD === */}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-xl">
                            <HeartPulse size={22} className="md:hidden" />
                            <HeartPulse size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/kesehatan" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">Kesehatan Hari Ini</p>
                    {loadKes ? (
                        <h3 className="text-[22px] md:text-2xl font-extrabold mb-4 text-[var(--text-primary)]">...</h3>
                    ) : kesehatan ? (
                        <div className="space-y-2">
                            <div className="flex gap-4 text-sm font-bold text-[var(--text-primary)]">
                                <span className="flex items-center gap-1">💧 {kesehatan.air_minum ?? '-'} gelas</span>
                                <span className="flex items-center gap-1">😴 {kesehatan.jam_tidur ?? '-'} jam</span>
                            </div>
                            {kesehatan.catatan && (
                                <p className="text-xs text-[var(--text-secondary)] italic truncate">{kesehatan.catatan}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--text-secondary)] italic">Data belum diisi</p>
                    )}
                </Card>

                {/* === TUGAS CARD === */}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-red-dim)] text-[var(--accent-red)] rounded-xl">
                            <CheckSquare size={22} className="md:hidden" />
                            <CheckSquare size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/tugas" className="text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">Tugas Hari Ini</p>
                    <div className="mb-3 md:mb-4">
                        <h3 className="text-[22px] md:text-2xl font-extrabold text-[var(--text-primary)]">
                            {loadT ? "..." : `${tugasSelesai.length}/${tugas.length}`} Tugas
                        </h3>
                        <p className="text-[9px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">Selesai {progressTugas}%</p>
                    </div>
                    {/* Progress bar - h-1.5 on mobile (6px), h-2 desktop */}
                    <div className="w-full h-1.5 md:h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent-red)] transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progressTugas}%` }}
                        />
                    </div>
                    <div className="mt-2 md:mt-4">
                        <p className="text-xs text-[var(--text-secondary)]">
                            {tugasAktif.length > 0 ? `${tugasAktif.length} tugas masih aktif` : "Semua tugas selesai! 🙌"}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Bottom section - Tugas Utama + Aktivitas Terbaru */}
            {/* On mobile: only show Tugas Utama (matching Flutter). Aktivitas Terbaru hidden on mobile. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tugas Utama - visible on all screens */}
                <Card className="p-0 overflow-hidden border-[var(--border)]">
                    <div className="px-4 md:px-6 py-3.5 md:py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]/30">
                        <h4 className="font-bold text-[13px] md:text-sm">Tugas Utama</h4>
                        <Link href="/dashboard/tugas" className="text-xs text-[var(--accent-blue)] hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]/50">
                        {tugasAktif.length === 0 ? (
                            <div className="p-8 md:p-10 text-center text-[var(--text-muted)] text-sm italic">
                                Tidak ada tugas aktif hari ini
                            </div>
                        ) : (
                            tugasAktif.slice(0, 5).map((t) => (
                                <div key={t.id} className="px-4 md:px-6 py-3.5 md:py-4 flex items-center gap-3 hover:bg-[var(--bg-card-hover)] transition-colors">
                                    {/* Checkbox 16x16 on mobile, matching Flutter */}
                                    <div className="w-4 h-4 rounded border border-[var(--border)] shrink-0" />
                                    <span className="text-sm font-medium text-[var(--text-primary)] flex-1 truncate">{t.judul}</span>
                                    <span className={cn(
                                        "ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.5px] shrink-0",
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

                {/* Aktivitas Terbaru - HIDDEN on mobile (Flutter doesn't have this in dashboard) */}
                <Card className="hidden lg:block p-0 overflow-hidden border-[var(--border)]">
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
