'use client';

import { useState } from 'react';
import { useTugas } from '@/hooks/useTugas';
import { hariIni, formatTanggalGroup, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';
import { Plus, ListTodo } from 'lucide-react';
import TugasForm from '@/components/tugas/TugasForm';
import TugasItem from '@/components/tugas/TugasItem';

export default function TugasPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');

    const { t } = useTranslation();

    const {
        tugas,
        loading,
        tugasAktif,
        tugasSelesai,
        toggleSelesai,
        deleteTugas
    } = useTugas();

    const displayTugas = filter === 'semua' ? tugas : filter === 'aktif' ? tugasAktif : tugasSelesai;

    
    const grouped: Record<string, typeof tugas> = {};
    displayTugas.forEach(t => {
        const key = t.tanggal_target;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t);
    });
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            {}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="hidden md:block text-2xl font-bold">{t('tasks')}</h2>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> {t('add_task')}
                </Button>
            </div>

            {}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 px-1">
                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)] overflow-x-auto flex-1">
                        {(['semua', 'aktif', 'selesai'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "flex-1 px-3.5 md:px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap capitalize",
                                    filter === f
                                        ? "bg-[var(--bg-card)] text-[var(--accent-blue)] shadow-sm"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {f === 'semua' ? t('filter_all') : f === 'aktif' ? t('filter_active') : t('filter_done')}
                            </button>
                        ))}
                    </div>
                </div>

                {}
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-[72px] w-full bg-[var(--bg-card-hover)] animate-pulse rounded-xl" />)}
                    </div>
                ) : displayTugas.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
                        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <ListTodo size={32} />
                        </div>
                        <p className="text-[var(--text-muted)] italic">{t('no_tasks')}</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sortedDates.map(date => (
                            <div key={date}>
                                <p className="text-xs font-bold text-[var(--accent-blue)] mb-2 tracking-wide">
                                    {formatTanggalGroup(date)}
                                </p>
                                <div className="space-y-2">
                                    {grouped[date].map((t) => (
                                        <TugasItem
                                            key={t.id}
                                            tugas={t}
                                            onToggle={toggleSelesai}
                                            onDelete={(id) => {
                                                if (confirm(t('delete_task_confirm'))) deleteTugas(id);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('add_task')}
            >
                <TugasForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
