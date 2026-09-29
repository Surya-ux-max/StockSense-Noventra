"""
StockSense-Noventra Synthetic Data Pipeline Orchestrator
Executes the end-to-end generation, quality trap injection, master consolidation, and validation pipeline.
"""

import sys
import time
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from server.src.config import RAW_DATA_DIR, PROCESSED_DATA_DIR, REPORTS_DIR, METADATA_DIR, NUM_STORES, NUM_PRODUCTS
from server.src.stores_generator import generate_stores
from server.src.products_generator import generate_products
from server.src.external_factors_generator import generate_external_factors
from server.src.demand_simulation import select_active_assortment, simulate_daily_demand
from server.src.inventory_generator import generate_inventory
from server.src.transactions_generator import generate_transactions
from server.src.quality_traps import inject_quality_traps
from server.src.master_builder import build_master_dataset
from server.src.validator import run_validation_checks, generate_dataset_summary, validate_causal_relationships
from server.src.metadata_generator import generate_metadata_files

def run_pipeline():
    start_time = time.time()
    print("=" * 70)
    print("  STOCKSENSE-NOVENTRA: WALMART SYNTHETIC RETAIL DATASET PIPELINE")
    print("=" * 70)
    
    # 1. Stores
    print("\n[Step 1/10] Generating Stores...")
    stores_df = generate_stores(num_stores=NUM_STORES)
    print(f"  -> Generated {len(stores_df)} stores across {stores_df['state'].nunique()} states.")
    
    # 2. Products
    print("\n[Step 2/10] Generating Product Catalog...")
    products_df = generate_products(target_count=NUM_PRODUCTS)
    print(f"  -> Generated {len(products_df)} products across {products_df['department'].nunique()} departments.")
    
    # 3. External Factors
    print("\n[Step 3/10] Generating Daily External Factors & Weather...")
    ext_df = generate_external_factors(stores_df)
    print(f"  -> Generated {len(ext_df)} external factor rows.")
    
    # 4. Assortment & Demand
    print("\n[Step 4/10] Selecting Active Store-Product Assortment and Simulating Causal Demand...")
    pairs_df, prod_lookup = select_active_assortment(stores_df, products_df)
    demand_df = simulate_daily_demand(pairs_df, ext_df, prod_lookup)
    print(f"  -> Active pairs: {len(pairs_df)}. Daily demand records: {len(demand_df)}.")
    
    # 5. Inventory Dynamics
    print("\n[Step 5/10] Simulating Daily Inventory Transitions & Stockouts...")
    clean_inv_df = generate_inventory(pairs_df, demand_df, prod_lookup)
    so_rate = clean_inv_df["stockout_flag"].mean()
    print(f"  -> Generated {len(clean_inv_df)} inventory rows. Natural stockout rate: {so_rate:.2%}.")
    
    # 6. Transactions
    print("\n[Step 6/10] Deconstructing Daily Sales into Basket Transactions...")
    clean_trans_df = generate_transactions(clean_inv_df, demand_df, ext_df)
    print(f"  -> Generated {len(clean_trans_df):,} transaction records.")
    
    # 7. Quality Traps Injection
    print("\n[Step 7/10] Injecting Controlled Data Quality Traps for Hackathon Round 1...")
    raw_trans, raw_prod, raw_ext, raw_inv, hidden_log = inject_quality_traps(
        clean_trans_df, products_df, ext_df, clean_inv_df
    )
    print(f"  -> Injected {len(hidden_log)} controlled anomalies. Documented in hidden audit log.")
    
    # Save Raw Datasets
    print("  -> Writing Raw Datasets (A-E)...")
    stores_df.to_csv(RAW_DATA_DIR / "stores.csv", index=False)
    raw_prod.to_csv(RAW_DATA_DIR / "products.csv", index=False)
    raw_ext.to_csv(RAW_DATA_DIR / "external_factors.csv", index=False)
    raw_inv.to_csv(RAW_DATA_DIR / "inventory.csv", index=False)
    raw_trans.to_csv(RAW_DATA_DIR / "transactions.csv", index=False)
    print(f"  -> Saved raw files to {RAW_DATA_DIR}")
    
    # 8. Master Consolidation
    print("\n[Step 8/10] Building Walmart StockSense Master Dataset...")
    master_df = build_master_dataset(stores_df, products_df, clean_inv_df, demand_df, ext_df)
    master_path = PROCESSED_DATA_DIR / "walmart_stocksense_master.csv"
    master_df.to_csv(master_path, index=False)
    print(f"  -> Master dataset created: {len(master_df):,} rows x {len(master_df.columns)} columns.")
    print(f"  -> Saved master file to {master_path}")
    
    # 9. Validation and Reports
    print("\n[Step 9/10] Executing Automated Validation Checks & Computing Business KPIs...")
    dq_report = run_validation_checks(raw_trans, raw_prod, stores_df, raw_inv, raw_ext, master_df)
    dq_report_path = REPORTS_DIR / "data_quality_report.csv"
    dq_report.to_csv(dq_report_path, index=False)
    
    summary_report = generate_dataset_summary(master_df, stores_df, products_df)
    summary_report_path = REPORTS_DIR / "dataset_summary.csv"
    summary_report.to_csv(summary_report_path, index=False)
    
    rel_report = validate_causal_relationships(master_df)
    rel_report_path = REPORTS_DIR / "relationship_validation.csv"
    rel_report.to_csv(rel_report_path, index=False)
    print(f"  -> Saved reports to {REPORTS_DIR}")
    
    # 10. Metadata
    print("\n[Step 10/10] Generating Data Dictionary and Generation Metadata JSON...")
    generate_metadata_files(hidden_log, summary_report)
    
    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 70)
    print(f" PIPELINE COMPLETED SUCCESSFULLY IN {elapsed}s")
    print("=" * 70)
    
    print("\n--- DATASET SUMMARY SNAPSHOT ---")
    for _, row in summary_report.iterrows():
        print(f"  {row['metric']:<38}: {row['value']}")
        
    print("\n--- CAUSAL RELATIONSHIP VALIDATION SNAPSHOT ---")
    for _, row in rel_report.iterrows():
        print(f"  [{row['causal_validation']}] {row['hypothesis']:<48} -> {row['effect_size']}")
        
    print("\n--- DATA QUALITY AUDIT SNAPSHOT ---")
    pass_cnt = (dq_report["status"] == "PASS").sum()
    print(f"  Checks Passing: {pass_cnt}/{len(dq_report)}")

if __name__ == "__main__":
    run_pipeline()
