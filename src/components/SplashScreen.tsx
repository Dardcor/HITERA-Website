"use client";
import { useEffect, useState } from 'react';

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-primary)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            animation: 'splashFadeOut 0.5s ease-in-out 2.5s forwards'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseGlow 2s infinite alternate, trackingIn 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
                padding: '0 20px'
            }}>
                <img src="/logo.png" alt="HITERA" style={{ height: 'clamp(64px, 12vw, 100px)' }} />
            </div>

            <div style={{
                width: '180px', height: '3px', background: 'rgba(139, 92, 246, 0.1)',
                marginTop: '40px', overflow: 'hidden', position: 'relative', borderRadius: '4px'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: '40%',
                    background: 'linear-gradient(90deg, transparent, var(--accent-hover), transparent)',
                    animation: 'slideRight 1s ease-in-out infinite', borderRadius: '4px'
                }}></div>
            </div>
        </div>
    );
}
