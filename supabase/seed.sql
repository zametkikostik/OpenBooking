-- =====================================================
-- SEED DATA - Development & Testing
-- =====================================================

-- NOTE: Run this in Supabase Dashboard SQL Editor after signing up
-- The admin user must be created through Supabase Auth first

-- Step 1: Sign up admin@openbooking.com through the app
-- Step 2: Run this SQL to set admin role

-- Update admin user role (replace with actual user ID after signup)
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@openbooking.com';

-- =====================================================
-- Test Properties
-- =====================================================

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Роскошная вилла с видом на море',
  'Прекрасная вилла с панорамным видом на море. Современный дизайн, бассейн, сад.',
  'Villa',
  'Сочи',
  'Россия',
  4,
  3,
  8,
  15000,
  'active',
  4.8,
  24
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Роскошная вилла с видом на море');

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Уютная квартира в центре',
  'Стильная квартира в историческом центре города. Рядом рестораны и музеи.',
  'Apartment',
  'Санкт-Петербург',
  'Россия',
  2,
  1,
  4,
  7500,
  'active',
  4.5,
  18
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Уютная квартира в центре');

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Современный лофт',
  'Просторный лофт в модном районе. Идеально для цифровых кочевников.',
  'Loft',
  'Москва',
  'Россия',
  1,
  1,
  2,
  9000,
  'active',
  4.9,
  32
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Современный лофт');

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Дом у озера',
  'Загородный дом с собственным пляжем. Тишина и природа.',
  'House',
  'Варна',
  'Болгария',
  3,
  2,
  6,
  12000,
  'active',
  4.7,
  15
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Дом у озера');

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Студия в старом городе',
  'Компактная студия в самом сердце старого города.',
  'Studio',
  'Киев',
  'Украина',
  1,
  1,
  2,
  4500,
  'active',
  4.3,
  9
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Студия в старом городе');

INSERT INTO properties (id, host_id, title, description, property_type, city, country, bedrooms, bathrooms, max_guests, price_per_night, status, rating, review_count)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'admin@openbooking.com' LIMIT 1),
  'Апартаменты с террасой',
  'Светлые апартаменты с большой террасой и видом на горы.',
  'Apartment',
  'Берлин',
  'Германия',
  2,
  1,
  4,
  8500,
  'active',
  4.6,
  21
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = 'Апартаменты с террасой');

-- =====================================================
-- Test Vault Pools
-- =====================================================

INSERT INTO vault_pools (id, name, description, total_value_locked, total_deposited, average_apy, risk_level, strategies, supported_assets, min_deposit, fee_percentage, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Aave Stable Yield', 'Консервативная стратегия через Aave с фокусом на стейблкоины', 2500000, 2000000, 5.2, 'low', ARRAY['aave_supply', 'aave_stable'], ARRAY['DAI', 'USDC', 'USDT'], 100, 2, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'ETH Liquid Staking', 'Доходность через стейкинг Ethereum с ликвидной позицией', 5000000, 4500000, 4.8, 'medium', ARRAY['aave_supply'], ARRAY['ETH', 'stETH'], 0.01, 5, 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'A7A5 High Yield', 'Высокодоходная стратегия с токеном A7A5', 750000, 600000, 12.5, 'high', ARRAY['aave_supply', 'yearn'], ARRAY['A7A5', 'ETH'], 500, 10, 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Real-time Metrics
-- =====================================================

UPDATE real_time_metrics SET 
  metric_value = 47,
  delta_24h = 5,
  delta_percentage = 11.9
WHERE metric_name = 'active_bookings';

UPDATE real_time_metrics SET 
  metric_value = 234,
  delta_24h = 18,
  delta_percentage = 8.3
WHERE metric_name = 'online_users';

UPDATE real_time_metrics SET 
  metric_value = 8250000,
  delta_24h = 150000,
  delta_percentage = 1.85
WHERE metric_name = 'total_value_locked';

UPDATE real_time_metrics SET 
  metric_value = 1250000,
  delta_24h = 45000,
  delta_percentage = 3.73
WHERE metric_name = 'total_revenue';

UPDATE real_time_metrics SET 
  metric_value = 6,
  delta_24h = 2,
  delta_percentage = 50
WHERE metric_name = 'total_properties';

UPDATE real_time_metrics SET 
  metric_value = 156,
  delta_24h = 12,
  delta_percentage = 8.33
WHERE metric_name = 'total_users';
