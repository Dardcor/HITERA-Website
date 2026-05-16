import Link from 'next/link';
import Image from 'next/image';
import { Wallet, HeartPulse, CheckSquare, Shield, Zap, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] transition-all">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="HITERA Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl md:text-2xl font-bold tracking-widest text-[var(--text-primary)]">HITERA</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-6 pt-32 md:pt-40 pb-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 tracking-tight leading-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Atur Hidup Jadi <span className="text-[var(--accent-blue)]">Lebih Mudah</span> & Presisi
        </h1>
        <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Aplikasi personal life-management untuk mengontrol keuangan, memantau kesehatan, dan mengelola tugas harian Anda dalam satu tempat yang futuristik.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/register">
            <Button className="px-10 py-4 text-base rounded-xl flex items-center gap-2">
              Buka Akun Gratis <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="px-10 py-4 text-base rounded-xl">
              Masuk ke Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 border-t border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-10 hover:border-[var(--accent-blue)] transition-all">
            <div className="w-14 h-14 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-2xl flex items-center justify-center mb-6">
              <Wallet size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Keuangan</h3>
            <p className="text-[var(--text-secondary)]">Pencatatan pemasukan dan pengeluaran harian dengan ringkasan saldo yang akurat.</p>
          </Card>

          <Card className="p-10 hover:border-[var(--accent-green)] transition-all">
            <div className="w-14 h-14 bg-[var(--accent-green-dim)] text-[var(--accent-green)] rounded-2xl flex items-center justify-center mb-6">
              <HeartPulse size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Kesehatan</h3>
            <p className="text-[var(--text-secondary)]">Pantau berat badan, asupan air, jam tidur, dan metrik kesehatan lainnya setiap hari.</p>
          </Card>

          <Card className="p-10 hover:border-[var(--accent-red)] transition-all">
            <div className="w-14 h-14 bg-[var(--accent-red-dim)] text-[var(--accent-red)] rounded-2xl flex items-center justify-center mb-6">
              <CheckSquare size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Tugas</h3>
            <p className="text-[var(--text-secondary)]">Kelola daftar kegiatan dengan prioritas dan pantau progress penyelesaiannya.</p>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 bg-[var(--bg-secondary)] rounded-[var(--radius)] mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Kenapa HITERA?</h2>
          <p className="text-[var(--text-secondary)]">Didesain untuk efisiensi dan fokus maksimal.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <Shield className="text-[var(--accent-blue)] mb-4" size={32} />
            <h4 className="font-bold mb-2">Privasi Terjamin</h4>
            <p className="text-sm text-[var(--text-muted)]">Data Anda tersimpan aman dengan enkripsi tingkat lanjut di Supabase.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="text-[var(--accent-blue)] mb-4" size={32} />
            <h4 className="font-bold mb-2">Cepat & Ringan</h4>
            <p className="text-sm text-[var(--text-muted)]">Aplikasi Next.js 14 yang dioptimalkan untuk performa maksimal di semua device.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Smartphone className="text-[var(--accent-blue)] mb-4" size={32} />
            <h4 className="font-bold mb-2">Siap PWA</h4>
            <p className="text-sm text-[var(--text-muted)]">Akses seperti aplikasi native langsung dari smartphone Anda.</p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-12 border-t border-[var(--border)] text-center text-[var(--text-muted)] text-sm">
        <p>&copy; 2026 HITERA Application. Dibuat dengan presisi.</p>
      </footer>
    </div>
  );
}
