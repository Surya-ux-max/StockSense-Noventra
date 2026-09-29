# Task 2.5: Model Validation, Accuracy & Decision Engine Certification
**Walmart StockSense Decision-Support System | IntelliData 2026 Hackathon**

---

## 1. Executive Summary & Audit Verification

Prior to frontend dashboard deployment, the trained and serialized StockSense models were subjected to a rigorous end-to-end evaluation using **ONLY** the persisted model artifacts loaded from `server/models/`.

No models were retrained, no datasets were modified, and all metrics were independently calculated from the chronological out-of-sample test setup.

| Evaluation Dimension | Status | Key Certified Findings |
|---|:---:|---|
| **Demand Model Accuracy** | **PASS** | $R^2 = 0.9332$, $\text{WAPE} = 13.49\%$, $\text{MAE} = 27.91$ units. Outperforms rolling mean baseline by $+4.19\%$ WAPE. |
| **Stock-out Model Performance** | **PASS** | $\text{ROC-AUC} = 0.7655$, $\text{PR-AUC} = 0.6096$, $\text{Recall} = 0.5563$, $\text{Brier Score} = 0.1811$. High operational recall for minority risk events. |
| **Model Performance Consistency** | **PASS** | Zero material deviation between certified Task 2 metrics and independent recalculations. |
| **Model Persistence (Save $\to$ Load $\to$ Predict)** | **PASS** | 100.0% prediction match across all models and baseline artifacts in a clean process. |
| **Scenario Testing (7 Conditions)** | **PASS** | All 7 operational retail scenarios produced valid non-negative forecasts, bounded probabilities, and case-pack rounded orders. |
| **Decision Engine & Manager Actions** | **PASS** | Deterministic business rules correctly mapped risk tiers to actionable replenishment orders and root cause drivers. |

---

## 2. Demand Model Accuracy & Baseline Benchmarking

$$\text{Target: } \text{next\_7\_day\_demand} = \sum_{k=1}^7 \text{units\_sold}_{t+k}$$

### Evaluation Metrics (Validation Set, $N = 3,000$ Store-SKU observations)
- **Mean Absolute Error (MAE):** **27.91 units**
- **Root Mean Squared Error (RMSE):** **45.37 units**
- **Mean Absolute Percentage Error (MAPE):** **13.66%**
- **Weighted Absolute Percentage Error (WAPE):** **13.49%**
- **Coefficient of Determination ($R^2$):** **0.9332**

### Prediction Distribution
- **Actual Mean Demand:** 206.94 units
- **Predicted Mean Demand:** 190.66 units
- **Prediction Minimum / Maximum:** 10.0 / 801.9 units
- **Prediction Error Mean / Std:** 16.28 / 42.35 units

### Baseline Comparison
| Model Architecture | MAE (units) | RMSE (units) | MAPE (%) | WAPE (%) | $R^2$ Score | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Baseline 1 (7-Day Rolling Mean $\times 7$) | 36.59 | 60.02 | 18.34% | 17.68% | 0.8830 | Benchmark |
| Baseline 2 (Daily Sales $\times 7$) | 64.09 | 114.95 | 34.33% | 30.97% | 0.5709 | Benchmark |
| Ridge Regression (Permitted) | 31.24 | 48.62 | 21.12% | 15.10% | 0.9232 | Permitted Candidate |
| **Random Forest Regressor** | **27.91** | **45.37** | **13.66%** | **13.49%** | **0.9332** | **FINAL SUBMISSION MODEL** |

---

## 3. Stock-out Model Performance

$$\text{Target: } \text{target\_stockout\_7d} = \mathbb{I}\left(\sum_{k=1}^7 \text{stockout\_flag}_{t+k} \ge 1\right)$$

### Primary Minority-Class Metrics (Validation Set)
- **Precision:** **0.5884**
- **Recall:** **0.5563**
- **F1-Score:** **0.5719**
- **ROC-AUC:** **0.7655**
- **PR-AUC:** **0.6096**
- **Brier Score:** **0.1811**
- **Supplementary Accuracy:** **0.7360**

### Confusion Matrix (Threshold = 0.50)
| | Predicted Negative (0) | Predicted Positive (1) |
|---|:---:|:---:|
| **Actual In-Stock (0)** | **1,679** (TN) | **370** (FP) |
| **Actual Stock-Out (1)** | **422** (FN) | **529** (TP) |

---

## 4. Certified vs Independently Reproduced Metrics

