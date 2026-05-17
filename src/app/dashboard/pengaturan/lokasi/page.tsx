'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MapPin, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LokasiPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [lokasiEnabled, setLokasiEnabled] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('Belum terdeteksi');

    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        try {
            const { data } = await supabase
                .from('user_settings')
                .select('lokasi_enabled')
                .eq('user_id', user?.id)
                .single();

            if (data) {
                setLokasiEnabled(data.lokasi_enabled || false);
                if (data.lokasi_enabled) {
                    checkLocation();
                }
            }
        } catch (error) {
            console.error('Error loading settings', error);
        }
        setLoading(false);
    };

    const checkLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                },
                (error) => {
                    setCurrentLocation('Gagal mengambil lokasi');
                }
            );
        } else {
            setCurrentLocation('Browser tidak mendukung Geolocation');
        }
    };

    const handleToggle = async (val: boolean) => {
        if (!user) return;
        setLokasiEnabled(val);

        try {
            await supabase
                .from('user_settings')
                .update({ lokasi_enabled: val })
                .eq('user_id', user.id);
            
            if (val) {
                checkLocation();
            } else {
                setCurrentLocation('Belum terdeteksi');
            }
        } catch (error) {
            setLokasiEnabled(!val);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/pengaturan" className="p-2 -ml-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">Lokasi</h2>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
                </div>
            ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <MapPin size={28} className="text-[var(--accent-blue)] mt-1" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-[16px] text-[var(--text-primary)]">Deteksi Lokasi Realtime</h3>
                                <p className="text-[13px] text-[var(--text-muted)] mt-1">
                                    Izinkan aplikasi untuk mendeteksi lokasi Anda saat mencatat transaksi dan aktivitas.
                                </p>
                                {lokasiEnabled && (
                                    <p className="text-[12px] font-medium text-[var(--success)] mt-3">
                                        Lokasi saat ini: {currentLocation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between">
                        <span className="text-[14px] text-[var(--text-primary)]">Aktifkan Lokasi</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={lokasiEnabled}
                                onChange={(e) => handleToggle(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-[var(--bg-secondary)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-blue)]"></div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}
