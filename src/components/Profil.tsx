"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, Lock, Save, Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfilView() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', user.id)
            .single();

        if (data) {
            setUsername(data.username || '');
            setFullName(data.full_name || '');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                username,
                full_name: fullName,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            setMessage({ type: 'error', text: 'Gagal memperbarui profil: ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Profil Berhasil Disinkronisasi.' });
        }
        setSaving(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak sesuai.' });
        }

        setSaving(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setMessage({ type: 'error', text: 'Gagal memperbarui kata sandi: ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Kata sandi berhasil diterapkan.' });
            setNewPassword('');
            setConfirmPassword('');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <Loader2 size={40} color="var(--accent-color)" className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div className="page-header-icon" style={{ padding: '20px', borderRadius: '24px' }}>
                    <UserCircle size={36} color="var(--text-primary)" />
                </div>
                <div>
                    <h1 className="page-title">Matriks <span style={{ color: 'var(--text-primary)' }}>Identitas</span></h1>
                    <p className="page-subtitle">Atur visibilitas publik dan perkuat protokol akun Anda.</p>
                </div>
            </header>

            {message.text && (
                <div className="animate-fade-in-delay-1" style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    fontWeight: '600',
                    fontSize: '15px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: message.type === 'success' ? '0 0 40px rgba(16, 185, 129, 0.1)' : '0 0 40px rgba(244, 63, 94, 0.1)'
                }}>
                    <ShieldCheck size={20} /> {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px' }}>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--text-primary)' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                        <User size={24} color="var(--text-primary)" /> Konfigurasi Identitas
                    </h2>
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="input-group">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="styled-input"
                                placeholder=" "
                            />
                            <label>Alias Unik (@)</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="styled-input"
                                placeholder=" "
                            />
                            <label>Nama Lengkap Asli</label>
                        </div>

                        <button type="submit" disabled={saving} className="styled-button" style={{ marginTop: '16px', background: 'linear-gradient(135deg, #3f3f46, #18181b)' }}>
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Sinkronisasi Profil
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--danger)' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                        <Lock size={24} color="var(--danger)" /> Pembaruan Sandi
                    </h2>
                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="input-group">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="styled-input"
                                placeholder=" "
                                required
                            />
                            <label>Kata Sandi Baru</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="styled-input"
                                placeholder=" "
                                required
                            />
                            <label>Konfirmasi Kata Sandi Baru</label>
                        </div>

                        <button type="submit" disabled={saving} className="styled-button" style={{ marginTop: '16px', background: 'linear-gradient(135deg, var(--danger), #be123c)' }}>
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                            Terapkan Sandi Baru
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
