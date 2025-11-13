-- Batch 4 of 7 (30 deals)

WITH
  stores_map AS (SELECT id, slug FROM stores),
  categories_map AS (SELECT id, name FROM categories),
  new_products AS (
    INSERT INTO products (name, category_id)
    VALUES
      ('Pepsi Max eller Faxe Kondi 1.iter', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Coca-Cola original, Zero sugar, Fanta orange, Fanta exotic, sukkerfri Tuborg Squash sport eller Tuborg Squash fersken 33 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Tuborg Classic, Grøn Tuborg eller Tuborg Classic 0.0% 33 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Silverboom Sydafrikansk rød- eller hvidvin 75 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Vanesa økologisk spansk rød-, hvid- eller rosévin', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Toms Skildpadde eller Skumfidus islagkage Dybfrost', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Bologna - italiensk is Stracciatella, Caramello, Panna con fragole, Pistacchio, Cioccolato, Ciock menta eller Vaniglia', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Sønderjyske Fristelser eller K-salat Flere varianter 140-', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Velsmag dansk julemedister eller hakket grisekød 14-18%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag entrecote eller ribeye', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag dansk ribbenssteg', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag danske koteletter, flæsk i skiver eller hakket grise- og kalvekød 4-7%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag danske kyllingeunderlår eller hakket kyllingekød 3-7%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag dansk mørbrad af gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag kalvefilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag røget hamburgerryg eller bacon', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Kyllingebrystfilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Dansk hakket kyllingekød 7-10%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Rose dansk hel kylling', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag hakket oksekød 8-12%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Premieur danske krogmodnede koteletter', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Løgismose Canette frilandsand', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Bistronne andefedt', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Bistronne kyllingeburger', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Kyllingestrimler', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('ProteinLab kebab med oksekød', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Tulip bacon', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Pålækker pålæg eller salami-hapser', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Hanegal økologisk spegepølse', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Gøl pølser', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts'))
    ON CONFLICT DO NOTHING
    RETURNING id, name, category_id
  ),
  existing_products AS (
    SELECT p.id, p.name, p.category_id
    FROM products p
    WHERE (p.name, p.category_id) IN (
      ('Pepsi Max eller Faxe Kondi 1.iter', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Coca-Cola original, Zero sugar, Fanta orange, Fanta exotic, sukkerfri Tuborg Squash sport eller Tuborg Squash fersken 33 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Tuborg Classic, Grøn Tuborg eller Tuborg Classic 0.0% 33 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Silverboom Sydafrikansk rød- eller hvidvin 75 cl', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Vanesa økologisk spansk rød-, hvid- eller rosévin', (SELECT id FROM categories_map WHERE name = 'Beverages')),
      ('Toms Skildpadde eller Skumfidus islagkage Dybfrost', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Bologna - italiensk is Stracciatella, Caramello, Panna con fragole, Pistacchio, Cioccolato, Ciock menta eller Vaniglia', (SELECT id FROM categories_map WHERE name = 'Frozen Foods')),
      ('Sønderjyske Fristelser eller K-salat Flere varianter 140-', (SELECT id FROM categories_map WHERE name = 'Special Offers')),
      ('Velsmag dansk julemedister eller hakket grisekød 14-18%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag entrecote eller ribeye', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag dansk ribbenssteg', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag danske koteletter, flæsk i skiver eller hakket grise- og kalvekød 4-7%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag danske kyllingeunderlår eller hakket kyllingekød 3-7%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag dansk mørbrad af gris', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag kalvefilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag røget hamburgerryg eller bacon', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Kyllingebrystfilet', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Dansk hakket kyllingekød 7-10%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Rose dansk hel kylling', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Velsmag hakket oksekød 8-12%', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Premieur danske krogmodnede koteletter', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Løgismose Canette frilandsand', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Bistronne andefedt', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Bistronne kyllingeburger', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Kyllingestrimler', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('ProteinLab kebab med oksekød', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Tulip bacon', (SELECT id FROM categories_map WHERE name = 'Meat & Poultry')),
      ('Pålækker pålæg eller salami-hapser', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Hanegal økologisk spegepølse', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts')),
      ('Gøl pølser', (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts'))
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
  ((SELECT id FROM all_products WHERE name = 'Pepsi Max eller Faxe Kondi 1.iter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Pepsi Max eller Faxe Kondi 1.5 liter', 12.0, '1.5 l', 8.0, 'liter', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106711'),
  ((SELECT id FROM all_products WHERE name = 'Coca-Cola original, Zero sugar, Fanta orange, Fanta exotic, sukkerfri Tuborg Squash sport eller Tuborg Squash fersken 33 cl' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Coca-Cola original, Zero sugar, Fanta orange, Fanta exotic, sukkerfri Tuborg Squash sport eller Tuborg Squash fersken 33 cl', 3.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106723'),
  ((SELECT id FROM all_products WHERE name = 'Tuborg Classic, Grøn Tuborg eller Tuborg Classic 0.0% 33 cl' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Tuborg Classic, Grøn Tuborg eller Tuborg Classic 0.0% 33 cl', 4.5, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106732'),
  ((SELECT id FROM all_products WHERE name = 'Silverboom Sydafrikansk rød- eller hvidvin 75 cl' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Silverboom Sydafrikansk rød- eller hvidvin 75 cl', 45.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106741'),
  ((SELECT id FROM all_products WHERE name = 'Vanesa økologisk spansk rød-, hvid- eller rosévin' AND category_id = (SELECT id FROM categories_map WHERE name = 'Beverages') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Vanesa økologisk spansk rød-, hvid- eller rosévin', 89.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106746'),
  ((SELECT id FROM all_products WHERE name = 'Toms Skildpadde eller Skumfidus islagkage Dybfrost' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Toms Skildpadde eller Skumfidus islagkage Dybfrost', 40.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106752'),
  ((SELECT id FROM all_products WHERE name = 'Bologna - italiensk is Stracciatella, Caramello, Panna con fragole, Pistacchio, Cioccolato, Ciock menta eller Vaniglia' AND category_id = (SELECT id FROM categories_map WHERE name = 'Frozen Foods') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Bologna - italiensk is Stracciatella, Caramello, Panna con fragole, Pistacchio, Cioccolato, Ciock menta eller Vaniglia 750 ML', 29.0, '750 ml', 38.666666666666664, 'liter', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106761'),
  ((SELECT id FROM all_products WHERE name = 'Sønderjyske Fristelser eller K-salat Flere varianter 140-' AND category_id = (SELECT id FROM categories_map WHERE name = 'Special Offers') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'rema'), 'Sønderjyske Fristelser eller K-salat Flere varianter 140-150 g', 12.0, '150 g', 80.0, 'kg', FALSE, '2025-11-02', '2025-11-08', '2025-11-02T15:02:26.106767'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag dansk julemedister eller hakket grisekød 14-18%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag dansk julemedister eller hakket grisekød 14-18%', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107019'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag entrecote eller ribeye' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag entrecote eller ribeye', 89.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107024'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag dansk ribbenssteg' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag dansk ribbenssteg', 24.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107029'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag danske koteletter, flæsk i skiver eller hakket grise- og kalvekød 4-7%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag danske koteletter, flæsk i skiver eller hakket grise- og kalvekød 4-7%', 30.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107037'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag danske kyllingeunderlår eller hakket kyllingekød 3-7%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag danske kyllingeunderlår eller hakket kyllingekød 3-7%', 35.0, NULL, NULL, NULL, TRUE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107045'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag dansk mørbrad af gris' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag dansk mørbrad af gris', 129.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107049'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag kalvefilet' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag kalvefilet', 149.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107053'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag røget hamburgerryg eller bacon' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag røget hamburgerryg eller bacon', 27.95, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107063'),
  ((SELECT id FROM all_products WHERE name = 'Kyllingebrystfilet' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Kyllingebrystfilet', 75.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107066'),
  ((SELECT id FROM all_products WHERE name = 'Dansk hakket kyllingekød 7-10%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Dansk hakket kyllingekød 7-10%', 49.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107072'),
  ((SELECT id FROM all_products WHERE name = 'Rose dansk hel kylling' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Rose dansk hel kylling', 45.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107076'),
  ((SELECT id FROM all_products WHERE name = 'Velsmag hakket oksekød 8-12%' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Velsmag hakket oksekød 8-12%', 79.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107081'),
  ((SELECT id FROM all_products WHERE name = 'Premieur danske krogmodnede koteletter' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Premieur danske krogmodnede koteletter', 50.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107086'),
  ((SELECT id FROM all_products WHERE name = 'Løgismose Canette frilandsand' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Løgismose Canette frilandsand', 199.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107090'),
  ((SELECT id FROM all_products WHERE name = 'Bistronne andefedt' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Bistronne andefedt', 20.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107094'),
  ((SELECT id FROM all_products WHERE name = 'Bistronne kyllingeburger' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Bistronne kyllingeburger', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107098'),
  ((SELECT id FROM all_products WHERE name = 'Kyllingestrimler' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Kyllingestrimler', 50.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107101'),
  ((SELECT id FROM all_products WHERE name = 'ProteinLab kebab med oksekød' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'ProteinLab kebab med oksekød', 35.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107105'),
  ((SELECT id FROM all_products WHERE name = 'Tulip bacon' AND category_id = (SELECT id FROM categories_map WHERE name = 'Meat & Poultry') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Tulip bacon', 49.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107108'),
  ((SELECT id FROM all_products WHERE name = 'Pålækker pålæg eller salami-hapser' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Pålækker pålæg eller salami-hapser', 10.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107114'),
  ((SELECT id FROM all_products WHERE name = 'Hanegal økologisk spegepølse' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Hanegal økologisk spegepølse', 18.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107119'),
  ((SELECT id FROM all_products WHERE name = 'Gøl pølser' AND category_id = (SELECT id FROM categories_map WHERE name = 'Deli & Cold Cuts') LIMIT 1), (SELECT id FROM stores_map WHERE slug = 'netto'), 'Gøl pølser', 30.0, NULL, NULL, NULL, FALSE, '2025-11-02', '2025-11-07', '2025-11-02T15:02:26.107123')
;