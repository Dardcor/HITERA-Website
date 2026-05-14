import { format, addDays, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/** Mengembalikan waktu sekarang dalam zona WIB (Asia/Jakarta, UTC+7) */
export function nowWIB(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (7 * 3600000));
}

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

export function formatTanggalID(tanggal: string): string {
  try {
    return format(parseISO(tanggal), 'EEEE, d MMMM yyyy', { locale: id });
  } catch (error) {
    return tanggal;
  }
}

export function formatTanggalSingkat(tanggal: string): string {
  try {
    return format(parseISO(tanggal), 'd MMM', { locale: id });
  } catch (error) {
    return tanggal;
  }
}

export function formatTanggalGroup(tanggal: string): string {
  try {
    return format(parseISO(tanggal), 'd MMMM yyyy', { locale: id });
  } catch (error) {
    return tanggal;
  }
}

export function hariIni(): string {
  return format(nowWIB(), 'yyyy-MM-dd');
}

export function tambahHari(tanggal: string, jumlah: number): string {
  return format(addDays(parseISO(tanggal), jumlah), 'yyyy-MM-dd');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
