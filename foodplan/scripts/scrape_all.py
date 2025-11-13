#!/usr/bin/env python3
"""
Master script to scrape all grocery store deals.
Runs Netto, Meny, and Rema 1000 scrapers sequentially.
"""
import subprocess
import sys
import os
from datetime import datetime

def run_script(script_name, store_name):
    """Run a scraping script and report results."""
    print(f"\n{'='*60}")
    print(f"Starting {store_name} scraper...")
    print(f"{'='*60}\n")

    try:
        result = subprocess.run(
            [sys.executable, script_name],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=False,
            text=True
        )

        if result.returncode == 0:
            print(f"\n✓ {store_name} scraping completed successfully!")
            return True
        else:
            print(f"\n✗ {store_name} scraping failed with return code {result.returncode}")
            return False
    except Exception as e:
        print(f"\n✗ Error running {store_name} scraper: {e}")
        return False

def main():
    print("=" * 60)
    print("Grocery Store Deals Scraper")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    scripts = [
        ("scrape_netto.py", "Netto"),
        ("scrape_meny.py", "Meny"),
        ("scrape_rema.py", "Rema 1000"),
    ]

    results = {}

    for script_file, store_name in scripts:
        if os.path.exists(script_file):
            results[store_name] = run_script(script_file, store_name)
        else:
            print(f"\n✗ Script not found: {script_file}")
            results[store_name] = False

    # Print summary
    print("\n" + "=" * 60)
    print("SCRAPING SUMMARY")
    print("=" * 60)

    for store_name, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{store_name:15s} - {status}")

    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Return exit code based on results
    if all(results.values()):
        print("\n✓ All scrapers completed successfully!")
        return 0
    else:
        print(f"\n⚠ {sum(1 for v in results.values() if not v)} scraper(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
