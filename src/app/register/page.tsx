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

export default function RegisterPage() {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { success, error: toastError } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toastError('Password tidak cocok.');
        }

        if (password.length < 8) {
            return toastError('Password minimal 8 karakter.');
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nama: nama,
                    },
                },
            });

            if (error) throw error;

            router.push('/loading');
        } catch (err: any) {
            toastError(err.message || 'Gagal registrasi.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="Daftar HITERA" width={160} height={48} className="h-12 w-auto mx-auto mb-2" />
                    <p className="text-[var(--text-secondary)]">Daftar Sekarang</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <Input
                        label="Nama Lengkap"
                        type="text"
                        placeholder="John Doe"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password (min 8 karakter)"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Konfirmasi Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full py-3 mt-4" isLoading={isLoading}>
                        Daftar
                    </Button>
                </form>

                <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-[var(--accent-blue)] font-semibold hover:underline">
                        Masuk
                    </Link>
                </p>
            </Card>
        </div>
    );
}
