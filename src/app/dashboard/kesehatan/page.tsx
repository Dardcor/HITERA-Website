'use client';

import { useState } from 'react';
import { useKesehatan } from '@/hooks/useKesehatan';
import { hariIni, tambahHari, formatTanggalID, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Edit3, HeartPulse, Droplet, Moon, Clipboard, Dumbbell } from 'lucide-react';
import KesehatanForm from '@/components/kesehatan/KesehatanForm';
import Link from 'next/link';

export default function KesehatanPage() {
    const [tanggal, setTanggal] = useState(hariIni());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { t, dateFnsLocale } = useTranslation();

    const { data, loading } = useKesehatan(tanggal);

    const prevDay = () => setTanggal(tambahHari(tanggal, -1));
    const nextDay = () => setTanggal(tambahHari(tanggal, 1));

    const MetrikCard = ({ icon: Icon, color, bgColor, label, value, unit }: any) => (
        <Card className="flex flex-col justify-between gap-3 p-3.5 md:p-5 min-h-[100px]">
            <div className={cn("p-1.5 w-fit rounded-lg", bgColor)}>
                <Icon size={18} className={color} />
            </div>
            <div>
                <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-[var(--text-primary)]">{value || '-'}</span>
                    <span className="text-[9px] text-[var(--text-muted)]">{unit}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="hidden md:block text-2xl font-bold">{t('daily_health')}</h2>
                    <div className="flex items-center gap-2 mt-0 md:mt-1">
                        <button onClick={prevDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-bold text-[var(--accent-blue)]">
                            {formatTanggalID(tanggal, dateFnsLocale)}
                        </span>
                        <button onClick={nextDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Edit3 size={18} /> {data ? t('edit') : t('save_data')}
                </Button>
            </div>

            {!loading && !data ? (
                <Card className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
                    <div className="w-[72px] h-[72px] bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent-blue)] mb-5 md:mb-6">
                        <HeartPulse size={36} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('data_not_filled')}</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6">
                        {t('record_health_today')}
                    </p>
                    <Button onClick={() => setIsModalOpen(true)} className="px-7 py-3">
                        {t('save_data')}
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
                    <MetrikCard
                        icon={Droplet}
                        color="text-cyan-500"
                        bgColor="bg-cyan-500/10"
                        label={t('water_intake')}
                        value={data?.air_minum}
                        unit={t('glasses').toLowerCase()}
                    />
                    <MetrikCard
                        icon={Moon}
                        color="text-indigo-500"
                        bgColor="bg-indigo-500/10"
                        label={t('sleep_hours')}
                        value={data?.jam_tidur}
                        unit={t('hours').toLowerCase()}
                    />
                    <MetrikCard
                        icon={Dumbbell}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                        label={t('exercise_duration')}
                        value={`${data?.olahraga_jam ?? 0}${t('hour_short')} ${data?.olahraga_menit ?? 0}${t('minute_short')}`}
                        unit=""
                    />
                    <Card className="flex flex-col justify-between gap-3 p-3.5 md:p-5 col-span-2 md:col-span-1 min-h-[100px]">
                        <div className="p-1.5 w-fit rounded-lg bg-amber-500/10">
                            <Clipboard size={18} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{t('notes')}</p>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 italic">
                                {data?.catatan || '-'}
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            <div className="pt-2 md:pt-6">
                <div className="flex justify-between items-center mb-3 md:mb-4 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-[1.5px]">{t('last_7_days')}</h3>
                    <Link href="/dashboard/kesehatan/history" className="text-xs text-[var(--accent-blue)] font-bold hover:underline">
                        {t('see_all')}
                    </Link>
                </div>
                <Card className="p-5 md:p-6">
                    <p className="text-sm text-[var(--text-muted)] italic">
                        {t('trend_analysis_hint')}
                    </p>
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={data ? t('edit') : t('save_data')}
            >
                <KesehatanForm
                    initialData={data}
                    tanggal={tanggal}
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
