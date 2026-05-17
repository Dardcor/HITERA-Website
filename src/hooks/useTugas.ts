'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tugas, TugasForm } from '@/types';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';
import { hariIni } from '@/lib/utils';

export function useTugas() {
    const [tugas, setTugas] = useState<Tugas[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const supabase = createClient();

    const fetchTugas = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tugas')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTugas(data || []);
        } catch (err: any) {
            toastError('Gagal memuat daftar tugas.');
        } finally {
            setLoading(false);
        }
    }, [user, supabase, toastError]);

    useEffect(() => {
        fetchTugas();
    }, [fetchTugas]);

    const addTugas = async (data: TugasForm) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('tugas').insert([{
                ...data,
                user_id: user.id,
                created_at: new Date().toISOString()
            }]);
            if (error) throw error;
            success('Tugas berhasil ditambahkan.');
            fetchTugas();
        } catch (err: any) {
            toastError('Gagal menambahkan tugas.');
        }
    };

    const toggleSelesai = async (id: string, currentStatus: string) => {
        if (!id || id === 'undefined' || id === 'null') {
            console.error('Safety guard: Prevented toggleSelesai with invalid ID');
            return;
        }
        const newStatus = currentStatus === 'selesai' ? 'aktif' : 'selesai';
        try {
            const { error } = await supabase
                .from('tugas')
                .update({
                    status: newStatus,
                    tanggal_selesai: newStatus === 'selesai' ? new Date().toISOString() : null
                })
                .eq('id', id);
            if (error) throw error;
            fetchTugas();
        } catch (err: any) {
            toastError('Gagal memperbarui status tugas.');
        }
    };

    const deleteTugas = async (id: string) => {
        if (!id || id === 'undefined' || id === 'null') {
            console.error('Safety guard: Prevented deleteTugas with invalid ID');
            return;
        }
        try {
            const { error } = await supabase.from('tugas').delete().eq('id', id);
            if (error) throw error;
            success('Tugas berhasil dihapus.');
            fetchTugas();
        } catch (err: any) {
            toastError('Gagal menghapus tugas.');
        }
    };

    return {
        tugas,
        loading,
        tugasAktif: tugas.filter(t => t.status === 'aktif'),
        tugasSelesai: tugas.filter(t => t.status === 'selesai'),
        addTugas,
        toggleSelesai,
        deleteTugas,
        refresh: fetchTugas
    };
}
