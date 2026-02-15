-- Tap-Taza Cleaning App - Initial Seed Data
-- Data is in Russian for Kazakhstan market

-- Insert sample cleaning companies
INSERT INTO companies (id, name, description, phone, email, address, rating, is_verified, created_at, updated_at) VALUES
(1, 'Чистый Дом', 'Профессиональная уборка квартир и домов в Алматы. Работаем с 2015 года.', '+7 (777) 123-45-67', 'info@chistydom.kz', 'г. Алматы, ул. Абая 150', 4.8, true, NOW(), NOW()),
(2, 'Блеск и Уют', 'Клининговая компания с опытом более 10 лет. Генеральная и ежедневная уборка.', '+7 (701) 234-56-78', 'contact@bleskiuyt.kz', 'г. Алматы, пр. Достык 89', 4.6, true, NOW(), NOW()),
(3, 'ЭкоКлин KZ', 'Экологичная уборка с использованием безопасных средств. Заботимся о вашем здоровье.', '+7 (702) 345-67-89', 'hello@ecoklin.kz', 'г. Алматы, ул. Жандосова 58', 4.9, true, NOW(), NOW()),
(4, 'Мастер Чистоты', 'Быстрая и качественная уборка офисов и коммерческих помещений.', '+7 (778) 456-78-90', 'order@masterclean.kz', 'г. Алматы, ул. Тимирязева 42', 4.5, true, NOW(), NOW());

-- Insert services for each company
-- Services for "Чистый Дом"
INSERT INTO services (id, company_id, name, description, price, duration_minutes, created_at, updated_at) VALUES
(1, 1, 'Стандартная уборка', 'Влажная уборка полов, протирка пыли, уборка кухни и санузла', 8000, 120, NOW(), NOW()),
(2, 1, 'Генеральная уборка', 'Полная уборка квартиры включая мытье окон, чистку мебели и техники', 25000, 300, NOW(), NOW()),
(3, 1, 'Уборка после ремонта', 'Удаление строительной пыли, мытье всех поверхностей, вывоз мусора', 35000, 480, NOW(), NOW());

-- Services for "Блеск и Уют"
INSERT INTO services (id, company_id, name, description, price, duration_minutes, created_at, updated_at) VALUES
(4, 2, 'Ежедневная уборка', 'Поддерживающая уборка квартиры: полы, пыль, кухня', 6000, 90, NOW(), NOW()),
(5, 2, 'Химчистка мебели', 'Профессиональная химчистка диванов, кресел и матрасов', 15000, 180, NOW(), NOW()),
(6, 2, 'Мытье окон', 'Мытье окон с двух сторон, включая рамы и подоконники', 5000, 60, NOW(), NOW());

-- Services for "ЭкоКлин KZ"
INSERT INTO services (id, company_id, name, description, price, duration_minutes, created_at, updated_at) VALUES
(7, 3, 'Эко-уборка стандарт', 'Уборка с использованием только экологичных средств', 10000, 120, NOW(), NOW()),
(8, 3, 'Антиаллергенная уборка', 'Специальная уборка для аллергиков с гипоаллергенными средствами', 12000, 150, NOW(), NOW()),
(9, 3, 'Уборка детской комнаты', 'Безопасная уборка с дезинфекцией игрушек и поверхностей', 8000, 90, NOW(), NOW());

-- Services for "Мастер Чистоты"
INSERT INTO services (id, company_id, name, description, price, duration_minutes, created_at, updated_at) VALUES
(10, 4, 'Уборка офиса', 'Ежедневная уборка офисных помещений до 100 кв.м', 15000, 120, NOW(), NOW()),
(11, 4, 'Уборка торговых площадей', 'Профессиональная уборка магазинов и торговых центров', 25000, 180, NOW(), NOW());

-- Reset sequences
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
