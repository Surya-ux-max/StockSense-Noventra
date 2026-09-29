"""
Master Builder Module
Assembles the clean, reconciled Walmart StockSense Master Dataset at the grain of:
ONE ROW = ONE DATE x ONE STORE x ONE PRODUCT
Calculates target next_7_day_demand without any future feature leakage.
"""

import numpy as np
import pandas as pd
from server.src.config import PROCESSED_DATA_DIR

def build_master_dataset(
    stores_df: pd.DataFrame,
    products_df: pd.DataFrame,
    inventory_df: pd.DataFrame,
    demand_df: pd.DataFrame,
    external_df: pd.DataFrame
) -> pd.DataFrame:
    # 1. Merge Inventory with Demand/Pricing
    master = pd.merge(
        inventory_df,
        demand_df[["date", "store_id", "product_id", "selling_price", "discount_pct", "promotion_flag"]],
        on=["date", "store_id", "product_id"],
        how="inner"
    )
    
    # Rename sold_qty to units_sold for SALES schema
    master["units_sold"] = master["sold_qty"]
    
    # Primary channel attribute (Store, with Pickup/Delivery affinity)
    # Most in-store items predominantly sell via 'Store', but pickup/delivery active
    master["channel"] = np.where(master["units_sold"] % 4 == 0, "Pickup", "Store")
    
    # 2. Merge Product attributes
    prod_clean = products_df.copy()
    # Normalize category capitalization for master
    prod_clean["category"] = prod_clean["category"].str.title()
    master = pd.merge(master, prod_clean, on="product_id", how="inner")
    
    # 3. Merge Store attributes
    master = pd.merge(master, stores_df, on="store_id", how="inner")
    
    # 4. Merge External Factors by (date, city, state)
    ext_clean = external_df.copy()
    # Fill any missing temperature for master with city median
    if ext_clean["temp_c"].isna().any():
        ext_clean["temp_c"] = ext_clean.groupby("city")["temp_c"].transform(lambda x: x.fillna(x.median()))
        
    master = pd.merge(
        master,
        ext_clean[[
            "date", "city", "state", "temp_c", "rain_mm", "holiday", 
            "festival", "weekend", "local_event", "school_holiday", 
            "payday_flag", "extreme_weather_flag"
        ]],
        on=["date", "city", "state"],
        how="left"
    )
    
    master.rename(columns={"temp_c": "temperature", "rain_mm": "rain"}, inplace=True)
    
    # 5. Calculate Target: next_7_day_demand
    # Must be sum of units_sold (or true demand) in the following 7 days (t+1 to t+7)
    # Ensure chronological sorting
    master = master.sort_values(by=["store_id", "product_id", "date"]).reset_index(drop=True)
    
    # Calculate forward 7-day rolling sum excluding current day
    # For each group, reverse, rolling 7, shift, reverse
    def calc_future_demand(group):
        # We want sum of units_sold for next 7 days: t+1 .. t+7
        # rolling sum over 7 periods looking forward:
        # In pandas: rolling(7).sum() on reversed series, shifted by 1
        rev = group["units_sold"].iloc[::-1]
        # rolling sum of window 7, minimum periods 7 (or 1 for partial)
        future_sum = rev.rolling(window=7, min_periods=7).sum().shift(1).iloc[::-1]
        return future_sum

    master["next_7_day_demand"] = master.groupby(["store_id", "product_id"], group_keys=False).apply(calc_future_demand)
    
    # If partial forward sum is acceptable or NaN for final 7 days test horizon,
    # let's round integer or keep as float with NaNs for evaluation
    master["next_7_day_demand"] = master["next_7_day_demand"].round().astype("Int64")
    
    # 6. Order columns strictly according to Section 17 Specification
    column_order = [
        # IDENTITY
        "date",
        "store_id",
        "product_id",
        # STORE
        "state",
        "city",
        "store_type",
        "floor_area_sqft",
        "avg_daily_customers",
        "region",
        "distribution_center_id",
        "distance_to_dc",
        # PRODUCT
        "department",
        "category",
        "sub_category",
        "brand",
        "mrp",
        "cost_price",
        "shelf_life_days",
        "supplier_id",
        "case_pack_qty",
        "perishable_flag",
        # SALES
        "units_sold",
        "selling_price",
        "discount_pct",
        "promotion_flag",
        "channel",
        # INVENTORY
        "opening_stock",
        "received_qty",
        "closing_stock",
        "incoming_stock",
        "reorder_level",
        "safety_stock",
        "lead_days",
        "transfer_in_qty",
        "transfer_out_qty",
        "stockout_flag",
        "lost_sales_units",
        # EXTERNAL
        "temperature",
        "rain",
        "holiday",
        "festival",
        "weekend",
        "local_event",
        "school_holiday",
        "payday_flag",
        "extreme_weather_flag",
        # TARGET
        "next_7_day_demand"
    ]
    
    master = master[column_order]
    # Chronological sort
    master = master.sort_values(by=["date", "store_id", "product_id"]).reset_index(drop=True)
    return master

if __name__ == "__main__":
    pass
