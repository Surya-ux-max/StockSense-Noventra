"""
Demand Simulation Module
Simulates realistic, causal-driven daily demand for Store x Product combinations across time.
"""

import numpy as np
import pandas as pd
from datetime import datetime
from server.src.config import RANDOM_SEED, START_DATE, NUM_DAYS, NUM_ACTIVE_PAIRS

def select_active_assortment(stores_df: pd.DataFrame, products_df: pd.DataFrame, num_pairs: int = NUM_ACTIVE_PAIRS, seed: int = RANDOM_SEED):
    """
    Selects realistic store-product assortment pairs.
    Supercenters carry more variety; Neighborhood Markets focus on Grocery/Consumables; Small Formats carry essentials.
    """
    np.random.seed(seed)
    pairs = []
    
    # Classify product department types
    fresh_grocery = ["Dairy", "Beverages", "Snacks", "Grocery", "Frozen"]
    household_pc = ["Household", "Personal Care", "Health & Wellness", "Beauty", "Pet Supplies"]
    general_merch = ["Home", "Apparel", "Toys", "Electronics"]
    
    # Store formats
    stores_list = stores_df.to_dict(orient="records")
    products_list = products_df.to_dict(orient="records")
    
    # Base velocity assignment for each product
    for p in products_list:
        dept = p["department"]
        subcat = p["sub_category"]
        if dept in ["Dairy", "Beverages"] or "Chips" in subcat or "Water" in subcat or "Milk" in subcat:
            p["velocity_tier"] = "high"
            p["base_daily_demand"] = np.random.uniform(25.0, 55.0)
            p["promo_sensitivity"] = np.random.uniform(1.35, 1.70)
            p["weather_sensitivity"] = 1.30 if dept == "Beverages" or "Ice Cream" in subcat else 1.05
        elif dept in ["Snacks", "Grocery", "Household", "Personal Care", "Frozen"]:
            p["velocity_tier"] = "medium"
            p["base_daily_demand"] = np.random.uniform(10.0, 24.0)
            p["promo_sensitivity"] = np.random.uniform(1.20, 1.45)
            p["weather_sensitivity"] = 1.0
        else:
            p["velocity_tier"] = "low"
            p["base_daily_demand"] = np.random.uniform(2.0, 7.5)
            p["promo_sensitivity"] = np.random.uniform(1.10, 1.25)
            p["weather_sensitivity"] = 1.0
            
    prod_lookup = {p["product_id"]: p for p in products_list}
    
    # Allocate pairs across stores proportionally to store size
    pairs_per_store = {}
    total_assigned = 0
    for s in stores_list:
        st_type = s["store_type"]
        if st_type == "Supercenter":
            k = 11
        elif st_type == "Neighborhood Market":
            k = 8
        else:
            k = 5
        pairs_per_store[s["store_id"]] = k
        total_assigned += k
        
    # Adjust to hit exactly num_pairs
    diff = num_pairs - total_assigned
    store_ids = list(pairs_per_store.keys())
    i = 0
    while diff != 0:
        s_id = store_ids[i % len(store_ids)]
        if diff > 0:
            pairs_per_store[s_id] += 1
            diff -= 1
        else:
            if pairs_per_store[s_id] > 4:
                pairs_per_store[s_id] -= 1
                diff += 1
        i += 1
        
    pair_records = []
    for s in stores_list:
        s_id = s["store_id"]
        st_type = s["store_type"]
        target_k = pairs_per_store[s_id]
        
        # Candidate pool based on store format
        if st_type == "Supercenter":
            candidates = products_list
        elif st_type == "Neighborhood Market":
            candidates = [p for p in products_list if p["department"] in fresh_grocery + household_pc]
        else:
            candidates = [p for p in products_list if p["department"] in fresh_grocery]
            
        chosen_indices = np.random.choice(len(candidates), size=min(target_k, len(candidates)), replace=False)
        for idx in chosen_indices:
            p = candidates[idx]
            pair_records.append({
                "store_id": s_id,
                "product_id": p["product_id"],
                "store_type": st_type,
                "state": s["state"],
                "city": s["city"],
                "avg_daily_customers": s["avg_daily_customers"],
                "distance_to_dc": s["distance_to_dc"],
                "base_daily_demand": p["base_daily_demand"],
                "promo_sensitivity": p["promo_sensitivity"],
                "weather_sensitivity": p["weather_sensitivity"],
                "velocity_tier": p["velocity_tier"]
            })
            
    return pd.DataFrame(pair_records), prod_lookup

