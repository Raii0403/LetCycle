-- Tabel data beranda LetsCycle. Dibuat KOSONG (tanpa seed); data hanya dari aksi user.

create table if not exists public.waste_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  name text not null,
  price_per_kg integer not null check (price_per_kg >= 0),
  icon text not null default 'cube-outline',
  color text not null default '#E9EDE5'
);

create table if not exists public.collection_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  name text not null,
  address text not null,
  phone text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180)
);

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  category_id uuid references public.waste_categories (id) on delete set null,
  category_name text not null,
  weight_kg numeric(10, 2) not null check (weight_kg > 0),
  bottle_count integer not null default 0 check (bottle_count >= 0),
  amount integer not null check (amount >= 0),
  points integer not null check (points >= 0)
);

alter table public.waste_categories enable row level security;

create policy "waste_categories_select_own" on public.waste_categories
  for select to authenticated using (auth.uid() = user_id);
create policy "waste_categories_insert_own" on public.waste_categories
  for insert to authenticated with check (auth.uid() = user_id);
create policy "waste_categories_update_own" on public.waste_categories
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "waste_categories_delete_own" on public.waste_categories
  for delete to authenticated using (auth.uid() = user_id);

alter table public.collection_points enable row level security;

create policy "collection_points_select_own" on public.collection_points
  for select to authenticated using (auth.uid() = user_id);
create policy "collection_points_insert_own" on public.collection_points
  for insert to authenticated with check (auth.uid() = user_id);
create policy "collection_points_update_own" on public.collection_points
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "collection_points_delete_own" on public.collection_points
  for delete to authenticated using (auth.uid() = user_id);

alter table public.deposits enable row level security;

create policy "deposits_select_own" on public.deposits
  for select to authenticated using (auth.uid() = user_id);
create policy "deposits_insert_own" on public.deposits
  for insert to authenticated with check (auth.uid() = user_id);
create policy "deposits_update_own" on public.deposits
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "deposits_delete_own" on public.deposits
  for delete to authenticated using (auth.uid() = user_id);
