# Grocery Store Deal Scrapers

Automated scraping scripts for Danish grocery store deals from etilbudsavis.dk.

## Available Scrapers

1. **Netto** - `scrape_netto.py`
2. **Meny** - `scrape_meny.py`
3. **Rema 1000** - `scrape_rema.py`
4. **All Stores** - `scrape_all.py` (runs all scrapers)

## Quick Start

### Scraping Netto (Fully Automated)

```bash
python3 scrape_netto.py
```

The Netto scraper is fully automated and requires no input. It will:
- Automatically fetch the latest deals
- Extract all 200+ products
- Save to `sale/YYYY-MM-DD/netto_deals.json`

### Scraping Meny

```bash
python3 scrape_meny.py
```

You'll need to provide:
1. **Publication ID**: Visit https://etilbudsavis.dk/MENY and copy the ID from the URL (`?publication=XXXXX`)
2. **Valid from date**: Start date (YYYY-MM-DD)
3. **Valid to date**: End date (YYYY-MM-DD)
4. **Week number**: e.g., 45

### Scraping Rema 1000

```bash
python3 scrape_rema.py
```

You'll need to provide:
1. **Publication ID**: Visit https://etilbudsavis.dk/REMA-1000 and copy the ID from the URL (`?publication=XXXXX`)
2. **Valid from date**: Start date (YYYY-MM-DD)
3. **Valid to date**: End date (YYYY-MM-DD)
4. **Week number**: e.g., 45

### Scraping All Stores

```bash
python3 scrape_all.py
```

Runs all three scrapers sequentially and provides a summary report.

## Output Structure

All scrapers generate JSON files with this structure:

```json
{
  "store_name": "Netto",
  "scraped_at": "2025-11-07T15:30:00.000000",
  "valid_from": "2025-11-08",
  "valid_to": "2025-11-15",
  "week_number": 45,
  "deals": [
    {
      "category": "Meat & Poultry",
      "original_name": "Dansk hakket kyllingekød 7-10% 500g",
      "normalized_name": "Dansk hakket kyllingekød 7-10%",
      "price": 39.0,
      "quantity": "500 g",
      "unit_type": "g",
      "price_per_unit": 78.0,
      "is_app_price": false
    }
  ]
}
```

## Output Files

Results are saved to:
- `sale/YYYY-MM-DD/netto_deals.json`
- `sale/YYYY-MM-DD/meny_deals.json`
- `sale/YYYY-MM-DD/rema_deals.json`

## Product Categories

Products are automatically categorized into:

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

## Features

- **Automatic quantity extraction**: Parses kg, g, l, ml, stk from product descriptions
- **Price per unit calculation**: Normalizes prices to base units (per kg, per liter, per piece)
- **App-price detection**: Identifies deals that require store apps
- **Category classification**: AI-powered categorization based on product names and descriptions
- **Error handling**: Robust error handling with detailed progress reporting

## Requirements

```bash
pip install requests
```

## How It Works

1. **Fetch publication metadata**: Gets page count and validity dates
2. **Extract offer IDs**: Scans all pages for product hotspots
3. **Fetch detailed data**: Retrieves full product information from API
4. **Parse and categorize**: Extracts quantities, calculates prices, assigns categories
5. **Save JSON**: Outputs structured data to dated directory

## Finding Publication IDs

### Method 1: From Website URL
1. Visit the store's page (e.g., https://etilbudsavis.dk/MENY)
2. Click on the latest magazine
3. Copy the publication ID from URL: `?publication=XXXXX`

### Method 2: From Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for requests to `paged-publications/{ID}/1`
5. The ID in the URL is your publication ID

## Troubleshooting

### "Could not determine publication ID"
- Make sure you're copying the correct ID from the URL
- The ID is the alphanumeric string after `?publication=`

### "No offers found"
- Check that the publication ID is current
- Some magazines may not have clickable offers
- Try a different week's publication

### Missing quantities
- Some products may not have quantity info in descriptions
- Defaults to "1 stk" if no quantity is detected
- You can manually update the categorization rules in the script

## Customization

### Adding More Categories
Edit the `categorize_product()` function in any script to add keywords for new categories.

### Improving Quantity Detection
Update the `extract_quantity_info()` function to handle more patterns.

### Changing Output Directory
Modify the `output_dir` variable in `main()`.

## API Information

These scripts use the public etilbudsavis.dk API:
- Publication viewer: `https://publication-viewer.tjek.com/api/`
- Offer details: `https://squid-api.tjek.com/v2/offers/`

No API key required. Be respectful with request rates.

## License

For personal use in the foodplan project.
