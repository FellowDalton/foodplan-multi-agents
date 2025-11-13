Use Chrome DevTools MCP to scrape food deals from https://etilbudsavis.dk/Netto and save the results as JSON to @sale/ with the date in the filename.

## Quick Method: Use Python Script

**Recommended**: For faster, automated scraping, run:

```bash
python3 scripts/scrape_netto.py
```

This fully automated script will:
- Fetch the latest Netto publication automatically
- Extract all 200+ deals via API
- Parse quantities and categorize products
- Save to `sale/YYYY-MM-DD/netto_deals.json`
- Complete in ~30 seconds

See `SCRAPING_README.md` for full documentation.

## Alternative: Manual Chrome DevTools Method

If you need to use Chrome DevTools instead of the Python script:

### Navigation Instructions

1. Navigate to https://etilbudsavis.dk/Netto
2. The website should open with the newest magazine automatically
3. If not, look for and click the button that says "Netto uge <newest-week-number>" (e.g., "Netto uge 46")
4. **Important**: The link/button will show the sale period dates - note which days the sale is valid for
5. Once the magazine is open, **all pages will be loaded at once** and can be seen in Chrome DevTools
6. Use Chrome DevTools to extract all the magazine page images that have loaded
7. Analyze each image to extract product names, prices, quantities, and other deal information
8. Use Claude's vision capabilities to read text from the magazine images

## Data Extraction from Images

When analyzing the magazine images:
- Extract product names exactly as they appear
- Identify prices (look for DKK amounts)
- Parse quantities from product descriptions (kg, g, l, ml, stk)
- Identify app-only prices (usually marked with special indicators)
- Determine the validity period and week number from the magazine
- Categorize products into the standard categories

## JSON Output Structure

The output must be a valid JSON file with the following structure:

```json
{
  "store_name": "Netto",
  "scraped_at": "2025-11-02T15:30:00.000000",
  "valid_from": "2025-11-02",
  "valid_to": "2025-11-06",
  "week_number": 44,
  "deals": [
    {
      "category": "Meat & Poultry",
      "original_name": "Velsmag dansk julemedister eller hakket grisekød 14-18% 500g",
      "normalized_name": "Velsmag dansk julemedister eller hakket grisekød 14-18%",
      "price": 10.00,
      "quantity": "500 g",
      "unit_type": "g",
      "price_per_unit": 20.00,
      "is_app_price": false
    },
    {
      "category": "Dairy & Eggs",
      "original_name": "Cheasy yoghurt 150g",
      "normalized_name": "Cheasy yoghurt",
      "price": 14.00,
      "quantity": "150 g",
      "unit_type": "g",
      "price_per_unit": 93.33,
      "is_app_price": true
    }
  ]
}
```

## Field Specifications

### Top-Level Fields
- **store_name**: Always "Netto"
- **scraped_at**: ISO 8601 timestamp of when scraping occurred
- **valid_from**: Start date of the offer period (YYYY-MM-DD)
- **valid_to**: End date of the offer period (YYYY-MM-DD)
- **week_number**: Week number of the offer period

### Deal Object Fields
- **category**: One of the 15 standard categories (see below)
- **original_name**: Full product name including quantity/size as shown on website
- **normalized_name**: Product name with quantity information removed
- **price**: Price in DKK as a number (not string)
- **quantity**: Quantity string (e.g., "1 kg", "500 g", "2 stk", "2x500g")
- **unit_type**: Unit type extracted from quantity (kg, g, l, ml, stk)
- **price_per_unit**: Calculated price per base unit (price/quantity normalized to base unit)
- **is_app_price**: Boolean - true if product requires Netto app for special price

## Standard Categories (in order)

Organize all products into these categories:

1. Meat & Poultry
2. Deli & Cold Cuts
3. Seafood
4. Bread & Bakery
5. Dairy & Eggs
6. Fruits & Vegetables
7. Pasta & International
8. Pantry & Condiments
9. Spreads & Butter
10. Sweets & Snacks
11. Coffee & Tea
12. Beverages
13. Frozen Foods
14. Plant-Based
15. Special Offers

## Quantity Parsing Rules

When extracting quantity and calculating price_per_unit:

- **Weight units**: Convert to base unit (kg or g)
  - "1 kg" → quantity: "1 kg", unit_type: "kg", normalize to kg
  - "500 g" → quantity: "500 g", unit_type: "g", normalize to kg (0.5)

- **Volume units**: Convert to base unit (l or ml)
  - "1 l" → quantity: "1 l", unit_type: "l", normalize to l
  - "500 ml" → quantity: "500 ml", unit_type: "ml", normalize to l (0.5)

- **Count units**: Use as-is
  - "2 stk" → quantity: "2 stk", unit_type: "stk", divide price by count

- **Multi-pack**: Parse carefully
  - "2x500g" → quantity: "2x500g", unit_type: "g", total = 1 kg

## Output File

Save the JSON output to: `sale/[YYYY-MM-DD]/netto_deals.json`

Where [YYYY-MM-DD] is today's date (e.g., sale/2025-11-02/netto_deals.json)

## Example Complete JSON

```json
{
  "store_name": "Netto",
  "scraped_at": "2025-11-02T15:30:00.000000",
  "valid_from": "2025-11-02",
  "valid_to": "2025-11-06",
  "week_number": 44,
  "deals": [
    {
      "category": "Meat & Poultry",
      "original_name": "Velsmag dansk julemedister 500g",
      "normalized_name": "Velsmag dansk julemedister",
      "price": 10.00,
      "quantity": "500 g",
      "unit_type": "g",
      "price_per_unit": 20.00,
      "is_app_price": false
    },
    {
      "category": "Dairy & Eggs",
      "original_name": "Buko flødeost 200g",
      "normalized_name": "Buko flødeost",
      "price": 10.00,
      "quantity": "200 g",
      "unit_type": "g",
      "price_per_unit": 50.00,
      "is_app_price": false
    }
  ]
}
```
