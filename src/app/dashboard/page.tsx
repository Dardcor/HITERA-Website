'use client';

import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useKeuangan } from '@/hooks/useKeuangan';
import { useKesehatan } from '@/hooks/useKesehatan';
import { useTugas } from '@/hooks/useTugas';
import { hariIni, formatRupiah, formatTanggalID, nowWIB, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wallet, HeartPulse, CheckSquare, Plus, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const tgl = hariIni();

    const { totalPemasukan, totalPengeluaran, totalSaldo, trendSaldo, loading: loadK } = useKeuangan(tgl);
    const { data: kesehatan, loading: loadKes } = useKesehatan(tgl);
    const { tugas, tugasAktif, tugasSelesai, loading: loadT } = useTugas();

    const getGreeting = () => {
        const hour = nowWIB().getHours();
        if (hour < 11) return t('greeting_morning');
        if (hour < 15) return t('greeting_afternoon');
        if (hour < 18) return t('greeting_evening');
        return t('greeting_night');
    };

    const progressTugas = tugas.length > 0 ? Math.round((tugasSelesai.length / tugas.length) * 100) : 0;

    return (
        <div className="space-y-8 md:space-y-8 animate-in fade-in duration-150">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {}
                    <p className="text-[11px] md:text-sm text-[var(--accent-blue)] font-bold uppercase tracking-[1.5px] md:tracking-widest mb-1">{formatTanggalID(tgl)}</p>
                    {}
                    <h2 className="text-xl md:text-3xl font-bold text-[var(--text-primary)]">
                        {getGreeting()}, {user?.user_metadata?.nama || user?.email?.split('@')[0]}
                    </h2>
                </div>
                {}
                <div className="hidden md:flex gap-2">
                    <Link href="/dashboard/keuangan">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Plus size={18} /> {t('add_transaction')}
                        </Button>
                    </Link>
                </div>
            </div>

            {}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-6">
                {}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-xl">
                            <Wallet size={22} className="md:hidden" />
                            <Wallet size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/keuangan" className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">{t('balance_now')}</p>
                    <h3 className={cn(
                        "text-[22px] md:text-2xl font-extrabold mb-3 md:mb-4",
                        totalSaldo >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                    )}>
                        {loadK ? "..." : formatRupiah(totalSaldo)}
                    </h3>
                    <div className="h-px bg-[var(--border)] mb-3" />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{t('income')}</p>
                            <p className="text-[13px] font-bold text-[var(--accent-green)]">+{loadK ? "..." : formatRupiah(totalPemasukan)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{t('expense')}</p>
                            <p className="text-[13px] font-bold text-[var(--accent-red)]">-{loadK ? "..." : formatRupiah(totalPengeluaran)}</p>
                        </div>
                    </div>
                    {trendSaldo.length > 0 && !loadK && (
                        <div className="h-[80px] mt-4 -mx-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendSaldo} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="saldo" 
                                        stroke="var(--accent-blue)" 
                                        fillOpacity={1} 
                                        fill="url(#colorSaldo)" 
                                        strokeWidth={2}
                                        dot={(props: any) => {
                                            const { cx, cy, index } = props;
                                            if (index === 0 || index === trendSaldo.length - 1) {
                                                return (
                                                    <circle key={index} cx={cx} cy={cy} r={3} fill="var(--accent-blue)" stroke="none" />
                                                );
                                            }
                                            return <></>;
                                        }}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Card>

                {}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-xl">
                            <HeartPulse size={22} className="md:hidden" />
                            <HeartPulse size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/kesehatan" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">{t('health_today')}</p>
                    {loadKes ? (
                        <h3 className="text-[22px] md:text-2xl font-extrabold mb-4 text-[var(--text-primary)]">...</h3>
                    ) : kesehatan ? (
                        <div className="space-y-2">
                            <div className="flex gap-4 text-sm font-bold text-[var(--text-primary)]">
                                <span className="flex items-center gap-1">💧 {kesehatan.air_minum ?? '-'} {t('glasses').toLowerCase()}</span>
                                <span className="flex items-center gap-1">😴 {kesehatan.jam_tidur ?? '-'} {t('hours').toLowerCase()}</span>
                            </div>
                            <div className="flex gap-4 text-sm font-bold text-[var(--text-primary)]">
                                <span className="flex items-center gap-1">🏃 {kesehatan.olahraga_jam ?? 0}{t('hour_short')} {kesehatan.olahraga_menit ?? 0}{t('minute_short')}</span>
                            </div>
                            {kesehatan.catatan && (
                                <p className="text-xs text-[var(--text-secondary)] italic truncate">{kesehatan.catatan}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--text-secondary)] italic">{t('data_not_filled')}</p>
                    )}
                </Card>

                {}
                <Card className="relative overflow-hidden group p-5">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-[var(--accent-red-dim)] text-[var(--accent-red)] rounded-xl">
                            <CheckSquare size={22} className="md:hidden" />
                            <CheckSquare size={24} className="hidden md:block" />
                        </div>
                        <Link href="/dashboard/tugas" className="text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1.5">{t('tasks_today')}</p>
                    <div className="mb-3 md:mb-4">
                        <h3 className="text-[22px] md:text-2xl font-extrabold text-[var(--text-primary)]">
                            {loadT ? "..." : `${tugasSelesai.length}/${tugas.length}`} {t('tasks')}
                        </h3>
                        <p className="text-[9px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{t('filter_done')} {progressTugas}%</p>
                    </div>
                    {}
                    <div className="w-full h-1.5 md:h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent-red)] transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progressTugas}%` }}
                        />
                    </div>
                    <div className="mt-2 md:mt-4">
                        <p className="text-xs text-[var(--text-secondary)]">
                            {tugasAktif.length > 0 ? `${tugasAktif.length} ${t('tasks').toLowerCase()} ${t('filter_active').toLowerCase()}` : `${t('all_tasks_done')} 🙌`}
                        </p>
                    </div>
                </Card>
            </div>

            {}
            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {}
                <Card className="p-0 overflow-hidden border-[var(--border)]">
                    <div className="px-4 md:px-6 py-3.5 md:py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]/30">
                        <h4 className="font-bold text-[13px] md:text-sm">{t('main_tasks')}</h4>
                        <Link href="/dashboard/tugas" className="text-xs text-[var(--accent-blue)] hover:underline">{t('see_all')}</Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]/50">
                        {tugasAktif.length === 0 ? (
                            <div className="p-8 md:p-10 text-center text-[var(--text-muted)] text-sm italic">
                                {t('no_active_tasks')}
                            </div>
                        ) : (
                            tugasAktif.slice(0, 5).map((t) => (
                                <div key={t.id} className="px-4 md:px-6 py-3.5 md:py-4 flex items-center gap-3 hover:bg-[var(--bg-card-hover)] transition-colors">
                                    {}
                                    <div className="w-4 h-4 rounded border border-[var(--border)] shrink-0" />
                                    <span className="text-sm font-medium text-[var(--text-primary)] flex-1 truncate">{t.judul}</span>
                                    <span className={cn(
                                        "ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.5px] shrink-0",
                                        t.prioritas === 'tinggi' ? "bg-[var(--accent-red-dim)] text-[var(--accent-red)]" :
                                            t.prioritas === 'sedang' ? "bg-[var(--accent-yellow-dim)] text-[var(--accent-yellow)]" :
                                                "bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                                    )}>
                                        {t.prioritas === 'tinggi' ? t('priority_high') : t.prioritas === 'sedang' ? t('priority_medium') : t('priority_low')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {}
                <Card className="hidden lg:block p-0 overflow-hidden border-[var(--border)]">
                    <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-secondary)]/30">
                        <h4 className="font-bold text-sm">{t('latest_activity')}</h4>
                        <Link href="/dashboard/keuangan" className="text-xs text-[var(--accent-blue)] hover:underline">{t('see_details')}</Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {totalPemasukan === 0 && totalPengeluaran === 0 ? (
                            <div className="p-10 text-center text-[var(--text-muted)] text-sm italic">
                                {t('no_activity_today')}
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[var(--text-muted)] mb-1">{t('cashflow_comparison')}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                                                <span className="text-xs font-bold text-[var(--accent-green)]">{formatRupiah(totalPemasukan)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
                                                <span className="text-xs font-bold text-[var(--accent-red)]">{formatRupiah(totalPengeluaran)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] uppercase font-bold">
                                        <span>{t('distribution')}</span>
                                        <span>{Math.round((totalPengeluaran / (totalPemasukan || 1)) * 100)}% {t('ratio')}</span>
                                    </div>
                                    <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-[var(--accent-green)]"
                                            style={{ width: `${(totalPemasukan / (totalPemasukan + totalPengeluaran || 1)) * 100}%` }}
                                        />
                                        <div
                                            className="h-full bg-[var(--accent-red)]"
                                            style={{ width: `${(totalPengeluaran / (totalPemasukan + totalPengeluaran || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
}
