-- Batch 7 of 7 (29 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Naturli'' smørbar', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('SPIR økologisk spread', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('Galle & Jessen pålægschokolade', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Haribo slikpose', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Fazer mint eller dumle bar', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Karen Volf glutenfri eller økologiske brunkager eller pebernødder', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Løgismose økologiske julekager', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Pringles chips', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('KiMs Meny chips eller franske kartofler', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('LU Tuc original saltkiks 2-pak', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Galbusera knækbrød eller kiks', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Sigdal glutenfri knækbrød', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Barebells bar', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Karat, Peter Larsen Kaffe eller Merrild formalet kaffe', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('ØGO økologiske hele kaffebønner', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Pickwick tebreve', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Faxe Kondi eller Pepsi Max sodavand', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Blue Keld', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monster Energy', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monster Energy eller Coca-Cola sodavand', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Innocent juice eller smoothie', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Semper smoothie', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Jensens æbleskiver med kakaocreme', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Gelato isbæger', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Perfect Season økologisk crispy falafel', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Naturli'' sandwich', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Naturli'' middagskomponenter eller pizza', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Naturli økologisk a''la bresaola eller grillet trylle''kylle', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Premieur confit de canard', (SELECT id FROM categories_map WHERE name = 'Special Offers'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Naturli'' smørbar', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('SPIR økologisk spread', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('Galle & Jessen pålægschokolade', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Haribo slikpose', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Fazer mint eller dumle bar', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Karen Volf glutenfri eller økologiske brunkager eller pebernødder', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Løgismose økologiske julekager', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Pringles chips', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('KiMs Meny chips eller franske kartofler', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('LU Tuc original saltkiks 2-pak', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Galbusera knækbrød eller kiks', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Sigdal glutenfri knækbrød', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Barebells bar', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Karat, Peter Larsen Kaffe eller Merrild formalet kaffe', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('ØGO økologiske hele kaffebønner', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Pickwick tebreve', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Faxe Kondi eller Pepsi Max sodavand', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Blue Keld', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monster Energy', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monster Energy eller Coca-Cola sodavand', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Innocent juice eller smoothie', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Semper smoothie', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Jensens æbleskiver med kakaocreme', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Gelato isbæger', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Perfect Season økologisk crispy falafel', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Naturli'' sandwich', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Naturli'' middagskomponenter eller pizza', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Naturli økologisk a''la bresaola eller grillet trylle''kylle', (SELECT id FROM categories_map WHERE name = 'Plant-Based')),
      ('Premieur confit de canard', (SELECT id FROM categories_map WHERE name = 'Special Offers'))
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
  ((SELECT id FROM all_products WHERE name = 'Naturli'' smørbar' AND category_id = (SELECT id FROM categories_map WHERE name = 'Spreads & Butter') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Naturli'' smørbar', 9.47, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107414'),
  ((SELECT id FROM all_products WHERE name = 'SPIR økologisk spread' AND category_id = (SELECT id FROM categories_map WHERE name = 'Spreads & Butter') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'SPIR økologisk spread', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107437'),
  ((SELECT id FROM all_products WHERE name = 'Galle & Jessen pålægschokolade' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Galle & Jessen pålægschokolade', 29.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107452'),
  ((SELECT id FROM all_products WHERE name = 'Haribo slikpose' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Haribo slikpose', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107458'),
  ((SELECT id FROM all_products WHERE name = 'Fazer mint eller dumle bar' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Fazer mint eller dumle bar', 8.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107464'),
  ((SELECT id FROM all_products WHERE name = 'Karen Volf glutenfri eller økologiske brunkager eller pebernødder' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Karen Volf glutenfri eller økologiske brunkager eller pebernødder', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107473'),
  ((SELECT id FROM all_products WHERE name = 'Løgismose økologiske julekager' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Løgismose økologiske julekager', 29.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107477'),
  ((SELECT id FROM all_products WHERE name = 'Pringles chips' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Pringles chips', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107481'),
  ((SELECT id FROM all_products WHERE name = 'KiMs Meny chips eller franske kartofler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'KiMs Meny chips eller franske kartofler', 11.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107486'),
  ((SELECT id FROM all_products WHERE name = 'LU Tuc original saltkiks 2-pak' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'LU Tuc original saltkiks 2-pak', 9.62, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107491'),
  ((SELECT id FROM all_products WHERE name = 'Galbusera knækbrød eller kiks' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Galbusera knækbrød eller kiks', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107496'),
  ((SELECT id FROM all_products WHERE name = 'Sigdal glutenfri knækbrød' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Sigdal glutenfri knækbrød', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107500'),
  ((SELECT id FROM all_products WHERE name = 'Barebells bar' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Barebells bar', 17.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107503'),
  ((SELECT id FROM all_products WHERE name = 'Karat, Peter Larsen Kaffe eller Merrild formalet kaffe' AND category_id = (SELECT id FROM categories_map WHERE name = 'Coffee & Tea') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Karat, Peter Larsen Kaffe eller Merrild formalet kaffe', 45.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107510'),
  ((SELECT id FROM all_products WHERE name = 'ØGO økologiske hele kaffebønner' AND category_id = (SELECT id FROM categories_map WHERE name = 'Coffee & Tea') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ØGO økologiske hele kaffebønner', 49.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107514'),
  ((SELECT id FROM all_products WHERE name = 'Pickwick tebreve' AND category_id = (SELECT id FROM categories_map WHERE name = 'Coffee & Tea') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Pickwick tebreve', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107518'),
  ((SELECT id FROM all_products WHERE name = 'Faxe Kondi eller Pepsi Max sodavand' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Faxe Kondi eller Pepsi Max sodavand', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107523'),
  ((SELECT id FROM all_products WHERE name = 'Blue Keld' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Blue Keld', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107526'),
  ((SELECT id FROM all_products WHERE name = 'Monster Energy' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Monster Energy', 14.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107529'),
  ((SELECT id FROM all_products WHERE name = 'Monster Energy eller Coca-Cola sodavand' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Monster Energy eller Coca-Cola sodavand', 72.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107533'),
  ((SELECT id FROM all_products WHERE name = 'Innocent juice eller smoothie' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Innocent juice eller smoothie', 24.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107537'),
  ((SELECT id FROM all_products WHERE name = 'Semper smoothie' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Semper smoothie', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107541'),
  ((SELECT id FROM all_products WHERE name = 'Jensens æbleskiver med kakaocreme' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Jensens æbleskiver med kakaocreme', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107546'),
  ((SELECT id FROM all_products WHERE name = 'Gelato isbæger' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Gelato isbæger', 30.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107549'),
  ((SELECT id FROM all_products WHERE name = 'Perfect Season økologisk crispy falafel' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Perfect Season økologisk crispy falafel', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107554'),
  ((SELECT id FROM all_products WHERE name = 'Naturli'' sandwich' AND category_id = (SELECT id FROM categories_map WHERE name = 'Plant-Based') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Naturli'' sandwich', 18.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107558'),
  ((SELECT id FROM all_products WHERE name = 'Naturli'' middagskomponenter eller pizza' AND category_id = (SELECT id FROM categories_map WHERE name = 'Plant-Based') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Naturli'' middagskomponenter eller pizza', 29.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107562'),
  ((SELECT id FROM all_products WHERE name = 'Naturli økologisk a''la bresaola eller grillet trylle''kylle' AND category_id = (SELECT id FROM categories_map WHERE name = 'Plant-Based') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Naturli økologisk a''la bresaola eller grillet trylle''kylle', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107572'),
  ((SELECT id FROM all_products WHERE name = 'Premieur confit de canard' AND category_id = (SELECT id FROM categories_map WHERE name = 'Special Offers') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur confit de canard', 99.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107576')
;