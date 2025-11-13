#!/usr/bin/env python3
import requests
import json
import re
from datetime import datetime

def extract_quantity_info(description, heading):
    """Extract quantity information from description and heading."""
    text = f"{heading} {description}"

    # Common patterns
    quantity = None
    unit_type = None

    # Look for weight patterns (g, kg)
    weight_match = re.search(r'(\d+(?:[.,]\d+)?)\s*(kg|g)\b', text, re.IGNORECASE)
    if weight_match:
        quantity = weight_match.group(1).replace(',', '.')
        unit_type = weight_match.group(2).lower()
        quantity = f"{quantity} {unit_type}"

    # Look for volume patterns (l, ml, cl)
    elif re.search(r'(\d+(?:[.,]\d+)?)\s*(l|ml|cl)\b', text, re.IGNORECASE):
        vol_match = re.search(r'(\d+(?:[.,]\d+)?)\s*(l|ml|cl)\b', text, re.IGNORECASE)
        quantity = vol_match.group(1).replace(',', '.')
        unit_type = vol_match.group(2).lower()
        quantity = f"{quantity} {unit_type}"

    # Look for piece patterns (stk, pak, etc)
    elif re.search(r'(\d+)\s*[-‐]?\s*(stk|pak|pack)', text, re.IGNORECASE):
        piece_match = re.search(r'(\d+)\s*[-‐]?\s*(stk|pak|pack)', text, re.IGNORECASE)
        quantity = f"{piece_match.group(1)} stk"
        unit_type = "stk"

    # Look for multi-pack patterns like "8-pak"
    elif re.search(r'(\d+)\s*[-‐]\s*pak', text, re.IGNORECASE):
        pack_match = re.search(r'(\d+)\s*[-‐]\s*pak', text, re.IGNORECASE)
        quantity = f"{pack_match.group(1)} stk"
        unit_type = "stk"

    # Default to 1 stk if no quantity found
    if not quantity:
        quantity = "1 stk"
        unit_type = "stk"

    return quantity, unit_type

def calculate_price_per_unit(price, quantity, unit_type):
    """Calculate price per base unit."""
    if not quantity or not unit_type:
        return None

    try:
        # Extract numeric value from quantity
        qty_match = re.search(r'(\d+(?:[.,]\d+)?)', quantity.replace(',', '.'))
        if not qty_match:
            return None

        qty_value = float(qty_match.group(1))

        # Convert to base unit
        if unit_type == 'g':
            # Price per kg
            price_per_unit = (price / qty_value) * 1000
        elif unit_type == 'kg':
            price_per_unit = price / qty_value
        elif unit_type == 'ml' or unit_type == 'cl':
            # Price per liter
            if unit_type == 'ml':
                price_per_unit = (price / qty_value) * 1000
            else:  # cl
                price_per_unit = (price / qty_value) * 100
        elif unit_type == 'l':
            price_per_unit = price / qty_value
        elif unit_type == 'stk':
            price_per_unit = price / qty_value
        else:
            price_per_unit = None

        return round(price_per_unit, 2) if price_per_unit else None
    except:
        return None

def categorize_product(heading, description):
    """Categorize product based on heading and description."""
    text = f"{heading} {description}".lower()

    # Meat & Poultry
    if any(word in text for word in ['kød', 'gris', 'okse', 'kalv', 'lam', 'kylling', 'and', 'kotelet', 'steg', 'hakket', 'bacon', 'hamburgerryg', 'nakke', 'culotte']):
        return "Meat & Poultry"

    # Deli & Cold Cuts
    if any(word in text for word in ['pølse', 'leverpostej', 'spegepølse', 'pålæg', 'salat']):
        return "Deli & Cold Cuts"

    # Seafood
    if any(word in text for word in ['laks', 'fisk', 'reje', 'sild', 'fiske']):
        return "Seafood"

    # Bread & Bakery
    if any(word in text for word in ['brød', 'baguette', 'rugbrød', 'æbleskiver']):
        return "Bread & Bakery"

    # Dairy & Eggs
    if any(word in text for word in ['æg', 'ost', 'yoghurt', 'mælk', 'feta', 'mozzarella', 'fraiche', 'smør', 'protein mousse', 'drikkeyoghurt', 'actimel', 'philadelphia', 'buko', 'smelteost']):
        return "Dairy & Eggs"

    # Fruits & Vegetables
    if any(word in text for word in ['banan', 'tomat', 'frugt', 'grønt', 'mango', 'appelsin', 'dadler', 'figner', 'porre', 'champignon', 'granatæble']):
        return "Fruits & Vegetables"

    # Pasta & International
    if any(word in text for word in ['pasta', 'specialiteter', 'gyros']):
        return "Pasta & International"

    # Pantry & Condiments
    if any(word in text for word in ['sauce', 'remoulade', 'mayonnaise', 'ærter', 'kartofler', 'suppe', 'passata', 'mel']):
        return "Pantry & Condiments"

    # Spreads & Butter
    if any(word in text for word in ['kærgården', 'marmelade']):
        return "Spreads & Butter"

    # Sweets & Snacks
    if any(word in text for word in ['chips', 'slik', 'marabou', 'chocolate', 'chokolade', 'kiks', 'cookies', 'flødeboller', 'nødder', 'granola']):
        return "Sweets & Snacks"

    # Coffee & Tea
    if any(word in text for word in ['kaffe', 'te', 'chai latte']):
        return "Coffee & Tea"

    # Beverages
    if any(word in text for word in ['sodavand', 'øl', 'vin', 'gløgg', 'energy', 'vitamin well', 'pepsi', 'coca-cola', 'faxe', 'juice', 'drik']):
        return "Beverages"

    # Frozen Foods
    if any(word in text for word in ['is', 'pizza', 'tø og server', 'færdigret']) and 'isbar' in text:
        return "Frozen Foods"

    # Plant-Based
    if any(word in text for word in ['plantedrik', 'naturli', 'den grønne slagter']):
        return "Plant-Based"

    # Special Offers (default for food items)
    return "Special Offers"

