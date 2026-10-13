-- Account-omgeving: profielen, favorieten en bestellingen.
-- Elke tabel heeft row-level security: gebruikers zien en wijzigen alleen hun eigen rijen.

-- ---------- profielen ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  phone text check (char_length(phone) <= 30),
  street text check (char_length(street) <= 160),
  postcode text check (char_length(postcode) <= 12),
  city text check (char_length(city) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

create policy "Eigen profiel lezen" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Eigen profiel aanmaken" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
create policy "Eigen profiel wijzigen" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Maak automatisch een profiel aan bij registratie (naam komt uit de signup-metadata).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(left(new.raw_user_meta_data ->> 'full_name', 120), ''))
  on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- favorieten ----------
-- product_handle verwijst naar de handle in de productcatalogus (src/data/products.json).
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_handle text not null check (char_length(product_handle) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, product_handle)
);
alter table public.favorites enable row level security;
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;

create policy "Eigen favorieten lezen" on public.favorites
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Eigen favorieten toevoegen" on public.favorites
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Eigen favorieten verwijderen" on public.favorites
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------- bestellingen ----------
-- Alleen lezen voor de gebruiker; bestellingen worden door de checkout-backend (service_role) geschreven.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'in_behandeling'
    check (status in ('in_behandeling', 'verzonden', 'afgeleverd', 'geannuleerd')),
  total numeric(10, 2) not null check (total >= 0),
  -- [{ "handle": text, "title": text, "size": text, "qty": int, "price": numeric }]
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
alter table public.orders enable row level security;
grant select on public.orders to authenticated;
grant all on public.orders to service_role;

create policy "Eigen bestellingen lezen" on public.orders
  for select to authenticated using (user_id = (select auth.uid()));
