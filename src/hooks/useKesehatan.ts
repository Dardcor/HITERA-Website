'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataKesehatan, KesehatanForm } from '@/types';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';

export function useKesehatan(tanggal: string) {
    const [data, setData] = useState<DataKesehatan | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { error: toastError, success } = useToast();
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('kesehatan')
                .select('*')
                .eq('user_id', user.id)
                .eq('tanggal', tanggal)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setData(data || null);
        } catch (err: any) {
            toastError('Gagal memuat data kesehatan.');
        } finally {
            setLoading(false);
        }
    }, [user, tanggal, supabase, toastError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const simpanData = async (formData: KesehatanForm) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('kesehatan').upsert({
                ...formData,
                user_id: user.id,
                tanggal: tanggal,
                created_at: new Date().toISOString()
            }, { onConflict: 'user_id,tanggal' });

            if (error) throw error;
            success('Data kesehatan berhasil disimpan.');
            fetchData();
        } catch (err: any) {
            toastError(err.message || 'Gagal menyimpan data kesehatan.');
        }
    };

    return { data, loading, simpanData, refresh: fetchData };
}
