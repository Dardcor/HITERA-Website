'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { TransaksiForm as TForm } from '@/types';
import { useKeuangan } from '@/hooks/useKeuangan';
import { hariIni, cn } from '@/lib/utils';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

const KATEGORI_PEMASUKAN = ['Gaji', 'Freelance', 'Investasi', 'Hadiah', 'Lainnya'];
const KATEGORI_PENGELUARAN = ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Kesehatan', 'Hiburan', 'Pendidikan', 'Lainnya'];

export default function TransaksiForm({ onSuccess, onCancel }: Props) {
    const [jenis, setJenis] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
    const [jumlah, setJumlah] = useState('');
    const [kategori, setKategori] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tanggal, setTanggal] = useState(hariIni());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { tambahTransaksi } = useKeuangan(tanggal);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data: TForm = {
            jenis,
            jumlah: Number(jumlah),
            kategori: kategori || (jenis === 'pemasukan' ? KATEGORI_PEMASUKAN[0] : KATEGORI_PENGELUARAN[0]),
            deskripsi,
            tanggal,
        };

        await tambahTransaksi(data);
        setIsSubmitting(false);
        onSuccess();
    };

    const kategoriList = jenis === 'pemasukan' ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

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
                    Pemasukan
                </button>
                <button
                    type="button"
                    onClick={() => setJenis('pengeluaran')}
                    className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                        jenis === 'pengeluaran' ? "bg-[var(--accent-red)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    Pengeluaran
                </button>
            </div>

            <Input
                label="Jumlah (Rp)"
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="0"
                required
            />

            <Select
                label="Kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
            >
                {kategoriList.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                ))}
            </Select>

            <Input
                label="Tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
            />

            <Textarea
                label="Deskripsi (Opsional)"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Contoh: Makan siang di kantor"
            />

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={onCancel} className="w-full md:w-auto order-2 md:order-1">Batal</Button>
                <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto order-1 md:order-2">Simpan Transaksi</Button>
            </div>
        </form>
    );
}
