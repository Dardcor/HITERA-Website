export interface User {
  id: string;
  email: string;
  nama?: string;
}

export interface Transaksi {
  id: string;
  user_id: string;
  jenis: 'pemasukan' | 'pengeluaran';
  jumlah: number;
  kategori: string;
  deskripsi?: string;
  tanggal: string;
  created_at: string;
}

export interface DataKesehatan {
  id: string;
  user_id: string;
  tanggal: string;
  berat_badan?: number;
  air_minum?: number;
  jam_tidur?: number;
  langkah_kaki?: number;
  tekanan_darah?: string;
  catatan?: string;
  created_at: string;
}

export interface Tugas {
  id: string;
  user_id: string;
  judul: string;
  deskripsi?: string;
  prioritas: 'rendah' | 'sedang' | 'tinggi';
  status: 'aktif' | 'selesai' | 'ditunda';
  tanggal_target: string;
  tanggal_selesai?: string;
  created_at: string;
}

export type TransaksiForm = Omit<Transaksi, 'id' | 'user_id' | 'created_at'>;
export type KesehatanForm = Omit<DataKesehatan, 'id' | 'user_id' | 'created_at'>;
export type TugasForm = Omit<Tugas, 'id' | 'user_id' | 'created_at' | 'tanggal_selesai'>;
