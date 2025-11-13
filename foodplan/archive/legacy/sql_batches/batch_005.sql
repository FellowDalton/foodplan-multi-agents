-- Batch 5 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('K-Salat pålægssalat', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Stryhns postej eller røget medister', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Glyngøre tun i olie, tomat eller vand', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Velsmag lakse- eller ørredstykke', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Premieur sild', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Koldrøget laks eller rejer', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Bådsmand varm- eller koldrøget laks', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Premieur varmrøget laks', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Schulstad Det Gode brød', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Schulstad Signaturbrød Gillelejehavn', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Premieur fuldkornspitabrød', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Kohberg fuldkorn burgerboller', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Valsemøllen brødblandinger', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Buko flødeost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Egelykke danske skrabeæg', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla Lactofree økologisk mælk', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Løgismose økologisk skyr', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla ØKO økologisk smør eller Kærgården økologisk smørbar', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheese Makers Treasures skiveost eller skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Karolines Køkken revet mozzarella', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Castello flødeost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Klovborg skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheasy skiveost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheasy yoghurt', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Egelykke piskefløde', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Lykkeliga danske lamme fjordskartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske danske håndsorterede gulerødder', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske stenfri grønne druer', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske grøntsager eller wokblanding', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Dansk spidskål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('K-Salat pålægssalat', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Stryhns postej eller røget medister', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Glyngøre tun i olie, tomat eller vand', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Velsmag lakse- eller ørredstykke', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Premieur sild', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Koldrøget laks eller rejer', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Bådsmand varm- eller koldrøget laks', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Premieur varmrøget laks', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Schulstad Det Gode brød', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Schulstad Signaturbrød Gillelejehavn', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Premieur fuldkornspitabrød', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Kohberg fuldkorn burgerboller', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Valsemøllen brødblandinger', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Buko flødeost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Egelykke danske skrabeæg', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla Lactofree økologisk mælk', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Løgismose økologisk skyr', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla ØKO økologisk smør eller Kærgården økologisk smørbar', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheese Makers Treasures skiveost eller skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Karolines Køkken revet mozzarella', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Castello flødeost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Klovborg skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheasy skiveost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cheasy yoghurt', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Egelykke piskefløde', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Lykkeliga danske lamme fjordskartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske danske håndsorterede gulerødder', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske stenfri grønne druer', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske grøntsager eller wokblanding', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Dansk spidskål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables'))
    )
  ),
  all_products AS (
    SELECT * FROM new_products
    UNION
    SELECT * FROM existing_products
  )
INSERT INTO deals (
  product_id, store_id, original_name, price,
  quantity, price_per_unit, unit_type, is_app_price,
  valid_from, valid_to, scraped_at
)
VALUES
  ((SELECT id FROM all_products WHERE name = 'K-Salat pålægssalat' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'K-Salat pålægssalat', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107128'),
  ((SELECT id FROM all_products WHERE name = 'Stryhns postej eller røget medister' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Stryhns postej eller røget medister', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107135'),
  ((SELECT id FROM all_products WHERE name = 'Glyngøre tun i olie, tomat eller vand' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Glyngøre tun i olie, tomat eller vand', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107142'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag lakse- eller ørredstykke' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag lakse- eller ørredstykke', 59.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107148'),
  ((SELECT id FROM all_products WHERE name = 'Premieur sild' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur sild', 32.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107151'),
  ((SELECT id FROM all_products WHERE name = 'Koldrøget laks eller rejer' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Koldrøget laks eller rejer', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107156'),
  ((SELECT id FROM all_products WHERE name = 'Bådsmand varm- eller koldrøget laks' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Bådsmand varm- eller koldrøget laks', 35.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107161'),
  ((SELECT id FROM all_products WHERE name = 'Premieur varmrøget laks' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur varmrøget laks', 59.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107165'),
  ((SELECT id FROM all_products WHERE name = 'Schulstad Det Gode brød' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Schulstad Det Gode brød', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107170'),
  ((SELECT id FROM all_products WHERE name = 'Schulstad Signaturbrød Gillelejehavn' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Schulstad Signaturbrød Gillelejehavn', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107175'),
  ((SELECT id FROM all_products WHERE name = 'Premieur fuldkornspitabrød' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur fuldkornspitabrød', 22.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107180'),
  ((SELECT id FROM all_products WHERE name = 'Kohberg fuldkorn burgerboller' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Kohberg fuldkorn burgerboller', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107185'),
  ((SELECT id FROM all_products WHERE name = 'Valsemøllen brødblandinger' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Valsemøllen brødblandinger', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107189'),
  ((SELECT id FROM all_products WHERE name = 'Buko flødeost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Buko flødeost', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107195'),
  ((SELECT id FROM all_products WHERE name = 'Egelykke danske skrabeæg' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Egelykke danske skrabeæg', 14.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107200'),
  ((SELECT id FROM all_products WHERE name = 'Arla Lactofree økologisk mælk' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Arla Lactofree økologisk mælk', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107204'),
  ((SELECT id FROM all_products WHERE name = 'Løgismose økologisk skyr' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Løgismose økologisk skyr', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107209'),
  ((SELECT id FROM all_products WHERE name = 'Arla ØKO økologisk smør eller Kærgården økologisk smørbar' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Arla ØKO økologisk smør eller Kærgården økologisk smørbar', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107216'),
  ((SELECT id FROM all_products WHERE name = 'Cheese Makers Treasures skiveost eller skæreost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Cheese Makers Treasures skiveost eller skæreost', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107222'),
  ((SELECT id FROM all_products WHERE name = 'Karolines Køkken revet mozzarella' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Karolines Køkken revet mozzarella', 16.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107229'),
  ((SELECT id FROM all_products WHERE name = 'Castello flødeost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Castello flødeost', 18.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107232'),
  ((SELECT id FROM all_products WHERE name = 'Klovborg skæreost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Klovborg skæreost', 70.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107236'),
  ((SELECT id FROM all_products WHERE name = 'Cheasy skiveost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Cheasy skiveost', 24.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107240'),
  ((SELECT id FROM all_products WHERE name = 'Cheasy yoghurt' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Cheasy yoghurt', 14.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107244'),
  ((SELECT id FROM all_products WHERE name = 'Egelykke piskefløde' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Egelykke piskefløde', 26.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107248'),
  ((SELECT id FROM all_products WHERE name = 'Lykkeliga danske lamme fjordskartofler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Lykkeliga danske lamme fjordskartofler', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107253'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske danske håndsorterede gulerødder' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske danske håndsorterede gulerødder', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107260'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske stenfri grønne druer' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske stenfri grønne druer', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107265'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske grøntsager eller wokblanding' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske grøntsager eller wokblanding', 13.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107271'),
  ((SELECT id FROM all_products WHERE name = 'Dansk spidskål' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Dansk spidskål', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107275')
;