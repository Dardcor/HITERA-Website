import { format, addDays, parseISO, Locale } from 'date-fns';
import { id } from 'date-fns/locale';

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

export function formatTanggalID(tanggal: string, localeObj: Locale = id): string {
  try {
    return format(parseISO(tanggal), 'EEEE, d MMMM yyyy', { locale: localeObj });
  } catch (error) {
    return tanggal;
  }
}

export function formatTanggalSingkat(tanggal: string, localeObj: Locale = id): string {
  try {
    return format(parseISO(tanggal), 'd MMM', { locale: localeObj });
  } catch (error) {
    return tanggal;
  }
}

export function formatTanggalGroup(tanggal: string, localeObj: Locale = id): string {
  try {
    return format(parseISO(tanggal), 'd MMMM yyyy', { locale: localeObj });
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
