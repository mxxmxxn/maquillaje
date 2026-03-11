-- Ejecuta esto en Supabase SQL Editor para permitir lectura pública de contenido
-- Esto permite que la web pública (sin autenticación) pueda leer servicios, galería y testimonios

drop policy if exists "public can read services" on public.services;
create policy "public can read services"
on public.services
for select
to public
using (true);

drop policy if exists "public can read gallery" on public.gallery_items;
create policy "public can read gallery"
on public.gallery_items
for select
to public
using (true);

drop policy if exists "public can read testimonials" on public.testimonials;
create policy "public can read testimonials"
on public.testimonials
for select
to public
using (true);

drop policy if exists "public can read hero" on public.hero_settings;
create policy "public can read hero"
on public.hero_settings
for select
to public
using (true);

drop policy if exists "public can read about" on public.about_content;
create policy "public can read about"
on public.about_content
for select
to public
using (true);

-- Verifica que los servicios son visibles
select id, name, price, icon from public.services limit 5;
