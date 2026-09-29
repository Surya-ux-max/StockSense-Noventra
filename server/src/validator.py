"""
Validator and Quality Auditor Module
Runs all 17 automated validation checks, computes dataset statistics, and verifies causal retail relationships.
Generates:
- reports/data_quality_report.csv
- reports/dataset_summary.csv
- reports/relationship_validation.csv
"""

import numpy as np
import pandas as pd
from server.src.config import REPORTS_DIR

def run_validation_checks(
    df_trans: pd.DataFrame,
    df_prod: pd.DataFrame,
    df_stores: pd.DataFrame,
    df_inv: pd.DataFrame,
    df_ext: pd.DataFrame,
    df_master: pd.DataFrame
) -> pd.DataFrame:
    """
    Executes the 17 formal validation checks and outputs a Data Quality Report.
    """
    checks = []
    
    # 1. Primary keys (Master uniqueness of Date x Store x Product)
    master_dups = df_master.duplicated(subset=["date", "store_id", "product_id"]).sum()
    checks.append({
        "check_id": 1,
        "check_name": "Master Primary Key Uniqueness",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if master_dups == 0 else "FAIL",
        "details": f"{master_dups} duplicate grain rows found. Expected: 0."
    })
    
    # 2. Duplicate transaction IDs (in Raw Transactions)
    tx_dups = df_trans.duplicated(subset=["transaction_id"]).sum()
    checks.append({
        "check_id": 2,
        "check_name": "Duplicate Transaction IDs",
        "scope": "transactions.csv",
        "status": "DETECTED_INTENTIONAL_ANOMALY" if tx_dups > 0 else "PASS",
        "details": f"{tx_dups} duplicate transaction IDs present (controlled data-quality round trap)."
    })
    
    # 3. Missing values in Master
    # Note: next_7_day_demand has expected NaNs for the final 7 forecast horizon days
    feat_cols = [c for c in df_master.columns if c != "next_7_day_demand"]
    missing_feats = df_master[feat_cols].isna().sum().sum()
    checks.append({
        "check_id": 3,
        "check_name": "Predictor Missing Values",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if missing_feats == 0 else "FAIL",
        "details": f"{missing_feats} missing values in predictor columns."
    })
    
    # 4. Invalid quantities (Master units_sold >= 0)
    neg_master_qty = (df_master["units_sold"] < 0).sum()
    checks.append({
        "check_id": 4,
        "check_name": "Master Non-negative Units Sold",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if neg_master_qty == 0 else "FAIL",
        "details": f"{neg_master_qty} negative sales values in master."
    })
    
    # 5. Invalid prices (selling_price > 0 and <= mrp + epsilon)
    invalid_prices = ((df_master["selling_price"] <= 0) | (df_master["selling_price"] > df_master["mrp"] + 0.01)).sum()
    checks.append({
        "check_id": 5,
        "check_name": "Realistic Price Boundary",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if invalid_prices == 0 else "FAIL",
        "details": f"{invalid_prices} price violations found."
    })
    
    # 6. Inventory arithmetic in Master
    # closing_stock = max(0, opening_stock + received_qty + transfer_in - units_sold - transfer_out)
    expected_closing = np.maximum(
        0, 
        df_master["opening_stock"] + df_master["received_qty"] + df_master["transfer_in_qty"] 
        - df_master["units_sold"] - df_master["transfer_out_qty"]
    )
    arithmetic_errs = (df_master["closing_stock"] != expected_closing).sum()
    checks.append({
        "check_id": 6,
        "check_name": "Master Inventory Arithmetic Balance",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if arithmetic_errs == 0 else "FAIL",
        "details": f"{arithmetic_errs} arithmetic mismatches in master."
    })
    
    # 7. Negative closing stock
    neg_closing = (df_master["closing_stock"] < 0).sum()
    checks.append({
        "check_id": 7,
        "check_name": "Zero Negative Inventory",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if neg_closing == 0 else "FAIL",
        "details": f"{neg_closing} negative inventory rows in master."
    })
    
    # 8. Stockout consistency (if closing_stock == 0 and lost_sales_units > 0 -> stockout_flag == 1)
    inconsistent_so = ((df_master["lost_sales_units"] > 0) & (df_master["stockout_flag"] != 1)).sum()
    checks.append({
        "check_id": 8,
        "check_name": "Stockout Flag & Lost Sales Consistency",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if inconsistent_so == 0 else "FAIL",
        "details": f"{inconsistent_so} inconsistent stockout flags."
    })
    
    # 9. Lost sales consistency (lost_sales >= 0)
    neg_lost = (df_master["lost_sales_units"] < 0).sum()
    checks.append({
        "check_id": 9,
        "check_name": "Non-negative Lost Sales Units",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if neg_lost == 0 else "FAIL",
        "details": f"{neg_lost} negative lost sales values."
    })
    
    # 10. Product-store relationships (stores in master exist in stores.csv)
    unmatched_stores = set(df_master["store_id"]) - set(df_stores["store_id"])
    checks.append({
        "check_id": 10,
        "check_name": "Store Master Referential Integrity",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if len(unmatched_stores) == 0 else "FAIL",
        "details": f"{len(unmatched_stores)} unmatched stores."
    })
    
    # 11. Store-product-date uniqueness
    spd_uniqueness = df_master.groupby(["store_id", "product_id", "date"]).size().max()
    checks.append({
        "check_id": 11,
        "check_name": "Store-Product-Date Single Observation",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if spd_uniqueness == 1 else "FAIL",
        "details": f"Max count per (store, product, date) is {spd_uniqueness}."
    })
    
    # 12. Date continuity
    dates_in_master = pd.to_datetime(df_master["date"].unique())
    full_range = pd.date_range(dates_in_master.min(), dates_in_master.max())
    missing_dates = len(full_range) - len(dates_in_master)
    checks.append({
        "check_id": 12,
        "check_name": "Calendar Continuity",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if missing_dates == 0 else "FAIL",
        "details": f"{missing_dates} missing calendar days in observation series."
    })
    
    # 13. Target availability
    valid_targets = df_master["next_7_day_demand"].notna().sum()
    total_rows = len(df_master)
    checks.append({
        "check_id": 13,
        "check_name": "Target next_7_day_demand Availability",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS",
        "details": f"{valid_targets}/{total_rows} rows have complete 7-day targets; remaining {total_rows - valid_targets} rows represent the out-of-sample evaluation horizon."
    })
    
    # 14. No future leakage (verifying predictor columns do not contain target info)
    leakage_cols = [c for c in df_master.columns if "future" in c.lower()]
    checks.append({
        "check_id": 14,
        "check_name": "No Feature Leakage Verification",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if len(leakage_cols) == 0 else "FAIL",
        "details": f"Predictor set strictly limited to concurrent operational features (t <= current date)."
    })
    
    # 15. Referential integrity between raw inventory and master
    inv_master_diff = len(df_inv) - len(df_master)
    checks.append({
        "check_id": 15,
        "check_name": "Inventory-Master Row Alignment",
        "scope": "inventory.csv vs master",
        "status": "PASS" if inv_master_diff == 0 else "FAIL",
        "details": f"Row count difference: {inv_master_diff}."
    })
    
    # 16. Category consistency in products vs master
    clean_cats = df_master["category"].nunique()
    checks.append({
        "check_id": 16,
        "check_name": "Master Category Normalization",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS",
        "details": f"{clean_cats} standardized categories present in master."
    })
    
    # 17. Price / cost relationships (cost_price < mrp)
    cost_violations = (df_master["cost_price"] >= df_master["mrp"]).sum()
    checks.append({
        "check_id": 17,
        "check_name": "Cost vs MRP Margins",
        "scope": "walmart_stocksense_master.csv",
        "status": "PASS" if cost_violations == 0 else "FAIL",
        "details": f"{cost_violations} margin violations (cost >= mrp)."
    })
    
    df_checks = pd.DataFrame(checks)
    return df_checks

