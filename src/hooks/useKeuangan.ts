'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Transaksi, TransaksiForm } from '@/types';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';

export function useKeuangan(tanggal: string) {
    const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);
    const [loading, setLoading] = useState(true);
    const [trendSaldo, setTrendSaldo] = useState<{tanggal: string, saldo: number}[]>([]);
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const supabase = createClient();

    const fetchStats = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch total saldo (all time)
            const { data: allData, error: totalError } = await supabase
                .from('transaksi')
                .select('jenis, jumlah, tanggal')
                .eq('user_id', user.id);

            if (totalError) throw totalError;

            let inTotal = 0;
            let outTotal = 0;
            const dailyChange: Record<string, number> = {};

            (allData || []).forEach(t => {
                const amt = Number(t.jumlah);
                const date = t.tanggal as string;
                if (t.jenis === 'pemasukan') {
                    inTotal += amt;
                    dailyChange[date] = (dailyChange[date] || 0) + amt;
                } else {
                    outTotal += amt;
                    dailyChange[date] = (dailyChange[date] || 0) - amt;
                }
            });
            setTotalPemasukan(inTotal);
            setTotalPengeluaran(outTotal);
            const currentTotalBalance = inTotal - outTotal;
            setTotalSaldo(currentTotalBalance);

            // Calculate last 7 days trend
            const trend = [];
            const todayDate = new Date();
            let runningBalance = currentTotalBalance;

            for (let i = 0; i < 7; i++) {
                const d = new Date(todayDate);
                d.setDate(d.getDate() - i);
                // Format YYYY-MM-DD
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                trend.unshift({
                    tanggal: dateStr,
                    saldo: runningBalance,
                });

                const changeData = dailyChange[dateStr] || 0;
                runningBalance -= changeData;
            }
            setTrendSaldo(trend);

            // Fetch all transactions
            const { data, error } = await supabase
                .from('transaksi')
                .select('*')
                .eq('user_id', user.id)
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
        fetchStats();
    }, [fetchStats]);

    // Variables removed in favor of cumulative states

    const tambahTransaksi = async (data: TransaksiForm) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('transaksi').insert([
                { ...data, user_id: user.id }
            ]);
            if (error) throw error;
            success('Transaksi berhasil ditambahkan.');
            fetchStats();
        } catch (err: any) {
            toastError(err.message || 'Gagal menambahkan transaksi.');
        }
    };

    const hapusTransaksi = async (id: string) => {
        try {
            const { error } = await supabase.from('transaksi').delete().eq('id', id);
            if (error) throw error;
            success('Transaksi berhasil dihapus.');
            fetchStats();
        } catch (err: any) {
            toastError('Gagal menghapus transaksi.');
        }
    };

    return {
        transaksi,
        loading,
        totalPemasukan,
        totalPengeluaran,
        saldoBersih: totalPemasukan - totalPengeluaran,
        totalSaldo,
        trendSaldo,
        tambahTransaksi,
        hapusTransaksi,
        refresh: fetchStats
    };
}
