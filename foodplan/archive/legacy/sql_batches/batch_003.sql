-- Batch 3 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Steff Houlberg bacon i skiver eller brunchpølser 300-', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Langelænder grillpølser, wienerpølser eller hotdogpølser 330-', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Hatting surdejsboller Dybfrost', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Schulstad Levebrød eller Kornkammeret økologisk solsikkerugbrød 470-', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Friskbagte rundstykker fra håndværksbageren', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Karolines Køkken piskefløde ½ liter', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cremefine til madlavning eller piskning 7%, 15% eller 19%', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Økologisk yoghurt Naturel, pære & banan, jordbær eller vanilje iter', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Castello aged Havarti, Gouda, Riberhus skiveost 45+ med eller uden kommen 200-', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Skrabeæg Str. M/L .', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Kærgården Original eller let', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Økologiske æbler Kl. I, udenlandske', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Danske aspargeskartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Økologiske gulerødder Danske', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Danske løg', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Klassisk kirsebærsauce eller REMA 1000 rødkål 530-', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Fond eller REMA 1000 saucer 300-/', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('REMA 1000 svesker uden sten', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('REMA 1000 kartofler i glas /drænet', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Vendelbo kirsebærsauce', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Matilde original iter', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Galle & Jessen pålægschokolade eller Nutella 216-', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('Karolines Køkken risalamande', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Taffel chips eller snacks 110-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Odense marcipan eller Spangsberg overtrækschokolade 225-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Nørregade eller Spangsberg juleslik 100-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Nøddemix, valnødder, hasselnødder eller mandler 200-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Trope nødder eller snacks 150-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Grå Peter Larsen eller Karat kaffe', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Nescafé gold', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Steff Houlberg bacon i skiver eller brunchpølser 300-', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Langelænder grillpølser, wienerpølser eller hotdogpølser 330-', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Hatting surdejsboller Dybfrost', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Schulstad Levebrød eller Kornkammeret økologisk solsikkerugbrød 470-', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Friskbagte rundstykker fra håndværksbageren', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Karolines Køkken piskefløde ½ liter', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Cremefine til madlavning eller piskning 7%, 15% eller 19%', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Økologisk yoghurt Naturel, pære & banan, jordbær eller vanilje iter', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Castello aged Havarti, Gouda, Riberhus skiveost 45+ med eller uden kommen 200-', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Skrabeæg Str. M/L .', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Kærgården Original eller let', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Økologiske æbler Kl. I, udenlandske', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Danske aspargeskartofler', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Økologiske gulerødder Danske', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Danske løg', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Klassisk kirsebærsauce eller REMA 1000 rødkål 530-', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Fond eller REMA 1000 saucer 300-/', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('REMA 1000 svesker uden sten', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('REMA 1000 kartofler i glas /drænet', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Vendelbo kirsebærsauce', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Matilde original iter', (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments')),
      ('Galle & Jessen pålægschokolade eller Nutella 216-', (SELECT id FROM categories_map WHERE name = 'Spreads & Butter')),
      ('Karolines Køkken risalamande', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Taffel chips eller snacks 110-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Odense marcipan eller Spangsberg overtrækschokolade 225-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Nørregade eller Spangsberg juleslik 100-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Nøddemix, valnødder, hasselnødder eller mandler 200-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Trope nødder eller snacks 150-', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Grå Peter Larsen eller Karat kaffe', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea')),
      ('Nescafé gold', (SELECT id FROM categories_map WHERE name = 'Coffee & Tea'))
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
  ((SELECT id FROM all_products WHERE name = 'Steff Houlberg bacon i skiver eller brunchpølser 300-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Steff Houlberg bacon i skiver eller brunchpølser 300-350 g', 22.0, '350 g', 62.85714285714286, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106555'),
  ((SELECT id FROM all_products WHERE name = 'Langelænder grillpølser, wienerpølser eller hotdogpølser 330-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Langelænder grillpølser, wienerpølser eller hotdogpølser 330-350 g', 20.0, '350 g', 57.142857142857146, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106560'),
  ((SELECT id FROM all_products WHERE name = 'Hatting surdejsboller Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Hatting surdejsboller Dybfrost 400 g', 20.0, '400 g', 50.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106566'),
  ((SELECT id FROM all_products WHERE name = 'Schulstad Levebrød eller Kornkammeret økologisk solsikkerugbrød 470-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Schulstad Levebrød eller Kornkammeret økologisk solsikkerugbrød 470-1080 g', 12.0, '1080 g', 11.11111111111111, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106572'),
  ((SELECT id FROM all_products WHERE name = 'Friskbagte rundstykker fra håndværksbageren' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Friskbagte rundstykker fra håndværksbageren', 3.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106578'),
  ((SELECT id FROM all_products WHERE name = 'Karolines Køkken piskefløde ½ liter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Karolines Køkken piskefløde ½ liter', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106584'),
  ((SELECT id FROM all_products WHERE name = 'Cremefine til madlavning eller piskning 7%, 15% eller 19%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Cremefine til madlavning eller piskning 7%, 15% eller 19% 250 ml', 9.0, '250 ml', 36.0, 'liter', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106592'),
  ((SELECT id FROM all_products WHERE name = 'Økologisk yoghurt Naturel, pære & banan, jordbær eller vanilje iter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Økologisk yoghurt Naturel, pære & banan, jordbær eller vanilje 1 liter', 15.0, '1 l', 15.0, 'liter', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106597'),
  ((SELECT id FROM all_products WHERE name = 'Castello aged Havarti, Gouda, Riberhus skiveost 45+ med eller uden kommen 200-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Castello aged Havarti, Gouda, Riberhus skiveost 45+ med eller uden kommen 200-240 g', 25.0, '240 g', 104.16666666666667, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106604'),
  ((SELECT id FROM all_products WHERE name = 'Skrabeæg Str. M/L .' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Skrabeæg Str. M/L 10 stk.', 18.0, '10 stk', 1.8, 'piece', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106609'),
  ((SELECT id FROM all_products WHERE name = 'Kærgården Original eller let' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Kærgården Original eller let 200 g', 15.0, '200 g', 75.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106612'),
  ((SELECT id FROM all_products WHERE name = 'Økologiske æbler Kl. I, udenlandske' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Økologiske æbler Kl. I, udenlandske', 15.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106618'),
  ((SELECT id FROM all_products WHERE name = 'Danske aspargeskartofler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Danske aspargeskartofler 650 g', 10.0, '650 g', 15.384615384615385, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106621'),
  ((SELECT id FROM all_products WHERE name = 'Økologiske gulerødder Danske' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Økologiske gulerødder Danske 1 kg', 8.0, '1 kg', 8.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106624'),
  ((SELECT id FROM all_products WHERE name = 'Danske løg' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Danske løg 1 kg', 6.0, '1 kg', 6.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106626'),
  ((SELECT id FROM all_products WHERE name = 'Klassisk kirsebærsauce eller REMA 1000 rødkål 530-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Klassisk kirsebærsauce eller REMA 1000 rødkål 530-950 g', 18.0, '950 g', 18.94736842105263, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106636'),
  ((SELECT id FROM all_products WHERE name = 'Fond eller REMA 1000 saucer 300-/' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Fond eller REMA 1000 saucer 300-410 g/ 180 ml', 15.0, '410 g', 36.58536585365854, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106645'),
  ((SELECT id FROM all_products WHERE name = 'REMA 1000 svesker uden sten' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'REMA 1000 svesker uden sten 200 g', 10.0, '200 g', 50.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106651'),
  ((SELECT id FROM all_products WHERE name = 'REMA 1000 kartofler i glas /drænet' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'REMA 1000 kartofler i glas 425 g/drænet', 9.0, '425 g', 21.176470588235293, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106658'),
  ((SELECT id FROM all_products WHERE name = 'Vendelbo kirsebærsauce' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Vendelbo kirsebærsauce 500 g', 12.0, '500 g', 24.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106662'),
  ((SELECT id FROM all_products WHERE name = 'Matilde original iter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pantry & Condiments') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Matilde original 1 liter', 10.0, '1 l', 10.0, 'liter', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106665'),
  ((SELECT id FROM all_products WHERE name = 'Galle & Jessen pålægschokolade eller Nutella 216-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Spreads & Butter') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Galle & Jessen pålægschokolade eller Nutella 216-350 g', 35.0, '350 g', 100.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106671'),
  ((SELECT id FROM all_products WHERE name = 'Karolines Køkken risalamande' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Karolines Køkken risalamande 450 g', 12.0, '450 g', 26.666666666666668, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106675'),
  ((SELECT id FROM all_products WHERE name = 'Taffel chips eller snacks 110-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Taffel chips eller snacks 110-175 g', 10.0, '175 g', 57.142857142857146, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106679'),
  ((SELECT id FROM all_products WHERE name = 'Odense marcipan eller Spangsberg overtrækschokolade 225-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Odense marcipan eller Spangsberg overtrækschokolade 225-250 g', 35.0, '250 g', 140.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106685'),
  ((SELECT id FROM all_products WHERE name = 'Nørregade eller Spangsberg juleslik 100-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Nørregade eller Spangsberg juleslik 100-130 g', 20.0, '130 g', 153.84615384615384, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106689'),
  ((SELECT id FROM all_products WHERE name = 'Nøddemix, valnødder, hasselnødder eller mandler 200-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Nøddemix, valnødder, hasselnødder eller mandler 200-400 g', 29.0, '400 g', 72.5, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106695'),
  ((SELECT id FROM all_products WHERE name = 'Trope nødder eller snacks 150-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Trope nødder eller snacks 150-425 g', 20.0, '425 g', 47.05882352941177, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106699'),
  ((SELECT id FROM all_products WHERE name = 'Grå Peter Larsen eller Karat kaffe' AND category_id = (SELECT id FROM categories_map WHERE name = 'Coffee & Tea') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Grå Peter Larsen eller Karat kaffe 400 g', 39.0, '400 g', 97.5, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106703'),
  ((SELECT id FROM all_products WHERE name = 'Nescafé gold' AND category_id = (SELECT id FROM categories_map WHERE name = 'Coffee & Tea') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Nescafé gold 210 g', 69.0, '210 g', 328.57142857142856, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106706')
;