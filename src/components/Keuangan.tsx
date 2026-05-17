import { useState, useEffect, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, Trash2, PiggyBank, PlusCircle, Activity, CreditCard, PieChart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

type Transaction = {
    id: string;
    jenis: 'pemasukan' | 'pengeluaran';
    jumlah: number;
    kategori: string;
    tanggal: string;
    created_at: string;
};

export default function KeuanganView() {
    const { t, dateFnsLocale } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [jenis, setJenis] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('transaksi')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setTransactions(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTransactions();

        const channel = supabase
            .channel('transaksi_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transaksi' }, () => {
                fetchTransactions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchTransactions]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('Sesi berakhir, silakan login ulang.');

        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        const localDateStr = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];

        const { error } = await supabase.from('transaksi').insert({
            user_id: user.id,
            jenis,
            jumlah: parseFloat(amount),
            kategori: category,
            tanggal: localDateStr
        });

        if (error) {
            alert(t('error') + ': ' + error.message);
        } else {
            setAmount('');
            setCategory('');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('delete_transaction_confirm'))) return;
        const { error } = await supabase
            .from('transaksi')
            .delete()
            .eq('id', id);

        if (error) alert(t('error') + ': ' + error.message);
    };

    const totalPemasukan = transactions.filter(tx => tx.jenis === 'pemasukan').reduce((acc, tx) => acc + tx.jumlah, 0);
    const totalPengeluaran = transactions.filter(tx => tx.jenis === 'pengeluaran').reduce((acc, tx) => acc + tx.jumlah, 0);
    const sisaSaldo = totalPemasukan - totalPengeluaran;

    const totalSemua = totalPemasukan + totalPengeluaran;
    const progressPemasukan = totalSemua === 0 ? 50 : Math.round((totalPemasukan / totalSemua) * 100);
    const progressPengeluaran = totalSemua === 0 ? 50 : Math.round((totalPengeluaran / totalSemua) * 100);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div className="page-header-icon" style={{ padding: '20px', borderRadius: '24px' }}>
                    <Wallet size={36} color="var(--accent-color)" />
                </div>
                <div>
                    <h1 className="page-title">{t('finance')} <span className="gradient-accent">Hub</span></h1>
                    <p className="page-subtitle">Track precise cash flows and dominate your asset compounding architecture.</p>
                </div>
            </header>

            <div className="glass-panel" style={{ borderTop: '2px solid var(--accent-color)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '8px' }}>{t('balance_now')}</h3>
                        <p style={{ fontSize: '42px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>{formatRupiah(sisaSaldo)}</p>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), transparent)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <PiggyBank size={24} color="var(--accent-hover)" />
                    </div>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${progressPemasukan}%`, background: 'var(--success)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    <div style={{ width: `${progressPengeluaran}%`, background: 'var(--danger)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="glass-panel" style={{ borderTop: '2px solid var(--success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ color: 'var(--success)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '8px', opacity: 0.8 }}>{t('income')}</h3>
                            <p style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>{formatRupiah(totalPemasukan)}</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), transparent)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129,0.3)' }}>
                            <TrendingUp size={24} color="var(--success)" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--danger)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ color: 'var(--danger)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '8px', opacity: 0.8 }}>{t('expense')}</h3>
                            <p style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>{formatRupiah(totalPengeluaran)}</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), transparent)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(244, 63, 94,0.3)' }}>
                            <TrendingDown size={24} color="var(--danger)" />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(400px, 1.2fr)', gap: '40px', alignItems: 'start' }}>

                <div className="glass-panel">
                    <h2 style={{ fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CreditCard size={24} color="var(--accent-hover)" /> {t('add_transaction')}
                    </h2>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <div
                                className={`custom-radio ${jenis === 'pemasukan' ? 'active' : ''}`}
                                onClick={() => setJenis('pemasukan')}
                            >
                                <TrendingUp size={18} color={jenis === 'pemasukan' ? 'var(--success)' : 'var(--text-secondary)'} />
                                {t('type_income')}
                            </div>
                            <div
                                className={`custom-radio ${jenis === 'pengeluaran' ? 'active' : ''}`}
                                onClick={() => setJenis('pengeluaran')}
                            >
                                <TrendingDown size={18} color={jenis === 'pengeluaran' ? 'var(--danger)' : 'var(--text-secondary)'} />
                                {t('type_expense')}
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                type="number"
                                placeholder=" "
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="styled-input"
                                style={{ fontSize: '20px', fontFamily: 'Outfit', fontWeight: '600' }}
                                required
                            />
                            <label>{t('amount')} (IDR)</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder=" "
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="styled-input"
                                required
                            />
                            <label>{t('category')} (e.g. {t('cat_food')}, {t('cat_salary')})</label>
                        </div>

                        <button type="submit" className="styled-button" style={{ marginTop: '16px' }}>
                            <PlusCircle size={20} /> {t('save_transaction')}
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                    <div style={{ padding: '0 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Activity size={24} color="var(--accent-hover)" /> {t('transaction_history')}
                        </h2>
                        {transactions.length > 0 && <span style={{ background: 'rgba(139,92,246,0.1)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', color: 'var(--accent-hover)', fontWeight: '600' }}>{transactions.length} Records</span>}
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                            <Activity size={32} color="var(--accent-color)" className="animate-pulse" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                            <PieChart size={64} style={{ opacity: 0.1, margin: '0 auto 24px' }} />
                            <p style={{ fontSize: '18px', fontWeight: '500' }}>{t('no_transactions')}</p>
                            <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>{t('add_now')}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                            {transactions.map((tx, idx) => {
                                let dateStr = tx.created_at;
                                if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
                                    dateStr += 'Z';
                                }
                                const formattedDate = dateStr ? format(new Date(dateStr), "HH:mm - d MMM yyyy", { locale: dateFnsLocale }) : tx.tanggal;

                                return (
                                <div key={tx.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'var(--glass-bg)', padding: '24px 32px', borderRadius: '20px',
                                    border: '1px solid var(--glass-border)',
                                    borderLeft: `4px solid ${tx.jenis === 'pemasukan' ? 'var(--success)' : 'var(--danger)'}`,
                                    transition: 'transform 0.3s, background 0.3s',
                                    animationDelay: `${idx * 0.05}s`
                                }} className="animate-fade-in hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            padding: '14px', borderRadius: '16px',
                                            background: tx.jenis === 'pemasukan' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: tx.jenis === 'pemasukan' ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {tx.jenis === 'pemasukan' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: '700', marginBottom: '6px', fontSize: '18px', letterSpacing: '0.5px' }}>{tx.kategori}</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Outfit' }}>{formattedDate}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                        <span style={{
                                            fontWeight: '800', fontSize: '20px', fontFamily: 'Outfit',
                                            color: tx.jenis === 'pemasukan' ? 'var(--success)' : 'var(--danger)',
                                            letterSpacing: '-0.5px'
                                        }}>
                                            {tx.jenis === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.jumlah)}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(tx.id)}
                                            style={{
                                                background: 'transparent', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--danger)',
                                                cursor: 'pointer', width: '40px', height: '40px',
                                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
                                            title="Delete Entry"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
