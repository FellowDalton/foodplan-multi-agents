#!/bin/bash
# Automated Netto deal updater
# Can be run via cron for scheduled updates

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "======================================"
echo "Netto Deal Updater"
echo "Started at: $(date)"
echo "======================================"

# Run the scraper
python3 scrape_netto.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Netto deals updated successfully!"
    echo "Completed at: $(date)"

    # Optional: Commit changes to git
    # Uncomment the lines below if you want automatic git commits
    # TODAY=$(date +%Y-%m-%d)
    # git add "sale/${TODAY}/netto_deals.json"
    # git commit -m "Auto-update: Netto deals for ${TODAY}"
    # git push
else
    echo ""
    echo "✗ Failed to update Netto deals"
    exit 1
fi
