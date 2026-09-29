# Task 1: Dataset Audit & Validation Summary Report
**Walmart StockSense-Noventra | IntelliData 2026 Hackathon**

---

## 1. Executive Determination: **KEEP**
Following a comprehensive independent audit of the 5 raw datasets (`transactions.csv`, `products.csv`, `stores.csv`, `inventory.csv`, `external_factors.csv`) and the processed master dataset (`walmart_stocksense_master.csv`), the dataset is certified as **INTERNALLY CONSISTENT, BUSINESS-REALISTIC, TEMPORALLY VALID, AND ZERO-LEAKAGE SAFE**.

**Recommendation:** **KEEP** — The dataset is fully validated and approved to proceed to Task 2 (Data Cleaning & Feature Engineering).

---

## 2. Dataset Inventory & Architecture
- **Master Grain:** Exactly **ONE ROW = ONE DATE × ONE STORE × ONE PRODUCT** (verified across 15,000 rows).
- **Time Horizon:** 50 consecutive calendar days (`2026-01-01` to `2026-02-19`) across 35 stores and 300 active Store × Product pairs.
- **Physical Integrity:** 0 negative inventory values, 0 inventory conservation errors in master.
- **Total Revenue:** $2,520,443.08
- **Stockout Incidence:** 681 events (**4.54%** operational rate).
- **Estimated Lost Sales Value:** $81,846.25 (15,595 unfulfilled units).

---

## 3. Data Quality Traps Audited (Hackathon Round 1)
All 24 intentional anomalies in raw datasets were independently detected and matched against the generation audit ledger:
1. **transactions.csv:** 5 duplicate transaction IDs, 3 negative quantities (returns).
2. **products.csv:** 5 category casing inconsistencies (`str.lower()` / `str.upper()`).
3. **external_factors.csv:** 8 missing temperature values (`NaN`).
4. **inventory.csv:** 3 arithmetic discrepancies in closing stock.

In the master processed table (`walmart_stocksense_master.csv`), all anomalies are properly reconciled and standardized, providing a golden target benchmark for Data Quality Round evaluation.

---

## 4. Causal Relationship Verification
- **Promotions:** +31.1% demand lift (**CONFIRMED**).
- **Weekends:** +22.9% velocity surge (**CONFIRMED**).
- **Temperature on Beverages:** Pearson $r = 0.337$ (**CONFIRMED**).
- **Store Formats:** Supercenters generate 2.21x Small Format volume (**CONFIRMED**).
- **Lead Time on Stockouts:** Long lead times ($\ge 4$d) elevate stockout rate by +4.14% (**CONFIRMED**).
- **Inventory Buffer Depletion:** Stock $\le$ Safety Stock elevates stockout rate to 36.95% (**CONFIRMED**).

---

## 5. Temporal Structure & Leakage Prevention
- **Target `next_7_day_demand`:** Verified mathematically as $\sum_{k=1}^{7} 	ext{units\_sold}_{t+k}$ with 0 leakage into predictor columns.
- **Usable Observations:**
  - Lag 1 day: 14,700 observations (49 days)
  - Lag 7 days: 12,900 observations (43 days)
  - Lag 14 days: 10,800 observations (36 days)
  - Lag 28 days: 6,600 observations (22 days)
- **Chronological Split Recommendation:**
  - **Train:** Jan 01 – Jan 30 (30 days / 9,000 rows / 60%)
  - **Validation:** Jan 31 – Feb 09 (10 days / 3,000 rows / 20%)
  - **Test / Prospective Horizon:** Feb 10 – Feb 19 (10 days / 3,000 rows / 20%)

---

## 6. Audit Scorecard Summary
- Total Checks Conducted: **19**
- Passing Checks: **19/19** (Raw quality traps categorized as expected LOW severity).
- Critical Blockers: **0**
- Final Decision: **KEEP**
