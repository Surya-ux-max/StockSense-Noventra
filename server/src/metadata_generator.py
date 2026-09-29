"""
Metadata Generator Module
Generates metadata/data_dictionary.csv and metadata/generation_metadata.json (with hidden anomaly ledger).
"""

import json
import pandas as pd
from server.src.config import METADATA_DIR, RANDOM_SEED, START_DATE, END_DATE

DATA_DICTIONARY_ENTRIES = [
    # Master Dataset
    {"dataset": "walmart_stocksense_master.csv", "column_name": "date", "data_type": "string (YYYY-MM-DD)", "description": "Calendar observation date.", "example_value": "2026-01-15", "constraint_rule": "Primary Key part. Consecutive dates within horizon."},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "store_id", "data_type": "string", "description": "Unique identifier for Walmart retail store.", "example_value": "WMT_CA_001", "constraint_rule": "Foreign key to stores.csv."},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "product_id", "data_type": "string", "description": "Unique identifier for Walmart retail product.", "example_value": "PRD_0012", "constraint_rule": "Foreign key to products.csv."},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "state", "data_type": "string", "description": "Two-letter US state code.", "example_value": "CA", "constraint_rule": "CA, TX, WI, FL, NY"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "city", "data_type": "string", "description": "City where store is located.", "example_value": "Los Angeles", "constraint_rule": "Valid store city"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "store_type", "data_type": "string", "description": "Retail format format of store.", "example_value": "Supercenter", "constraint_rule": "Supercenter, Neighborhood Market, Small Format"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "floor_area_sqft", "data_type": "integer", "description": "Store total floor square footage.", "example_value": "185000", "constraint_rule": "12000 - 220000"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "avg_daily_customers", "data_type": "integer", "description": "Estimated daily store customer footfall.", "example_value": "4200", "constraint_rule": "500 - 7000"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "region", "data_type": "string", "description": "Geographic sales region.", "example_value": "West", "constraint_rule": "West, Southwest, Midwest, Southeast, Northeast"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "distribution_center_id", "data_type": "string", "description": "Assigned Walmart regional distribution center.", "example_value": "WMT_DC_CA01", "constraint_rule": "Valid DC ID"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "distance_to_dc", "data_type": "float", "description": "Driving distance to assigned DC in miles.", "example_value": "64.5", "constraint_rule": "15.0 - 250.0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "department", "data_type": "string", "description": "Retail product department.", "example_value": "Dairy", "constraint_rule": "14 Walmart departments"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "category", "data_type": "string", "description": "Merchandise category.", "example_value": "Dairy Products", "constraint_rule": "Standardized category name"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "sub_category", "data_type": "string", "description": "Product sub-category.", "example_value": "Fresh Milk", "constraint_rule": "Standardized sub-category"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "brand", "data_type": "string", "description": "Product manufacturer brand.", "example_value": "Great Value", "constraint_rule": "Valid brand"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "mrp", "data_type": "float", "description": "Maximum Retail Price / regular list price ($).", "example_value": "4.28", "constraint_rule": "mrp >= selling_price"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "cost_price", "data_type": "float", "description": "Unit acquisition cost ($).", "example_value": "3.35", "constraint_rule": "cost_price < mrp"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "shelf_life_days", "data_type": "integer", "description": "Shelf life stability in days.", "example_value": "10", "constraint_rule": "7 - 3650"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "supplier_id", "data_type": "string", "description": "Primary vendor/supplier identifier.", "example_value": "SUP_DAI_01", "constraint_rule": "Valid supplier code"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "case_pack_qty", "data_type": "integer", "description": "Units per master distribution shipping pack.", "example_value": "12", "constraint_rule": "4 - 32"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "perishable_flag", "data_type": "integer", "description": "Binary flag indicating perishable item.", "example_value": "1", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "units_sold", "data_type": "integer", "description": "Total units purchased by customers on date.", "example_value": "34", "constraint_rule": "units_sold >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "selling_price", "data_type": "float", "description": "Effective customer transaction unit price ($).", "example_value": "3.85", "constraint_rule": "selling_price <= mrp"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "discount_pct", "data_type": "float", "description": "Active promotional discount rate.", "example_value": "0.10", "constraint_rule": "0.00 - 0.40"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "promotion_flag", "data_type": "integer", "description": "Flag indicating active promotional campaign.", "example_value": "1", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "channel", "data_type": "string", "description": "Primary fulfillment channel.", "example_value": "Store", "constraint_rule": "Store, Pickup"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "opening_stock", "data_type": "integer", "description": "Inventory on hand at start of day.", "example_value": "65", "constraint_rule": "opening_stock >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "received_qty", "data_type": "integer", "description": "Replenishment inventory delivered from DC.", "example_value": "48", "constraint_rule": "received_qty >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "closing_stock", "data_type": "integer", "description": "Inventory on hand at end of business day.", "example_value": "79", "constraint_rule": "closing_stock >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "incoming_stock", "data_type": "integer", "description": "Open purchase orders in transit.", "example_value": "0", "constraint_rule": "incoming_stock >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "reorder_level", "data_type": "integer", "description": "Inventory threshold that triggers replenishment.", "example_value": "42", "constraint_rule": "reorder_level > safety_stock"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "safety_stock", "data_type": "integer", "description": "Buffer stock to mitigate demand variability.", "example_value": "16", "constraint_rule": "safety_stock >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "lead_days", "data_type": "integer", "description": "Replenishment lead time in days.", "example_value": "2", "constraint_rule": "1 - 5"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "transfer_in_qty", "data_type": "integer", "description": "Units transferred in from peer stores.", "example_value": "0", "constraint_rule": "transfer_in_qty >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "transfer_out_qty", "data_type": "integer", "description": "Units transferred out to peer stores.", "example_value": "0", "constraint_rule": "transfer_out_qty >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "stockout_flag", "data_type": "integer", "description": "Binary flag indicating inventory exhaustion.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "lost_sales_units", "data_type": "integer", "description": "Unfulfilled customer demand units due to stockout.", "example_value": "0", "constraint_rule": "lost_sales_units >= 0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "temperature", "data_type": "float", "description": "Daily mean ambient temperature in Celsius.", "example_value": "14.2", "constraint_rule": "-20.0 to 35.0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "rain", "data_type": "float", "description": "Daily precipitation in millimeters.", "example_value": "0.0", "constraint_rule": "rain >= 0.0"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "holiday", "data_type": "integer", "description": "Federal holiday flag.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "festival", "data_type": "integer", "description": "Major cultural or sports festival event flag.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "weekend", "data_type": "integer", "description": "Weekend day flag (Saturday/Sunday).", "example_value": "1", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "local_event", "data_type": "integer", "description": "Local city event flag.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "school_holiday", "data_type": "integer", "description": "School break or holiday flag.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "payday_flag", "data_type": "integer", "description": "Semi-monthly payroll flag (1st and 15th).", "example_value": "1", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "extreme_weather_flag", "data_type": "integer", "description": "Extreme weather storm/blizzard flag.", "example_value": "0", "constraint_rule": "0 or 1"},
    {"dataset": "walmart_stocksense_master.csv", "column_name": "next_7_day_demand", "data_type": "integer", "description": "Target: Cumulative actual demand units over following 7 calendar days.", "example_value": "245", "constraint_rule": "Target column for regression/forecasting; NaN for final 7 horizon days."}
]

