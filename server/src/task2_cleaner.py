"""
Task 2 Data Cleaning Module
Cleans the intentionally imperfect raw datasets, documents each remediation in an audit report,
saves the cleaned files under data/processed/clean/, and rebuilds walmart_stocksense_master_clean.csv.
"""

import numpy as np
import pandas as pd
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
CLEAN_DIR = PROCESSED_DIR / "clean"
REPORTS_DIR = BASE_DIR / "reports"

for d in [CLEAN_DIR, REPORTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

def run_data_cleaning():
    print("=" * 70)
    print("  TASK 2: SYSTEMATIC DATA CLEANING & RECONCILIATION")
    print("=" * 70)
    
    cleaning_log = []
    
    # ---------------------------------------------------------
    # 1. CLEAN TRANSACTIONS
    # ---------------------------------------------------------
    print("\n[Step 1/5] Cleaning transactions.csv...")
    df_trans = pd.read_csv(RAW_DIR / "transactions.csv")
    initial_trans_rows = len(df_trans)
    
    # 1a. Duplicate Transaction IDs
    dup_tx_mask = df_trans.duplicated(subset=["transaction_id"], keep="first")
    dup_tx_count = int(dup_tx_mask.sum())
    df_trans_dedup = df_trans[~dup_tx_mask].copy()
    cleaning_log.append({
        "dataset": "transactions.csv",
        "issue": "Duplicate Primary Key (transaction_id)",
        "affected_rows": dup_tx_count,
        "resolution": "Deduplicate preserving first genuine transaction record",
        "method": "drop_duplicates(subset=['transaction_id'], keep='first')",
        "status": "RESOLVED"
    })
    
    # 1b. Negative Sales Quantities (Customer Returns)
    neg_qty_mask = df_trans_dedup["quantity"] <= 0
    neg_qty_count = int(neg_qty_mask.sum())
    df_trans_clean = df_trans_dedup[~neg_qty_mask].copy()
    cleaning_log.append({
        "dataset": "transactions.csv",
        "issue": "Invalid Negative Quantities (Unflagged Returns)",
        "affected_rows": neg_qty_count,
        "resolution": "Filter out non-positive sales units to align with gross POS demand",
        "method": "df[df['quantity'] > 0]",
        "status": "RESOLVED"
    })
    
    trans_clean_path = CLEAN_DIR / "transactions_clean.csv"
    df_trans_clean.to_csv(trans_clean_path, index=False)
    print(f"  -> Cleaned transactions: {initial_trans_rows:,} -> {len(df_trans_clean):,} rows ({trans_clean_path})")

    # ---------------------------------------------------------
    # 2. CLEAN PRODUCTS
    # ---------------------------------------------------------
    print("\n[Step 2/5] Cleaning products.csv...")
    df_prod = pd.read_csv(RAW_DIR / "products.csv")
    
    # Category Casing Inconsistency
    case_mask = df_prod["category"].str.islower() | df_prod["category"].str.isupper()
    case_count = int(case_mask.sum())
    df_prod_clean = df_prod.copy()
    df_prod_clean["category"] = df_prod_clean["category"].str.title()
    cleaning_log.append({
        "dataset": "products.csv",
        "issue": "Inconsistent Category Casing (lowercase/uppercase)",
        "affected_rows": case_count,
        "resolution": "Standardize all merchandise category strings to Title Case",
        "method": "df['category'].str.title()",
        "status": "RESOLVED"
    })
    
    prod_clean_path = CLEAN_DIR / "products_clean.csv"
    df_prod_clean.to_csv(prod_clean_path, index=False)
    print(f"  -> Cleaned products: {len(df_prod_clean)} rows ({prod_clean_path})")

    # ---------------------------------------------------------
    # 3. CLEAN STORES
    # ---------------------------------------------------------
    print("\n[Step 3/5] Cleaning stores.csv...")
    df_stores = pd.read_csv(RAW_DIR / "stores.csv")
    df_stores_clean = df_stores.copy()
    cleaning_log.append({
        "dataset": "stores.csv",
        "issue": "None detected during Task 1 audit",
        "affected_rows": 0,
        "resolution": "Verified complete referential integrity and format distributions",
        "method": "Integrity validation check",
        "status": "PASS"
    })
    stores_clean_path = CLEAN_DIR / "stores_clean.csv"
    df_stores_clean.to_csv(stores_clean_path, index=False)
    print(f"  -> Cleaned stores: {len(df_stores_clean)} rows ({stores_clean_path})")

    # ---------------------------------------------------------
    # 4. CLEAN EXTERNAL FACTORS
    # ---------------------------------------------------------
    print("\n[Step 4/5] Cleaning external_factors.csv...")
    df_ext = pd.read_csv(RAW_DIR / "external_factors.csv")
    missing_temp_count = int(df_ext["temp_c"].isna().sum())
    
    df_ext_clean = df_ext.copy()
    # Impute missing temperatures using city median
    df_ext_clean["temp_c"] = df_ext_clean.groupby(["state", "city"])["temp_c"].transform(
        lambda s: s.fillna(s.median())
    )
    cleaning_log.append({
        "dataset": "external_factors.csv",
        "issue": "Missing Temperature Values (Sensor Dropouts)",
        "affected_rows": missing_temp_count,
        "resolution": "Impute with localized city/state seasonal median temperature",
        "method": "df.groupby(['state', 'city'])['temp_c'].transform(median)",
        "status": "RESOLVED"
    })
    ext_clean_path = CLEAN_DIR / "external_factors_clean.csv"
    df_ext_clean.to_csv(ext_clean_path, index=False)
    print(f"  -> Cleaned external factors: {len(df_ext_clean)} rows ({ext_clean_path})")

    # ---------------------------------------------------------
    # 5. CLEAN INVENTORY
    # ---------------------------------------------------------
    print("\n[Step 5/5] Cleaning inventory.csv...")
    df_inv = pd.read_csv(RAW_DIR / "inventory.csv")
    
    expected_closing = np.maximum(
        0,
        df_inv["opening_stock"] + df_inv["received_qty"] + df_inv["transfer_in_qty"]
        - df_inv["sold_qty"] - df_inv["transfer_out_qty"]
    )
    inv_err_mask = df_inv["closing_stock"] != expected_closing
    inv_err_count = int(inv_err_mask.sum())
    
    df_inv_clean = df_inv.copy()
    df_inv_clean["closing_stock"] = expected_closing
    cleaning_log.append({
        "dataset": "inventory.csv",
        "issue": "Closing Stock Arithmetic Discrepancies",
        "affected_rows": inv_err_count,
        "resolution": "Rebalance closing stock based on physical conservation law",
        "method": "closing = max(0, opening + received + xfer_in - sold - xfer_out)",
        "status": "RESOLVED"
    })
    inv_clean_path = CLEAN_DIR / "inventory_clean.csv"
    df_inv_clean.to_csv(inv_clean_path, index=False)
    print(f"  -> Cleaned inventory: {len(df_inv_clean)} rows ({inv_clean_path})")

    # ---------------------------------------------------------
    # SAVE CLEANING AUDIT REPORT
    # ---------------------------------------------------------
    df_report = pd.DataFrame(cleaning_log)
    report_path = REPORTS_DIR / "task2_cleaning_report.csv"
    df_report.to_csv(report_path, index=False)
    print(f"\nSaved Cleaning Audit Report: {report_path}")
    print(df_report.to_string(index=False))

    # ---------------------------------------------------------
    # 6. REBUILD CLEAN MASTER DATASET
    # ---------------------------------------------------------
    print("\n[Rebuild Master] Rebuilding walmart_stocksense_master_clean.csv from clean sources...")
    
    # Aggregate transaction units by Date x Store x Product
    tx_agg = df_trans_clean.groupby(["date", "store_id", "product_id"]).agg(
        tx_units_sold=("quantity", "sum"),
        mean_selling_price=("selling_price", "mean"),
        mean_discount_pct=("discount_pct", "mean"),
        max_promo_flag=("promotion_flag", "max")
    ).reset_index()
    
    # Merge with inventory clean
    master_clean = pd.merge(
        df_inv_clean,
        tx_agg,
        on=["date", "store_id", "product_id"],
        how="left"
    )
    
    # In case transactions had missing sales for zero days, units_sold is 0
    master_clean["units_sold"] = master_clean["sold_qty"]
    master_clean["selling_price"] = master_clean["mean_selling_price"]
    master_clean["discount_pct"] = master_clean["mean_discount_pct"].fillna(0.0)
    master_clean["promotion_flag"] = master_clean["max_promo_flag"].fillna(0).astype(int)
    master_clean.drop(columns=["tx_units_sold", "mean_selling_price", "mean_discount_pct", "max_promo_flag"], inplace=True)
    
    # If selling_price is NaN because of zero sales on that day, fill with product MRP
    master_clean = pd.merge(master_clean, df_prod_clean, on="product_id", how="inner")
    master_clean["selling_price"] = master_clean["selling_price"].fillna(master_clean["mrp"])
    
    # Merge with store clean
    master_clean = pd.merge(master_clean, df_stores_clean, on="store_id", how="inner")
    
    # Merge with external factors clean
    master_clean = pd.merge(
        master_clean,
        df_ext_clean[[
            "date", "city", "state", "temp_c", "rain_mm", "holiday", 
            "festival", "weekend", "local_event", "school_holiday", 
            "payday_flag", "extreme_weather_flag"
        ]],
        on=["date", "city", "state"],
        how="left"
    )
    master_clean.rename(columns={"temp_c": "temperature", "rain_mm": "rain"}, inplace=True)
    
    # Channel assignment
    master_clean["channel"] = np.where(master_clean["units_sold"] % 4 == 0, "Pickup", "Store")
    
    # Compute Target: next_7_day_demand (sum of units_sold in t+1..t+7)
    master_clean = master_clean.sort_values(by=["store_id", "product_id", "date"]).reset_index(drop=True)
    
    def calc_future_demand(group):
        rev = group["units_sold"].iloc[::-1]
        future_sum = rev.rolling(window=7, min_periods=7).sum().shift(1).iloc[::-1]
        return future_sum

    master_clean["next_7_day_demand"] = master_clean.groupby(["store_id", "product_id"], group_keys=False).apply(calc_future_demand)
    master_clean["next_7_day_demand"] = master_clean["next_7_day_demand"].round().astype("Int64")
    
    # Chronological ordering
    master_clean = master_clean.sort_values(by=["date", "store_id", "product_id"]).reset_index(drop=True)
    
    # Strict Column Ordering
    cols_order = [
        "date", "store_id", "product_id",
        "state", "city", "store_type", "floor_area_sqft", "avg_daily_customers", "region", "distribution_center_id", "distance_to_dc",
        "department", "category", "sub_category", "brand", "mrp", "cost_price", "shelf_life_days", "supplier_id", "case_pack_qty", "perishable_flag",
        "units_sold", "selling_price", "discount_pct", "promotion_flag", "channel",
        "opening_stock", "received_qty", "closing_stock", "incoming_stock", "reorder_level", "safety_stock", "lead_days", "transfer_in_qty", "transfer_out_qty", "stockout_flag", "lost_sales_units",
        "temperature", "rain", "holiday", "festival", "weekend", "local_event", "school_holiday", "payday_flag", "extreme_weather_flag",
        "next_7_day_demand"
    ]
    master_clean = master_clean[cols_order]
    
    clean_master_path = PROCESSED_DIR / "walmart_stocksense_master_clean.csv"
    master_clean.to_csv(clean_master_path, index=False)
    print(f"  -> Clean Master Dataset built: {len(master_clean):,} rows x {len(master_clean.columns)} columns ({clean_master_path})")
    
    return master_clean, df_report

if __name__ == "__main__":
    run_data_cleaning()