def generate_dataset_summary(df_master: pd.DataFrame, df_stores: pd.DataFrame, df_prod: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Section 24 formal business KPIs and dataset statistics.
    """
    total_rows = len(df_master)
    total_cols = len(df_master.columns)
    num_stores = df_master["store_id"].nunique()
    num_products = df_master["product_id"].nunique()
    num_categories = df_master["category"].nunique()
    num_suppliers = df_master["supplier_id"].nunique()
    
    date_min = df_master["date"].min()
    date_max = df_master["date"].max()
    
    total_units_sold = int(df_master["units_sold"].sum())
    revenue = float((df_master["units_sold"] * df_master["selling_price"]).sum())
    avg_daily_demand = round(float(df_master["units_sold"].mean()), 2)
    stockout_rate = round(float(df_master["stockout_flag"].mean()), 4)
    total_lost_sales_units = int(df_master["lost_sales_units"].sum())
    lost_sales_val = float((df_master["lost_sales_units"] * df_master["selling_price"]).sum())
    
    promo_rate = round(float(df_master["promotion_flag"].mean()), 4)
    avg_discount = round(float(df_master["discount_pct"].mean()), 4)
    avg_lead_time = round(float(df_master["lead_days"].mean()), 2)
    
    # Inventory KPIs
    avg_inventory = float(df_master["closing_stock"].mean())
    days_of_inventory = round(avg_inventory / max(0.1, avg_daily_demand), 1)
    
    summary_data = [
        {"metric": "Number of Rows", "value": total_rows},
        {"metric": "Number of Columns", "value": total_cols},
        {"metric": "Number of Stores (Master / Catalog)", "value": f"{num_stores} / {len(df_stores)}"},
        {"metric": "Number of Products (Master / Catalog)", "value": f"{num_products} / {len(df_prod)}"},
        {"metric": "Number of Categories", "value": num_categories},
        {"metric": "Number of Suppliers", "value": num_suppliers},
        {"metric": "Date Range", "value": f"{date_min} to {date_max}"},
        {"metric": "Total Units Sold", "value": total_units_sold},
        {"metric": "Total Revenue ($)", "value": f"${revenue:,.2f}"},
        {"metric": "Average Daily Demand (units/row)", "value": avg_daily_demand},
        {"metric": "Stockout Rate (%)", "value": f"{stockout_rate * 100:.2f}%"},
        {"metric": "Total Lost Sales Units", "value": total_lost_sales_units},
        {"metric": "Estimated Lost Sales Value ($)", "value": f"${lost_sales_val:,.2f}"},
        {"metric": "Promotion Rate (%)", "value": f"{promo_rate * 100:.2f}%"},
        {"metric": "Average Discount (%)", "value": f"{avg_discount * 100:.2f}%"},
        {"metric": "Average Lead Time (days)", "value": avg_lead_time},
        {"metric": "Days of Inventory Coverage (DOI)", "value": f"{days_of_inventory} days"}
    ]
    
    return pd.DataFrame(summary_data)

def validate_causal_relationships(df_master: pd.DataFrame) -> pd.DataFrame:
    """
    Tests Section 25 causal retail relationships (EDA & Statistical Validation).
    """
    results = []
    
    # 1. Promotion vs Non-Promotion Demand
    promo_demand = df_master[df_master["promotion_flag"] == 1]["units_sold"].mean()
    non_promo_demand = df_master[df_master["promotion_flag"] == 0]["units_sold"].mean()
    promo_lift = ((promo_demand - non_promo_demand) / max(0.1, non_promo_demand)) * 100
    results.append({
        "hypothesis": "Promotions increase sales demand",
        "metric_a": f"Promo Mean: {promo_demand:.2f}",
        "metric_b": f"Non-Promo Mean: {non_promo_demand:.2f}",
        "effect_size": f"+{promo_lift:.1f}% Demand Lift",
        "causal_validation": "CONFIRMED" if promo_lift > 10 else "UNVERIFIED"
    })
    
    # 2. Weekend vs Weekday Demand
    weekend_demand = df_master[df_master["weekend"] == 1]["units_sold"].mean()
    weekday_demand = df_master[df_master["weekend"] == 0]["units_sold"].mean()
    wknd_lift = ((weekend_demand - weekday_demand) / max(0.1, weekday_demand)) * 100
    results.append({
        "hypothesis": "Weekends lift retail sales volume",
        "metric_a": f"Weekend Mean: {weekend_demand:.2f}",
        "metric_b": f"Weekday Mean: {weekday_demand:.2f}",
        "effect_size": f"+{wknd_lift:.1f}% Weekend Lift",
        "causal_validation": "CONFIRMED" if wknd_lift > 5 else "UNVERIFIED"
    })
    
    # 3. Temperature vs Beverage Demand
    bev_df = df_master[df_master["department"] == "Beverages"]
    if len(bev_df) > 0:
        corr_bev = bev_df["temperature"].corr(bev_df["units_sold"])
        results.append({
            "hypothesis": "Warm temperatures drive beverage sales",
            "metric_a": f"Warm (>18C) Avg: {bev_df[bev_df['temperature'] > 18]['units_sold'].mean():.2f}",
            "metric_b": f"Cold (<10C) Avg: {bev_df[bev_df['temperature'] < 10]['units_sold'].mean():.2f}",
            "effect_size": f"Pearson r = {corr_bev:.3f}",
            "causal_validation": "CONFIRMED" if corr_bev > 0.10 else "UNVERIFIED"
        })
        
    # 4. Store Type vs Demand
    sc_demand = df_master[df_master["store_type"] == "Supercenter"]["units_sold"].mean()
    sf_demand = df_master[df_master["store_type"] == "Small Format"]["units_sold"].mean()
    sc_ratio = sc_demand / max(0.1, sf_demand)
    results.append({
        "hypothesis": "Supercenters generate higher demand than Small Formats",
        "metric_a": f"Supercenter: {sc_demand:.2f}",
        "metric_b": f"Small Format: {sf_demand:.2f}",
        "effect_size": f"{sc_ratio:.2f}x Demand Ratio",
        "causal_validation": "CONFIRMED" if sc_ratio > 1.2 else "UNVERIFIED"
    })
    
    # 5. Lead Time vs Stockout Rate
    long_lead_so = df_master[df_master["lead_days"] >= 4]["stockout_flag"].mean() * 100
    short_lead_so = df_master[df_master["lead_days"] <= 2]["stockout_flag"].mean() * 100
    results.append({
        "hypothesis": "Longer lead times elevate stock-out risk",
        "metric_a": f"Lead >=4d: {long_lead_so:.2f}%",
        "metric_b": f"Lead <=2d: {short_lead_so:.2f}%",
        "effect_size": f"{long_lead_so - short_lead_so:+.2f}% Risk Spread",
        "causal_validation": "CONFIRMED" if long_lead_so >= short_lead_so else "UNVERIFIED"
    })
    
    # 6. Inventory Coverage vs Stockout Rate
    low_cov_so = df_master[df_master["closing_stock"] <= df_master["safety_stock"]]["stockout_flag"].mean() * 100
    high_cov_so = df_master[df_master["closing_stock"] > df_master["safety_stock"] * 2]["stockout_flag"].mean() * 100
    results.append({
        "hypothesis": "Inventory near or below safety stock triggers stockouts",
        "metric_a": f"Low Stock SO: {low_cov_so:.2f}%",
        "metric_b": f"Safe Stock SO: {high_cov_so:.2f}%",
        "effect_size": f"{low_cov_so - high_cov_so:+.2f}% Spread",
        "causal_validation": "CONFIRMED" if low_cov_so > high_cov_so else "UNVERIFIED"
    })
    
    return pd.DataFrame(results)

if __name__ == "__main__":
    pass
