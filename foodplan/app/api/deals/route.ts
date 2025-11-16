import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { StoreDealsJSON, DealWithStore, DealsAPIResponse } from '@/types';

export const dynamic = 'force-dynamic';

// Path to the sale directory (relative to project root)
const SALE_DIR = path.join(process.cwd(), 'sale');

/**
 * Find the latest date folder in the sale directory
 */
function findLatestDateFolder(): string | null {
  try {
    if (!fs.existsSync(SALE_DIR)) {
      console.error('Sale directory does not exist:', SALE_DIR);
      return null;
    }

    const entries = fs.readdirSync(SALE_DIR, { withFileTypes: true });
    const dateFolders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => /^\d{4}-\d{2}-\d{2}$/.test(name)) // Match YYYY-MM-DD format
      .sort()
      .reverse(); // Most recent first

    return dateFolders.length > 0 ? dateFolders[0] : null;
  } catch (error) {
    console.error('Error finding latest date folder:', error);
    return null;
  }
}

/**
 * Read deals JSON file for a specific store
 */
function readStoreDeals(dateFolder: string, store: string): StoreDealsJSON | null {
  try {
    const filePath = path.join(SALE_DIR, dateFolder, `${store}_deals.json`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Deals file not found: ${filePath}`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data: StoreDealsJSON = JSON.parse(fileContent);

    return data;
  } catch (error) {
    console.error(`Error reading deals for ${store}:`, error);
    return null;
  }
}

/**
 * Convert store deals to deals with store information
 */
function enrichDealsWithStore(storeData: StoreDealsJSON, storeSlug: 'netto' | 'rema' | 'meny'): DealWithStore[] {
  return storeData.deals.map(deal => ({
    ...deal,
    store_name: storeData.store_name,
    store_slug: storeSlug,
    valid_from: storeData.valid_from,
    valid_to: storeData.valid_to,
    week_number: storeData.week_number,
  }));
}

/**
 * GET /api/deals
 * Query params:
 * - store: 'netto' | 'rema' | 'meny' (optional, filter by store)
 * - category: string (optional, filter by category)
 * - search: string (optional, search in product names)
 * - sortBy: 'price' | 'price_per_unit' | 'name' (optional)
 * - sortOrder: 'asc' | 'desc' (optional, default: 'asc')
 */
export async function GET(request: NextRequest) {
  try {
    // Find the latest date folder
    const latestDate = findLatestDateFolder();

    if (!latestDate) {
      return NextResponse.json<DealsAPIResponse>(
        {
          success: false,
          error: 'No deals data available. The sale directory is empty or does not exist.',
        },
        { status: 404 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const storeFilter = searchParams.get('store') as 'netto' | 'rema' | 'meny' | null;
    const categoryFilter = searchParams.get('category');
    const searchQuery = searchParams.get('search')?.toLowerCase();
    const sortBy = searchParams.get('sortBy') as 'price' | 'price_per_unit' | 'name' | null;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    // Determine which stores to read
    const storesToRead = storeFilter ? [storeFilter] : ['netto', 'rema', 'meny'];

    // Read all store deals
    let allDeals: DealWithStore[] = [];
    const availableStores: string[] = [];

    for (const store of storesToRead) {
      const storeData = readStoreDeals(latestDate, store);
      if (storeData) {
        const enrichedDeals = enrichDealsWithStore(
          storeData,
          store as 'netto' | 'rema' | 'meny'
        );
        allDeals = allDeals.concat(enrichedDeals);
        availableStores.push(storeData.store_name);
      }
    }

    if (allDeals.length === 0) {
      return NextResponse.json<DealsAPIResponse>(
        {
          success: false,
          error: 'No deals found for the specified criteria.',
        },
        { status: 404 }
      );
    }

    // Apply filters
    let filteredDeals = allDeals;

    // Category filter
    if (categoryFilter) {
      filteredDeals = filteredDeals.filter(
        deal => deal.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery) {
      filteredDeals = filteredDeals.filter(
        deal =>
          deal.normalized_name.toLowerCase().includes(searchQuery) ||
          deal.original_name.toLowerCase().includes(searchQuery)
      );
    }

    // Sort deals
    if (sortBy) {
      filteredDeals.sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
          case 'price':
            compareValue = a.price - b.price;
            break;
          case 'price_per_unit':
            compareValue = a.price_per_unit - b.price_per_unit;
            break;
          case 'name':
            compareValue = a.normalized_name.localeCompare(b.normalized_name);
            break;
        }

        return sortOrder === 'desc' ? -compareValue : compareValue;
      });
    }

    // Get unique categories
    const categories = Array.from(
      new Set(allDeals.map(deal => deal.category))
    ).sort();

    // Return response
    return NextResponse.json<DealsAPIResponse>({
      success: true,
      data: {
        deals: filteredDeals,
        total_count: filteredDeals.length,
        stores: availableStores,
        categories: categories,
        latest_date: latestDate,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/deals:', error);
    return NextResponse.json<DealsAPIResponse>(
      {
        success: false,
        error: 'Internal server error while fetching deals.',
      },
      { status: 500 }
    );
  }
}
