import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

export interface UserSettings {
  notifikasi_enabled: boolean;
  bahasa: string;
  keuangan_notif_enabled?: boolean;
  kesehatan_notif_enabled?: boolean;
  tugas_notif_enabled?: boolean;
  keuangan_notif_time?: string;
  kesehatan_notif_time?: string;
  tugas_notif_time?: string;
}

export function useSettings() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [settings, setSettings] = useState<UserSettings>({
    notifikasi_enabled: false,
    bahasa: 'id',
    keuangan_notif_enabled: false,
    kesehatan_notif_enabled: false,
    tugas_notif_enabled: false,
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setSettings({
          notifikasi_enabled: data.notifikasi_enabled ?? false,
          bahasa: data.bahasa ?? 'id',
          keuangan_notif_enabled: data.keuangan_notif_enabled ?? false,
          kesehatan_notif_enabled: data.kesehatan_notif_enabled ?? false,
          tugas_notif_enabled: data.tugas_notif_enabled ?? false,
          keuangan_notif_time: data.keuangan_notif_time,
          kesehatan_notif_time: data.kesehatan_notif_time,
          tugas_notif_time: data.tugas_notif_time,
        });
      } else {
        
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          notifikasi_enabled: false,
          bahasa: 'id',
          keuangan_notif_enabled: false,
          kesehatan_notif_enabled: false,
          tugas_notif_enabled: false,
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    const oldSettings = { ...settings };
    const newSettings = { ...settings, ...updates };
    
    
    setSettings(newSettings);
    
    try {
      const { error } = await supabase.from('user_settings').upsert({
        user_id: user.id,
        ...newSettings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update settings:', err);
      
      setSettings(oldSettings);
      throw err;
    }
  };

  const deleteAllData = async () => {
    if (!user) return;
    
    try {
      
      await Promise.all([
        supabase.from('transaksi').delete().eq('user_id', user.id),
        supabase.from('kesehatan').delete().eq('user_id', user.id),
        supabase.from('tugas').delete().eq('user_id', user.id),
        supabase.from('keseharian_todos').delete().eq('user_id', user.id),
      ]);
    } catch (err) {
      console.error('Failed to delete user data:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    deleteAllData,
    refreshSettings: loadSettings
  };
}
