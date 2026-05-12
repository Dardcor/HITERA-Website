'use client';

import { Transaksi } from '@/types';
import { formatRupiah, cn } from '@/lib/utils';
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

    return (
        <div className="group flex items-center p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] transition-all gap-3">
            {/* Icon circle - 40x40 matching Flutter */}
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                isPemasukan ? "bg-[var(--accent-green-dim)] text-[var(--accent-green)]" : "bg-[var(--accent-red-dim)] text-[var(--accent-red)]"
            )}>
                {getIcon(transaksi.kategori)}
            </div>

            {/* Info - matching Flutter Column layout */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{transaksi.kategori}</h4>
                <p className="text-[10px] text-[var(--text-muted)] tracking-[0.5px] truncate">
                    {transaksi.deskripsi || 'Tidak ada deskripsi'}
                </p>
            </div>

            {/* Amount + time - matching Flutter right Column */}
            <div className="text-right shrink-0">
                <p className={cn(
                    "text-[13px] font-bold flex items-center justify-end gap-0.5",
                    isPemasukan ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                )}>
                    {isPemasukan ? <Plus size={12} /> : <Minus size={12} />}
                    {formatRupiah(transaksi.jumlah)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                    {new Date(transaksi.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {/* Delete button - matching Flutter GestureDetector with delete icon */}
            <button
                onClick={() => onDelete(transaksi.id)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-red)] md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
