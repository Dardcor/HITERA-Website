'use client';

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function KontrolDataPage() {
    const { deleteAllData } = useSettings();
    const { success, error: toastError } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            await deleteAllData();
            success('Semua data berhasil dihapus.');
            setShowConfirm(false);
        } catch (err) {
            toastError('Gagal menghapus data.');
        }
        setIsDeleting(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">Kontrol Data</h2>
            </div>

            <div className="border border-[var(--accent-red-dim)] rounded-xl bg-[var(--bg-card)] p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[var(--accent-red-dim)] rounded-lg text-[var(--accent-red)]">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--accent-red)]">Zona Berbahaya</h3>
                </div>
                
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    Tindakan ini akan menghapus semua data Anda secara permanen dari server kami, 
                    termasuk data transaksi, kesehatan, tugas, dan keseharian. Profil dan pengaturan tidak akan dihapus.
                </p>

                <Button 
                    variant="danger" 
                    className="w-full font-bold"
                    onClick={() => setShowConfirm(true)}
                >
                    Hapus Semua Data
                </Button>
            </div>

            <Modal 
                isOpen={showConfirm} 
                onClose={() => setShowConfirm(false)}
                title="Hapus Semua Data"
            >
                <div className="p-6">
                    <p className="text-[var(--text-secondary)] mb-6">
                        Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowConfirm(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={handleDeleteAll}
                            isLoading={isDeleting}
                        >
                            Hapus Semua
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
