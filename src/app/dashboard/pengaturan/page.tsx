'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Settings, Shield, Bell, LogOut, ChevronRight } from 'lucide-react';

export default function PengaturanPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold">Pengaturan</h2>

            <Card className="p-0 overflow-hidden divide-y divide-[var(--border)]">
                <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent-blue)] border border-[var(--border)]">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{user?.user_metadata?.nama || 'User'}</h3>
                        <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
                    </div>
                    <Button variant="ghost" className="ml-auto text-xs">Edit Profil</Button>
                </div>

                <div className="p-2">
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] rounded-xl transition-all group">
                        <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]">
                            <Shield size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-sm font-bold">Keamanan</p>
                            <p className="text-xs text-[var(--text-muted)]">Ganti kata sandi dan amankan akun</p>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] rounded-xl transition-all group">
                        <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]">
                            <Bell size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-sm font-bold">Notifikasi</p>
                            <p className="text-xs text-[var(--text-muted)]">Atur pengingat harian</p>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] rounded-xl transition-all group">
                        <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]">
                            <Settings size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-sm font-bold">Tampilan</p>
                            <p className="text-xs text-[var(--text-muted)]">Tema gelap otomatis (Premium)</p>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </button>
                </div>
            </Card>

            <Card className="p-0 overflow-hidden">
                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-4 p-4 hover:bg-[var(--accent-red-dim)] text-[var(--accent-red)] transition-all group"
                >
                    <div className="p-2 bg-[var(--accent-red-dim)] rounded-lg">
                        <LogOut size={20} />
                    </div>
                    <p className="text-sm font-bold">Keluar dari Aplikasi</p>
                </button>
            </Card>

            <div className="text-center pt-10">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">HITERA Version 2.0.0</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 tracking-tight">&copy; 2026 Dardcor Hitera</p>
            </div>
        </div>
    );
}
