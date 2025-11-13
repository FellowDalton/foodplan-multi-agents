-- Batch 6 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Formodnede avocadoer', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske danske æbler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Medjool dadler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Kaki', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Harvest Best kartofler på glas', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Dansk rødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Beauvais Herregårdsrødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Peka kartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('La Campagna fettuccine', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('La Campagna klassisk hummus', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('ØGO økologisk fusilli pasta', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Andoni italiensk pizza', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Nongshim instant nudler', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Paradiso asparges', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('SPIR glutenfri rød linsepasta', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Premieur udenlandske specialiteter', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Maison Georges suppe', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Graasten mayonnaise i tube', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Chestfords karry/mango dressing', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske hakkede tomater', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske bønner eller kikærter', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske havregryn', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk ekstra jomfru olivenolie', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk pizzadej', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk grødris', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Samsø økologiske survarer', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Sunsweet svesker', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Mamone frø eller kerner', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Jensens sauce', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Naturli'' økologisk smørbar eller smørbar blok', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Formodnede avocadoer', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('ØGO økologiske danske æbler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Medjool dadler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Kaki', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Harvest Best kartofler på glas', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Dansk rødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Beauvais Herregårdsrødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Peka kartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('La Campagna fettuccine', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('La Campagna klassisk hummus', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('ØGO økologisk fusilli pasta', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Andoni italiensk pizza', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Nongshim instant nudler', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Paradiso asparges', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('SPIR glutenfri rød linsepasta', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Premieur udenlandske specialiteter', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Maison Georges suppe', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Graasten mayonnaise i tube', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Chestfords karry/mango dressing', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske hakkede tomater', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske bønner eller kikærter', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologiske havregryn', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk ekstra jomfru olivenolie', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk pizzadej', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('ØGO økologisk grødris', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Samsø økologiske survarer', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Sunsweet svesker', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Mamone frø eller kerner', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Jensens sauce', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Naturli'' økologisk smørbar eller smørbar blok', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter'))
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
  ((SELECT id FROM all_products WHERE name = 'Formodnede avocadoer' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Formodnede avocadoer', 22.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107279'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske danske æbler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske danske æbler', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107284'),
  ((SELECT id FROM all_products WHERE name = 'Medjool dadler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Medjool dadler', 49.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107287'),
  ((SELECT id FROM all_products WHERE name = 'Kaki' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Kaki', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107290'),
  ((SELECT id FROM all_products WHERE name = 'Harvest Best kartofler på glas' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Harvest Best kartofler på glas', 7.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107295'),
  ((SELECT id FROM all_products WHERE name = 'Dansk rødkål' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Dansk rødkål', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107299'),
  ((SELECT id FROM all_products WHERE name = 'Beauvais Herregårdsrødkål' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Beauvais Herregårdsrødkål', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107303'),
  ((SELECT id FROM all_products WHERE name = 'Peka kartofler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Peka kartofler', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107307'),
  ((SELECT id FROM all_products WHERE name = 'La Campagna fettuccine' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'La Campagna fettuccine', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107312'),
  ((SELECT id FROM all_products WHERE name = 'La Campagna klassisk hummus' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'La Campagna klassisk hummus', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107316'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologisk fusilli pasta' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologisk fusilli pasta', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107321'),
  ((SELECT id FROM all_products WHERE name = 'Andoni italiensk pizza' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Andoni italiensk pizza', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107325'),
  ((SELECT id FROM all_products WHERE name = 'Nongshim instant nudler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Nongshim instant nudler', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107329'),
  ((SELECT id FROM all_products WHERE name = 'Paradiso asparges' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Paradiso asparges', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107333'),
  ((SELECT id FROM all_products WHERE name = 'SPIR glutenfri rød linsepasta' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'SPIR glutenfri rød linsepasta', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107338'),
  ((SELECT id FROM all_products WHERE name = 'Premieur udenlandske specialiteter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur udenlandske specialiteter', 25.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107343'),
  ((SELECT id FROM all_products WHERE name = 'Maison Georges suppe' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Maison Georges suppe', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107347'),
  ((SELECT id FROM all_products WHERE name = 'Graasten mayonnaise i tube' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Graasten mayonnaise i tube', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107352'),
  ((SELECT id FROM all_products WHERE name = 'Chestfords karry/mango dressing' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Chestfords karry/mango dressing', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107356'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske hakkede tomater' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske hakkede tomater', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107361'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske bønner eller kikærter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske bønner eller kikærter', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107367'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske havregryn' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske havregryn', 11.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107371'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologisk ekstra jomfru olivenolie' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologisk ekstra jomfru olivenolie', 49.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107378'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologisk pizzadej' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologisk pizzadej', 9.75, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107383'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologisk grødris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologisk grødris', 15.36, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107387'),
  ((SELECT id FROM all_products WHERE name = 'Samsø økologiske survarer' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Samsø økologiske survarer', 16.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107392'),
  ((SELECT id FROM all_products WHERE name = 'Sunsweet svesker' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Sunsweet svesker', 39.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107396'),
  ((SELECT id FROM all_products WHERE name = 'Mamone frø eller kerner' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Mamone frø eller kerner', 11.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107400'),
  ((SELECT id FROM all_products WHERE name = 'Jensens sauce' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Jensens sauce', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107404'),
  ((SELECT id FROM all_products WHERE name = 'Naturli'' økologisk smørbar eller smørbar blok' AND category_id = (SELECT id FROM categories_map WHERE name = 'Spreads & Butter') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Naturli'' økologisk smørbar eller smørbar blok', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107410')
;