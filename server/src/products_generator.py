"""
Products Generator Module
Generates Walmart product hierarchy, pricing, shelf life, and supplier attributes (products.csv).
"""

import numpy as np
import pandas as pd
from server.src.config import RANDOM_SEED, RAW_DATA_DIR

PRODUCT_TAXONOMY = [
    # Department, Category, Sub-Category, Brands, ShelfLifeRange, IsPerishable, BaseMRP Range, Margin Range, CasePackOptions
    ("Dairy", "Dairy Products", "Fresh Milk", ["Great Value", "Horizon Organic", "Fairlife"], (7, 14), 1, (3.28, 5.48), (0.16, 0.24), [6, 12]),
    ("Dairy", "Dairy Products", "Yogurt", ["Chobani", "Dannon", "Great Value", "Oikos"], (14, 30), 1, (1.24, 4.98), (0.20, 0.30), [12, 24]),
    ("Dairy", "Dairy Products", "Cheese & Butter", ["Kraft", "Great Value", "Sargento", "Tillamook"], (45, 90), 1, (2.98, 7.48), (0.22, 0.32), [12, 24]),
    
    ("Beverages", "Soft Drinks", "Carbonated Drinks", ["Coca-Cola", "Pepsi", "Dr Pepper", "Sprite"], (180, 365), 0, (2.28, 7.98), (0.25, 0.38), [12, 24]),
    ("Beverages", "Water", "Bottled Water", ["Great Value", "Dasani", "Aquafina", "Fiji"], (365, 730), 0, (1.98, 6.48), (0.30, 0.45), [12, 24, 32]),
    ("Beverages", "Juice", "Refrigerated Juice", ["Tropicana", "Simply Orange", "Minute Maid"], (21, 45), 1, (3.48, 5.98), (0.20, 0.32), [6, 12]),
    ("Beverages", "Coffee & Tea", "Ground Coffee", ["Folgers", "Starbucks", "Great Value"], (180, 365), 0, (6.98, 14.98), (0.25, 0.35), [6, 12]),
    
    ("Snacks", "Salty Snacks", "Potato Chips", ["Lay's", "Ruffles", "Pringles", "Great Value"], (90, 180), 0, (2.48, 4.78), (0.30, 0.42), [12, 24]),
    ("Snacks", "Salty Snacks", "Tortilla & Pretzels", ["Doritos", "Tostitos", "Snyder's"], (90, 180), 0, (2.98, 5.28), (0.28, 0.40), [12, 24]),
    ("Snacks", "Sweet Snacks", "Cookies & Biscuits", ["Oreo", "Chips Ahoy!", "Great Value"], (120, 240), 0, (2.88, 4.98), (0.28, 0.38), [12, 24]),
    ("Snacks", "Healthy Snacks", "Nuts & Dried Fruit", ["Planters", "Great Value", "Wonderful"], (180, 365), 0, (4.98, 11.98), (0.25, 0.35), [12, 24]),
    
    ("Grocery", "Pantry Staples", "Pasta & Noodles", ["Barilla", "Great Value", "Kraft Mac"], (365, 730), 0, (1.18, 3.48), (0.22, 0.35), [12, 24]),
    ("Grocery", "Pantry Staples", "Rice & Grains", ["Mahatma", "Great Value", "Uncle Ben's"], (365, 730), 0, (2.48, 8.98), (0.20, 0.30), [6, 12]),
    ("Grocery", "Canned Goods", "Canned Vegetables & Soup", ["Campbell's", "Green Giant", "Great Value"], (365, 1095), 0, (1.28, 3.28), (0.25, 0.38), [12, 24]),
    ("Grocery", "Cooking & Baking", "Cooking Oils", ["Crisco", "Great Value", "Wesson", "Bertolli"], (365, 730), 0, (3.98, 12.48), (0.18, 0.28), [6, 12]),
    
    ("Frozen", "Frozen Meals", "Pizza & Entrees", ["DiGiorno", "Stouffer's", "Hot Pockets"], (180, 365), 1, (3.98, 8.48), (0.22, 0.34), [8, 16]),
    ("Frozen", "Ice Cream", "Tubs & Bars", ["Ben & Jerry's", "Breyers", "Great Value"], (180, 365), 1, (3.48, 6.48), (0.25, 0.35), [8, 12]),
    ("Frozen", "Frozen Produce", "Frozen Vegetables & Fruit", ["Birds Eye", "Great Value"], (270, 365), 1, (1.88, 4.28), (0.20, 0.32), [12, 24]),
    
    ("Household", "Cleaning Supplies", "Disinfectants & Sprays", ["Lysol", "Clorox", "Great Value"], (730, 1095), 0, (3.28, 7.98), (0.30, 0.45), [6, 12]),
    ("Household", "Paper Goods", "Paper Towels & Tissue", ["Bounty", "Charmin", "Scott", "Great Value"], (1095, 1825), 0, (6.48, 19.98), (0.25, 0.35), [4, 8, 12]),
    ("Household", "Laundry", "Detergent & Softener", ["Tide", "Gain", "all", "Great Value"], (730, 1095), 0, (7.98, 18.98), (0.25, 0.38), [4, 8]),
    
    ("Personal Care", "Hair Care", "Shampoo & Conditioner", ["Head & Shoulders", "Pantene", "Dove"], (730, 1095), 0, (4.48, 9.98), (0.35, 0.48), [6, 12]),
    ("Personal Care", "Body Care", "Body Wash & Soap", ["Dove", "Irish Spring", "Dial", "Equate"], (730, 1095), 0, (3.48, 7.98), (0.35, 0.50), [6, 12]),
    ("Personal Care", "Oral Care", "Toothpaste & Brushes", ["Colgate", "Crest", "Oral-B", "Equate"], (730, 1095), 0, (2.98, 6.48), (0.35, 0.48), [12, 24]),
    
    ("Health & Wellness", "OTC Medicine", "Pain Relief & Cold", ["Tylenol", "Advil", "Equate", "DayQuil"], (730, 1095), 0, (4.98, 14.48), (0.35, 0.52), [12, 24]),
    ("Health & Wellness", "Vitamins", "Daily Supplements", ["Nature Made", "One A Day", "Equate"], (730, 1095), 0, (7.98, 18.48), (0.40, 0.55), [12, 24]),
    
    ("Beauty", "Skin Care", "Moisturizers & Lotions", ["Neutrogena", "CeraVe", "Olay", "Equate"], (730, 1095), 0, (6.98, 19.98), (0.38, 0.52), [6, 12]),
    ("Beauty", "Cosmetics", "Lip & Eye Care", ["Maybelline", "L'Oreal", "CoverGirl"], (730, 1095), 0, (5.48, 12.98), (0.40, 0.55), [12, 24]),
    
    ("Pet Supplies", "Dog Food", "Dry & Wet Dog Food", ["Purina", "Pedigree", "Blue Buffalo"], (180, 365), 0, (8.98, 28.98), (0.22, 0.32), [4, 8]),
    ("Pet Supplies", "Cat Care", "Cat Litter & Food", ["Tidy Cats", "Friskies", "Meow Mix"], (365, 730), 0, (6.48, 18.48), (0.25, 0.35), [4, 6]),
    
    ("Home", "Kitchenware", "Cookware & Storage", ["Mainstays", "Pyrex", "Rubbermaid"], (1825, 3650), 0, (5.98, 24.98), (0.35, 0.50), [4, 8]),
    ("Apparel", "Basics", "Socks & Underwear", ["Hanes", "Fruit of the Loom", "George"], (1825, 3650), 0, (7.98, 16.98), (0.35, 0.48), [6, 12]),
    ("Toys", "Board Games", "Family Games", ["Hasbro", "Mattel", "LEGO"], (1825, 3650), 0, (9.98, 29.98), (0.30, 0.45), [6, 10]),
    ("Electronics", "Accessories", "Cables & Power", ["onn.", "Anker", "Belkin"], (1825, 3650), 0, (6.88, 22.88), (0.40, 0.55), [10, 20])
]

