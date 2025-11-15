# Deals API - Examples & Documentation

## Base URL
```
http://localhost:3000/api/deals
```

## Endpoints

### GET /api/deals
Fetch grocery deals with optional filtering and sorting.

## Query Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `store` | string | `netto`, `rema`, `meny` | Filter by specific store |
| `category` | string | Category name | Filter by product category |
| `search` | string | Any text | Search in product names |
| `sortBy` | string | `price`, `price_per_unit`, `name` | Sort criteria |
| `sortOrder` | string | `asc`, `desc` | Sort direction |

## Example Requests

### 1. Get All Deals
```bash
curl http://localhost:3000/api/deals
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "category": "Meat & Poultry",
        "original_name": "Velsmag danske nakkekoteletter",
        "normalized_name": "Velsmag danske nakkekoteletter",
        "price": 55.0,
        "quantity": "1 stk",
        "unit_type": "stk",
        "price_per_unit": 55.0,
        "is_app_price": false,
        "store_name": "Netto",
        "store_slug": "netto",
        "valid_from": "2025-11-08",
        "valid_to": "2025-11-15",
        "week_number": 45
      }
    ],
    "total_count": 513,
    "stores": ["Netto", "Rema 1000", "Meny"],
    "categories": [
      "Meat & Poultry",
      "Dairy & Eggs",
      "Fruits & Vegetables",
      "..."
    ],
    "latest_date": "2025-11-07"
  }
}
```

### 2. Filter by Store (Netto Only)
```bash
curl http://localhost:3000/api/deals?store=netto
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [ /* 211 Netto deals */ ],
    "total_count": 211,
    "stores": ["Netto"],
    "categories": [ /* categories */ ],
    "latest_date": "2025-11-07"
  }
}
```

### 3. Filter by Category
```bash
curl "http://localhost:3000/api/deals?category=Meat%20%26%20Poultry"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [ /* 122 meat & poultry deals */ ],
    "total_count": 122,
    "stores": ["Netto", "Rema 1000", "Meny"],
    "categories": ["Meat & Poultry"],
    "latest_date": "2025-11-07"
  }
}
```

### 4. Search for Products
```bash
curl "http://localhost:3000/api/deals?search=laks"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "normalized_name": "Gravad, kold- eller varmrøget laks",
        "price": 19.0,
        "store_name": "Netto",
        "..."
      },
      {
        "normalized_name": "Laksefilet 600 g",
        "price": 89.95,
        "store_name": "Rema 1000",
        "..."
      }
    ],
    "total_count": 6,
    "stores": ["Netto", "Rema 1000", "Meny"],
    "categories": ["Seafood"],
    "latest_date": "2025-11-07"
  }
}
```

### 5. Sort by Price (Lowest First)
```bash
curl "http://localhost:3000/api/deals?sortBy=price&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "normalized_name": "Løse bananer",
        "price": 1.5,
        "price_per_unit": 0.05,
        "..."
      },
      {
        "normalized_name": "Amper Energy",
        "price": 2.0,
        "price_per_unit": 8.0,
        "..."
      }
    ],
    "total_count": 513,
    "..."
  }
}
```

### 6. Sort by Price per Unit
```bash
curl "http://localhost:3000/api/deals?sortBy=price_per_unit&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "normalized_name": "Løse bananer",
        "price": 1.5,
        "price_per_unit": 0.05,
        "unit_type": "stk",
        "quantity": "30 stk",
        "..."
      }
    ],
    "total_count": 513,
    "..."
  }
}
```

### 7. Combined Filters (Netto + Dairy + Sorted)
```bash
curl "http://localhost:3000/api/deals?store=netto&category=Dairy%20%26%20Eggs&sortBy=price&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [ /* Netto dairy products sorted by price */ ],
    "total_count": 18,
    "stores": ["Netto"],
    "categories": ["Dairy & Eggs"],
    "latest_date": "2025-11-07"
  }
}
```

### 8. Search + Filter + Sort
```bash
curl "http://localhost:3000/api/deals?search=øko&category=Dairy%20%26%20Eggs&sortBy=price&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "normalized_name": "ØGO økologiske æg",
        "price": 26.0,
        "category": "Dairy & Eggs",
        "..."
      }
    ],
    "total_count": 2,
    "..."
  }
}
```

## Error Responses

### No Deals Data Available
```json
{
  "success": false,
  "error": "No deals data available. The sale directory is empty or does not exist."
}
```
**HTTP Status:** 404

