import { supabase } from "@/lib/supabase";
import type {
  ListingInsert,
  ListingRow,
  ListingUpdate,
} from "@/types/listing";

// Semua query dibatasi RLS: hanya baris milik user yang sedang login.

export async function fetchListings(): Promise<ListingRow[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal memuat barang jualan: ${error.message}`);
  }
  return (data ?? []) as ListingRow[];
}

export async function insertListing(input: ListingInsert): Promise<ListingRow> {
  // user_id diisi otomatis oleh default auth.uid() di database.
  const { data, error } = await supabase
    .from("listings")
    .insert(input)
    .select()
    .single();
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal menambah barang: ${error.message}`);
  }
  return data as ListingRow;
}

export async function updateListing(
  id: string,
  changes: ListingUpdate,
): Promise<ListingRow> {
  const { data, error } = await supabase
    .from("listings")
    .update(changes)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal mengubah barang: ${error.message}`);
  }
  return data as ListingRow;
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) {
    console.error("[supabase]", error);
    throw new Error(`Gagal menghapus barang: ${error.message}`);
  }
}
