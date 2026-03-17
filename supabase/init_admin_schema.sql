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
  photo_url text not null default '',
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
  description text not null default '',
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
  description text not null default '',
  category_id uuid references public.service_categories(id),
  price text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.about_content add column if not exists photo_url text not null default '';
alter table public.gallery_items add column if not exists description text not null default '';
alter table public.services add column if not exists description text not null default '';

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

update public.about_content
set
  paragraph_1 = case when paragraph_1 = '' then 'Soy maquilladora profesional especializada en piel real y acabados elegantes. Cada look se adapta a tu estilo, tu evento y la luz con la que vas a vivirlo.' else paragraph_1 end,
  paragraph_2 = case when paragraph_2 = '' then 'Trabajo con tecnicas actuales, productos premium y una experiencia cercana para que disfrutes el proceso con calma, seguridad y un resultado refinado.' else paragraph_2 end,
  paragraph_3 = case when paragraph_3 = '' then 'Mi enfoque combina naturalidad, duracion y detalles bien pensados para que te veas luminosa en persona, en foto y en video.' else paragraph_3 end,
  stat_1_number = case when stat_1_number = 0 then 180 else stat_1_number end,
  stat_1_label = case when stat_1_label = '' then 'Clientes felices' else stat_1_label end,
  stat_2_number = case when stat_2_number = 0 then 8 else stat_2_number end,
  stat_2_label = case when stat_2_label = '' then 'Anios de experiencia' else stat_2_label end,
  stat_3_number = case when stat_3_number = 0 then 35 else stat_3_number end,
  stat_3_label = case when stat_3_label = '' then 'Cursos certificados' else stat_3_label end
where id = 'default';

insert into public.service_categories (id, name, sort_order)
values
  ('11111111-1111-4111-8111-111111111111', 'novias', 0),
  ('22222222-2222-4222-8222-222222222222', 'social', 1),
  ('33333333-3333-4333-8333-333333333333', 'editorial', 2),
  ('44444444-4444-4444-8444-444444444444', 'quince', 3)
on conflict (id) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.gallery_items (id, image_url, category, title, description, sort_order)
values
  ('a1111111-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop', 'novias', 'Glow bridal', 'Piel luminosa, mirada suave y acabados elegantes para novias.', 0),
  ('a2222222-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=900&auto=format&fit=crop', 'social', 'Soft glam', 'Maquillaje social pulido con brillo controlado y rasgos definidos.', 1),
  ('a3333333-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop', 'editorial', 'Editorial chic', 'Propuesta editorial con textura, luz y presencia en camara.', 2),
  ('a4444444-4444-4444-8444-444444444444', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=900&auto=format&fit=crop', 'quince', 'Fiesta rose', 'Look romantico y fresco para celebraciones y eventos especiales.', 3),
  ('a5555555-5555-4555-8555-555555555555', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=900&auto=format&fit=crop', 'novias', 'Natural bride', 'Acabado natural de larga duracion con foco en una piel bonita.', 4),
  ('a6666666-6666-4666-8666-666666666666', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=900&auto=format&fit=crop', 'social', 'Noche dorada', 'Tonos calidos y estructura limpia para eventos de tarde y noche.', 5)
on conflict (id) do update set
  image_url = excluded.image_url,
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.services (id, icon, name, description, category_id, price, sort_order)
values
  ('b1111111-1111-4111-8111-111111111111', 'Crown', 'Novias', 'Prueba previa, diseño del look y maquillaje de larga duracion para el dia de la boda.', '11111111-1111-4111-8111-111111111111', '$120', 0),
  ('b2222222-2222-4222-8222-222222222222', 'Sparkles', 'Social Glam', 'Maquillaje elegante para fiestas, invitadas y eventos con acabado pulido y favorecedor.', '22222222-2222-4222-8222-222222222222', '$55', 1),
  ('b3333333-3333-4333-8333-333333333333', 'Brush', 'Editorial', 'Propuestas pensadas para sesiones, campañas y contenido visual con mayor impacto.', '33333333-3333-4333-8333-333333333333', '$95', 2),
  ('b4444444-4444-4444-8444-444444444444', 'Wand2', 'Automaquillaje', 'Clase personalizada para aprender tecnicas, productos y un look adaptado a tu rostro.', '22222222-2222-4222-8222-222222222222', '$70', 3)
on conflict (id) do update set
  icon = excluded.icon,
  name = excluded.name,
  description = excluded.description,
  category_id = excluded.category_id,
  price = excluded.price,
  sort_order = excluded.sort_order;

-- Admin inicial por email.
insert into public.admin_users (email)
values ('mimun.baltitmx@gmail.com')
on conflict (email) do nothing;