| Model | Metric | Certified Task 2 Value | Independent Recalculation | Absolute Difference | Status |
|---|---|:---:|:---:|:---:|:---:|
| **Random Forest Regressor (Demand)** | MAE | 27.91 | 27.91 | 0.0028 | **PASS** |
| **Random Forest Regressor (Demand)** | RMSE | 45.37 | 45.37 | 0.0035 | **PASS** |
| **Random Forest Regressor (Demand)** | MAPE | 13.66% | 13.66% | 0.0049 | **PASS** |
| **Random Forest Regressor (Demand)** | WAPE | 13.49% | 13.49% | 0.0046 | **PASS** |
| **Random Forest Regressor (Demand)** | $R^2$ | 0.9332 | 0.9332 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | Precision | 0.5884 | 0.5884 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | Recall | 0.5563 | 0.5563 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | F1-Score | 0.5719 | 0.5719 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | ROC-AUC | 0.7655 | 0.7655 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | PR-AUC | 0.6096 | 0.6096 | 0.0000 | **PASS** |
| **Random Forest Classifier (Stockout)** | Brier Score | 0.1811 | 0.1811 | 0.0000 | **PASS** |

---

## 5. Scenario Testing Across 7 Operational Conditions

Tested in [`server/reports/task2_scenario_tests.csv`](file:///d:/StockSense-Noventra/server/reports/task2_scenario_tests.csv):

| Scenario | Store & SKU | Pred Demand | Stockout Prob | Risk | On-Hand | In-Transit | Rec Order | Case Pack | Decision Action | Status |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|:---:|
| **1. Normal Inventory & Demand** | WMT_CA_001 / PRD_0015 | 280 | 0.2840 | **LOW** | 120 | 0 | **180** | 12 | *Monitor inventory; current stock buffer sufficient.* | **PASS** |
| **2. Promo & Demand Surge** | WMT_TX_013 / PRD_0044 | 240 | 0.7410 | **HIGH** | 80 | 0 | **180** | 12 | *Raise replenishment order immediately; request expedited DC transfer.* | **PASS** |
| **3. Critically Low Inventory** | WMT_NY_031 / PRD_0150 | 325 | 0.8004 | **HIGH** | 42 | 0 | **300** | 12 | *Raise replenishment order immediately; request expedited DC transfer.* | **PASS** |
| **4. Low Stock + In-Transit** | WMT_TX_010 / PRD_0002 | 620 | 0.6450 | **MEDIUM** | 35 | 400 | **240** | 12 | *Review replenishment plan and advance delivery schedule by 48h.* | **PASS** |
| **5. Case-Pack Rounding (Pack=12)** | WMT_WI_020 / PRD_0083 | 572 | 0.6915 | **MEDIUM** | 180 | 120 | **300** | 12 | *Review replenishment plan and advance delivery schedule by 48h.* | **PASS** |
| **6. Low-Demand SKU** | WMT_CA_002 / PRD_0096 | 45 | 0.2210 | **LOW** | 60 | 0 | **0** | 6 | *Monitor inventory; current stock buffer sufficient.* | **PASS** |
| **7. High-Demand SKU** | WMT_FL_028 / PRD_0005 | 540 | 0.7514 | **HIGH** | 95 | 0 | **480** | 24 | *Raise replenishment order immediately; request expedited DC transfer.* | **PASS** |

### Case-Pack Rounding Verification
$$	ext{Recommended Order Qty} = \left\lceil \frac{\max(0, \text{Forecast} + \text{Safety Stock} - \text{On-Hand} - \text{In-Transit})}{\text{Case Pack Qty}} \right\rceil \times \text{Case Pack Qty}$$
- All recommended orders are exact non-negative integer multiples of their SKU case pack quantities (0, 12, 24, 48, etc.).
- Fractional case packs or negative order values: **0** (**PASS**).

---

## 6. Ground-Truth Prediction Test (Actual Historical Test Records)

| Prediction Date | Store ID | Product ID | Department | Predicted 7d Demand | Actual 7d Demand | Absolute Error | Percentage Error (%) |
|---|---|---|---|:---:|:---:|:---:|:---:|
| 2026-02-10 | WMT_TX_011 | PRD_0021 | Dairy Products | 286 | 294 | 8 | 2.72% |
| 2026-02-11 | WMT_NY_031 | PRD_0045 | Soft Drinks | 340 | 328 | 12 | 3.66% |
| 2026-02-12 | WMT_FL_024 | PRD_0078 | Salty Snacks | 192 | 204 | 12 | 5.88% |
| 2026-02-10 | WMT_CA_003 | PRD_0012 | Dairy Products | 410 | 390 | 20 | 5.13% |
| 2026-02-11 | WMT_WI_018 | PRD_0142 | Canned Goods | 175 | 168 | 7 | 4.17% |

---

## 7. Model Persistence Verification (Save $\to$ Load $\to$ Predict)

- Loaded artifacts directly from `server/models/demand/` and `server/models/stockout/`.
- Predictions on held-out test data matched pre-serialization values with **100.0% numerical precision** (`np.allclose = True`).
- No retraining, refitting, or weight modifications were performed.

---

## 8. Final Decision & Readiness Certification

```
MODEL PERFORMANCE:
PASS

MODEL PERSISTENCE:
PASS

SCENARIO TESTING:
PASS

DECISION ENGINE:
PASS

OVERALL SYSTEM:
READY FOR FRONTEND
```
