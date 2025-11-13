#!/usr/bin/env python3
"""
Script to insert parsed deals from JSON into Supabase database.
This generates SQL statements that can be executed via MCP.
"""

import json
from pathlib import Path
from typing import Dict, List, Set


def generate_insert_sql(parsed_data: List[Dict]) -> str:
    """
    Generate SQL INSERT statements for all deals in the parsed data.
    """

    # Store mapping (name to slug)
    store_mapping = {
        'Netto': 'netto',
        'Rema': 'rema',
        'Rema 1000': 'rema',
        'Meny': 'meny'
    }

    # Track unique products to avoid duplicates
    unique_products: Dict[tuple, str] = {}  # (normalized_name, category) -> product_id variable
    product_counter = 1

    # Track unique categories
    unique_categories: Set[str] = set()

    sql_parts = []
    sql_parts.append("-- Generated SQL for inserting deals")
    sql_parts.append("-- This script uses CTEs to insert products and then deals\n")

    # Collect all unique products and categories
    for store_data in parsed_data:
        for deal in store_data['deals']:
            unique_categories.add(deal['category'])
            key = (deal['normalized_name'], deal['category'])
            if key not in unique_products:
                unique_products[key] = f"p{product_counter}"
                product_counter += 1

    sql_parts.append("WITH")

    # Step 1: Get store IDs
    sql_parts.append("  stores_map AS (")
    sql_parts.append("    SELECT id, slug FROM stores")
    sql_parts.append("  ),")

    # Step 2: Get category IDs
    sql_parts.append("  categories_map AS (")
    sql_parts.append("    SELECT id, name FROM categories")
    sql_parts.append("  ),")

    # Step 3: Insert products and get their IDs
    sql_parts.append("  new_products AS (")
    sql_parts.append("    INSERT INTO products (name, category_id)")
    sql_parts.append("    VALUES")

    product_values = []
    for (normalized_name, category), var_name in unique_products.items():
        # Escape single quotes in product names
        escaped_name = normalized_name.replace("'", "''")
        product_values.append(
            f"      ('{escaped_name}', (SELECT id FROM categories_map WHERE name = '{category}'))"
        )

    sql_parts.append(",\n".join(product_values))
    sql_parts.append("    RETURNING id, name, category_id")
    sql_parts.append("  )")

    # Step 4: Insert deals
    sql_parts.append("INSERT INTO deals (")
    sql_parts.append("  product_id, store_id, original_name, price,")
    sql_parts.append("  quantity, price_per_unit, unit_type, is_app_price,")
    sql_parts.append("  valid_from, valid_to, scraped_at")
    sql_parts.append(")")
    sql_parts.append("VALUES")

    deal_values = []
    for store_data in parsed_data:
        store_slug = store_mapping[store_data['store_name']]

        for deal in store_data['deals']:
            # Escape single quotes
            original_name = deal['original_name'].replace("'", "''")
            normalized_name = deal['normalized_name'].replace("'", "''")
            category = deal['category']

            # Format values
            price = deal['price']
            quantity = f"'{deal['quantity']}'" if deal['quantity'] else "NULL"
            price_per_unit = deal['price_per_unit'] if deal['price_per_unit'] else "NULL"
            unit_type = f"'{deal['unit_type']}'" if deal['unit_type'] else "NULL"
            is_app_price = 'TRUE' if deal['is_app_price'] else 'FALSE'
            valid_from = f"'{deal['valid_from']}'" if deal['valid_from'] else "NULL"
            valid_to = f"'{deal['valid_to']}'" if deal['valid_to'] else "NULL"
            scraped_at = f"'{deal['scraped_at']}'"

            deal_values.append(
                f"  ((SELECT id FROM new_products WHERE name = '{normalized_name}' AND category_id = (SELECT id FROM categories_map WHERE name = '{category}') LIMIT 1), "
                f"(SELECT id FROM stores_map WHERE slug = '{store_slug}'), "
                f"'{original_name}', {price}, {quantity}, {price_per_unit}, {unit_type}, "
                f"{is_app_price}, {valid_from}, {valid_to}, {scraped_at})"
            )

    sql_parts.append(",\n".join(deal_values))
    sql_parts.append(";")

    return "\n".join(sql_parts)


def main():
    """Main function to generate SQL from parsed JSON."""
    json_file = Path(__file__).parent / 'parsed_deals.json'

    if not json_file.exists():
        print(f"Error: {json_file} not found")
        print("Run ingest_deals.py first to generate the JSON file")
        return

    with open(json_file, 'r', encoding='utf-8') as f:
        parsed_data = json.load(f)

    print(f"Loaded {len(parsed_data)} store datasets")
    total_deals = sum(len(store['deals']) for store in parsed_data)
    print(f"Total deals to insert: {total_deals}")

    # Generate SQL
    sql = generate_insert_sql(parsed_data)

    # Save to file
    output_file = Path(__file__).parent / 'insert_deals.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql)

    print(f"\n✓ SQL generated successfully")
    print(f"✓ Saved to: {output_file}")
    print(f"\nNext step: Execute the SQL file via Claude Code MCP")
    print(f"  Total products to create: {sql.count('INSERT INTO products')}")
    print(f"  Total deals to insert: {total_deals}")


if __name__ == '__main__':
    main()
