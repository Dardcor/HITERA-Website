"use client";
import { useEffect, useState } from 'react';

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Create keyframes dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes splashFadeOut {
                from { opacity: 1; visibility: visible; }
                to { opacity: 0; visibility: hidden; }
            }
            @keyframes ringSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        return () => {
            clearTimeout(timer);
            document.head.removeChild(style);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-primary, #0a0a0f)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            animation: 'splashFadeOut 0.5s ease-in-out 4.5s forwards'
        }}>
            <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* 4-color spinning ring */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: '50%',
                    background: 'conic-gradient(#10B981 0% 25%, #EF4444 25% 50%, #F59E0B 50% 75%, #3B82F6 75% 100%)',
                    animation: 'ringSpin 1.5s linear infinite'
                }} />
                
                {/* Inner mask to create the ring effect */}
                <div style={{
                    position: 'absolute',
                    top: '6px', left: '6px', right: '6px', bottom: '6px',
                    backgroundColor: 'var(--bg-primary, #0a0a0f)',
                    borderRadius: '50%'
                }} />

                {/* Logo perfectly centered and filling the inner space */}
                <img 
                    src="/logo.png" 
                    alt="HITERA" 
                    style={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }} 
                />
            </div>
        </div>
    );
}
