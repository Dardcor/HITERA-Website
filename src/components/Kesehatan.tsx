import { useState, useEffect, useCallback } from 'react';
import { HeartPulse, Droplet, Moon, Plus, Minus, Loader2, Save, StickyNote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function KesehatanView() {
    const [water, setWater] = useState(0);
    const [sleep, setSleep] = useState('');
    const [catatan, setCatatan] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const fetchHealthData = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('kesehatan')
            .select('*')
            .eq('user_id', user.id)
            .eq('tanggal', today)
            .single();

        if (data) {
            setWater(data.air_minum || 0);
            setSleep(data.jam_tidur?.toString() || '');
            setCatatan(data.catatan || '');
        }
        setLoading(false);
    }, [today]);

    useEffect(() => {
        fetchHealthData();
    }, [fetchHealthData]);

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('Silakan login ulang.');

        const { error } = await supabase
            .from('kesehatan')
            .upsert({
                user_id: user.id,
                tanggal: today,
                air_minum: water,
                jam_tidur: parseFloat(sleep) || 0,
                catatan: catatan || null,
            }, { onConflict: 'user_id,tanggal' });

        if (error) alert('Gagal sinkronisasi: ' + error.message);
        setSaving(false);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div className="page-header-icon" style={{ padding: '20px', borderRadius: '24px' }}>
                    <HeartPulse size={36} color="var(--success)" />
                </div>
                <div>
                    <h1 className="page-title">Metrik <span style={{ color: 'var(--success)' }}>Kesehatan</span></h1>
                    <p className="page-subtitle">Pantau kondisi fisik dan jaga fondasi biologis Anda.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="styled-button"
                    style={{ width: 'auto', padding: '16px 32px', display: 'flex', gap: '12px', marginLeft: 'auto', background: 'linear-gradient(135deg, var(--success), #059669)' }}
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {saving ? 'Menyimpan...' : 'Simpan Metrik'}
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--info)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Droplet size={24} color="var(--info)" /> Hidrasi
                        </h2>
                        <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--info)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(59,130,246,0.3)' }}>Target: 8 Gelas</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center', margin: '40px 0' }}>
                        <button
                            onClick={() => setWater(Math.max(0, water - 1))}
                            className="icon-btn hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))', padding: '20px', borderRadius: '20px', color: 'var(--info)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', borderTop: '1px solid rgba(59,130,246,0.4)' }}>
                            <Minus size={24} />
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '64px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--info)', lineHeight: '1.1' }}>{water}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '2px', fontWeight: '600' }}>GELAS</span>
                        </div>
                        <button
                            onClick={() => setWater(Math.min(20, water + 1))}
                            className="icon-btn hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))', padding: '20px', borderRadius: '20px', color: 'var(--info)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', borderTop: '1px solid rgba(59,130,246,0.4)' }}>
                            <Plus size={24} />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}><Loader2 size={24} color="var(--info)" className="animate-spin" /></div>
                    ) : (
                        <div style={{ width: '100%', height: '16px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (water / 8) * 100)}%`, background: 'var(--info)', transition: 'width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}></div>
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--accent-hover)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Moon size={24} color="var(--accent-hover)" /> Pemulihan Tidur
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '40px' }}>Catat total jam kondisi istirahat fisik Anda.</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', margin: '40px 0' }}>
                        <input
                            type="number"
                            value={sleep}
                            onChange={(e) => setSleep(e.target.value)}
                            className="styled-input"
                            placeholder="0"
                            style={{ width: '160px', fontSize: '48px', height: '100px', textAlign: 'center', fontWeight: '800', fontFamily: 'Outfit', borderRadius: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <span style={{ fontSize: '24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Jam</span>
                    </div>
                </div>

                <div className="glass-panel" style={{ borderTop: '2px solid var(--warning)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <StickyNote size={24} color="var(--warning)" /> Catatan Harian
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>Catat perasaan dan aktivitas penting hari ini.</p>

                    <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="styled-input"
                        placeholder="Bagaimana perasaanmu hari ini?"
                        rows={4}
                        style={{ width: '100%', resize: 'vertical', fontSize: '15px', fontFamily: 'inherit', borderRadius: '16px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                    />
                </div>
            </div>
        </div>
    );
}
