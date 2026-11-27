// Baris tabel public.listings (barang yang dijual user).
export interface ListingRow {
  id: string;
  user_id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  seller_name: string;
  city: string;
  thumbnail: string;
  created_at: string;
}

export type ListingInsert = Omit<ListingRow, "id" | "user_id" | "created_at">;
export type ListingUpdate = Partial<ListingInsert>;

// Baris tabel public.favorites.
export interface FavoriteRow {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  price: number;
  thumbnail: string | null;
  created_at: string;
}

export type FavoriteInsert = Pick<
  FavoriteRow,
  "product_id" | "name" | "price" | "thumbnail"
>;
