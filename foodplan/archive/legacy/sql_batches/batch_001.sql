-- Batch 1 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Culotte af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('julemedister af dansk gris, hakket dansk grisekød 8-12% eller 1, Rose Holger dansk kylling', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Gestus dansk kyllingebrystfilet eller kyllingeinderfilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Flæsk i skiver eller koteletter af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Ribbenssteg af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Stegeben af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Tykstegsmedaljoner af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Mørbrad af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Fritgående berberiand', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Canard Martín berberi andelår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Canard Martín berberi andebryst', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Julius andebryststeg', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard entrecote', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard T-bone', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard steaks af okseinderlår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard gullasch af okseinderlår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Skaftkoteletter af dansk frilandsgris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('OMHU culotte af frilandslammekød', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Oksegrydesteg uden ben af bov eller tykkam', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Sydeuropæisk charcuteri', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Antipasti', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Laksefilet med skind', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Gestus pizzabunde', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Buko økologisk flødeost eller Karolines Køkken økologisk hytteost eller mozzarella', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Yoggi yoghurt', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Them skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Grøn Balance Øllingegaard økologisk yoghurt med top', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Øllingegaard økologisk vinter koldskål', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla Unika Umage Lille Knas ost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('OMHU klementiner', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Culotte af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('julemedister af dansk gris, hakket dansk grisekød 8-12% eller 1, Rose Holger dansk kylling', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Gestus dansk kyllingebrystfilet eller kyllingeinderfilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Flæsk i skiver eller koteletter af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Ribbenssteg af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Stegeben af dansk gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Tykstegsmedaljoner af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Mørbrad af dansk kalv', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Fritgående berberiand', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Canard Martín berberi andelår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Canard Martín berberi andebryst', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Julius andebryststeg', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard entrecote', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard T-bone', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard steaks af okseinderlår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Freygaard gullasch af okseinderlår', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Skaftkoteletter af dansk frilandsgris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('OMHU culotte af frilandslammekød', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Oksegrydesteg uden ben af bov eller tykkam', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Sydeuropæisk charcuteri', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Antipasti', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Laksefilet med skind', (SELECT id FROM categories_map WHERE name = 'Seafood')),
      ('Gestus pizzabunde', (SELECT id FROM categories_map WHERE name = 'Bread & Bakery')),
      ('Buko økologisk flødeost eller Karolines Køkken økologisk hytteost eller mozzarella', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Yoggi yoghurt', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Them skæreost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Grøn Balance Øllingegaard økologisk yoghurt med top', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Øllingegaard økologisk vinter koldskål', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('Arla Unika Umage Lille Knas ost', (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs')),
      ('OMHU klementiner', (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables'))
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
  ((SELECT id FROM all_products WHERE name = 'Culotte af dansk kalv' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Culotte af dansk kalv', 79.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.105992'),
  ((SELECT id FROM all_products WHERE name = 'julemedister af dansk gris, hakket dansk grisekød 8-12% eller 1, Rose Holger dansk kylling' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), '1 kg julemedister af dansk gris, 1 kg hakket dansk grisekød 8-12% eller 1,6 kg Rose Holger dansk kylling', 59.95, '1 kg', 59.95, 'kg', FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106005'),
  ((SELECT id FROM all_products WHERE name = 'Gestus dansk kyllingebrystfilet eller kyllingeinderfilet' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Gestus dansk kyllingebrystfilet eller kyllingeinderfilet', 169.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106013'),
  ((SELECT id FROM all_products WHERE name = 'Flæsk i skiver eller koteletter af dansk gris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Flæsk i skiver eller koteletter af dansk gris', 54.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106019'),
  ((SELECT id FROM all_products WHERE name = 'Ribbenssteg af dansk gris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Ribbenssteg af dansk gris', 34.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106023'),
  ((SELECT id FROM all_products WHERE name = 'Stegeben af dansk gris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Stegeben af dansk gris', 19.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106027'),
  ((SELECT id FROM all_products WHERE name = 'Tykstegsmedaljoner af dansk kalv' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Tykstegsmedaljoner af dansk kalv', 64.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106032'),
  ((SELECT id FROM all_products WHERE name = 'Mørbrad af dansk kalv' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Mørbrad af dansk kalv', 189.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106036'),
  ((SELECT id FROM all_products WHERE name = 'Fritgående berberiand' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Fritgående berberiand', 199.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106039'),
  ((SELECT id FROM all_products WHERE name = 'Canard Martín berberi andelår' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Canard Martín berberi andelår', 24.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106044'),
  ((SELECT id FROM all_products WHERE name = 'Canard Martín berberi andebryst' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Canard Martín berberi andebryst', 49.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106049'),
  ((SELECT id FROM all_products WHERE name = 'Julius andebryststeg' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Julius andebryststeg', 59.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106052'),
  ((SELECT id FROM all_products WHERE name = 'Freygaard entrecote' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Freygaard entrecote', 179.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106056'),
  ((SELECT id FROM all_products WHERE name = 'Freygaard T-bone' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Freygaard T-bone', 149.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106061'),
  ((SELECT id FROM all_products WHERE name = 'Freygaard steaks af okseinderlår' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Freygaard steaks af okseinderlår', 54.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106065'),
  ((SELECT id FROM all_products WHERE name = 'Freygaard gullasch af okseinderlår' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Freygaard gullasch af okseinderlår', 89.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106070'),
  ((SELECT id FROM all_products WHERE name = 'Skaftkoteletter af dansk frilandsgris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Skaftkoteletter af dansk frilandsgris', 39.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106075'),
  ((SELECT id FROM all_products WHERE name = 'OMHU culotte af frilandslammekød' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'OMHU culotte af frilandslammekød', 74.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106079'),
  ((SELECT id FROM all_products WHERE name = 'Oksegrydesteg uden ben af bov eller tykkam' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Oksegrydesteg uden ben af bov eller tykkam', 74.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106084'),
  ((SELECT id FROM all_products WHERE name = 'Sydeuropæisk charcuteri' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Sydeuropæisk charcuteri', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106089'),
  ((SELECT id FROM all_products WHERE name = 'Antipasti' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Antipasti', 39.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106092'),
  ((SELECT id FROM all_products WHERE name = 'Laksefilet med skind' AND category_id = (SELECT id FROM categories_map WHERE name = 'Seafood') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Laksefilet med skind', 99.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106096'),
  ((SELECT id FROM all_products WHERE name = 'Gestus pizzabunde' AND category_id = (SELECT id FROM categories_map WHERE name = 'Bread & Bakery') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Gestus pizzabunde', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106100'),
  ((SELECT id FROM all_products WHERE name = 'Buko økologisk flødeost eller Karolines Køkken økologisk hytteost eller mozzarella' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Buko økologisk flødeost eller Karolines Køkken økologisk hytteost eller mozzarella', 12.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106108'),
  ((SELECT id FROM all_products WHERE name = 'Yoggi yoghurt' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Yoggi yoghurt', 9.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106111'),
  ((SELECT id FROM all_products WHERE name = 'Them skæreost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Them skæreost', 45.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106115'),
  ((SELECT id FROM all_products WHERE name = 'Grøn Balance Øllingegaard økologisk yoghurt med top' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Grøn Balance Øllingegaard økologisk yoghurt med top', 8.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106121'),
  ((SELECT id FROM all_products WHERE name = 'Øllingegaard økologisk vinter koldskål' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Øllingegaard økologisk vinter koldskål', 24.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106127'),
  ((SELECT id FROM all_products WHERE name = 'Arla Unika Umage Lille Knas ost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Dairy & Eggs') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'Arla Unika Umage Lille Knas ost', 49.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106131'),
  ((SELECT id FROM all_products WHERE name = 'OMHU klementiner' AND category_id = (SELECT id FROM categories_map WHERE name = 'Fruits & Vegetables') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'meny'), 'OMHU klementiner', 25.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-06', '2025-11-02T15:02:26.106135')
;