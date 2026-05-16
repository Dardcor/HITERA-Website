'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { TransaksiForm as TForm } from '@/types';
import { useKeuangan } from '@/hooks/useKeuangan';
import { hariIni, cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TransaksiForm({ onSuccess, onCancel }: Props) {
    const [jenis, setJenis] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
    const [jumlah, setJumlah] = useState('');
    const [kategori, setKategori] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tanggal, setTanggal] = useState(hariIni());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { tambahTransaksi } = useKeuangan(tanggal);
    const { t } = useTranslation();

    // Use translation keys for categories
    const KATEGORI_PEMASUKAN_KEYS = ['cat_salary', 'cat_freelance', 'cat_investment', 'cat_gift', 'cat_other'];
    const KATEGORI_PENGELUARAN_KEYS = ['cat_food', 'cat_transport', 'cat_shopping', 'cat_bills', 'cat_health', 'cat_entertainment', 'cat_education', 'cat_other'];

    // DB values remain in Indonesian for consistency with existing data
    const KATEGORI_PEMASUKAN_VALUES = ['Gaji', 'Freelance', 'Investasi', 'Hadiah', 'Lainnya'];
    const KATEGORI_PENGELUARAN_VALUES = ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Kesehatan', 'Hiburan', 'Pendidikan', 'Lainnya'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const kategoriValues = jenis === 'pemasukan' ? KATEGORI_PEMASUKAN_VALUES : KATEGORI_PENGELUARAN_VALUES;
        const data: TForm = {
            jenis,
            jumlah: Number(jumlah),
            kategori: kategori || (jenis === 'pemasukan' ? KATEGORI_PEMASUKAN_VALUES[0] : KATEGORI_PENGELUARAN_VALUES[0]),
            deskripsi,
            tanggal,
        };

        await tambahTransaksi(data);
        setIsSubmitting(false);
        onSuccess();
    };

    const kategoriKeys = jenis === 'pemasukan' ? KATEGORI_PEMASUKAN_KEYS : KATEGORI_PENGELUARAN_KEYS;
    const kategoriValues = jenis === 'pemasukan' ? KATEGORI_PEMASUKAN_VALUES : KATEGORI_PENGELUARAN_VALUES;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => setJenis('pemasukan')}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                        jenis === 'pemasukan' ? "bg-[var(--accent-green)] text-[#0a0a0f]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    {t('type_income')}
                </button>
                <button
                    type="button"
                    onClick={() => setJenis('pengeluaran')}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                        jenis === 'pengeluaran' ? "bg-[var(--accent-red)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    {t('type_expense')}
                </button>
            </div>

            <Input
                label={`${t('amount')} (Rp)`}
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="0"
                required
            />

            <Select
                label={t('category')}
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
            >
                {kategoriKeys.map((key, i) => (
                    <option key={kategoriValues[i]} value={kategoriValues[i]}>{t(key)}</option>
                ))}
            </Select>

            <Input
                label={t('date')}
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
            />

            <Textarea
                label={t('description_optional')}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder={t('ex_hint')}
            />

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel} className="w-full md:w-auto order-2 md:order-1">{t('cancel')}</Button>
                <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto order-1 md:order-2">{t('save_transaction')}</Button>
            </div>
        </form>
    );
}
