import { useState, useEffect, useCallback } from 'react';
import { BookOpen, ListTodo, NotebookPen, Check, X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { nowWIB } from '@/lib/utils';

type Todo = {
    id: string;
    text: string;
    done: boolean;
};

export default function KeseharianView() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingNotes, setSavingNotes] = useState(false);

    const today = nowWIB().toISOString().split('T')[0];

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: todoData } = await supabase
            .from('keseharian_todos')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .order('created_at', { ascending: false });

        if (todoData) {
            setTodos(todoData.map((t: { id: string; text: string; is_done: boolean }) => ({
                id: t.id,
                text: t.text,
                done: t.is_done
            })));
        }

        const { data: journalData } = await supabase
            .from('keseharian_jurnal')
            .select('content')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();

        if (journalData) setNotes(journalData.content);
        setLoading(false);
    }, [today]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('keseharian_todos').insert({
            user_id: user.id,
            text: newTodo,
            date: today
        });

        if (error) alert('Gagal tambah tugas: ' + error.message);
        else {
            setNewTodo('');
            fetchAllData();
        }
    };

    const toggleTodo = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('keseharian_todos')
            .update({ is_done: !currentStatus })
            .eq('id', id);

        if (error) alert('Gagal update: ' + error.message);
        else fetchAllData();
    };

    const deleteTodo = async (id: string) => {
        const { error } = await supabase
            .from('keseharian_todos')
            .delete()
            .eq('id', id);

        if (error) alert('Gagal hapus: ' + error.message);
        else fetchAllData();
    };

    const saveJournal = async (content: string) => {
        setSavingNotes(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('keseharian_jurnal')
            .upsert({
                user_id: user.id,
                date: today,
                content: content
            }, { onConflict: 'user_id, date' });

        if (error) console.error('Gagal simpan jurnal:', error.message);
        setSavingNotes(false);
    };

    useEffect(() => {
        if (loading) return;
        const timer = setTimeout(() => {
            saveJournal(notes);
        }, 1500);
        return () => clearTimeout(timer);
    }, [notes, loading, today]);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px', height: '100%' }}>

            <header className="page-header" style={{ marginBottom: '24px' }}>
                <div className="page-header-icon" style={{ padding: '20px', borderRadius: '24px' }}>
                    <BookOpen size={36} color="var(--info)" />
                </div>
                <div>
                    <h1 className="page-title">Jurnal & <span style={{ color: 'var(--info)' }}>Tugas</span></h1>
                    <p className="page-subtitle">Atur daftar tugas taktis dan catat jurnal harian Anda.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(400px, 1.2fr)', gap: '40px', alignItems: 'stretch' }}>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', maxHeight: '75vh', borderTop: '2px solid var(--info)' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '32px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ListTodo size={24} color="var(--info)" /> Tugas Harian
                    </h2>

                    <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                        <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder=" "
                                className="styled-input"
                                style={{ borderRadius: '16px' }}
                            />
                            <label>Tambahkan tugas baru...</label>
                        </div>
                        <button type="submit" className="styled-button" style={{ width: 'auto', padding: '0 24px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--info), #2563eb)' }}>
                            <Plus size={24} />
                        </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px', flex: 1 }}>
                        {todos.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
                                <Check size={56} style={{ opacity: 0.1, margin: '0 auto 16px' }} />
                                <p style={{ fontSize: '18px', fontWeight: '500' }}>Tidak ada tugas dalam antrean.</p>
                                <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Nikmati waktu luang Anda atau tambahkan tugas.</p>
                            </div>
                        ) : (
                            todos.map((todo, idx) => (
                                <div key={todo.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '24px', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)',
                                    opacity: todo.done ? 0.4 : 1, transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    animationDelay: `${idx * 0.05}s`
                                }} className="animate-fade-in hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', flex: 1 }} onClick={() => toggleTodo(todo.id, todo.done)}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '10px',
                                            border: `2px solid ${todo.done ? 'var(--info)' : 'rgba(255,255,255,0.2)'}`,
                                            background: todo.done ? 'var(--info)' : 'rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                                        }}>
                                            {todo.done && <Check size={20} color="white" strokeWidth={3} />}
                                        </div>
                                        <span style={{
                                            textDecoration: todo.done ? 'line-through' : 'none',
                                            fontSize: '18px', color: todo.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                                            fontWeight: todo.done ? '400' : '500',
                                            transition: 'all 0.3s'
                                        }}>{todo.text}</span>
                                    </div>
                                    <button onClick={() => deleteTodo(todo.id)} className="icon-btn" style={{ padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} title="Hapus Tugas">
                                        <X size={24} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: '2px solid var(--accent-hover)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <NotebookPen size={24} color="var(--accent-hover)" /> Catatan & Jurnal
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                                Kebebasan untuk menuangkan isi pikiran Anda.
                            </p>
                        </div>
                        {savingNotes && (
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '6px 16px', borderRadius: '20px', color: 'var(--accent-hover)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '600' }}>
                                <Loader2 size={14} className="animate-spin" /> Menyimpan...
                            </div>
                        )}
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="styled-input"
                        placeholder="Mulai mengetik pemikiran Anda di sini..."
                        style={{
                            flex: 1, minHeight: '400px', resize: 'none',
                            fontFamily: 'Outfit, inherit', fontSize: '18px', lineHeight: '1.8',
                            padding: '32px', background: 'rgba(0,0,0,0.4)',
                            border: savingNotes ? '1px solid var(--accent-hover)' : '1px solid var(--glass-border)',
                            borderRadius: '24px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)',
                            transition: 'border 0.3s'
                        }}
                    />
                </div>

            </div>
        </div>
    );
}
