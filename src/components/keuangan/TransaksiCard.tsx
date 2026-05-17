'use client';

import { useState, useEffect } from 'react';
import { Transaksi } from '@/types';
import { formatRupiah, cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import { Trash2, ShoppingBag, Utensils, Car, Receipt, Heart, Gamepad2, GraduationCap, Briefcase, Plus, Minus } from 'lucide-react';

interface Props {
    transaksi: Transaksi;
    onDelete: (id: string) => void;
}

const getIcon = (kategori: string) => {
    const k = kategori.toLowerCase();
    if (k.includes('makan')) return <Utensils size={18} />;
    if (k.includes('transport')) return <Car size={18} />;
    if (k.includes('belanja')) return <ShoppingBag size={18} />;
    if (k.includes('tagihan')) return <Receipt size={18} />;
    if (k.includes('kesehatan')) return <Heart size={18} />;
    if (k.includes('hiburan')) return <Gamepad2 size={18} />;
    if (k.includes('pendidikan')) return <GraduationCap size={18} />;
    if (k.includes('gaji') || k.includes('pekerjaan')) return <Briefcase size={18} />;
    return <Briefcase size={18} />;
};

export default function TransaksiCard({ transaksi, onDelete }: Props) {
    const isPemasukan = transaksi.jenis === 'pemasukan';
    const { t, localeTag } = useTranslation();
    const [formattedTime, setFormattedTime] = useState<string>('');

    useEffect(() => {
        let dateStr = transaksi.created_at;
        if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
            dateStr += 'Z';
        }
        const d = new Date(dateStr);
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
        const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
        setFormattedTime(`${jam} - ${tgl}`);
    }, [transaksi.created_at]);

    return (
        <div className="group flex items-center p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] transition-all gap-3">
            {}
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                isPemasukan ? "bg-[var(--accent-green-dim)] text-[var(--accent-green)]" : "bg-[var(--accent-red-dim)] text-[var(--accent-red)]"
            )}>
                {getIcon(transaksi.kategori)}
            </div>

            {}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{transaksi.kategori}</h4>
                <p className="text-[10px] text-[var(--text-muted)] tracking-[0.5px] truncate">
                    {transaksi.deskripsi || t('no_desc')}
                </p>
            </div>

            {}
            <div className="text-right shrink-0">
                <p className={cn(
                    "text-[13px] font-bold flex items-center justify-end gap-0.5",
                    isPemasukan ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                )}>
                    {isPemasukan ? <Plus size={12} /> : <Minus size={12} />}
                    {formatRupiah(transaksi.jumlah)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                    {formattedTime}
                </p>
            </div>

            {}
            <button
                onClick={() => onDelete(transaksi.id)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-red)] md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
