'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Transaksi, TransaksiForm } from '@/types';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';

export function useKeuangan(tanggal: string) {
    const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const supabase = createClient();

    const fetchTransaksi = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('transaksi')
                .select('*')
                .eq('user_id', user.id)
                .eq('tanggal', tanggal)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransaksi(data || []);
        } catch (err: any) {
            toastError('Gagal memuat data keuangan.');
        } finally {
            setLoading(false);
        }
    }, [user, tanggal, supabase, toastError]);

    useEffect(() => {
        fetchTransaksi();
    }, [fetchTransaksi]);

    const totalPemasukan = transaksi
        .filter(t => t.jenis === 'pemasukan')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

    const totalPengeluaran = transaksi
        .filter(t => t.jenis === 'pengeluaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

    const saldoBersih = totalPemasukan - totalPengeluaran;

    const tambahTransaksi = async (data: TransaksiForm) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('transaksi').insert([
                { ...data, user_id: user.id }
            ]);
            if (error) throw error;
            success('Transaksi berhasil ditambahkan.');
            fetchTransaksi();
        } catch (err: any) {
            toastError(err.message || 'Gagal menambahkan transaksi.');
        }
    };

    const hapusTransaksi = async (id: string) => {
        try {
            const { error } = await supabase.from('transaksi').delete().eq('id', id);
            if (error) throw error;
            success('Transaksi berhasil dihapus.');
            fetchTransaksi();
        } catch (err: any) {
            toastError('Gagal menghapus transaksi.');
        }
    };

    return {
        transaksi,
        loading,
        totalPemasukan,
        totalPengeluaran,
        saldoBersih,
        tambahTransaksi,
        hapusTransaksi,
        refresh: fetchTransaksi
    };
}
