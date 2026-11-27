// Barang daur ulang / bekas layak pakai yang dijual antar pengguna.
export interface Product {
  readonly id: string;
  name: string;
  price: number; // harga per barang (bukan per kg)
  category: string;
  condition: string;
  sellerName: string;
  city: string;
  thumbnail: string;
  // Terisi jika ini jualan milik user yang login (berasal dari Supabase).
  ownerId?: string;
}

export function formatRupiah(angka: number): string {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