def is_app_price(heading, description):
    """Check if price requires Rema 1000 app."""
    text = f"{heading} {description}"
    return 'app-pris' in text.lower() or 'app pris' in text.lower()

def get_latest_publication():
    """Get the latest REMA 1000 publication ID."""
    try:
        print("Note: You may need to update the publication_id manually")
        print("Check https://etilbudsavis.dk/REMA-1000 for the latest publication")

        # Return a default - user should update this
        return input("Enter REMA 1000 publication ID (from URL ?publication=XXXXX): ").strip()
    except:
        return None

def main():
    publication_id = get_latest_publication()

    if not publication_id:
        print("Could not determine publication ID. Exiting.")
        return

    # Use default page count
    page_count = 40
    print(f"Using default page count: {page_count} pages")

    # Get all offer IDs
    print("Fetching offer IDs from all pages...")
    offer_ids = []
    for page in range(1, page_count + 1):
        try:
            response = requests.get(f'https://publication-viewer.tjek.com/api/paged-publications/{publication_id}/{page}')
            data = response.json()

            if 'hotspots' in data:
                for hotspot in data['hotspots']:
                    if 'offer' in hotspot and 'id' in hotspot['offer']:
                        offer_ids.append(hotspot['offer']['id'])
        except Exception as e:
            print(f"Error fetching page {page}: {e}")

    print(f"Found {len(offer_ids)} offers")

    # Fetch detailed information for each offer
    print("Fetching detailed offer information...")
    deals = []

    for i, offer_id in enumerate(offer_ids):
        try:
            response = requests.get(f'https://squid-api.tjek.com/v2/offers/{offer_id}')
            if response.status_code == 200:
                offer = response.json()

                heading = offer.get('heading', '')
                description = offer.get('description', '')
                price = offer.get('pricing', {}).get('price')

                if price is None:
                    continue

                # Extract quantity info
                quantity, unit_type = extract_quantity_info(description, heading)

                # Calculate price per unit
                price_per_unit = calculate_price_per_unit(price, quantity, unit_type)

                # Categorize
                category = categorize_product(heading, description)

                # Check if app price
                is_app = is_app_price(heading, description)

                # Normalize name (remove quantity info)
                normalized_name = heading

                deal = {
                    "category": category,
                    "original_name": heading,
                    "normalized_name": normalized_name,
                    "price": float(price),
                    "quantity": quantity,
                    "unit_type": unit_type,
                    "price_per_unit": price_per_unit,
                    "is_app_price": is_app
                }

                deals.append(deal)

                if (i + 1) % 20 == 0:
                    print(f"Processed {i + 1}/{len(offer_ids)} offers...")

        except Exception as e:
            print(f"Error fetching offer {offer_id}: {e}")

    print(f"Successfully processed {len(deals)} deals")

    # Get validity dates
    valid_from = input("Enter valid_from date (YYYY-MM-DD): ").strip()
    valid_to = input("Enter valid_to date (YYYY-MM-DD): ").strip()
    week_number = input("Enter week number: ").strip()

    # Create final JSON structure
    output = {
        "store_name": "Rema 1000",
        "scraped_at": datetime.now().isoformat(),
        "valid_from": valid_from,
        "valid_to": valid_to,
        "week_number": int(week_number) if week_number else 0,
        "deals": deals
    }

    # Save to file
    output_dir = "/Users/dalton/projects/foodplan/sale/2025-11-07"
    import os
    os.makedirs(output_dir, exist_ok=True)

    output_file = f"{output_dir}/rema_deals.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(deals)} deals to {output_file}")

if __name__ == "__main__":
    main()
