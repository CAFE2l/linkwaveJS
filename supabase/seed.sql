-- Linkwave — Seed Data for Development / Demo
-- Run after schema.sql has been applied

-- Create demo users via the auth.users trigger (handled by application on signup)
-- For direct DB seeding, we insert into public.users and public.profiles

-- 1. Demo Users
INSERT INTO public.users (id, email, username, name, avatar_url, banner_url, role, active, theme_json, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'ana@demo.com',     'analuz',     'Ana Luz',      NULL, NULL, 'user', true, '{"background_type":"gradient","background_color":"#0ea5e9","background_gradient_start":"#06b6d4","background_gradient_end":"#3b82f6","card_glass_style":"frosted","font_style":"nunito","enable_stars":true,"link_hover_effect":"glow"}', NOW() - INTERVAL '45 days'),
  ('00000000-0000-0000-0000-000000000002', 'joao@demo.com',    'joaosilva',   'João Silva',   NULL, NULL, 'user', true, '{"background_type":"solid","background_color":"#1e1b4b","card_glass_style":"dark","font_style":"space","enable_stars":false,"link_hover_effect":"lift"}', NOW() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000003', 'marina@demo.com',  'marinacosta', 'Marina Costa', NULL, NULL, 'user', true, '{"background_type":"galaxy","galaxy_theme":"nebula","card_glass_style":"frosted","font_style":"serif","enable_stars":true,"link_hover_effect":"float"}', NOW() - INTERVAL '20 days'),
  ('00000000-0000-0000-0000-000000000004', 'carlos@demo.com',  'carlosdev',   'Carlos Dev',   NULL, NULL, 'user', true, '{"background_type":"gradient","background_color":"#831843","background_gradient_start":"#be123c","background_gradient_end":"#4c1d95","card_glass_style":"neon","font_style":"mono","enable_stars":true,"link_hover_effect":"scale"}', NOW() - INTERVAL '15 days'),
  ('00000000-0000-0000-0000-000000000005', 'admin@linkwave.dev', 'admin',     'Admin',        NULL, NULL, 'admin', true, '{}', NOW() - INTERVAL '90 days');

-- 2. Profiles
INSERT INTO public.profiles (user_id, name, username, email, bio, theme, custom_colors, active, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ana Luz',     'analuz',     'ana@demo.com',       '✨ Criadora de conteúdo digital • Front-end & UI/UX', 'wave', '{}', true, NOW() - INTERVAL '45 days', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'João Silva',  'joaosilva',  'joao@demo.com',      'Desenvolvedor full-stack apaixonado por tecnologia', 'midnight', '{}', true, NOW() - INTERVAL '30 days', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Marina Costa','marinacosta','marina@demo.com',     'Fotógrafa e viajante 📸✈️', 'aurora', '{}', true, NOW() - INTERVAL '20 days', NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Carlos Dev',  'carlosdev',  'carlos@demo.com',     'Indie hacker • Building in public', 'wave', '{}', true, NOW() - INTERVAL '15 days', NOW());

-- 3. Links
INSERT INTO public.links (user_id, title, url, icon, order_position, created_at)
VALUES
  -- Ana Luz (5 links)
  ('00000000-0000-0000-0000-000000000001', 'Meu Portfolio',    'https://analuz.dev',       'globe',    0, NOW() - INTERVAL '44 days'),
  ('00000000-0000-0000-0000-000000000001', 'YouTube',          'https://youtube.com/@analuz', 'youtube', 1, NOW() - INTERVAL '43 days'),
  ('00000000-0000-0000-0000-000000000001', 'Instagram',        'https://instagram.com/analuz', 'instagram', 2, NOW() - INTERVAL '42 days'),
  ('00000000-0000-0000-0000-000000000001', 'GitHub',           'https://github.com/analuz', 'github', 3, NOW() - INTERVAL '41 days'),
  ('00000000-0000-0000-0000-000000000001', 'Discord Server',   'https://discord.gg/analuz', 'message-circle', 4, NOW() - INTERVAL '40 days'),
  -- João Silva (3 links)
  ('00000000-0000-0000-0000-000000000002', 'LinkedIn',         'https://linkedin.com/in/joaosilva', 'linkedin', 0, NOW() - INTERVAL '29 days'),
  ('00000000-0000-0000-0000-000000000002', 'Blog',             'https://joaosilva.dev/blog', 'pen-tool', 1, NOW() - INTERVAL '28 days'),
  ('00000000-0000-0000-0000-000000000002', 'Twitter / X',      'https://x.com/joaosilva', 'twitter', 2, NOW() - INTERVAL '27 days'),
  -- Marina Costa (4 links)
  ('00000000-0000-0000-0000-000000000003', 'Portfolio Fotos',  'https://marinacosta.fotos', 'camera', 0, NOW() - INTERVAL '19 days'),
  ('00000000-0000-0000-0000-000000000003', 'Instagram',        'https://instagram.com/marinacosta', 'instagram', 1, NOW() - INTERVAL '18 days'),
  ('00000000-0000-0000-0000-000000000003', 'Loja de Prints',   'https://marinacosta.prints', 'shopping-cart', 2, NOW() - INTERVAL '17 days'),
  ('00000000-0000-0000-0000-000000000003', 'Medium',           'https://medium.com/@marinacosta', 'book-open', 3, NOW() - INTERVAL '16 days'),
  -- Carlos Dev (2 links)
  ('00000000-0000-0000-0000-000000000004', 'Produto XYZ',      'https://produtoxyz.com', 'package', 0, NOW() - INTERVAL '14 days'),
  ('00000000-0000-0000-0000-000000000004', 'Twitter / X',      'https://x.com/carlosdev', 'twitter', 1, NOW() - INTERVAL '13 days');

-- 4. Clicks — spread over the last 30 days for realistic charts
INSERT INTO public.clicks (link_id, user_id, ip_address, country, city, created_at)
SELECT
  l.id,
  l.user_id,
  CASE floor(random() * 5)::int
    WHEN 0 THEN '189.12.34.56'::inet
    WHEN 1 THEN '201.45.67.89'::inet
    WHEN 2 THEN '98.76.54.32'::inet
    WHEN 3 THEN '45.67.89.10'::inet
    WHEN 4 THEN '200.100.50.25'::inet
  END,
  CASE floor(random() * 5)::int
    WHEN 0 THEN 'Brazil'
    WHEN 1 THEN 'United States'
    WHEN 2 THEN 'Portugal'
    WHEN 3 THEN 'Germany'
    WHEN 4 THEN 'Japan'
  END,
  CASE floor(random() * 5)::int
    WHEN 0 THEN 'São Paulo'
    WHEN 1 THEN 'New York'
    WHEN 2 THEN 'Lisbon'
    WHEN 3 THEN 'Berlin'
    WHEN 4 THEN 'Tokyo'
  END,
  NOW() - (random() * INTERVAL '30 days')
FROM public.links l
CROSS JOIN generate_series(1, (random() * 8 + 2)::int)
ON CONFLICT DO NOTHING;
