'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const supabase = createClient();
    const { success, error: toastError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (error) throw error;
            success('Link reset password telah dikirim ke email Anda.');
            setIsSent(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Gagal mengirim email reset password.';
            toastError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="HITERA" width={160} height={48} className="h-12 w-auto mx-auto mb-2" />
                    <p className="text-[var(--text-secondary)]">
                        Masukkan email Anda untuk menerima link reset password.
                    </p>
                </div>

                {isSent ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-full flex items-center justify-center">
                            <Mail size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Email Terkirim</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Cek inbox email <span className="font-bold text-[var(--accent-blue)]">{email}</span> untuk link reset password.
                            </p>
                        </div>
                        <Link href="/login">
                            <Button variant="secondary" className="w-full py-3 flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Kembali ke Login
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Alamat Email"
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Button type="submit" className="w-full py-3 flex items-center justify-center gap-2" isLoading={isLoading}>
                            Kirim Link Reset <ArrowRight size={18} />
                        </Button>
                    </form>
                )}

                {!isSent && (
                    <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
                        <Link
                            href="/login"
                            className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft size={14} /> Kembali ke Login
                        </Link>
                    </p>
                )}
            </Card>
        </div>
    );
}
