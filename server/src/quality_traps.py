"""
Data Quality Traps Injection Module
Injects controlled, realistic, and recoverable data anomalies into raw datasets for the Data Quality Round.
Maintains a strict hidden ledger of all injected anomalies.
"""

import numpy as np
import pandas as pd
from server.src.config import RANDOM_SEED

def inject_quality_traps(df_trans: pd.DataFrame, df_prod: pd.DataFrame, df_ext: pd.DataFrame, df_inv: pd.DataFrame, seed: int = RANDOM_SEED):
    np.random.seed(seed)
    
    hidden_log = []
    
    # 1. External Factors: Missing temperature values (~8 values)
    ext_corrupted = df_ext.copy()
    ext_trap_indices = np.random.choice(len(ext_corrupted), size=8, replace=False)
    for idx in ext_trap_indices:
        orig_temp = ext_corrupted.loc[idx, "temp_c"]
        ext_corrupted.loc[idx, "temp_c"] = np.nan
        hidden_log.append({
            "dataset": "external_factors.csv",
            "row_identifier": f"date={ext_corrupted.loc[idx, 'date']}, city={ext_corrupted.loc[idx, 'city']}",
            "column": "temp_c",
            "original_value": float(orig_temp),
            "corrupted_value": None,
            "anomaly_type": "Missing Value",
            "expected_correction": "Impute with regional 3-day rolling mean or same-day state average."
        })
        
    # 2. Products: Inconsistent category capitalization (~5 rows)
    prod_corrupted = df_prod.copy()
    prod_trap_indices = np.random.choice(len(prod_corrupted), size=5, replace=False)
    for i, idx in enumerate(prod_trap_indices):
        orig_cat = prod_corrupted.loc[idx, "category"]
        if i % 2 == 0:
            corrupted_cat = orig_cat.lower()
        else:
            corrupted_cat = orig_cat.upper()
        prod_corrupted.loc[idx, "category"] = corrupted_cat
        hidden_log.append({
            "dataset": "products.csv",
            "row_identifier": f"product_id={prod_corrupted.loc[idx, 'product_id']}",
            "column": "category",
            "original_value": orig_cat,
            "corrupted_value": corrupted_cat,
            "anomaly_type": "Case Inconsistency",
            "expected_correction": "Standardize using str.title() or taxonomy master mapping."
        })
        
    # 3. Transactions: Duplicate transaction IDs (5 rows) & Negative quantities (3 rows)
    trans_corrupted = df_trans.copy()
    dup_indices = np.random.choice(len(trans_corrupted), size=5, replace=False)
    dup_rows = trans_corrupted.iloc[dup_indices].copy()
    # Append duplicates to the end
    trans_corrupted = pd.concat([trans_corrupted, dup_rows], ignore_index=True)
    for _, r in dup_rows.iterrows():
        hidden_log.append({
            "dataset": "transactions.csv",
            "row_identifier": f"transaction_id={r['transaction_id']}",
            "column": "transaction_id",
            "original_value": "Unique ID",
            "corrupted_value": "Duplicate Entry",
            "anomaly_type": "Primary Key Duplicate",
            "expected_correction": "Deduplicate transactions keeping first occurrence or drop exact duplicates."
        })
        
    # Negative quantity traps (returns erroneously coded as negative sales without return flag)
    neg_indices = np.random.choice(len(trans_corrupted) - len(dup_rows), size=3, replace=False)
    for idx in neg_indices:
        orig_qty = trans_corrupted.loc[idx, "quantity"]
        trans_corrupted.loc[idx, "quantity"] = -int(orig_qty)
        hidden_log.append({
            "dataset": "transactions.csv",
            "row_identifier": f"transaction_id={trans_corrupted.loc[idx, 'transaction_id']}",
            "column": "quantity",
            "original_value": int(orig_qty),
            "corrupted_value": -int(orig_qty),
            "anomaly_type": "Impossible Negative Value",
            "expected_correction": "Filter out return records (quantity < 0) or treat as separate returns table."
        })
        
    # 4. Inventory: Arithmetic mismatch (3 rows where closing_stock is off by 1-2 units)
    inv_corrupted = df_inv.copy()
    inv_trap_indices = np.random.choice(len(inv_corrupted), size=3, replace=False)
    for idx in inv_trap_indices:
        orig_closing = inv_corrupted.loc[idx, "closing_stock"]
        # slight offset
        inv_corrupted.loc[idx, "closing_stock"] = orig_closing + 2
        hidden_log.append({
            "dataset": "inventory.csv",
            "row_identifier": f"date={inv_corrupted.loc[idx, 'date']}, store={inv_corrupted.loc[idx, 'store_id']}, product={inv_corrupted.loc[idx, 'product_id']}",
            "column": "closing_stock",
            "original_value": int(orig_closing),
            "corrupted_value": int(orig_closing + 2),
            "anomaly_type": "Inventory Equation Mismatch",
            "expected_correction": "Recompute closing_stock = max(0, opening + received + transfer_in - sold - transfer_out)."
        })
        
    return trans_corrupted, prod_corrupted, ext_corrupted, inv_corrupted, hidden_log

if __name__ == "__main__":
    pass
