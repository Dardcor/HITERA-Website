'use client';

import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';

const BAHASA_OPTIONS = [
    { value: 'id', label: 'Indonesia', flag: 'https://flagcdn.com/id.svg' },
    { value: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { value: 'ms', label: 'Malaysia', flag: 'https://flagcdn.com/my.svg' },
    { value: 'ja', label: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
    { value: 'zh', label: 'China', flag: 'https://flagcdn.com/cn.svg' },
];

export default function BahasaPage() {
    const { settings, loading } = useSettings();
    const { error: toastError } = useToast();
    const { t, changeLanguage, locale } = useTranslation();

    const handleSelect = async (value: string) => {
        if (locale === value) return;
        
        try {
            await changeLanguage(value);
        } catch (err) {
            toastError(t('language_update_failed'));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-150 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pengaturan" className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">{t('language')}</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-[var(--accent-blue)]" />
                </div>
            ) : (
                <div className="space-y-3">
                    {BAHASA_OPTIONS.map((option) => {
                        const isSelected = locale === option.value;
                        
                        return (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isSelected 
                                    ? 'bg-[var(--bg-card)] border-[var(--accent-blue)] border-2' 
                                    : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent-blue)]'
                                }`}
                            >
                                <span className={`text-base flex items-center gap-3 ${isSelected ? 'font-bold' : ''}`}>
                                    <div className="w-8 h-6 relative rounded-sm overflow-hidden border border-[var(--border)]">
                                        <img 
                                            src={option.flag} 
                                            alt={`Flag of ${option.label}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span>{option.label}</span>
                                </span>
                                {isSelected && (
                                    <Check className="text-[var(--accent-blue)]" size={20} />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