def generate_metadata_files(hidden_log: list, summary_df: pd.DataFrame):
    # 1. Data Dictionary
    df_dict = pd.DataFrame(DATA_DICTIONARY_ENTRIES)
    dict_path = METADATA_DIR / "data_dictionary.csv"
    df_dict.to_csv(dict_path, index=False)
    
    # 2. Generation Metadata JSON
    summary_dict = dict(zip(summary_df["metric"], summary_df["value"]))
    meta = {
        "project": "StockSense-Noventra Retail Decision Intelligence",
        "hackathon": "IntelliData 2026",
        "simulation_context": "Walmart US Retail Network",
        "disclaimer": "Synthetic simulation constructed with realistic Walmart organizational structure and operational physics. Contains no proprietary Walmart data.",
        "master_grain": "ONE ROW = ONE DATE x ONE STORE x ONE PRODUCT",
        "time_horizon": {
            "start_date": START_DATE,
            "end_date": END_DATE,
            "duration_days": 50
        },
        "random_seed": RANDOM_SEED,
        "dataset_kpis": summary_dict,
        "business_formulas": {
            "inventory_equation": "closing_stock = max(0, opening_stock + received_qty + transfer_in_qty - sold_qty - transfer_out_qty)",
            "safety_stock": "ceil(1.65 * std_daily_demand * sqrt(lead_days))",
            "reorder_level": "ceil(mean_daily_demand * lead_days + safety_stock)",
            "recommended_order": "max(0, ceil((forecast_demand + safety_stock - current_stock - incoming_stock) / case_pack_qty) * case_pack_qty)",
            "lost_sales_value": "lost_sales_units * selling_price",
            "stockout_classification": {
                "HIGH": "stockout_probability >= 0.70",
                "MEDIUM": "0.40 <= stockout_probability < 0.70",
                "LOW": "stockout_probability < 0.40"
            }
        },
        "intentional_data_quality_traps_hidden_log": hidden_log
    }
    
    meta_path = METADATA_DIR / "generation_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=4)
        
    print(f"Generated metadata: {dict_path} & {meta_path}")

if __name__ == "__main__":
    pass
