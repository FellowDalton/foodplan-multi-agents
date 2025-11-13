# Foodplan - Danish Supermarket Price Verification System

A comprehensive price verification system to track and analyze deals from Danish supermarkets (Netto, Rema 1000, Meny).

## ✅ Setup Complete

### Database Infrastructure
- **Supabase Project**: Connected via MCP
- **Database Schema**: 5 tables created
  - `stores` (3 stores: Netto, Rema 1000, Meny)
  - `categories` (15 categories)
  - `products` (automatically populated from deals)
  - `deals` (main transaction table)
  - `price_metrics` (for historical tracking)
- **Row Level Security**: Enabled with service role access
- **Indexes**: Optimized for common queries

### Data Ingestion Pipeline
- **Scrapers**: `/meny`, `/netto`, `/rema` commands - Scrape deals and output JSON
- **JSON Files**: Structured deal data saved to `sale/[date]/[store]_deals.json`
- **Database Loading**: Load JSON data to Supabase via MCP tools (manual or automated)

### Current Data Status
- **Historical Data**: 209 deals from initial markdown scrapes (legacy)
  - Netto: 111 deals
  - Rema 1000: 52 deals
  - Meny: 46 deals
- **Database**: 120 deals inserted (57.4% of historical data)
- **New Format**: All future scrapes output structured JSON ready for database insertion

## Data Structure

### JSON Output Format
Each scraper command outputs a JSON file with the following structure:

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
      "original_name": "Product with quantity 500g",
      "normalized_name": "Product name",
      "price": 10.00,
      "quantity": "500 g",
      "unit_type": "g",
      "price_per_unit": 20.00,
      "is_app_price": false
    }
  ]
}
```

### Deal Fields
Each deal includes:
- **original_name**: Full product name with quantity
- **normalized_name**: Product name without quantity
- **category**: One of 15 standard categories
- **price**: Price in DKK (number)
- **quantity**: Quantity string (e.g., "1 kg", "500 g")
- **price_per_unit**: Calculated price per base unit
- **unit_type**: Unit type (kg, g, l, ml, stk)
- **is_app_price**: Boolean - requires store app
- **valid_from/valid_to**: Date range
- **scraped_at**: Timestamp

### Quantity Parsing
Scraper commands automatically extract quantities and calculate price per unit:
- **Weight**: "1 kg", "500 g" → normalized to price per kg
- **Volume**: "1 l", "500 ml" → normalized to price per liter
- **Count**: "2 stk" → price per piece
- **Multi-pack**: "2x500g" → handles complex formats

## Project Structure

```
foodplan/
├── .claude/commands/          # Slash commands
│   ├── all-deals.md          # Master scraper
│   ├── meny.md, netto.md, rema.md
│
├── scripts/                   # Python scrapers
│   ├── scrape_all.py         # Master script
│   ├── scrape_meny.py, scrape_netto.py, scrape_rema.py
│
├── docs/                      # Documentation
│   ├── PROJECT_STATUS.md     # Current status & roadmap
│   ├── SCRAPING_README.md    # Scraper documentation
│   └── supabase-setup.md     # Database schema
│
├── sale/[date]/              # Scraped data (JSON)
├── archive/legacy/           # Legacy files
├── recipes/                  # Recipe storage
├── requirements.txt          # Python dependencies
├── .env.sample              # Config template
└── README.md                # This file
```

## Workflow

### 1. Scrape Store Deals

**Option A - Using Python Scripts (Recommended):**
```bash
python3 scripts/scrape_all.py
# or individual stores:
python3 scripts/scrape_netto.py
python3 scripts/scrape_meny.py
python3 scripts/scrape_rema.py
```

**Option B - Using Claude Commands:**
```bash
/all-deals
# or individual stores:
/netto
/meny
/rema
```

Both methods create JSON files in `sale/[date]/` directory.

### 2. Load Data to Supabase
(To be implemented - will read JSON files and insert to database via MCP)

### 3. Query and Analyze
Use the database queries below or create reporting commands

## Next Steps

### Phase 3: Build Analysis Queries
- Cross-store price comparison
- Historical price tracking
- Deal quality scoring algorithm
- Best deals per category

### Phase 4: Create Reporting Commands
- `/analyze` - Run full analysis
- `/report` - Generate weekly comparison
- `/compare-stores` - Compare specific products
- `/history <product>` - Show price history
- `/best-deals [category]` - Top-scored deals

### Phase 5: Automate JSON to Database Loading
Create a command or script to:
- Read JSON files from `sale/[date]/`
- Insert deals directly to Supabase via MCP
- Handle duplicate detection
- Update price_metrics for historical tracking

## Database Queries

### Useful Queries

**Find cheapest deals this week:**
```sql
SELECT p.name, d.price, s.name as store, d.price_per_unit, d.unit_type
FROM deals d
JOIN products p ON d.product_id = p.id
JOIN stores s ON d.store_id = s.id
WHERE d.valid_from >= CURRENT_DATE - INTERVAL '7 days'
  AND d.price_per_unit IS NOT NULL
ORDER BY d.price_per_unit ASC
LIMIT 20;
```

**Compare product across stores:**
```sql
SELECT p.name, s.name as store, d.price, d.price_per_unit, d.unit_type
FROM deals d
JOIN products p ON d.product_id = p.id
JOIN stores s ON d.store_id = s.id
WHERE p.name ILIKE '%chicken%'
  AND d.price_per_unit IS NOT NULL
ORDER BY p.name, d.price_per_unit;
```

**Deals by category:**
```sql
SELECT c.name as category, COUNT(d.id) as deals, AVG(d.price) as avg_price
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN deals d ON p.id = d.product_id
GROUP BY c.name
ORDER BY deals DESC;
```

## Success Criteria (from PLAN.md)

- ✅ All historical deals migrated to database (in progress: 30/209)
- ⏳ New deals automatically saved to Supabase (next phase)
- ⏳ Accurate cross-store price comparison (ready for implementation)
- ⏳ Deal quality scores calculated correctly (ready for implementation)
- ⏳ Weekly reports generated automatically (ready for implementation)
- ⏳ Price history tracked over time (schema ready)
- ⏳ Alerts trigger for good deals (ready for implementation)

## Tech Stack

- **Database**: Supabase (PostgreSQL)
- **Scripts**: Python 3
- **Orchestration**: Claude Code CLI
- **Data Scraping**: Chrome DevTools MCP
- **MCP Integration**: Supabase MCP Server

## Database Schema Details

See `docs/supabase-setup.md` for full schema including:
- Table definitions with constraints
- Foreign key relationships
- Index optimizations
- RLS policies

## Documentation

- **README.md** (this file) - Project overview
- **QUICK_START.md** - Quick reference for scrapers
- **docs/PROJECT_STATUS.md** - Current status and roadmap
- **docs/SCRAPING_README.md** - Detailed scraper documentation
- **docs/supabase-setup.md** - Database schema and setup

## Getting Started

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment (optional):**
   ```bash
   cp .env.sample .env
   # Edit .env with your Supabase credentials
   ```

3. **Run scrapers:**
   ```bash
   python3 scripts/scrape_all.py
   ```

4. **Check output:**
   ```bash
   cat sale/$(date +%Y-%m-%d)/netto_deals.json | head -50
   ```

## Contact

This system was built to help identify genuine deals vs artificial discounts from Danish supermarkets.
