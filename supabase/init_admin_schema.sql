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
  description text not null default '',
  hero_image_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_content (
  id text primary key,
  description text not null default '',
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
  name text not null,
  category_id uuid references public.service_categories(id),
  description text not null default '',
  price text not null,
  icon text not null default 'Sparkles',
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

alter table public.hero_settings add column if not exists description text not null default '';
alter table public.about_content add column if not exists description text not null default '';
alter table public.services add column if not exists category_id uuid references public.service_categories(id);
alter table public.services add column if not exists description text not null default '';
alter table public.services add column if not exists icon text not null default 'Sparkles';
alter table public.testimonials add column if not exists category text not null default '';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'hero_settings' and column_name = 'subtitle'
  ) then
    execute 'update public.hero_settings set description = coalesce(nullif(description, ''''), subtitle)';
    execute 'alter table public.hero_settings drop column subtitle';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'about_content' and column_name = 'paragraph_1'
  ) then
    execute 'update public.about_content set description = coalesce(nullif(description, ''''), paragraph_1)';
    execute 'alter table public.about_content drop column paragraph_1';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'about_content' and column_name = 'paragraph_2'
  ) then
    execute 'alter table public.about_content drop column paragraph_2';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'about_content' and column_name = 'paragraph_3'
  ) then
    execute 'alter table public.about_content drop column paragraph_3';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'about_content' and column_name = 'photo_url'
  ) then
    execute 'alter table public.about_content drop column photo_url';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'gallery_items' and column_name = 'description'
  ) then
    execute 'alter table public.gallery_items drop column description';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'services' and column_name = 'image_url'
  ) then
    execute 'alter table public.services drop column image_url';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'testimonials' and column_name = 'service'
  ) then
    execute 'update public.testimonials set category = coalesce(nullif(category, ''''), service)';
    execute 'alter table public.testimonials drop column service';
  end if;
end $$;

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

insert into public.contact_info (id)
values ('default')
on conflict (id) do nothing;

update public.about_content
set
  description = case when description = '' then 'Soy maquilladora profesional especializada en piel real y acabados elegantes. Cada look se adapta a tu estilo, tu evento y la luz con la que vas a vivirlo.' else description end,
  stat_1_number = case when stat_1_number = 0 then 180 else stat_1_number end,
  stat_1_label = case when stat_1_label = '' then 'Clientes felices' else stat_1_label end,
  stat_2_number = case when stat_2_number = 0 then 8 else stat_2_number end,
  stat_2_label = case when stat_2_label = '' then 'Anios de experiencia' else stat_2_label end,
  stat_3_number = case when stat_3_number = 0 then 35 else stat_3_number end,
  stat_3_label = case when stat_3_label = '' then 'Cursos certificados' else stat_3_label end
where id = 'default';

update public.hero_settings
set
  title = case when title = '' then 'Diseno de belleza con movimiento, luz y presencia' else title end,
  description = case when description = '' then 'Un fondo luminoso y delicado acompana cada look para mantener la portada viva sin ocultar la imagen principal.' else description end,
  hero_image_url = case when hero_image_url = '' then '/imagen_maquillaje.jpg' else hero_image_url end
where id = 'default';

update public.contact_info
set
  description = case when description = '' then 'Cuentame fecha, horario y estilo deseado para preparar una propuesta a tu medida.' else description end,
  instagram_url = case when instagram_url = '' then 'https://instagram.com' else instagram_url end,
  whatsapp_number = case when whatsapp_number = '' then '34685647170' else whatsapp_number end,
  email = case when email = '' then 'hola@maquillaje.com' else email end
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

insert into public.gallery_items (id, image_url, category, title, sort_order)
values
  ('a1111111-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop', 'novias', 'Glow bridal', 0),
  ('a2222222-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=900&auto=format&fit=crop', 'social', 'Soft glam', 1),
  ('a3333333-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop', 'editorial', 'Editorial chic', 2),
  ('a4444444-4444-4444-8444-444444444444', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=900&auto=format&fit=crop', 'quince', 'Fiesta rose', 3),
  ('a5555555-5555-4555-8555-555555555555', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=900&auto=format&fit=crop', 'novias', 'Natural bride', 4),
  ('a6666666-6666-4666-8666-666666666666', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=900&auto=format&fit=crop', 'social', 'Noche dorada', 5)
on conflict (id) do update set
  image_url = excluded.image_url,
  category = excluded.category,
  title = excluded.title,
  sort_order = excluded.sort_order;

insert into public.services (id, name, category_id, description, price, icon, sort_order)
values
  ('b1111111-1111-4111-8111-111111111111', 'Novias', '11111111-1111-4111-8111-111111111111', 'Prueba previa, preparacion de piel y maquillaje de larga duracion para el dia de la boda.', '$120', 'Crown', 0),
  ('b2222222-2222-4222-8222-222222222222', 'Social Glam', '22222222-2222-4222-8222-222222222222', 'Maquillaje elegante para fiestas, invitadas y eventos con acabado pulido y favorecedor.', '$55', 'Sparkles', 1),
  ('b3333333-3333-4333-8333-333333333333', 'Editorial', '33333333-3333-4333-8333-333333333333', 'Propuestas pensadas para sesiones, campanas y contenido visual con mayor impacto.', '$95', 'Brush', 2),
  ('b4444444-4444-4444-8444-444444444444', 'Automaquillaje', '22222222-2222-4222-8222-222222222222', 'Clase personalizada para aprender tecnicas, productos y un look adaptado a tu rostro.', '$70', 'Wand2', 3)
on conflict (id) do update set
  name = excluded.name,
  category_id = excluded.category_id,
  description = excluded.description,
  price = excluded.price,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

insert into public.testimonials (id, name, text, rating, category, photo_url)
values
  ('c1111111-1111-4111-8111-111111111111', 'Andrea', 'Increible resultado, duracion perfecta toda la noche.', 5, 'Social Glam', ''),
  ('c2222222-2222-4222-8222-222222222222', 'Lucia', 'Mi look de novia fue exactamente como lo sonaba.', 5, 'Novias', ''),
  ('c3333333-3333-4333-8333-333333333333', 'Nadia', 'Atencion super profesional y maquillaje elegante.', 5, 'Editorial', ''),
  ('c4444444-4444-4444-8444-444444444444', 'Sofia', 'La piel se veia luminosa y natural incluso en fotos con flash.', 5, 'Novias', ''),
  ('c5555555-5555-4555-8555-555555555555', 'Valeria', 'Puntual, detallista y con muy buen gusto para elegir tonos.', 5, 'Social Glam', ''),
  ('c6666666-6666-4666-8666-666666666666', 'Camila', 'Me encanto la asesoria previa, supo entender justo lo que queria.', 5, 'Prueba Novia', ''),
  ('c7777777-7777-4777-8777-777777777777', 'Paula', 'Trabajo fino, limpio y muy duradero. Repetire seguro.', 5, 'Evento de noche', ''),
  ('c8888888-8888-4888-8888-888888888888', 'Marta', 'Quedo precioso en video y en persona, cero efecto pesado.', 5, 'Editorial', ''),
  ('c9999999-9999-4999-8999-999999999999', 'Elena', 'Todo el proceso fue muy comodo y profesional, super recomendada.', 5, 'Social Glam', ''),
  ('d1111111-1111-4111-8111-111111111111', 'Irene', 'Me senti guapisima y segura toda la boda, fue un acierto total.', 5, 'Novias', '')
on conflict (id) do update set
  name = excluded.name,
  text = excluded.text,
  rating = excluded.rating,
  category = excluded.category,
  photo_url = excluded.photo_url;

-- Admin inicial por email.
insert into public.admin_users (email)
values ('mimun.baltitmx@gmail.com')
on conflict (email) do nothing;