def generate_products(target_count: int = 350, seed: int = RANDOM_SEED) -> pd.DataFrame:
    np.random.seed(seed)
    
    products = []
    prod_counter = 1
    
    # Calculate how many products per sub-category
    items_per_group = max(1, target_count // len(PRODUCT_TAXONOMY))
    extra = target_count - (items_per_group * len(PRODUCT_TAXONOMY))
    
    supplier_map = {}
    supplier_counter = 1
    
    for idx, (dept, cat, subcat, brands, shelf_range, is_perish, mrp_range, margin_range, case_packs) in enumerate(PRODUCT_TAXONOMY):
        count = items_per_group + (1 if idx < extra else 0)
        
        # Suppliers are typically aligned with department/category
        sup_key = f"{dept}_{cat}"
        if sup_key not in supplier_map:
            supplier_map[sup_key] = f"SUP_{dept[:3].upper()}_{supplier_counter:02d}"
            supplier_counter += 1
        supplier_id = supplier_map[sup_key]
        
        for i in range(count):
            product_id = f"PRD_{prod_counter:04d}"
            brand = np.random.choice(brands)
            
            # Pricing: MRP and Cost Price
            mrp = round(float(np.random.uniform(mrp_range[0], mrp_range[1])), 2)
            margin = float(np.random.uniform(margin_range[0], margin_range[1]))
            cost_price = round(mrp * (1.0 - margin), 2)
            # Ensure cost < mrp strictly
            if cost_price >= mrp:
                cost_price = round(mrp * 0.75, 2)
                
            shelf_life_days = int(np.random.uniform(shelf_range[0], shelf_range[1]))
            case_pack_qty = int(np.random.choice(case_packs))
            
            products.append({
                "product_id": product_id,
                "department": dept,
                "category": cat,
                "sub_category": subcat,
                "brand": brand,
                "mrp": mrp,
                "cost_price": cost_price,
                "shelf_life_days": shelf_life_days,
                "supplier_id": supplier_id,
                "case_pack_qty": case_pack_qty,
                "perishable_flag": is_perish
            })
            prod_counter += 1
            
    df_products = pd.DataFrame(products)
    return df_products

if __name__ == "__main__":
    df = generate_products(350)
    out_path = RAW_DATA_DIR / "products.csv"
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} products -> {out_path}")