### No Deals Found for Criteria
```json
{
  "success": false,
  "error": "No deals found for the specified criteria."
}
```
**HTTP Status:** 404

### Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error while fetching deals."
}
```
**HTTP Status:** 500

## Response Schema

### Success Response
```typescript
{
  success: true,
  data: {
    deals: DealWithStore[],      // Array of deals
    total_count: number,          // Number of deals returned
    stores: string[],             // Available stores
    categories: string[],         // All categories found
    latest_date: string           // Date folder used (YYYY-MM-DD)
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: string                   // Error message
}
```

## Deal Object Schema

```typescript
{
  // Product Information
  category: string,               // e.g., "Meat & Poultry"
  original_name: string,          // Original product name from scraper
  normalized_name: string,        // Cleaned product name

  // Pricing
  price: number,                  // Product price in DKK
  quantity: string,               // e.g., "500 g", "1 stk"
  unit_type: string,              // e.g., "g", "kg", "stk", "ml", "cl"
  price_per_unit: number,         // Price per unit for comparison
  is_app_price: boolean,          // True if app-only price

  // Store Information
  store_name: string,             // e.g., "Netto"
  store_slug: "netto" | "rema" | "meny",

  // Validity
  valid_from: string,             // ISO date (YYYY-MM-DD)
  valid_to: string,               // ISO date (YYYY-MM-DD)
  week_number: number             // Week number (1-53)
}
```

## Real Data Examples

### Cheapest Deal
```json
{
  "category": "Meat & Poultry",
  "normalized_name": "Løse bananer",
  "price": 1.5,
  "quantity": "30 stk",
  "unit_type": "stk",
  "price_per_unit": 0.05,
  "is_app_price": false,
  "store_name": "Netto",
  "store_slug": "netto",
  "valid_from": "2025-11-08",
  "valid_to": "2025-11-15",
  "week_number": 45
}
```

### App-Only Deal
```json
{
  "category": "Meat & Poultry",
  "normalized_name": "Gyros eller Velsmag dansk hakket grisekød 8-12%",
  "price": 29.0,
  "quantity": "1 stk",
  "unit_type": "stk",
  "price_per_unit": 29.0,
  "is_app_price": true,
  "store_name": "Netto",
  "store_slug": "netto",
  "valid_from": "2025-11-08",
  "valid_to": "2025-11-15",
  "week_number": 45
}
```

### High-Value Deal
```json
{
  "category": "Meat & Poultry",
  "normalized_name": "Premieur fritgående and",
  "price": 119.0,
  "quantity": "1 stk",
  "unit_type": "stk",
  "price_per_unit": 119.0,
  "is_app_price": false,
  "store_name": "Netto",
  "store_slug": "netto",
  "valid_from": "2025-11-08",
  "valid_to": "2025-11-15",
  "week_number": 45
}
```

## Integration Examples

### JavaScript/TypeScript (Fetch API)
```typescript
async function getDeals(filters?: {
  store?: 'netto' | 'rema' | 'meny';
  category?: string;
  search?: string;
  sortBy?: 'price' | 'price_per_unit' | 'name';
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();

  if (filters?.store) params.append('store', filters.store);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const response = await fetch(`/api/deals?${params}`);
  return response.json();
}

// Usage
const allDeals = await getDeals();
const nettoDeals = await getDeals({ store: 'netto' });
const cheapestFirst = await getDeals({ sortBy: 'price', sortOrder: 'asc' });
```

### React Hook
```typescript
import { useState, useEffect } from 'react';

function useDeals(filters) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/deals?${params}`);
        const data = await response.json();

        if (data.success) {
          setDeals(data.data.deals);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [filters]);

  return { deals, loading, error };
}
```

## Performance Considerations

- **File I/O**: API reads JSON files from disk on each request
- **Caching**: Consider implementing cache for production
- **Response Size**: Full dataset ~500+ deals can be large
- **Filtering**: Client-side filtering can reduce server load
- **Pagination**: Not currently implemented (all deals returned)

## Future Enhancements

1. **Pagination**: Add `limit` and `offset` parameters
2. **Caching**: Cache JSON data in memory
3. **Price Alerts**: Webhook for price changes
4. **Historical Data**: Access to previous weeks' deals
5. **Bulk Operations**: Multiple stores/categories in one request
6. **GraphQL**: Consider GraphQL API for more flexible queries
