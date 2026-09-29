"""
Transactions Generator Module
Deconstructs daily store-product sales into basket transaction-level POS records (transactions.csv).
Includes realistic channel mix, fulfillment types, payment modes, and controlled quality anomalies.
"""

import numpy as np
import pandas as pd
from server.src.config import RANDOM_SEED

CHANNELS = ["Store", "Pickup", "Delivery", "Online"]
PAYMENT_MODES = ["Credit Card", "Debit Card", "Walmart Pay", "Cash", "EBT", "Gift Card"]
PAYMENT_WEIGHTS = [0.42, 0.30, 0.14, 0.08, 0.04, 0.02]

def generate_transactions(inventory_df: pd.DataFrame, demand_df: pd.DataFrame, ext_df: pd.DataFrame, seed: int = RANDOM_SEED):
    np.random.seed(seed)
    
    # Merge inventory and demand metadata
    merged = pd.merge(
        inventory_df[["date", "store_id", "product_id", "sold_qty"]],
        demand_df[["date", "store_id", "product_id", "selling_price", "discount_pct", "promotion_flag"]],
        on=["date", "store_id", "product_id"]
    )
    
    # Rain/weather lookup by date & store location
    # Get rain flag by date
    rain_dates = set(ext_df[ext_df["rain_mm"] > 3.0]["date"].unique())
    
    tx_records = []
    tx_counter = 1
    
    # Synthetic customer pool
    cust_pool = [f"CUST_WMT_{i:06d}" for i in range(1, 4500)]
    
    # Store-specific customer affinity
    store_ids = inventory_df["store_id"].unique()
    store_cust_map = {s: np.random.choice(cust_pool, size=350, replace=False) for s in store_ids}
    
    for row in merged.itertuples():
        sold = row.sold_qty
        if sold <= 0:
            continue
            
        dt_str = row.date
        s_id = row.store_id
        p_id = row.product_id
        price = row.selling_price
        disc = row.discount_pct
        promo = row.promotion_flag
        
        has_rain = dt_str in rain_dates
        # Channel probabilities shift on rainy days
        if has_rain:
            chan_probs = [0.48, 0.26, 0.20, 0.06]
        else:
            chan_probs = [0.72, 0.16, 0.09, 0.03]
            
        # Break sold into transactions
        remaining_units = sold
        while remaining_units > 0:
            # Basket item qty: usually 1 or 2, sometimes 3-4
            if remaining_units == 1:
                item_qty = 1
            else:
                item_qty = int(np.random.choice([1, 2, 3, 4], p=[0.60, 0.25, 0.10, 0.05]))
                item_qty = min(item_qty, remaining_units)
                
            remaining_units -= item_qty
            
            tx_id = f"TXN_{tx_counter:08d}"
            tx_counter += 1
            
            cust_id = np.random.choice(store_cust_map[s_id])
            channel = np.random.choice(CHANNELS, p=chan_probs)
            
            if channel == "Store":
                fulfillment = "In-Store"
            elif channel == "Pickup":
                fulfillment = "Pickup"
            else:
                fulfillment = "Delivery"
                
            pay_mode = np.random.choice(PAYMENT_MODES, p=PAYMENT_WEIGHTS)
            
            # Hour: retail distribution peak between 10am and 8pm
            hour = int(np.clip(np.random.normal(14.5, 3.5), 7, 22))
            
            # Rollback / markdown flags
            rollback_flag = 1 if promo == 1 and disc >= 0.15 else 0
            markdown_flag = 1 if promo == 0 and disc > 0.05 else 0
            
            tx_records.append({
                "transaction_id": tx_id,
                "date": dt_str,
                "store_id": s_id,
                "product_id": p_id,
                "quantity": item_qty,
                "selling_price": price,
                "discount_pct": disc,
                "promotion_flag": promo,
                "customer_id": cust_id,
                "payment_mode": pay_mode,
                "hour": hour,
                "channel": channel,
                "fulfillment_type": fulfillment,
                "markdown_flag": markdown_flag,
                "rollback_flag": rollback_flag
            })
            
    df_tx = pd.DataFrame(tx_records)
    return df_tx

if __name__ == "__main__":
    pass
