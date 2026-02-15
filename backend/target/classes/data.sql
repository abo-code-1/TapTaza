-- Tap-Taza Cleaning App - Seed Data
-- Kazakhstan market (Russian language)
-- Guards: only inserts if tables are empty

-- ============================================
-- 1. COMPANIES
-- ============================================
INSERT INTO companies (id, name, description, rating, review_count, price_range, verified, logo_url, created_at, updated_at)
SELECT * FROM (VALUES
    ('a1000000-0000-0000-0000-000000000001'::uuid, 'CleanMaster', 'Профессиональный клининг нового поколения. Гипоаллергенные средства и современное оборудование.', 4.9, 342, '₸₸', true, NULL, NOW(), NOW()),
    ('a1000000-0000-0000-0000-000000000002'::uuid, 'EcoCleaning', 'Экологичная уборка для вашего дома. Только безопасные и сертифицированные средства.', 4.8, 218, '₸₸', true, NULL, NOW(), NOW()),
    ('a1000000-0000-0000-0000-000000000003'::uuid, 'Блеск и Порядок', 'Клининговая компания с опытом более 10 лет. Генеральная и ежедневная уборка.', 4.7, 156, '₸₸₸', false, NULL, NOW(), NOW()),
    ('a1000000-0000-0000-0000-000000000004'::uuid, 'FastClean', 'Быстрая и качественная уборка. Выезд в течение часа по Алматы.', 4.5, 89, '₸', true, NULL, NOW(), NOW())
) AS v(id, name, description, rating, review_count, price_range, verified, logo_url, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM companies LIMIT 1);

-- ============================================
-- 2. SERVICES
-- ============================================
INSERT INTO services (id, company_id, name, description, price, duration_minutes)
SELECT gen_random_uuid(), c.id, s.name, s.description, s.price, s.duration_minutes
FROM companies c
CROSS JOIN (VALUES
    -- CleanMaster services
    ('CleanMaster', 'Стандартная уборка', 'Влажная уборка полов, протирка пыли, уборка кухни и санузла', 8000, 120),
    ('CleanMaster', 'Генеральная уборка', 'Полная уборка квартиры включая мытье окон, чистку мебели и техники', 25000, 300),
    ('CleanMaster', 'Уборка после ремонта', 'Удаление строительной пыли, мытье всех поверхностей', 35000, 480),
    -- EcoCleaning services
    ('EcoCleaning', 'Эко-уборка стандарт', 'Уборка с использованием только экологичных средств', 10000, 120),
    ('EcoCleaning', 'Антиаллергенная уборка', 'Специальная уборка для аллергиков с гипоаллергенными средствами', 12000, 150),
    ('EcoCleaning', 'Уборка детской комнаты', 'Безопасная уборка с дезинфекцией игрушек и поверхностей', 8000, 90),
    -- Блеск и Порядок services
    ('Блеск и Порядок', 'Ежедневная уборка', 'Поддерживающая уборка квартиры: полы, пыль, кухня', 6000, 90),
    ('Блеск и Порядок', 'Химчистка мебели', 'Профессиональная химчистка диванов, кресел и матрасов', 15000, 180),
    ('Блеск и Порядок', 'Мытье окон', 'Мытье окон с двух сторон, включая рамы и подоконники', 5000, 60),
    -- FastClean services
    ('FastClean', 'Экспресс-уборка', 'Быстрая уборка за 1.5 часа: основные зоны квартиры', 5000, 90),
    ('FastClean', 'Уборка офиса', 'Ежедневная уборка офисных помещений до 100 кв.м', 15000, 120)
) AS s(company_name, name, description, price, duration_minutes)
WHERE c.name = s.company_name
AND NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- ============================================
-- 3. TEST USERS
-- ============================================
INSERT INTO users (id, phone, first_name, last_name, created_at, updated_at)
SELECT * FROM (VALUES
    ('b1000000-0000-0000-0000-000000000001'::uuid, '+77771234567', 'Айдар', 'Касымов', NOW() - INTERVAL '30 days', NOW()),
    ('b1000000-0000-0000-0000-000000000002'::uuid, '+77772345678', 'Дана', 'Нурланова', NOW() - INTERVAL '20 days', NOW()),
    ('b1000000-0000-0000-0000-000000000003'::uuid, '+77773456789', 'Тимур', 'Абдуллаев', NOW() - INTERVAL '15 days', NOW()),
    ('b1000000-0000-0000-0000-000000000004'::uuid, '+77774567890', 'Алия', 'Сагинбаева', NOW() - INTERVAL '10 days', NOW()),
    ('b1000000-0000-0000-0000-000000000005'::uuid, '+77775678901', 'Марат', 'Жунусов', NOW() - INTERVAL '5 days', NOW())
) AS v(id, phone, first_name, last_name, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);

