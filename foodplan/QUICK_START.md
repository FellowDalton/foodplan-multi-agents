# Quick Start: Grocery Deal Scrapers

## Fastest Way to Get All Deals

### Option 1: Netto Only (Fully Automated)
```bash
python3 scripts/scrape_netto.py
```
✓ No input required
✓ Completes in ~30 seconds
✓ Output: `sale/2025-11-07/netto_deals.json`

### Option 2: All Three Stores
```bash
python3 scripts/scrape_all.py
```
⚠️ You'll need publication IDs for Meny and Rema

**Get Publication IDs:**
1. **Meny**: Visit https://etilbudsavis.dk/MENY → Copy ID from URL (`?publication=XXXXX`)
2. **Rema**: Visit https://etilbudsavis.dk/REMA-1000 → Copy ID from URL (`?publication=XXXXX`)

## Using Slash Commands

Alternatively, use Claude Code commands:
- `/netto` - Scrape Netto deals
- `/meny` - Scrape Meny deals  
- `/rema` - Scrape Rema 1000 deals
- `/all-deals` - Scrape all stores

Each command now shows Python script option first (recommended).

## Output Structure

All scripts create JSON files with:
- Store name and metadata
- 200+ product deals per store
- Automatic categorization (15 categories)
- Quantity parsing and price-per-unit calculations
- App-price indicators

Example output location:
```
sale/2025-11-07/
├── netto_deals.json (211 deals)
├── meny_deals.json (coming soon)
└── rema_deals.json (coming soon)
```

## Full Documentation

See `docs/SCRAPING_README.md` for:
- Detailed usage instructions
- Troubleshooting guide
- Customization options
- API information

See `docs/PROJECT_STATUS.md` for:
- Current project status
- Implementation roadmap
- Next steps and priorities

## Scripts Available

Located in `scripts/` directory:
- `scrape_netto.py` - Netto (fully automated)
- `scrape_meny.py` - Meny (requires pub ID)
- `scrape_rema.py` - Rema 1000 (requires pub ID)
- `scrape_all.py` - Master script for all stores
- `update_netto.sh` - Bash wrapper for cron jobs

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment template (optional)
cp .env.sample .env
```