def simulate_daily_demand(pairs_df: pd.DataFrame, ext_df: pd.DataFrame, prod_lookup: dict, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """
    Simulates daily demand for each store x product x date with causal relationships.
    """
    np.random.seed(seed)
    
    dates = pd.date_range(start=START_DATE, periods=NUM_DAYS, freq="D").strftime("%Y-%m-%d").tolist()
    
    # Index external factors by (date, city, state)
    ext_lookup = {(r["date"], r["city"], r["state"]): r for r in ext_df.to_dict(orient="records")}
    
    demand_records = []
    
    for _, pair in pairs_df.iterrows():
        s_id = pair["store_id"]
        p_id = pair["product_id"]
        city = pair["city"]
        state = pair["state"]
        p_info = prod_lookup[p_id]
        dept = p_info["department"]
        subcat = p_info["sub_category"]
        base_demand = pair["base_daily_demand"]
        promo_sens = pair["promo_sensitivity"]
        weather_sens = pair["weather_sensitivity"]
        
        # Store demand multiplier (based on customer footfall)
        store_multiplier = pair["avg_daily_customers"] / 3200.0
        
        # Periodic promotions (e.g. active every 2-3 weeks for 4-7 days)
        promo_active_days = set()
        promo_start_1 = int(np.random.uniform(5, 12))
        promo_dur_1 = int(np.random.uniform(4, 7))
        promo_start_2 = int(np.random.uniform(28, 36))
        promo_dur_2 = int(np.random.uniform(4, 7))
        for d_idx in range(promo_start_1, promo_start_1 + promo_dur_1):
            if d_idx < NUM_DAYS:
                promo_active_days.add(dates[d_idx])
        for d_idx in range(promo_start_2, promo_start_2 + promo_dur_2):
            if d_idx < NUM_DAYS:
                promo_active_days.add(dates[d_idx])
                
        for dt_idx, dt_str in enumerate(dates):
            ext = ext_lookup.get((dt_str, city, state), {})
            dt = datetime.strptime(dt_str, "%Y-%m-%d")
            
            # 1. Day of Week Effect
            dow = dt.weekday()
            if dow in [4, 5, 6]:  # Fri, Sat, Sun
                dow_mult = 1.25 if dept in ["Snacks", "Beverages", "Dairy", "Frozen"] else 1.12
            elif dow in [1, 2]:   # Tue, Wed
                dow_mult = 0.90
            else:
                dow_mult = 1.00
                
            # 2. Promotion & Pricing
            is_promo = 1 if dt_str in promo_active_days else 0
            if is_promo:
                discount_pct = round(float(np.random.uniform(0.12, 0.28)), 2)
                promo_mult = 1.0 + (promo_sens - 1.0) * (discount_pct / 0.20)
                selling_price = round(p_info["mrp"] * (1.0 - discount_pct), 2)
            else:
                # Occasional slight rollback
                if np.random.random() < 0.08:
                    discount_pct = round(float(np.random.uniform(0.05, 0.10)), 2)
                    promo_mult = 1.08
                    selling_price = round(p_info["mrp"] * (1.0 - discount_pct), 2)
                else:
                    discount_pct = 0.0
                    promo_mult = 1.0
                    selling_price = p_info["mrp"]
                    
            # 3. Weather Effect
            temp_c = ext.get("temp_c", 15.0)
            rain_mm = ext.get("rain_mm", 0.0)
            snow_mm = ext.get("snow_mm", 0.0)
            extreme_weather = ext.get("extreme_weather_flag", 0)
            
            weather_mult = 1.0
            if dept == "Beverages" or "Ice Cream" in subcat:
                # Temperature sensitivity: higher in hot weather
                if temp_c > 22.0:
                    weather_mult *= (1.0 + 0.025 * (temp_c - 22.0))
                elif temp_c < 5.0:
                    weather_mult *= (1.0 - 0.02 * (5.0 - temp_c))
            elif "Soup" in subcat or "Coffee" in subcat:
                # Cold weather lifts hot drinks and soup
                if temp_c < 5.0:
                    weather_mult *= (1.0 + 0.03 * (5.0 - temp_c))
                    
            if extreme_weather == 1:
                weather_mult *= 0.65  # severe disruption reduces store footfall
                
            # 4. Holiday & Events
            event_mult = 1.0
            holiday_name = ext.get("holiday_name", "None")
            if holiday_name == "Super Bowl Sunday":
                if dept in ["Snacks", "Beverages", "Frozen"]:
                    event_mult *= 1.65
            elif holiday_name == "Valentine's Day":
                if dept in ["Beauty", "Personal Care", "Snacks"]:
                    event_mult *= 1.50
            elif holiday_name in ["New Year's Day", "Presidents Day"]:
                event_mult *= 1.18
                
            # Payday lift (1st and 15th)
            if ext.get("payday_flag", 0) == 1:
                event_mult *= 1.15
                
            # 5. Trend / Slight Growth
            trend_mult = 1.0 + 0.002 * dt_idx  # 10% secular trend over 50 days
            
            # Combine multipliers
            expected_demand = base_demand * store_multiplier * dow_mult * promo_mult * weather_mult * event_mult * trend_mult
            
            # Add stochastic Poisson / Neg-Binomial noise
            realized_demand = int(np.random.poisson(max(0.5, expected_demand)))
            # Ensure non-negative
            realized_demand = max(0, realized_demand)
            
            demand_records.append({
                "date": dt_str,
                "store_id": s_id,
                "product_id": p_id,
                "selling_price": selling_price,
                "discount_pct": discount_pct,
                "promotion_flag": is_promo,
                "actual_demand": realized_demand
            })
            
    return pd.DataFrame(demand_records)

if __name__ == "__main__":
    from server.src.stores_generator import generate_stores
    from server.src.products_generator import generate_products
    from server.src.external_factors_generator import generate_external_factors
    
    st = generate_stores()
    pr = generate_products()
    ext = generate_external_factors(st)
    pairs, lookup = select_active_assortment(st, pr)
    dem = simulate_daily_demand(pairs, ext, lookup)
    print(f"Simulated demand for {len(dem)} store-product-day rows.")
