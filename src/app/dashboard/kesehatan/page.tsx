'use client';

import { useState } from 'react';
import { useKesehatan } from '@/hooks/useKesehatan';
import { hariIni, tambahHari, formatTanggalID, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ChevronLeft, ChevronRight, Edit3, HeartPulse, Scale, Droplet, Moon, Footprints, Activity, Clipboard } from 'lucide-react';
import KesehatanForm from '@/components/kesehatan/KesehatanForm';
import Link from 'next/link';

export default function KesehatanPage() {
    const [tanggal, setTanggal] = useState(hariIni());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, loading } = useKesehatan(tanggal);

    const prevDay = () => setTanggal(tambahHari(tanggal, -1));
    const nextDay = () => setTanggal(tambahHari(tanggal, 1));

    const MetrikCard = ({ icon: Icon, color, label, value, unit }: any) => (
        <Card className="flex flex-col gap-3">
            <div className={cn("p-2 w-fit rounded-lg", color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold flex items-baseline gap-1">
                    {value || '-'} <span className="text-[10px] text-[var(--text-muted)] font-medium lowercase">{unit}</span>
                </p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Kesehatan Harian</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <button onClick={prevDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold text-[var(--accent-blue)]">
                            {formatTanggalID(tanggal)}
                        </span>
                        <button onClick={nextDay} className="p-1 hover:bg-[var(--bg-card-hover)] rounded border border-[var(--border)]">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Edit3 size={18} /> {data ? 'Edit Data' : 'Isi Data Hari Ini'}
                </Button>
            </div>

            {!loading && !data ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent-blue)] mb-6 animate-pulse">
                        <HeartPulse size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Data Belum Diisi</h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-8">
                        Catat perkembangan kesehatan Anda hari ini untuk melihat tren jangka panjang.
                    </p>
                    <Button onClick={() => setIsModalOpen(true)} className="px-8">
                        📋 Isi Data Kesehatan
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MetrikCard
                        icon={Scale}
                        color="bg-blue-500/10 text-blue-500"
                        label="Berat Badan"
                        value={data?.berat_badan}
                        unit="kg"
                    />
                    <MetrikCard
                        icon={Droplet}
                        color="bg-cyan-500/10 text-cyan-500"
                        label="Air Minum"
                        value={data?.air_minum}
                        unit="gelas"
                    />
                    <MetrikCard
                        icon={Moon}
                        color="bg-indigo-500/10 text-indigo-500"
                        label="Jam Tidur"
                        value={data?.jam_tidur}
                        unit="jam"
                    />
                    <MetrikCard
                        icon={Footprints}
                        color="bg-emerald-500/10 text-emerald-500"
                        label="Langkah"
                        value={data?.langkah_kaki?.toLocaleString('id-ID')}
                        unit="langkah"
                    />
                    <MetrikCard
                        icon={Activity}
                        color="bg-rose-500/10 text-rose-500"
                        label="T. Darah"
                        value={data?.tekanan_darah}
                        unit="mmHg"
                    />
                    <Card className="flex flex-col gap-3">
                        <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-500">
                            <Clipboard size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Catatan</p>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 italic">
                                {data?.catatan || '-'}
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            <div className="pt-6">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Analisis Singkat</h3>
                    <Link href="/dashboard/kesehatan/history" className="text-xs text-[var(--accent-blue)] font-bold hover:underline">
                        View History
                    </Link>
                </div>
                <Card className="p-6">
                    <p className="text-sm text-[var(--text-muted)] italic">
                        Fitur analisis tren 7 hari akan muncul di sini setelah Anda mengisi data minimal selama 3 hari berturut-turut.
                    </p>
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={data ? "Edit Data Kesehatan" : "Isi Data Kesehatan"}
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
