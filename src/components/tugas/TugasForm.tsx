'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { TugasForm as TForm } from '@/types';
import { useTugas } from '@/hooks/useTugas';
import { cn, formatTanggalID } from '@/lib/utils';
import { X, Calendar } from 'lucide-react';

interface Props {
    tanggal: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TugasForm({ tanggal, onSuccess, onCancel }: Props) {
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [prioritas, setPrioritas] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addTugas } = useTugas(tanggal);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!judul.trim()) return;

        setIsSubmitting(true);
        await addTugas({
            judul,
            deskripsi,
            prioritas,
            status: 'aktif',
            tanggal_target: tanggal,
            deadline: deadline || undefined,
        });

        setIsSubmitting(false);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="Judul Tugas"
                placeholder="Contoh: Beli susu"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
            />

            <Textarea
                label="Deskripsi (Opsional)"
                placeholder="Tambahkan detail..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
            />

            <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Deadline (Opsional)</label>
                <div className="relative">
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
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
                <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Prioritas</label>
                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]">
                    {(['rendah', 'sedang', 'tinggi'] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPrioritas(p)}
                            className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-md transition-all capitalize",
                                prioritas === p
                                    ? p === 'tinggi' ? "bg-[var(--accent-red)] text-white" :
                                        p === 'sedang' ? "bg-[var(--accent-yellow)] text-[#0a0a0f]" :
                                            "bg-[var(--accent-blue)] text-[#0a0a0f]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel}>Batal</Button>
                <Button type="submit" isLoading={isSubmitting}>Tambah Tugas</Button>
            </div>
        </form>
    );
}
