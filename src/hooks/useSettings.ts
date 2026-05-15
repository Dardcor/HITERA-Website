import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { createClient } from '@/lib/supabase/client';

export interface UserSettings {
  notifikasi_enabled: boolean;
  bahasa: string;
}

export function useSettings() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [settings, setSettings] = useState<UserSettings>({
    notifikasi_enabled: false,
    bahasa: 'id',
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
        });
      } else {
        
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          notifikasi_enabled: false,
          bahasa: 'id',
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
