import { format, addDays, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

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

export function hariIni(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function tambahHari(tanggal: string, jumlah: number): string {
  return format(addDays(parseISO(tanggal), jumlah), 'yyyy-MM-dd');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
