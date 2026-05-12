'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKeuangan } from '@/hooks/useKeuangan';
import { hariIni, tambahHari, formatTanggalID, formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Plus, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import TransaksiForm from '@/components/keuangan/TransaksiForm';
import TransaksiCard from '@/components/keuangan/TransaksiCard';

export default function KeuanganPage() {
    const [tanggal, setTanggal] = useState(hariIni());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        transaksi,
        loading,
        totalPemasukan,
        totalPengeluaran,
        totalSaldo,
        hapusTransaksi
    } = useKeuangan(tanggal);

    const prevDay = () => setTanggal(tambahHari(tanggal, -1));
    const nextDay = () => setTanggal(tambahHari(tanggal, 1));
    const resetToToday = () => setTanggal(hariIni());

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Keuangan Harian</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <button onClick={prevDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronLeft size={16} />
                        </button>
                        <span
                            className="text-sm font-bold text-[var(--accent-blue)] cursor-pointer hover:underline"
                            onClick={resetToToday}
                        >
                            {formatTanggalID(tanggal)}
                        </span>
                        <button onClick={nextDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Tambah Transaksi
                </Button>
            </div>

            <Card className="bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-blue)]">
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">SALDO ANDA SEKARANG</p>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{loading ? "..." : formatRupiah(totalSaldo)}</h3>
                    <div className="p-2 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-lg">
                        <Wallet size={20} />
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-green)]">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Total Pemasukan</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[var(--accent-green)]">{loading ? "..." : `+ ${formatRupiah(totalPemasukan)}`}</h3>
                        <div className="p-2 bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </Card>

                <Card className="bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-red)]">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Total Pengeluaran</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[var(--accent-red)]">{loading ? "..." : `- ${formatRupiah(totalPengeluaran)}`}</h3>
                        <div className="p-2 bg-[var(--accent-red-dim)] text-[var(--accent-red)] rounded-lg">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Transaksi Hari Ini</h3>
                    <Link href="/dashboard/keuangan/history" className="text-xs text-[var(--accent-blue)] font-bold hover:underline">
                        Lihat Semua History
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : transaksi.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <Wallet size={32} />
                        </div>
                        <p className="text-[var(--text-muted)] italic">Tidak ada transaksi pada tanggal ini.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => setIsModalOpen(true)}>
                            Tambah sekarang
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {transaksi.map((t) => (
                            <TransaksiCard
                                key={t.id}
                                transaksi={t}
                                onDelete={(id) => {
                                    if (confirm('Hapus transaksi ini?')) hapusTransaksi(id);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Transaksi"
            >
                <TransaksiForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
