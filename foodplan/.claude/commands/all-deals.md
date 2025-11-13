## Quick Method: Use Python Script

**Recommended**: For fastest results, run the master scraper:

```bash
python3 scripts/scrape_all.py
```

This will:
- Run all three store scrapers sequentially
- Create the dated folder automatically
- Show progress for each store
- Provide a summary report

**Note**: Meny and Rema will prompt for publication IDs. Have them ready from:
- Meny: https://etilbudsavis.dk/MENY
- Rema: https://etilbudsavis.dk/REMA-1000

See `SCRAPING_README.md` for full documentation.

## Alternative: Run Individual Commands

First, create a folder in sale/ with today's date in the format YYYY-MM-DD (e.g., sale/2025-11-02/).

Then run the following slash commands in parallel, instructing each to save their JSON output to the newly created dated folder:

1. /meny - save to sale/[today's date]/meny_deals.json
2. /netto - save to sale/[today's date]/netto_deals.json
3. /rema - save to sale/[today's date]/rema_deals.json

This will scrape deals from all three stores simultaneously and organize them in a dated folder structure with JSON files.

## Expected Output

After completion, you should have three JSON files in the dated folder:

```
sale/2025-11-02/
├── meny_deals.json
├── netto_deals.json
└── rema_deals.json
```

Each JSON file will contain structured deal data ready for database insertion or analysis.
