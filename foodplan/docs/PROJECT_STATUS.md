# Foodplan - Price Verification System

**Last Updated:** 2025-11-07
**Current Phase:** JSON Migration Complete - Ready for Database Loader
**Project Goal:** Verify genuine deals from Danish supermarkets (Netto, Rema 1000, Meny) by tracking prices over time

---

## 📊 Current Status

### ✅ Completed Phases

#### Phase 1: Database Infrastructure (100%)
- **Supabase Setup**
  - MCP connection configured in `.mcp.json`
  - Project URL and service role key configured
  - Connection verified and working

- **Database Schema Created**
  - `stores`: 3 rows (Netto, Rema 1000, Meny)
  - `categories`: 15 product categories
  - `products`: Normalized product names with indexes
  - `deals`: Price history with foreign keys
  - `price_metrics`: Historical price tracking
  - RLS enabled with service role access

- **Migrations Applied**
  - `create_core_tables` ✅
  - `setup_rls_policies` ✅

#### Phase 2: JSON-First Data Pipeline (100%)
- **Automated Scrapers**
  - Python scripts for all three stores (Netto, Meny, Rema 1000)
  - Automatic quantity parsing and price per unit calculation
  - Output: `sale/[YYYY-MM-DD]/[store]_deals.json`
  - Master script (`scripts/scrape_all.py`) runs all scrapers sequentially

- **JSON Schema Structure**
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
        "normalized_name": "Product",
        "price": 10.00,
        "quantity": "500 g",
        "unit_type": "g",
        "price_per_unit": 20.00,
        "is_app_price": false
      }
    ]
  }
  ```

- **Claude Commands**
  - `/all-deals` - Run all scrapers (recommended)
  - `/meny`, `/netto`, `/rema` - Individual store scrapers
  - All commands reference `scripts/` directory

#### Phase 3: Historical Data (57.4% - Legacy)
- **Legacy markdown-based deals migrated:** 120 / 209 (57.4%)
- **Remaining legacy batches:** 89 deals (optional)
- **Note:** New workflow uses JSON format, legacy migration is optional

---

## ⏳ Remaining Work

### Priority 1: Build JSON to Database Loader
Create command/script to:
- Read JSON files from `sale/[date]/` directory
- Parse structured deal data
- Insert to Supabase via MCP tools
- Handle duplicate product detection
- Link deals to stores and categories
- Update price_metrics for historical tracking

**Implementation Steps:**
1. Read JSON file
2. Get or create product record (using normalized_name)
3. Get store_id and category_id from metadata
4. Insert deal record with all fields
5. Update price_metrics (avg_price, min_price, max_price)

### Priority 2: Implement Analysis Features

#### Cross-Store Comparison
- Find same/similar products across stores
- Use fuzzy matching for product name similarity
- Compare price_per_unit for fair comparison
- Generate "best deal" recommendations

#### Deal Quality Scoring Algorithm
Score each deal on scale of 1-100:
- **Historical comparison** (40 points): How much below average?
- **Cross-store comparison** (30 points): Cheapest option?
- **Price trend** (20 points): Is price dropping or rising?
- **Discount magnitude** (10 points): Large absolute discount?

Quality tiers:
- 80-100: Excellent deal (⭐⭐⭐⭐⭐)
- 60-79: Good deal (⭐⭐⭐⭐)
- 40-59: Average deal (⭐⭐⭐)
- 20-39: Mediocre deal (⭐⭐)
- 0-19: Poor deal (⭐)

#### Historical Price Tracking
- Calculate rolling averages per product
- Detect price drops vs increases
- Identify suspicious "deals" (price was lower recently)
- Flag products with genuine discounts

### Priority 3: Create New Commands
- `/load-deals` - Load JSON files to database
- `/analyze` - Run full analysis on latest data
- `/report` - Generate weekly comparison report
- `/compare-stores [product]` - Compare specific product
- `/history <product>` - Show price history
- `/best-deals [category]` - Show top-scored deals

### Priority 4: Reporting & Visualization
- **Weekly Comparison Reports**
  - Automated report generation
  - Group by category
  - Show best deals with quality scores
  - Output as markdown or HTML

- **Price History Visualization**
  - Line graphs showing price over time
  - Category-level price trends
  - Store comparison charts
  - Export as PNG/SVG (matplotlib or Chart.js)

- **Alert System**
  - User-specified products of interest
  - Price thresholds (e.g., alert if ground beef < 30 DKK/kg)
  - Check on each scrape run
  - Generate notifications

---

## 📁 Project Structure

```
foodplan/
├── .claude/
│   ├── commands/              # Slash commands
│   │   ├── all-deals.md       # Master scraper
│   │   ├── meny.md           # Meny scraper
│   │   ├── netto.md          # Netto scraper
│   │   └── rema.md           # Rema scraper
│   └── settings.local.json    # MCP config
│
├── scripts/                   # Python scrapers
│   ├── scrape_all.py         # Master scraper
│   ├── scrape_meny.py        # Meny scraper
│   ├── scrape_netto.py       # Netto scraper
│   ├── scrape_rema.py        # Rema scraper
│   └── update_netto.sh       # Update helper
│
├── docs/                      # Documentation
│   ├── PROJECT_STATUS.md     # This file
│   ├── SCRAPING_README.md    # Scraper docs
│   └── supabase-setup.md     # Database schema
│
├── sale/                      # Scraped data
│   └── [YYYY-MM-DD]/         # Date folders
│       ├── meny_deals.json
│       ├── netto_deals.json
│       └── rema_deals.json
│
├── archive/legacy/            # Legacy files
│   ├── sql_batches/          # Old SQL migrations
│   ├── *.py                  # Old scripts
│   └── *.sql                 # Old data files
│
├── logs/                      # Claude Code logs
├── recipes/                   # Recipe storage
├── .env.example              # Config template
├── .gitignore                # Git ignore rules
├── requirements.txt          # Python dependencies
├── README.md                 # Project overview
└── QUICK_START.md            # Quick reference
```

---

## 🚀 Quick Start

### Run All Scrapers
```bash
python3 scripts/scrape_all.py
# Outputs: sale/[date]/[store]_deals.json for all stores
```

### Run Individual Scrapers
```bash
python3 scripts/scrape_netto.py   # Fully automatic
python3 scripts/scrape_meny.py    # Requires publication ID
python3 scripts/scrape_rema.py    # Requires publication ID
```

### Via Claude Commands
```bash
/all-deals    # Run all scrapers
/meny         # Scrape Meny only
/netto        # Scrape Netto only
/rema         # Scrape Rema 1000 only
```

### Check JSON Output
```bash
cat sale/2025-11-07/netto_deals.json | head -50
```

---

## 🔍 Database Verification Queries

### Check Total Deals
```sql
SELECT COUNT(*) as total_deals FROM deals;
```

### Check Deals Per Store
```sql
SELECT s.name, COUNT(d.id) as deal_count
FROM stores s
LEFT JOIN deals d ON s.id = d.store_id
GROUP BY s.name
ORDER BY deal_count DESC;
```

### Check Products Created
```sql
SELECT COUNT(*) as total_products FROM products;
```

### View Sample Deals
```sql
SELECT
  s.name as store,
  d.original_name,
  d.price,
  d.quantity,
  d.price_per_unit,
  d.unit_type,
  d.valid_from,
  d.valid_to
