"""
Task 2 Feature Engineering Module
Transforms cleaned daily master observations into leakage-free tabular features.
Strict prediction time: END OF DAY t.
Output: data/processed/model_features.csv
"""

import numpy as np
import pandas as pd
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR = BASE_DIR / "data" / "output"

for d in [PROCESSED_DIR, OUTPUT_DIR]:
    d.mkdir(parents=True, exist_ok=True)

def generate_model_features():
    print("=" * 70)
    print("  TASK 2: LEAKAGE-FREE FEATURE ENGINEERING (PREDICTION TIME: END OF DAY t)")
    print("=" * 70)
    
    clean_master_path = PROCESSED_DIR / "walmart_stocksense_master_clean.csv"
    if not clean_master_path.exists():
        from server.src.task2_cleaner import run_data_cleaning
        df, _ = run_data_cleaning()
    else:
        df = pd.read_csv(clean_master_path)
        
    # Ensure pickup_enabled and delivery_enabled from stores_clean are present
    stores_clean_path = PROCESSED_DIR / "clean" / "stores_clean.csv"
    if stores_clean_path.exists():
        df_st = pd.read_csv(stores_clean_path)
        if "pickup_enabled" in df_st.columns and "pickup_enabled" not in df.columns:
            df = pd.merge(df, df_st[["store_id", "pickup_enabled", "delivery_enabled"]], on="store_id", how="left")
        
    print(f"\n[Step 1/5] Sorting observations chronologically per (store_id, product_id)...")
    # Sort strictly by store_id, product_id, date
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["store_id", "product_id", "date"]).reset_index(drop=True)
    
    # -------------------------------------------------------------
    # 1. DEMAND LAG FEATURES (Historical observations <= t)
    # -------------------------------------------------------------
    print("[Step 2/5] Creating demand lag, rolling, and trend features...")
    # lag_1: units_sold at t-1. Note: units_sold at t is current day sales (available at end of day t).
    # To predict t+1..t+7, we have sales up to t.
    # So lag_1 from prediction viewpoint can be sales at t, lag_7 is sales at t-6, etc.
    # Standard time-series convention:
    # sales_t = units_sold on day t
    # lag_1_demand = units_sold on day t-1
    # lag_7_demand = units_sold on day t-7
    # lag_14_demand = units_sold on day t-14
    
    # Group by (store_id, product_id)
    grouped = df.groupby(["store_id", "product_id"])
    
    df["sales_t"] = df["units_sold"] # Available at end of day t
    df["lag_1"] = grouped["units_sold"].shift(1)
    df["lag_7"] = grouped["units_sold"].shift(7)
    df["lag_14"] = grouped["units_sold"].shift(14)
    
    # Rolling Statistics (strictly historical: closed window including t)
    # pandas rolling(k) on series includes current row t and preceding k-1 rows
    df["rolling_mean_3"] = grouped["units_sold"].transform(lambda s: s.rolling(3, min_periods=1).mean())
    df["rolling_mean_7"] = grouped["units_sold"].transform(lambda s: s.rolling(7, min_periods=2).mean())
    df["rolling_mean_14"] = grouped["units_sold"].transform(lambda s: s.rolling(14, min_periods=3).mean())
    
    df["rolling_std_3"] = grouped["units_sold"].transform(lambda s: s.rolling(3, min_periods=2).std().fillna(0.0))
    df["rolling_std_7"] = grouped["units_sold"].transform(lambda s: s.rolling(7, min_periods=3).std().fillna(0.0))
    df["rolling_std_14"] = grouped["units_sold"].transform(lambda s: s.rolling(14, min_periods=4).std().fillna(0.0))
    
    # Demand Trend & Momentum
    df["demand_growth_7d"] = (df["rolling_mean_3"] - df["rolling_mean_7"]) / np.maximum(1.0, df["rolling_mean_7"])
    df["demand_growth_14d"] = (df["rolling_mean_7"] - df["rolling_mean_14"]) / np.maximum(1.0, df["rolling_mean_14"])
    df["recent_vs_baseline_demand"] = df["rolling_mean_3"] / np.maximum(0.5, df["rolling_mean_14"])
    
    # -------------------------------------------------------------
    # 2. INVENTORY FEATURES (End of Day t)
    # -------------------------------------------------------------
    print("[Step 3/5] Engineering inventory health, buffer gaps, and coverage metrics...")
    df["current_inventory"] = df["closing_stock"] # Realized on-hand stock at close of day t
    df["incoming_inventory"] = df["incoming_stock"] # Confirmed pending PO shipments in pipeline
    
    # Coverage metrics
    df["inventory_coverage_days"] = df["current_inventory"] / np.maximum(0.1, df["rolling_mean_7"])
    df["inventory_to_demand_ratio"] = (df["current_inventory"] + df["incoming_inventory"]) / np.maximum(0.1, df["rolling_mean_7"] * 7.0)
    df["reorder_gap"] = df["reorder_level"] - (df["current_inventory"] + df["incoming_inventory"])
    df["safety_stock_gap"] = df["safety_stock"] - df["current_inventory"]
    df["lead_time_demand"] = df["rolling_mean_7"] * df["lead_days"]
    
    # Recent stockout history (sum of stockout_flags over past 7 days <= t)
    df["recent_stockouts_7d"] = grouped["stockout_flag"].transform(lambda s: s.rolling(7, min_periods=1).sum())
    
    # -------------------------------------------------------------
    # 3. PRICE & PROMOTION FEATURES
    # -------------------------------------------------------------
    print("[Step 4/5] Computing pricing elasticity and promotional depth metrics...")
    df["current_price"] = df["selling_price"]
    df["price_vs_mrp"] = df["current_price"] / np.maximum(0.1, df["mrp"])
    
    lag_7_price = grouped["selling_price"].shift(7)
    df["price_change_7d"] = df["current_price"] - lag_7_price.fillna(df["current_price"])
    df["promotion_recent_frequency"] = grouped["promotion_flag"].transform(lambda s: s.rolling(7, min_periods=1).mean())
    
    # -------------------------------------------------------------
    # 4. CALENDAR, WEATHER, & STORE/PRODUCT ENCODINGS
    # -------------------------------------------------------------
    dt = df["date"].dt
    df["day_of_week"] = dt.dayofweek
    df["day_of_month"] = dt.day
    df["week_of_year"] = dt.isocalendar().week.astype(int)
    df["month"] = dt.month
    df["is_weekend"] = df["weekend"]
    
    # Target 2: Stockout in Next 7 Days (Classification target!)
    # Future stockout flag over t+1..t+7: 1 if any stockout occurs in next 7 days, else 0
    def calc_future_stockout(group):
        rev = group["stockout_flag"].iloc[::-1]
        future_max = rev.rolling(window=7, min_periods=7).max().shift(1).iloc[::-1]
        return future_max
        
    df["target_stockout_7d"] = grouped.apply(calc_future_stockout).reset_index(level=[0, 1], drop=True)
    df["target_stockout_7d"] = df["target_stockout_7d"].astype("Int64")
    
    # Supervised rows flag: 1 if complete future 7-day window exists, 0 for prospective test horizon
    df["supervised_flag"] = np.where(df["next_7_day_demand"].notna() & df["target_stockout_7d"].notna(), 1, 0)
    
    # Format date back to string
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")
    
    # Chronological sort
    df = df.sort_values(by=["date", "store_id", "product_id"]).reset_index(drop=True)
    
    out_path = PROCESSED_DIR / "model_features.csv"
    df.to_csv(out_path, index=False)
    print(f"\n[Step 5/5] Saved model features table: {len(df):,} rows x {len(df.columns)} columns ({out_path})")
    
    # Report feature column summary
    print(f"  Supervised Rows (complete 7d target): {(df['supervised_flag'] == 1).sum():,}")
    print(f"  Prospective Evaluation Rows (unlabeled future): {(df['supervised_flag'] == 0).sum():,}")
    print(f"  Future 7-Day Stockout Class Prevalence: {df[df['supervised_flag'] == 1]['target_stockout_7d'].mean():.2%}")
    
    return df

if __name__ == "__main__":
    generate_model_features()