-- ============================================
-- 4. ADDRESSES
-- ============================================
INSERT INTO addresses (id, user_id, label, street, apartment, city, is_default, created_at)
SELECT * FROM (VALUES
    -- Айдар's addresses
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000001'::uuid, 'Дом', 'ул. Абая 150', 'кв. 45', 'Алматы', true, NOW()),
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000001'::uuid, 'Офис', 'пр. Достык 5', 'офис 301', 'Алматы', false, NOW()),
    -- Дана's address
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000002'::uuid, 'Дом', 'ул. Толе Би 59', 'кв. 12', 'Алматы', true, NOW()),
    -- Тимур's address
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000003'::uuid, 'Дом', 'мкр. Самал-2, д. 33', 'кв. 78', 'Алматы', true, NOW()),
    -- Алия's addresses
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000004'::uuid, 'Дом', 'ул. Жандосова 94', 'кв. 5', 'Алматы', true, NOW()),
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000004'::uuid, 'Родители', 'ул. Тимирязева 42', 'кв. 110', 'Алматы', false, NOW()),
    -- Марат's address
    (gen_random_uuid(), 'b1000000-0000-0000-0000-000000000005'::uuid, 'Дом', 'пр. Аль-Фараби 21', 'кв. 200', 'Алматы', true, NOW())
) AS v(id, user_id, label, street, apartment, city, is_default, created_at)
WHERE NOT EXISTS (SELECT 1 FROM addresses LIMIT 1);

-- ============================================
-- 5. BOOKINGS
-- ============================================
INSERT INTO bookings (id, user_id, company_id, service_id, address_id, date, time, status, room_count, has_pets, eco_friendly, notes, total_price, created_at, updated_at)
SELECT
    gen_random_uuid(),
    u.id,
    c.id,
    s.id,
    a.id,
    b.date,
    b.time::time,
    b.status,
    b.room_count,
    b.has_pets,
    b.eco_friendly,
    b.notes,
    b.total_price,
    b.created_at,
    b.created_at
FROM (VALUES
    -- Айдар: completed booking with CleanMaster
    ('+77771234567', 'CleanMaster', 'Стандартная уборка', 'Дом', CURRENT_DATE - 14, '10:00', 'COMPLETED', 3, false, false, 'Позвоните за 30 минут до приезда', 10000, NOW() - INTERVAL '14 days'),
    -- Айдар: confirmed upcoming booking
    ('+77771234567', 'EcoCleaning', 'Эко-уборка стандарт', 'Офис', CURRENT_DATE + 3, '14:00', 'CONFIRMED', 2, false, true, NULL, 13000, NOW() - INTERVAL '1 day'),
    -- Дана: completed booking
    ('+77772345678', 'CleanMaster', 'Генеральная уборка', 'Дом', CURRENT_DATE - 7, '09:00', 'COMPLETED', 4, true, false, 'Есть кот, не аллергичный', 29000, NOW() - INTERVAL '10 days'),
    -- Дана: pending booking
    ('+77772345678', 'Блеск и Порядок', 'Химчистка мебели', 'Дом', CURRENT_DATE + 5, '11:00', 'PENDING', 2, true, false, 'Диван и два кресла', 15000, NOW() - INTERVAL '2 hours'),
    -- Тимур: completed booking
    ('+77773456789', 'FastClean', 'Экспресс-уборка', 'Дом', CURRENT_DATE - 3, '16:00', 'COMPLETED', 2, false, false, NULL, 5000, NOW() - INTERVAL '5 days'),
    -- Алия: cancelled booking
    ('+77774567890', 'EcoCleaning', 'Антиаллергенная уборка', 'Дом', CURRENT_DATE - 1, '12:00', 'CANCELLED', 3, false, true, 'Отмена из-за болезни', 17000, NOW() - INTERVAL '4 days'),
    -- Алия: pending booking
    ('+77774567890', 'CleanMaster', 'Уборка после ремонта', 'Родители', CURRENT_DATE + 7, '08:00', 'PENDING', 5, false, false, 'Ремонт в двух комнатах, много пыли', 41000, NOW() - INTERVAL '6 hours'),
    -- Марат: in-progress booking
    ('+77775678901', 'Блеск и Порядок', 'Ежедневная уборка', 'Дом', CURRENT_DATE, '15:00', 'IN_PROGRESS', 2, false, false, NULL, 6000, NOW() - INTERVAL '3 days')
) AS b(phone, company_name, service_name, addr_label, date, time, status, room_count, has_pets, eco_friendly, notes, total_price, created_at)
JOIN users u ON u.phone = b.phone
JOIN companies c ON c.name = b.company_name
JOIN services s ON s.name = b.service_name AND s.company_id = c.id
JOIN addresses a ON a.user_id = u.id AND a.label = b.addr_label
WHERE NOT EXISTS (SELECT 1 FROM bookings LIMIT 1);

-- ============================================
-- 6. REVIEWS (only for completed bookings)
-- ============================================
INSERT INTO reviews (id, user_id, company_id, booking_id, rating, comment, created_at)
SELECT
    gen_random_uuid(),
    bk.user_id,
    bk.company_id,
    bk.id,
    r.rating,
    r.comment,
    bk.created_at + INTERVAL '1 day'
FROM bookings bk
JOIN users u ON u.id = bk.user_id
JOIN companies c ON c.id = bk.company_id
JOIN (VALUES
    ('+77771234567', 'CleanMaster', 5, 'Отличная уборка! Квартира сияет, приехали вовремя. Буду заказывать еще.'),
    ('+77772345678', 'CleanMaster', 5, 'Генеральная уборка на высшем уровне. Вымыли даже за холодильником. Спасибо!'),
    ('+77773456789', 'FastClean', 4, 'Быстро и чисто, но забыли протереть зеркало в ванной. В целом хорошо.')
) AS r(phone, company_name, rating, comment)
ON u.phone = r.phone AND c.name = r.company_name
WHERE bk.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM reviews LIMIT 1);
