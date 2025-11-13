# Supabase Setup Guide for Foodplan

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: foodplan
   - **Database Password**: (choose a strong password and save it!)
   - **Region**: Choose closest to you (e.g., Europe West for Denmark)
   - **Pricing Plan**: Free tier is sufficient to start
5. Click "Create new project" and wait for setup (~2 minutes)

## Step 2: Get Connection Credentials

Once project is created:

1. Go to **Settings** → **API**
2. Note down:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (for client-side access)
     - `service_role` `secret` key (for server-side/admin access)

3. Go to **Settings** → **Database**
4. Note down:
   - **Connection string** (for direct PostgreSQL access if needed)

## Step 3: Add Supabase MCP to `.mcp.json`

Add the Supabase MCP server to your `.mcp.json` file:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-chrome-devtools"
      ]
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://xxxxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
      }
    }
  }
}
```

**IMPORTANT**: Replace:
- `https://xxxxx.supabase.co` with your actual Project URL
- `your-service-role-key-here` with your actual service_role key

## Step 4: Create Database Schema

Go to **SQL Editor** in Supabase dashboard and run the following SQL:

### Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stores table
CREATE TABLE stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),
    original_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity TEXT,
    price_per_unit DECIMAL(10, 2),
    unit_type TEXT,
    is_app_price BOOLEAN DEFAULT FALSE,
    valid_from DATE,
    valid_to DATE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price metrics table
CREATE TABLE price_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) UNIQUE,
    avg_price DECIMAL(10, 2),
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_deals_product_id ON deals(product_id);
CREATE INDEX idx_deals_store_id ON deals(store_id);
CREATE INDEX idx_deals_valid_from ON deals(valid_from);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
```

### Insert Initial Data

```sql
-- Insert stores
INSERT INTO stores (name, slug, url) VALUES
    ('Netto', 'netto', 'https://etilbudsavis.dk/Netto'),
    ('Rema 1000', 'rema', 'https://etilbudsavis.dk/REMA-1000'),
    ('Meny', 'meny', 'https://etilbudsavis.dk/MENY');

-- Insert categories
INSERT INTO categories (name, slug) VALUES
    ('Meat & Poultry', 'meat-poultry'),
    ('Deli & Cold Cuts', 'deli-cold-cuts'),
    ('Seafood', 'seafood'),
    ('Bread & Bakery', 'bread-bakery'),
    ('Dairy & Eggs', 'dairy-eggs'),
    ('Fruits & Vegetables', 'fruits-vegetables'),
    ('Pasta & International', 'pasta-international'),
    ('Pantry & Condiments', 'pantry-condiments'),
    ('Spreads & Butter', 'spreads-butter'),
    ('Sweets & Snacks', 'sweets-snacks'),
    ('Coffee & Tea', 'coffee-tea'),
    ('Beverages', 'beverages'),
    ('Frozen Foods', 'frozen-foods'),
    ('Plant-Based', 'plant-based'),
    ('Special Offers', 'special-offers');
```

## Step 5: Set Up Row Level Security (RLS)

For security, enable RLS but allow all operations for now (you can refine later):

```sql
-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations with service_role key
CREATE POLICY "Allow all for service role" ON stores FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON price_metrics FOR ALL USING (true);
```

## Step 6: JSON Schema Documentation

### Scraper Output Format

The scraper commands (`/meny`, `/netto`, `/rema`) output JSON files with the following structure:

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

### JSON to Database Mapping

| JSON Field | Database Table | Database Column | Notes |
|------------|---------------|-----------------|-------|
| `store_name` | `stores` | `name` | Lookup by name to get `store_id` |
| `scraped_at` | `deals` | `scraped_at` | Timestamp when data was scraped |
| `valid_from` | `deals` | `valid_from` | Start date of offer |
| `valid_to` | `deals` | `valid_to` | End date of offer |
| `deals[].category` | `categories` | `name` | Lookup to get `category_id` |
| `deals[].original_name` | `deals` | `original_name` | Full product name as scraped |
| `deals[].normalized_name` | `products` | `name` | Product lookup/creation |
| `deals[].price` | `deals` | `price` | Deal price in DKK |
| `deals[].quantity` | `deals` | `quantity` | Quantity string |
| `deals[].unit_type` | `deals` | `unit_type` | Unit type (kg, g, l, ml, stk) |
| `deals[].price_per_unit` | `deals` | `price_per_unit` | Normalized price |
| `deals[].is_app_price` | `deals` | `is_app_price` | Requires store app |

### JSON Loader Implementation Notes

When building the JSON to database loader:

1. **Load JSON file** from `sale/[date]/[store]_deals.json`
2. **Lookup store_id** by matching `store_name` to `stores.name`
3. **For each deal in deals array:**
   - Lookup `category_id` by matching `category` to `categories.name`
   - Check if product exists (by `normalized_name` and `category_id`)
     - If exists: use existing `product_id`
     - If not: create new product, get `product_id`
   - Insert deal with:
     - `product_id`, `store_id`, `category_id` (foreign keys)
     - All other fields from JSON
4. **Update price_metrics** for historical tracking

### Example SQL for JSON Loading

```sql
-- 1. Get store_id
SELECT id FROM stores WHERE name = 'Netto';

