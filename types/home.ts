// Baris tabel public.waste_categories.
export interface WasteCategoryRow {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  price_per_kg: number;
  icon: string; // nama ikon Ionicons
  color: string;
}
export type WasteCategoryInsert = Pick<
  WasteCategoryRow,
  "name" | "price_per_kg" | "icon" | "color"
>;

// Baris tabel public.collection_points.
export interface CollectionPointRow {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  address: string;
  phone: string | null;
  latitude: number;
  longitude: number;
}
export type CollectionPointInsert = Pick<
  CollectionPointRow,
  "name" | "address" | "phone" | "latitude" | "longitude"
>;

// Baris tabel public.deposits (setoran sampah).
export interface DepositRow {
  id: string;
  user_id: string;
  created_at: string;
  category_id: string | null;
  category_name: string;
  weight_kg: number;
  bottle_count: number;
  amount: number;
  points: number;
}
export type DepositInsert = Pick<
  DepositRow,
  "category_id" | "category_name" | "weight_kg" | "bottle_count" | "amount" | "points"
>;
