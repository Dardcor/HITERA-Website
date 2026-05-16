'use client';

import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';

const BAHASA_OPTIONS = [
    { value: 'id', label: 'Indonesia 🇮🇩' },
    { value: 'en', label: 'English 🇬🇧' },
    { value: 'ms', label: 'Malaysia 🇲🇾' },
    { value: 'ja', label: 'Japan 🇯🇵' },
    { value: 'zh', label: 'China 🇨🇳' },
];

export default function BahasaPage() {
    const { settings, loading } = useSettings();
    const { error: toastError } = useToast();
    const { t, changeLanguage } = useTranslation();

    const handleSelect = async (value: string) => {
        if (settings.bahasa === value) return;
        
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
                        const isSelected = settings.bahasa === option.value;
                        
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
                                <span className={`text-base ${isSelected ? 'font-bold' : ''}`}>
                                    {option.label}
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
