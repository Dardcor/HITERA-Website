'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoadingPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 border-4 border-transparent border-t-[var(--accent-blue)] border-r-[var(--accent-green)] border-b-[var(--accent-red)] border-l-[var(--accent-yellow)] rounded-full animate-spin"></div>
                <Image src="/logo.png" alt="HITERA" width={64} height={64} className="z-10" />
            </div>
        </div>
    );
}
