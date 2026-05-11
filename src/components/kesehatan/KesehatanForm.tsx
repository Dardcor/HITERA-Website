'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { KesehatanForm as KForm } from '@/types';
import { useKesehatan } from '@/hooks/useKesehatan';
import { Minus, Plus } from 'lucide-react';

interface Props {
    initialData?: any;
    tanggal: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function KesehatanForm({ initialData, tanggal, onSuccess, onCancel }: Props) {
    const [beratBadan, setBeratBadan] = useState(initialData?.berat_badan || '');
    const [airMinum, setAirMinum] = useState(initialData?.air_minum || 0);
    const [jamTidur, setJamTidur] = useState(initialData?.jam_tidur || '');
    const [langkahKaki, setLangkahKaki] = useState(initialData?.langkah_kaki || '');
    const [tekananDarah, setTekananDarah] = useState(initialData?.tekanan_darah || '');
    const [catatan, setCatatan] = useState(initialData?.catatan || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { simpanData } = useKesehatan(tanggal);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data: KForm = {
            tanggal,
            berat_badan: Number(beratBadan),
            air_minum: Number(airMinum),
            jam_tidur: Number(jamTidur),
            langkah_kaki: Number(langkahKaki),
            tekanan_darah: tekananDarah,
            catatan,
        };

        await simpanData(data);
        setIsSubmitting(false);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Berat Badan (kg)"
                    type="number"
                    step="0.1"
                    value={beratBadan}
                    onChange={(e) => setBeratBadan(e.target.value)}
                    placeholder="70.0"
                />
                <Input
                    label="Jam Tidur (jam)"
                    type="number"
                    step="0.5"
                    value={jamTidur}
                    onChange={(e) => setJamTidur(e.target.value)}
                    placeholder="7.5"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Air Minum (Gelas 250ml)</label>
                <div className="flex items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
                    <Button
                        type="button"
                        variant="ghost"
                        className="p-2 h-auto"
                        onClick={() => setAirMinum(Math.max(0, airMinum - 1))}
                    >
                        <Minus size={18} />
                    </Button>
                    <div className="flex-1 text-center font-bold text-lg">{airMinum} <span className="text-xs text-[var(--text-muted)]">Gelas</span></div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="p-2 h-auto"
                        onClick={() => setAirMinum(airMinum + 1)}
                    >
                        <Plus size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Langkah Kaki"
                    type="number"
                    value={langkahKaki}
                    onChange={(e) => setLangkahKaki(e.target.value)}
                    placeholder="8000"
                />
                <Input
                    label="Tekanan Darah"
                    type="text"
                    value={tekananDarah}
                    onChange={(e) => setTekananDarah(e.target.value)}
                    placeholder="120/80"
                />
            </div>

            <Textarea
                label="Catatan Hari Ini"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Bagaimana perasaanmu hari ini?"
            />

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel}>Batal</Button>
                <Button type="submit" isLoading={isSubmitting}>Simpan Data</Button>
            </div>
        </form>
    );
}
