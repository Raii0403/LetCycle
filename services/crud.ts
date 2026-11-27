import { supabase } from "@/lib/supabase";

// Pabrik service CRUD untuk satu tabel Supabase. Semua query dibatasi RLS,
// dan user_id tidak dikirim saat create karena default-nya auth.uid().
export function createCrudService<
  Row extends { id: string },
  Insert extends object,
>(table: string, label: string) {
  function fail(action: string, error: { message: string }): never {
    console.error(`[supabase:${table}] ${action}`, error);
    throw new Error(`Gagal ${action} ${label}: ${error.message}`);
  }

  return {
    // Urut dari yang terbaru.
    async getAll(): Promise<Row[]> {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) fail("memuat", error);
      return (data ?? []) as Row[];
    },

    async getById(id: string): Promise<Row | null> {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) fail("memuat", error);
      return (data as Row | null) ?? null;
    },

    async create(input: Insert): Promise<Row> {
      const { data, error } = await supabase
        .from(table)
        .insert(input)
        .select()
        .single();
      if (error) fail("menambah", error);
      return data as Row;
    },

    async update(id: string, changes: Partial<Insert>): Promise<Row> {
      const { data, error } = await supabase
        .from(table)
        .update(changes as never)
        .eq("id", id)
        .select()
        .single();
      if (error) fail("mengubah", error);
      return data as Row;
    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) fail("menghapus", error);
    },
  };
}
