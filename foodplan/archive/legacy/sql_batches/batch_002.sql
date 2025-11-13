-- Batch 2 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Beauvais herregårdsrødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Grøn Balance økologiske grøntsager', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Meyers hummus eller basilikumpesto', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Toms Pingvin stænger, Spunk eller Kæmpe Skildpadde', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Ben & Jerry''s', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Ferrero Collection', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Coca-Cola, Coca-Cola Zero, Tuborg Squash, Fanta eller Schweppes', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Royal Classic eller Pilsner, Faxe Kondi eller Pepsi Max', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Ribena', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Fanø Bryghus Harvester''s Reserve Barrel Aged Barley Wine fadlagret årgang 2025', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Thor Negroamaro Zinfandel', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monkey 47 Schwarzwald Dry Gin, Diplomático Reserva Exclusiva rom eller Glenfiddich Single Malt Scotch Whisky', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Carte d''Or, Frisko is i bæger eller Magnum bonbon', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Banana is', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Grøn Balance toiletpapir eller køkkenruller', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Simply The Best Time of the Year julekalender', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Andebryststeg Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andebryst Dybfrost 160-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andelår Dybfrost 180-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Hel and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Fritgående and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Stort andelår fra fritgående and Dybfrost 200-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andebryststeg fra fritgående and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Friland økologisk dansk hakket grisekød 8-12%, grise- og oksekød 8-12%, koteletter eller julemedister 300-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Frilandsgris XL spareribs', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Frilandsgris mørbrad 500- eller grisekæber 400-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Dansk ovnklar flæskesteg uden ben', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Ekstra svær til flæskestegen', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Danske tykstegsbøffer, kalve osso buco eller kalvesteaks med nordisk inspireret marinade', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Beauvais herregårdsrødkål', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Grøn Balance økologiske grøntsager', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables')),
      ('Meyers hummus eller basilikumpesto', (SELECT id FROM categories_map WHERE name = 'Pasta & International')),
      ('Toms Pingvin stænger, Spunk eller Kæmpe Skildpadde', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Ben & Jerry''s', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Ferrero Collection', (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks')),
      ('Coca-Cola, Coca-Cola Zero, Tuborg Squash, Fanta eller Schweppes', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Royal Classic eller Pilsner, Faxe Kondi eller Pepsi Max', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Ribena', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Fanø Bryghus Harvester''s Reserve Barrel Aged Barley Wine fadlagret årgang 2025', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Thor Negroamaro Zinfandel', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Monkey 47 Schwarzwald Dry Gin, Diplomático Reserva Exclusiva rom eller Glenfiddich Single Malt Scotch Whisky', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Carte d''Or, Frisko is i bæger eller Magnum bonbon', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Banana is', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Grøn Balance toiletpapir eller køkkenruller', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Simply The Best Time of the Year julekalender', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Andebryststeg Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andebryst Dybfrost 160-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andelår Dybfrost 180-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Hel and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Fritgående and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Stort andelår fra fritgående and Dybfrost 200-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Andebryststeg fra fritgående and Dybfrost', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Friland økologisk dansk hakket grisekød 8-12%, grise- og oksekød 8-12%, koteletter eller julemedister 300-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Frilandsgris XL spareribs', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Frilandsgris mørbrad 500- eller grisekæber 400-', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Dansk ovnklar flæskesteg uden ben', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Ekstra svær til flæskestegen', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Danske tykstegsbøffer, kalve osso buco eller kalvesteaks med nordisk inspireret marinade', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry'))
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
  ((SELECT id FROM all_products WHERE name = 'Beauvais herregårdsrødkål' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Beauvais herregårdsrødkål', 15.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106140'),
  ((SELECT id FROM all_products WHERE name = 'Grøn Balance økologiske grøntsager' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Grøn Balance økologiske grøntsager', 13.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106144'),
  ((SELECT id FROM all_products WHERE name = 'Meyers hummus eller basilikumpesto' AND category_id = (SELECT id FROM categories_map WHERE name = 'Pasta & International') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Meyers hummus eller basilikumpesto', 39.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106149'),
  ((SELECT id FROM all_products WHERE name = 'Toms Pingvin stænger, Spunk eller Kæmpe Skildpadde' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Toms Pingvin stænger, Spunk eller Kæmpe Skildpadde', 5.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106156'),
  ((SELECT id FROM all_products WHERE name = 'Ben & Jerry''s' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Ben & Jerry''s', 42.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106159'),
  ((SELECT id FROM all_products WHERE name = 'Ferrero Collection' AND category_id = (SELECT id FROM categories_map WHERE name = 'Sweets & Snacks') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Ferrero Collection', 110.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106163'),
  ((SELECT id FROM all_products WHERE name = 'Coca-Cola, Coca-Cola Zero, Tuborg Squash, Fanta eller Schweppes' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Coca-Cola, Coca-Cola Zero, Tuborg Squash, Fanta eller Schweppes', 9.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106170'),
  ((SELECT id FROM all_products WHERE name = 'Royal Classic eller Pilsner, Faxe Kondi eller Pepsi Max' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Royal Classic eller Pilsner, Faxe Kondi eller Pepsi Max', 72.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106175'),
  ((SELECT id FROM all_products WHERE name = 'Ribena' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Ribena', 28.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106178'),
  ((SELECT id FROM all_products WHERE name = 'Fanø Bryghus Harvester''s Reserve Barrel Aged Barley Wine fadlagret årgang 2025' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Fanø Bryghus Harvester''s Reserve Barrel Aged Barley Wine fadlagret årgang 2025', 99.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106190'),
  ((SELECT id FROM all_products WHERE name = 'Thor Negroamaro Zinfandel' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Thor Negroamaro Zinfandel', 59.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106194'),
  ((SELECT id FROM all_products WHERE name = 'Monkey 47 Schwarzwald Dry Gin, Diplomático Reserva Exclusiva rom eller Glenfiddich Single Malt Scotch Whisky' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Monkey 47 Schwarzwald Dry Gin, Diplomático Reserva Exclusiva rom eller Glenfiddich Single Malt Scotch Whisky', 279.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106206'),
  ((SELECT id FROM all_products WHERE name = 'Carte d''Or, Frisko is i bæger eller Magnum bonbon' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Carte d''Or, Frisko is i bæger eller Magnum bonbon', 38.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106212'),
  ((SELECT id FROM all_products WHERE name = 'Banana is' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Banana is', 49.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106215'),
  ((SELECT id FROM all_products WHERE name = 'Grøn Balance toiletpapir eller køkkenruller' AND category_id = (SELECT id FROM categories_map WHERE name = 'Special Offers') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Grøn Balance toiletpapir eller køkkenruller', 22.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106221'),
  ((SELECT id FROM all_products WHERE name = 'Simply The Best Time of the Year julekalender' AND category_id = (SELECT id FROM categories_map WHERE name = 'Special Offers') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Simply The Best Time of the Year julekalender', 350.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106226'),
  ((SELECT id FROM all_products WHERE name = 'Andebryststeg Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Andebryststeg Dybfrost 600 g', 39.0, '600 g', 65.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106477'),
  ((SELECT id FROM all_products WHERE name = 'Andebryst Dybfrost 160-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Andebryst Dybfrost 160-200 g', 15.0, '200 g', 75.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106484'),
  ((SELECT id FROM all_products WHERE name = 'Andelår Dybfrost 180-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Andelår Dybfrost 180-220 g', 12.0, '220 g', 54.54545454545455, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106489'),
  ((SELECT id FROM all_products WHERE name = 'Hel and Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Hel and Dybfrost', 110.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106493'),
  ((SELECT id FROM all_products WHERE name = 'Hel and Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Hel and Dybfrost', 59.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106496'),
  ((SELECT id FROM all_products WHERE name = 'Fritgående and Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Fritgående and Dybfrost', 149.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106501'),
  ((SELECT id FROM all_products WHERE name = 'Stort andelår fra fritgående and Dybfrost 200-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Stort andelår fra fritgående and Dybfrost 200-250 g', 25.0, '250 g', 100.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106507'),
  ((SELECT id FROM all_products WHERE name = 'Andebryststeg fra fritgående and Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Andebryststeg fra fritgående and Dybfrost 700 g', 69.0, '700 g', 98.57142857142857, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106513'),
  ((SELECT id FROM all_products WHERE name = 'Friland økologisk dansk hakket grisekød 8-12%, grise- og oksekød 8-12%, koteletter eller julemedister 300-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Friland økologisk dansk hakket grisekød 8-12%, grise- og oksekød 8-12%, koteletter eller julemedister 300-350 g', 39.0, '350 g', 111.42857142857143, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106522'),
  ((SELECT id FROM all_products WHERE name = 'Frilandsgris XL spareribs' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Frilandsgris XL spareribs 1000 g', 89.0, '1000 g', 89.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106526'),
  ((SELECT id FROM all_products WHERE name = 'Frilandsgris mørbrad 500- eller grisekæber 400-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Frilandsgris mørbrad 500-700 g eller grisekæber 400-450 g', 59.0, '700 g', 84.28571428571429, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106532'),
  ((SELECT id FROM all_products WHERE name = 'Dansk ovnklar flæskesteg uden ben' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Dansk ovnklar flæskesteg uden ben', 19.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106537'),
  ((SELECT id FROM all_products WHERE name = 'Ekstra svær til flæskestegen' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Ekstra svær til flæskestegen 400 g', 25.0, '400 g', 62.5, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106541'),
  ((SELECT id FROM all_products WHERE name = 'Danske tykstegsbøffer, kalve osso buco eller kalvesteaks med nordisk inspireret marinade' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Danske tykstegsbøffer, kalve osso buco eller kalvesteaks med nordisk inspireret marinade', 69.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106549')
;