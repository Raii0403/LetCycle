-- Jalankan di Supabase Dashboard > SQL Editor > New query > Run.

-- 1. listings: barang yang dijual oleh user (menggantikan data lokal "Jual Barang")
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  price integer not null check (price > 0),
  category text not null,
  condition text not null,
  seller_name text not null,
  city text not null,
  thumbnail text not null,
  created_at timestamptz not null default now()
);

-- 2. favorites: barang marketplace yang ditandai favorit oleh user
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id text not null,
  name text not null,
  price integer not null,
  thumbnail text,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Row Level Security
alter table public.listings enable row level security;
alter table public.favorites enable row level security;

-- listings: hanya pemilik
create policy "listings_select_own" on public.listings
  for select to authenticated using (auth.uid() = user_id);
create policy "listings_insert_own" on public.listings
  for insert to authenticated with check (auth.uid() = user_id);
create policy "listings_update_own" on public.listings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "listings_delete_own" on public.listings
  for delete to authenticated using (auth.uid() = user_id);

-- favorites: hanya pemilik
create policy "favorites_select_own" on public.favorites
  for select to authenticated using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites
  for insert to authenticated with check (auth.uid() = user_id);
create policy "favorites_update_own" on public.favorites
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
  for delete to authenticated using (auth.uid() = user_id);