FROM deals d
JOIN stores s ON d.store_id = s.id
ORDER BY d.created_at DESC
LIMIT 10;
```

---

## 🛠️ Tech Stack

- **Database**: Supabase (PostgreSQL)
- **Data Format**: JSON (structured deal data)
- **Scraping**: Python with `requests` library
- **Orchestration**: Claude Code CLI
- **MCP Integration**: Supabase MCP, Chrome DevTools MCP
- **Query Language**: SQL for analytics
- **Visualization**: (To be implemented - Python/JavaScript)

---

## 📋 Standard Categories

All products are organized into these 15 categories:

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

---

## ⚠️ Important Notes

1. **JSON-First Workflow**: All new scrapes use JSON format. Legacy markdown-based workflow is deprecated.

2. **Price Calculation**: `price_per_unit` is calculated automatically during scraping for fair comparison across different package sizes.

3. **App Prices**: Some deals are marked as `is_app_price = true`, requiring the store's mobile app.

4. **Data Integrity**: Database uses foreign key constraints. Products are created/matched automatically.

5. **Safe Operations**: All SQL operations use `ON CONFLICT` clauses for idempotency.

---

## 🎯 Success Metrics

### Completed
- ✅ Database infrastructure ready
- ✅ Automated scraper scripts working
- ✅ JSON-first data pipeline established
- ✅ Quantity parsing and normalization
- ✅ Claude commands integrated

### Next Milestones
- 🎯 Build JSON to database loader (Priority 1)
- 🎯 Implement cross-store price comparison (Priority 2)
- 🎯 Create deal quality scoring algorithm (Priority 2)
- 🎯 Build reporting commands (Priority 3)
- 🎯 Add visualization capabilities (Priority 4)

---

## 📞 For AI Assistants

**Project Context:**
- Purpose: Identify genuine deals vs artificial discounts
- Method: Track prices over time, compare across stores
- Current: Scrapers complete, need database loader
- Next: Build loader → Implement analysis → Create reports

**Key Files:**
- `docs/supabase-setup.md` - Database schema details
- `docs/SCRAPING_README.md` - Scraper documentation
- `README.md` - Project overview
- `scripts/scrape_*.py` - Scraper implementations
- `.claude/commands/` - Slash command definitions

---

**End of Status Document**
