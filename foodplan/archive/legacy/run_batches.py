#!/usr/bin/env python3
"""
Script to display SQL batches for manual execution via Claude Code MCP.
Since we can't call MCP directly from Python, this script will output
the instructions for Claude Code to execute each batch.
"""

from pathlib import Path

def main():
    sql_dir = Path(__file__).parent / 'sql_batches'
    batch_files = sorted(sql_dir.glob('batch_*.sql'))

    print(f"Found {len(batch_files)} SQL batch files to execute\n")
    print("=" * 60)
    print("INSTRUCTIONS FOR CLAUDE CODE:")
    print("=" * 60)
    print()
    print("Please execute each batch using the mcp__supabase__execute_sql tool.")
    print("For each batch file listed below:")
    print("1. Read the file content using: cat sql_batches/batch_XXX.sql")
    print("2. Execute via MCP: mcp__supabase__execute_sql")
    print()
    print("Batch files:")
    for i, batch_file in enumerate(batch_files, 1):
        print(f"  {i}. {batch_file.name}")

    print()
    print("=" * 60)


if __name__ == '__main__':
    main()
