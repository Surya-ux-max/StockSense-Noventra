"""
Stores Generator Module
Generates realistic representative Walmart store network (stores.csv).
"""

import numpy as np
import pandas as pd
from server.src.config import REGIONS, STORE_FORMATS, RANDOM_SEED, RAW_DATA_DIR

def generate_stores(num_stores: int = 35, seed: int = RANDOM_SEED) -> pd.DataFrame:
    np.random.seed(seed)
    
    stores = []
    store_counter = 1
    
    region_names = list(REGIONS.keys())
    # Distribute stores across 5 regions (~7 stores per region)
    stores_per_region = {r: num_stores // len(region_names) for r in region_names}
    remainder = num_stores % len(region_names)
    for i in range(remainder):
        stores_per_region[region_names[i]] += 1
        
    format_types = list(STORE_FORMATS.keys())
    format_probs = [STORE_FORMATS[f]["weight"] for f in format_types]
    
    for region_name, count in stores_per_region.items():
        reg_info = REGIONS[region_name]
        state = reg_info["state"]
        cities = reg_info["cities"]
        dc_id = reg_info["dc_id"]
        
        for i in range(count):
            store_id = f"WMT_{state}_{store_counter:03d}"
            city = cities[i % len(cities)]
            st_type = np.random.choice(format_types, p=format_probs)
            
            sqft_min, sqft_max = STORE_FORMATS[st_type]["sqft_range"]
            sqft = int(np.random.uniform(sqft_min, sqft_max))
            
            cust_min, cust_max = STORE_FORMATS[st_type]["cust_range"]
            # Customers correlate with floor area
            size_ratio = (sqft - sqft_min) / max(1, (sqft_max - sqft_min))
            avg_cust = int(cust_min + size_ratio * (cust_max - cust_min) + np.random.normal(0, 150))
            avg_cust = max(500, avg_cust)
            
            # Realistic distance to regional DC in miles (15 to 250 miles)
            distance_to_dc = round(float(np.random.uniform(18.0, 240.0)), 1)
            
            pickup_p = STORE_FORMATS[st_type]["pickup_prob"]
            delivery_p = STORE_FORMATS[st_type]["delivery_prob"]
            
            pickup_enabled = int(np.random.random() < pickup_p)
            delivery_enabled = int(np.random.random() < delivery_p)
            
            stores.append({
                "store_id": store_id,
                "state": state,
                "city": city,
                "store_type": st_type,
                "floor_area_sqft": sqft,
                "avg_daily_customers": avg_cust,
                "region": region_name,
                "distribution_center_id": dc_id,
                "distance_to_dc": distance_to_dc,
                "pickup_enabled": pickup_enabled,
                "delivery_enabled": delivery_enabled
            })
            store_counter += 1
            
    df_stores = pd.DataFrame(stores)
    return df_stores

if __name__ == "__main__":
    df = generate_stores()
    out_path = RAW_DATA_DIR / "stores.csv"
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} stores -> {out_path}")
