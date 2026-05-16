'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { TugasForm as TForm } from '@/types';
import { useTugas } from '@/hooks/useTugas';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn, hariIni, nowWIB } from '@/lib/utils';
import { X } from 'lucide-react';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TugasForm({ onSuccess, onCancel }: Props) {
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [prioritas, setPrioritas] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addTugas } = useTugas();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!judul.trim()) return;

        setIsSubmitting(true);
        await addTugas({
            judul,
            deskripsi,
            prioritas,
            status: 'aktif',
            tanggal_target: hariIni(),
            deadline: deadline || undefined,
        });

        setIsSubmitting(false);
        onSuccess();
    };

    const prioritasItems: { key: 'rendah' | 'sedang' | 'tinggi'; labelKey: string }[] = [
        { key: 'rendah', labelKey: 'priority_low' },
        { key: 'sedang', labelKey: 'priority_medium' },
        { key: 'tinggi', labelKey: 'priority_high' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label={t('task_title')}
                placeholder={t('add_new_task')}
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
            />

            <Textarea
                label={t('description_optional')}
                placeholder={t('add_detail')}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
            />

            <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)] ml-1">{t('deadline_optional')}</label>
                <div className="relative">
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={nowWIB().toISOString().split('T')[0]}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none transition-colors [color-scheme:dark]"
                    />
                    {deadline && (
                        <button
                            type="button"
                            onClick={() => setDeadline('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)] ml-1">{t('priority')}</label>
                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]">
                    {prioritasItems.map(({ key, labelKey }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setPrioritas(key)}
                            className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-md transition-all capitalize",
                                prioritas === key
                                    ? key === 'tinggi' ? "bg-[var(--accent-red)] text-white" :
                                        key === 'sedang' ? "bg-[var(--accent-yellow)] text-[#0a0a0f]" :
                                            "bg-[var(--accent-blue)] text-[#0a0a0f]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            {t(labelKey)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel} className="w-full md:w-auto order-2 md:order-1">{t('cancel')}</Button>
                <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto order-1 md:order-2">{t('add_task_btn')}</Button>
            </div>
        </form>
    );
}
