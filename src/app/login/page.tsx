'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { success, error: toastError } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            success('Login berhasil!');
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            toastError(err.message || 'Gagal login. Silakan cek email & password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="HITERA" width={160} height={48} className="h-12 w-auto mx-auto mb-2" />
                    <p className="text-[var(--text-secondary)]">Masuk ke akun Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
                        >
                            Lupa password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full py-3" isLoading={isLoading}>
                        Masuk
                    </Button>
                </form>

                <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-[var(--accent-blue)] font-semibold hover:underline">
                        Daftar Sekarang
                    </Link>
                </p>
            </Card>
        </div>
    );
}
