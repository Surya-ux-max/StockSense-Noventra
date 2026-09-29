"""
Inventory Generator Module
Simulates daily inventory transitions, replenishment orders, supplier lead times/delays, and stockouts.
Strictly enforces physical inventory accounting equations and zero negative stock.
"""

import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from server.src.config import RANDOM_SEED, START_DATE, NUM_DAYS

def generate_inventory(pairs_df: pd.DataFrame, demand_df: pd.DataFrame, prod_lookup: dict, seed: int = RANDOM_SEED) -> pd.DataFrame:
    np.random.seed(seed)
    
    dates = pd.date_range(start=START_DATE, periods=NUM_DAYS, freq="D").strftime("%Y-%m-%d").tolist()
    
    # Pre-aggregate demand lookup: (store_id, product_id, date) -> record
    dem_lookup = {(r["store_id"], r["product_id"], r["date"]): r for r in demand_df.to_dict(orient="records")}
    
    inventory_records = []
    
    for _, pair in pairs_df.iterrows():
        s_id = pair["store_id"]
        p_id = pair["product_id"]
        dist_dc = pair["distance_to_dc"]
        base_demand = pair["base_daily_demand"]
        p_info = prod_lookup[p_id]
        case_pack = max(1, p_info.get("case_pack_qty", 12))
        
        # Lead time (days): 1 to 5 days depending on DC distance and supplier
        # e.g., < 50 miles -> 1-2 days, 50-150 miles -> 2-3 days, > 150 miles -> 3-5 days
        if dist_dc < 60:
            lead_days = int(np.random.choice([1, 2], p=[0.7, 0.3]))
        elif dist_dc < 150:
            lead_days = int(np.random.choice([2, 3], p=[0.6, 0.4]))
        else:
            lead_days = int(np.random.choice([3, 4, 5], p=[0.5, 0.35, 0.15]))
            
        # Reorder level and safety stock
        mean_demand = base_demand * (pair["avg_daily_customers"] / 3200.0)
        sigma_demand = max(1.5, mean_demand * 0.30)
        # Z-score ~1.65 for 95% service level
        safety_stock = max(4, int(math.ceil(1.65 * sigma_demand * math.sqrt(lead_days))))
        reorder_level = max(safety_stock + 5, int(math.ceil(mean_demand * lead_days + safety_stock)))
        
        # Order-up-to target (covers lead days + 4 review days)
        target_max_stock = int(math.ceil(mean_demand * (lead_days + 4) + safety_stock))
        
        # Initial opening stock on Day 0
        curr_stock = int(np.random.uniform(reorder_level, target_max_stock * 1.1))
        
        # Replenishment pipeline: list of pending shipments: {"arrival_date": dt_str, "qty": units}
        in_transit_orders = []
        
        for dt_idx, dt_str in enumerate(dates):
            current_dt = datetime.strptime(dt_str, "%Y-%m-%d")
            
            # 1. Received stock today
            received_today = 0
            remaining_transit = []
            for order in in_transit_orders:
                if order["arrival_date"] <= dt_str:
                    received_today += order["qty"]
                else:
                    remaining_transit.append(order)
            in_transit_orders = remaining_transit
            
            # 2. Transfers (rare, 1.5% probability)
            transfer_in = 0
            transfer_out = 0
            if np.random.random() < 0.015:
                if np.random.random() < 0.5:
                    transfer_in = int(np.random.choice([case_pack, case_pack * 2]))
                else:
                    transfer_out = min(curr_stock // 2, int(np.random.choice([case_pack, case_pack * 2])))
                    
            # 3. Available inventory before sales
            available_stock = max(0, curr_stock + received_today + transfer_in - transfer_out)
            
            # 4. Actual demand for today
            dem_row = dem_lookup.get((s_id, p_id, dt_str), {})
            actual_demand = dem_row.get("actual_demand", int(mean_demand))
            
            # 5. Inventory transaction & Stockout determination
            if actual_demand <= available_stock:
                sold_qty = actual_demand
                lost_sales_units = 0
                closing_stock = available_stock - sold_qty
                stockout_flag = 0
                stockout_hours = 0.0
            else:
                sold_qty = available_stock
                lost_sales_units = actual_demand - available_stock
                closing_stock = 0
                stockout_flag = 1
                ratio = lost_sales_units / max(1, actual_demand)
                stockout_hours = round(min(24.0, ratio * 14.0 + 2.5), 1)
                
            # 6. Incoming stock currently in pipeline
            incoming_stock = sum(o["qty"] for o in in_transit_orders)
            
            # 7. Reorder decision
            # When inventory position <= reorder_level, order replenishment
            inv_position = closing_stock + incoming_stock
            if inv_position <= reorder_level:
                order_deficit = target_max_stock - inv_position
                if order_deficit > 0:
                    # Round up to multiple of case pack
                    order_qty = int(math.ceil(order_deficit / case_pack) * case_pack)
                    
                    # Supplier delay: ~6% probability of a 1-3 day delay
                    delay_days = 0
                    if np.random.random() < 0.06:
                        delay_days = int(np.random.choice([1, 2, 3]))
                        
                    arrival_dt = current_dt + timedelta(days=lead_days + delay_days)
                    in_transit_orders.append({
                        "arrival_date": arrival_dt.strftime("%Y-%m-%d"),
                        "qty": order_qty
                    })
                    incoming_stock += order_qty
                    
            inventory_records.append({
                "date": dt_str,
                "store_id": s_id,
                "product_id": p_id,
                "opening_stock": curr_stock,
                "received_qty": received_today,
                "sold_qty": sold_qty,
                "closing_stock": closing_stock,
                "incoming_stock": incoming_stock,
                "reorder_level": reorder_level,
                "safety_stock": safety_stock,
                "lead_days": lead_days,
                "transfer_in_qty": transfer_in,
                "transfer_out_qty": transfer_out,
                "stockout_flag": stockout_flag,
                "stockout_duration_hours": stockout_hours,
                "lost_sales_units": lost_sales_units
            })
            
            # Next day's opening stock is today's closing stock
            curr_stock = closing_stock
            
    df_inv = pd.DataFrame(inventory_records)
    return df_inv

if __name__ == "__main__":
    from server.src.stores_generator import generate_stores
    from server.src.products_generator import generate_products
    from server.src.external_factors_generator import generate_external_factors
    from server.src.demand_simulation import select_active_assortment, simulate_daily_demand
    
    st = generate_stores()
    pr = generate_products()
    ext = generate_external_factors(st)
    pairs, lookup = select_active_assortment(st, pr)
    dem = simulate_daily_demand(pairs, ext, lookup)
    inv = generate_inventory(pairs, dem, lookup)
    print(f"Generated {len(inv)} inventory records. Stockout rate: {inv['stockout_flag'].mean():.2%}")