-- 2. Get category_id
SELECT id FROM categories WHERE name = 'Meat & Poultry';

-- 3. Get or create product
INSERT INTO products (name, category_id)
VALUES ('Product name', '<category_id>')
ON CONFLICT (name, category_id) DO UPDATE SET updated_at = NOW()
RETURNING id;

-- 4. Insert deal
INSERT INTO deals (
  product_id, store_id, original_name, price,
  quantity, price_per_unit, unit_type, is_app_price,
  valid_from, valid_to, scraped_at
) VALUES (
  '<product_id>', '<store_id>', 'Product with quantity 500g', 10.00,
  '500 g', 20.00, 'g', false,
  '2025-11-02', '2025-11-06', '2025-11-02T15:30:00'
);
```

## Step 7: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see all 5 tables created
3. Click on `stores` table - you should see 3 stores
4. Click on `categories` table - you should see 15 categories

## Step 8: Test MCP Connection

Restart Claude Code and verify the Supabase MCP is working:

```bash
# In Claude Code, the MCP should now be available
# You can test by asking: "Can you list the stores in the database?"
```

## Environment Variables (Alternative to .mcp.json)

If you prefer to use environment variables instead of hardcoding in `.mcp.json`:

1. Create `.env` file in project root:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Update `.mcp.json` to reference env vars (requires shell expansion support)

## Security Notes

- ⚠️ **NEVER commit** your service_role key to git
- Add `.env` to `.gitignore`
- Consider using Supabase's Vault feature for extra security
- The `service_role` key bypasses RLS - use carefully

## Useful SQL Queries for Testing

```sql
-- Count deals per store
SELECT s.name, COUNT(d.id) as deal_count
FROM stores s
LEFT JOIN deals d ON s.id = d.store_id
GROUP BY s.name;

-- Get average price per category
SELECT c.name, AVG(d.price) as avg_price, COUNT(d.id) as deals
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN deals d ON p.id = d.product_id
GROUP BY c.name
ORDER BY avg_price DESC;

-- Find cheapest deals this week
SELECT p.name, d.price, s.name as store, d.valid_from
FROM deals d
JOIN products p ON d.product_id = p.id
JOIN stores s ON d.store_id = s.id
WHERE d.valid_from >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY d.price ASC
LIMIT 20;
```

## Next Steps

Once setup is complete:
1. ✅ Scraper commands updated to output JSON (completed)
2. ⏳ Build JSON to database loader (see Step 6 for mapping guide)
3. ⏳ Start building analysis queries
4. ⏳ Implement reporting features

### Current Workflow
1. Run `/all-deals` to scrape all stores → outputs JSON files
2. Load JSON files to database (loader to be implemented)
3. Query and analyze data in Supabase

## Troubleshooting

**MCP not connecting:**
- Verify credentials are correct
- Check that `.mcp.json` is valid JSON
- Restart Claude Code after changes

**Tables not created:**
- Check SQL Editor for error messages
- Ensure UUID extension is enabled
- Verify you ran all SQL commands

**RLS blocking queries:**
- Verify you're using `service_role` key, not `anon` key
- Check that RLS policies are created
