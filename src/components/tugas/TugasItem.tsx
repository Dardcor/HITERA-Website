'use client';

import { Tugas } from '@/types';
import { cn, formatTanggalSingkat } from '@/lib/utils';
import { Check, Trash2, Clock } from 'lucide-react';

interface Props {
    tugas: Tugas;
    onToggle: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

export default function TugasItem({ tugas, onToggle, onDelete }: Props) {
    const isSelesai = tugas.status === 'selesai';

    const prioritasColor: Record<string, string> = {
        tinggi: "bg-[var(--accent-red)]",
        sedang: "bg-[var(--accent-yellow)]",
        rendah: "bg-[var(--accent-blue)]",
    };

    const isOverdue = tugas.deadline && tugas.status !== 'selesai' && new Date(tugas.deadline) < new Date();

    return (
        <div className={cn(
            "group p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl transition-all",
            isSelesai ? "opacity-60" : "hover:border-[var(--border-focus)]"
        )}>
            {/* Main row - matches Flutter Row with checkbox, title, priority dot, delete */}
            <div className="flex items-center gap-3.5">
                {/* Checkbox - 24x24 rounded-md matching Flutter */}
                <button
                    onClick={() => onToggle(tugas.id, tugas.status)}
                    className={cn(
                        "w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0",
                        isSelesai
                            ? "bg-[var(--accent-green)] border-[var(--accent-green)] text-[#0a0a0f]"
                            : "border-[var(--border)] hover:border-[var(--accent-blue)] text-transparent"
                    )}
                >
                    <Check size={14} strokeWidth={3} />
                </button>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                    <h4 className={cn(
                        "text-sm font-bold truncate",
                        isSelesai && "line-through text-[var(--text-muted)] decoration-[var(--text-muted)]"
                    )}>
                        {tugas.judul}
                    </h4>
                    {tugas.deskripsi && (
                        <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 truncate">
                            {tugas.deskripsi}
                        </p>
                    )}
                </div>

                {/* Priority dot - 8x8 circle matching Flutter */}
                <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    prioritasColor[tugas.prioritas]
                )} title={`Prioritas: ${tugas.prioritas}`} />

                {/* Delete button - always visible on mobile */}
                <button
                    onClick={() => onDelete(tugas.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-red)] md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Deadline row - below main row, matching Flutter conditionals */}
            {tugas.deadline && (
                <div className="flex items-center gap-1.5 mt-2 ml-10">
                    <Clock size={11} className={isOverdue ? "text-[var(--accent-red)]" : "text-[var(--text-muted)]"} />
                    <span className={cn(
                        "text-[10px]",
                        isOverdue ? "text-[var(--accent-red)] font-bold" : "text-[var(--text-muted)]"
                    )}>
                        Deadline: {formatTanggalSingkat(tugas.deadline)}
                    </span>
                </div>
            )}
        </div>
    );
}
