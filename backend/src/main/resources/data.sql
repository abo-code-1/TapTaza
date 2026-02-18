-- Tap-Taza Cleaning App - Initial Seed Data
-- Data is in Russian for Kazakhstan market
-- Only insert if tables are empty

-- Insert sample cleaning companies
INSERT INTO companies (id, name, description, rating, review_count, price_range, verified, created_at, updated_at)
SELECT * FROM (VALUES
    (gen_random_uuid(), 'Чистый Дом', 'Профессиональная уборка квартир и домов в Алматы. Работаем с 2015 года.', 4.8, 156, '₸₸', true, NOW(), NOW()),
    (gen_random_uuid(), 'Блеск и Уют', 'Клининговая компания с опытом более 10 лет. Генеральная и ежедневная уборка.', 4.6, 89, '₸₸', true, NOW(), NOW()),
    (gen_random_uuid(), 'ЭкоКлин KZ', 'Экологичная уборка с использованием безопасных средств. Заботимся о вашем здоровье.', 4.9, 234, '₸₸₸', true, NOW(), NOW()),
    (gen_random_uuid(), 'Мастер Чистоты', 'Быстрая и качественная уборка офисов и коммерческих помещений.', 4.5, 67, '₸', true, NOW(), NOW())
) AS v(id, name, description, rating, review_count, price_range, verified, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM companies LIMIT 1);

-- Insert services for each company (using subqueries to get company IDs)
INSERT INTO services (id, company_id, name, description, price, duration_minutes)
SELECT gen_random_uuid(), c.id, s.name, s.description, s.price, s.duration_minutes
FROM companies c
CROSS JOIN (VALUES
    ('Чистый Дом', 'Стандартная уборка', 'Влажная уборка полов, протирка пыли, уборка кухни и санузла', 8000, 120),
    ('Чистый Дом', 'Генеральная уборка', 'Полная уборка квартиры включая мытье окон, чистку мебели и техники', 25000, 300),
    ('Чистый Дом', 'Уборка после ремонта', 'Удаление строительной пыли, мытье всех поверхностей', 35000, 480),
    ('Блеск и Уют', 'Ежедневная уборка', 'Поддерживающая уборка квартиры: полы, пыль, кухня', 6000, 90),
    ('Блеск и Уют', 'Химчистка мебели', 'Профессиональная химчистка диванов, кресел и матрасов', 15000, 180),
    ('Блеск и Уют', 'Мытье окон', 'Мытье окон с двух сторон, включая рамы и подоконники', 5000, 60),
    ('ЭкоКлин KZ', 'Эко-уборка стандарт', 'Уборка с использованием только экологичных средств', 10000, 120),
    ('ЭкоКлин KZ', 'Антиаллергенная уборка', 'Специальная уборка для аллергиков с гипоаллергенными средствами', 12000, 150),
    ('ЭкоКлин KZ', 'Уборка детской комнаты', 'Безопасная уборка с дезинфекцией игрушек и поверхностей', 8000, 90),
    ('Мастер Чистоты', 'Уборка офиса', 'Ежедневная уборка офисных помещений до 100 кв.м', 15000, 120),
    ('Мастер Чистоты', 'Уборка торговых площадей', 'Профессиональная уборка магазинов и торговых центров', 25000, 180)
) AS s(company_name, name, description, price, duration_minutes)
WHERE c.name = s.company_name
AND NOT EXISTS (SELECT 1 FROM services LIMIT 1);
