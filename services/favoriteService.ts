import { supabase } from "@/lib/supabase";
import type { FavoriteInsert, FavoriteRow } from "@/types/listing";

export async function fetchFavorites(): Promise<FavoriteRow[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal memuat favorit: ${error.message}`);
  }
  return (data ?? []) as FavoriteRow[];
}

export async function addFavorite(input: FavoriteInsert): Promise<FavoriteRow> {
  const { data, error } = await supabase
    .from("favorites")
    .insert(input)
    .select()
    .single();
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal menambah favorit: ${error.message}`);
  }
  return data as FavoriteRow;
}

export async function removeFavorite(productId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("product_id", productId);
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal menghapus favorit: ${error.message}`);
  }
}
