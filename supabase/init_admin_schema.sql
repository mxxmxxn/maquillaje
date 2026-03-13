-- Ejecuta este script en Supabase SQL Editor.
-- Crea tablas del panel admin + politicas RLS + bucket de imagenes.

create extension if not exists pgcrypto;

-- Lista de emails con permisos de administracion.
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Utility para saber si el usuario autenticado es admin por email.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.hero_settings (
  id text primary key,
  title text not null default '',
  subtitle text not null default '',
  hero_image_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_content (
  id text primary key,
  paragraph_1 text not null default '',
  paragraph_2 text not null default '',
  paragraph_3 text not null default '',
  stat_1_number integer not null default 0,
  stat_1_label text not null default '',
  stat_2_number integer not null default 0,
  stat_2_label text not null default '',
  stat_3_number integer not null default 0,
  stat_3_label text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_info (
  id text primary key,
  description text not null default '',
  instagram_url text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text not null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'Sparkles',
  name text not null,
  category_id uuid references public.service_categories(id),
  price text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  category text not null,
  photo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_items_sort_order on public.gallery_items (sort_order);
create index if not exists idx_services_sort_order on public.services (sort_order);

drop trigger if exists set_updated_at_hero on public.hero_settings;
create trigger set_updated_at_hero
before update on public.hero_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_about on public.about_content;
create trigger set_updated_at_about
before update on public.about_content
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_contact on public.contact_info;
create trigger set_updated_at_contact
before update on public.contact_info
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_gallery on public.gallery_items;
create trigger set_updated_at_gallery
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_categories on public.service_categories;
create trigger set_updated_at_categories
before update on public.service_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_services on public.services;
create trigger set_updated_at_services
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_testimonials on public.testimonials;
create trigger set_updated_at_testimonials
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.hero_settings enable row level security;
alter table public.about_content enable row level security;
alter table public.contact_info enable row level security;
alter table public.gallery_items enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;

-- Solo admin autenticado puede leer/escribir desde el panel admin.
drop policy if exists "admin can manage hero" on public.hero_settings;
create policy "admin can manage hero"
on public.hero_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage about" on public.about_content;
create policy "admin can manage about"
on public.about_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage contact" on public.contact_info;
create policy "admin can manage contact"
on public.contact_info
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage gallery" on public.gallery_items;
create policy "admin can manage gallery"
on public.gallery_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage categories" on public.service_categories;
create policy "admin can manage categories"
on public.service_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage services" on public.services;
create policy "admin can manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can manage testimonials" on public.testimonials;
create policy "admin can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Permisos para la lista de admins.
drop policy if exists "admin users read own access" on public.admin_users;
create policy "admin users read own access"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "service role manages admin users" on public.admin_users;
create policy "service role manages admin users"
on public.admin_users
for all
to service_role
using (true)
with check (true);

-- Bucket de imagenes para subida desde Admin.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Cualquiera puede leer imagenes publicas.
drop policy if exists "public can read images" on storage.objects;
create policy "public can read images"
on storage.objects
for select
to public
using (bucket_id = 'images');

-- Solo admin autenticado puede subir/editar/eliminar.
drop policy if exists "admin can upload images" on storage.objects;
create policy "admin can upload images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin can update images" on storage.objects;
create policy "admin can update images"
on storage.objects
for update
to authenticated
using (bucket_id = 'images' and public.is_admin())
with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin can delete images" on storage.objects;
create policy "admin can delete images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'images' and public.is_admin());

-- Semillas base para los formularios singleton.
insert into public.hero_settings (id)
values ('default')
on conflict (id) do nothing;

insert into public.about_content (id)
values ('default')
on conflict (id) do nothing;

-- Admin inicial por email.
insert into public.admin_users (email)
values ('mimun.baltitmx@gmail.com')
on conflict (email) do nothing;
