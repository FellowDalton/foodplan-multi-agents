#!/usr/bin/env python3
"""
Complete execution script for remaining batches.
This prepares batch SQL files for execution via Claude Code MCP.
"""

from pathlib import Path
import json

def main():
    # Read batch files 4-7
    batches_to_execute = []

    for i in range(4, 8):
        batch_file = Path(f'sql_batches/batch_{i:03d}.sql')
        if batch_file.exists():
            with open(batch_file, 'r') as f:
                sql_content = f.read()

            # Count deals in this batch
            deals_count = sql_content.count("SELECT id FROM all_products WHERE name =")

            batches_to_execute.append({
                'batch_number': i,
                'file': str(batch_file),
                'deals_count': deals_count,
                'sql_size': len(sql_content)
            })

    print("=" * 60)
    print("REMAINING BATCHES TO EXECUTE")
    print("=" * 60)
    print()

    total_deals = sum(b['deals_count'] for b in batches_to_execute)

    for batch in batches_to_execute:
        print(f"Batch {batch['batch_number']}:")
        print(f"  File: {batch['file']}")
        print(f"  Deals: {batch['deals_count']}")
        print(f"  SQL Size: {batch['sql_size']:,} bytes")
        print()

    print("=" * 60)
    print(f"Total remaining deals: {total_deals}")
    print()
    print("To execute each batch, use:")
    print("  mcp__supabase__execute_sql with the SQL content from each file")
    print()

    # Save batch info to JSON
    with open('batch_execution_plan.json', 'w') as f:
        json.dump(batches_to_execute, f, indent=2)

    print("✓ Batch execution plan saved to: batch_execution_plan.json")


if __name__ == '__main__':
    main()
