'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { User, Lock, Save, Loader2, Shield, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function ProfilPage() {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const { t } = useTranslation();
    const supabase = createClient();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoadingProfile(true);
        try {
            const { data } = await supabase
                .from('profiles')
                .select('username, full_name')
                .eq('id', user.id)
                .single();

            if (data) {
                setUsername(data.username || '');
                setFullName(data.full_name || '');
            }
        } catch (_) { }
        setLoadingProfile(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSavingProfile(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            success(t('profile_synced'));
        } catch (err: any) {
            toastError(t('profile_sync_failed'));
        }
        setSavingProfile(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toastError(t('password_confirm_mismatch'));
        }
        if (newPassword.length < 8) {
            return toastError(t('password_min_8'));
        }
        setSavingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            success(t('password_applied'));
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            toastError(t('password_apply_failed'));
        }
        setSavingPassword(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">{t('profile')}</h2>
            </div>

            <Card className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent-blue)] border border-[var(--border)] shrink-0">
                    <User size={28} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate">{user?.user_metadata?.nama || 'User'}</h3>
                    <p className="text-[13px] text-[var(--text-muted)] truncate">{user?.email}</p>
                </div>
            </Card>

            <Card className="p-0 overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
                    <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
                        <User size={20} className="text-[var(--text-primary)]" />
                    </div>
                    <h4 className="font-bold text-sm md:text-base">{t('identity_config')}</h4>
                </div>
                {loadingProfile ? (
                    <div className="flex justify-center py-10">
                        <Loader2 size={24} className="animate-spin text-[var(--accent-blue)]" />
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="p-4 md:p-6 space-y-4">
                        <Input
                            label={t('unique_alias')}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                        />
                        <Input
                            label={t('full_name')}
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={t('full_name')}
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full py-3 mt-2"
                            isLoading={savingProfile}
                        >
                            <Save size={18} className="mr-2" /> {t('sync_profile_btn')}
                        </Button>
                    </form>
                )}
            </Card>

            <Card className="p-0 overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
                    <div className="p-2 bg-[var(--accent-red-dim)] rounded-lg">
                        <Lock size={20} className="text-[var(--accent-red)]" />
                    </div>
                    <h4 className="font-bold text-sm md:text-base">{t('password_update')}</h4>
                </div>
                <form onSubmit={handleChangePassword} className="p-4 md:p-6 space-y-4">
                    <Input
                        label={t('new_password')}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label={t('confirm_new_password')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    <Button
                        type="submit"
                        variant="danger"
                        className="w-full py-3 mt-2"
                        isLoading={savingPassword}
                    >
                        <Shield size={18} className="mr-2" /> {t('apply_new_password')}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
