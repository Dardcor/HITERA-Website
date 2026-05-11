'use client';

import { useState } from 'react';
import { useTugas } from '@/hooks/useTugas';
import { hariIni, tambahHari, formatTanggalID, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Plus, ChevronLeft, ChevronRight, CheckSquare, ListTodo } from 'lucide-react';
import TugasForm from '@/components/tugas/TugasForm';
import TugasItem from '@/components/tugas/TugasItem';
import Link from 'next/link';

export default function TugasPage() {
    const [tanggal, setTanggal] = useState(hariIni());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');

    const {
        tugas,
        loading,
        tugasAktif,
        tugasSelesai,
        toggleSelesai,
        deleteTugas
    } = useTugas(tanggal);

    const prevDay = () => setTanggal(tambahHari(tanggal, -1));
    const nextDay = () => setTanggal(tambahHari(tanggal, 1));

    const progress = tugas.length > 0 ? Math.round((tugasSelesai.length / tugas.length) * 100) : 0;

    const displayTugas = filter === 'semua' ? tugas : filter === 'aktif' ? tugasAktif : tugasSelesai;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Daftar Tugas</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <button onClick={prevDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold text-[var(--accent-blue)]">
                            {formatTanggalID(tanggal)}
                        </span>
                        <button onClick={nextDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Tambah Tugas
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Progress Hari Ini</p>
                    <p className="text-sm font-bold text-[var(--accent-blue)]">{progress}% Selesai</p>
                </div>
                <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-green)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-3">
                    {tugasSelesai.length} dari {tugas.length} tugas berhasil diselesaikan
                </p>
            </Card>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)] overflow-x-auto">
                        {(['semua', 'aktif', 'selesai'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap capitalize",
                                    filter === f ? "bg-[var(--bg-card)] text-[var(--accent-blue)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <Link href="/dashboard/tugas/history" className="text-xs text-[var(--accent-blue)] font-bold hover:underline">
                        History Tugas
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : displayTugas.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <ListTodo size={32} />
                        </div>
                        <p className="text-[var(--text-muted)] italic">Tidak ada tugas dalam kategori ini.</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {displayTugas.map((t) => (
                            <TugasItem
                                key={t.id}
                                tugas={t}
                                onToggle={toggleSelesai}
                                onDelete={(id) => {
                                    if (confirm('Hapus tugas ini?')) deleteTugas(id);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Tugas Baru"
            >
                <TugasForm
                    tanggal={tanggal}
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
