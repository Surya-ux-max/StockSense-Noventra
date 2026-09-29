# Walmart StockSense-Noventra: Decision-Support Synthetic Retail Dataset
**IntelliData 2026 Hackathon | Retail Operations & Inventory Decision Intelligence**

---

## 1. Executive Summary & Purpose

The **Walmart StockSense** dataset is an enterprise-grade synthetic retail decision-intelligence benchmark built for the **IntelliData 2026 Data Science Hackathon**. Modern large-scale retail supply chains operate under dynamic customer demand, promotions, geographic weather variability, multi-tier distribution logistics, and supplier lead-time stochasticity. 

Traditional inventory management tools fail when demand spikes deplete inventory faster than supplier lead times allow replenishment, resulting in lost sales, customer dissatisfaction, and margin erosion.

This dataset provides the foundation to develop an end-to-end decision-support system that:
1. **Forecasts next 7-day demand** for every Store × Product combination.
2. **Predicts stock-out probability** over the operational decision horizon.
3. **Classifies stock-out risk** into **HIGH** ($\ge 0.70$), **MEDIUM** ($0.40 - <0.70$), and **LOW** ($<0.40$).
4. **Explains WHY a product is at risk** (e.g., promotional lift, weekend velocity spike, low inventory buffer, extended supplier lead time).
5. **Recommends actionable replenishment orders** rounded to distribution case packs.
6. **Produces manager-ready interventions** to prevent lost revenue.
7. **Quantifies business KPIs**: revenue, lost sales value, inventory turnover, and days of inventory coverage (DOI).

---

## 2. Walmart Context & Synthetic Data Disclaimer

> [!NOTE]
> **Synthetic Data Disclaimer:**  
> This dataset is an engineered synthetic simulation inspired by Walmart's publicly known United States operational structure, retail store formats, merchandising hierarchy, and regional logistics network. It does **not** contain real customer Personally Identifiable Information (PII) or proprietary internal Walmart data. All customer identifiers, transaction IDs, store codes, and supplier IDs are synthetic.

### Geographic Network
The simulation models **35 representative Walmart stores** across five major US economic regions and diverse climatic zones:
- **West (California - CA):** Supercenters and Neighborhood Markets in Los Angeles, San Diego, San Jose, Sacramento, Fresno (served by `WMT_DC_CA01` in Bakersfield, CA).
- **Southwest (Texas - TX):** High-volume hubs in Houston, Dallas, Austin, San Antonio, Fort Worth (served by `WMT_DC_TX01` in Waxahachie, TX).
- **Midwest (Wisconsin - WI):** Sub-zero winter locations in Milwaukee, Madison, Green Bay, Kenosha, Appleton (served by `WMT_DC_WI01` in Beaver Dam, WI).
- **Southeast (Florida - FL):** High footfall stores in Miami, Orlando, Tampa, Jacksonville, Tallahassee (served by `WMT_DC_FL01` in Macclenny, FL).
- **Northeast (New York - NY):** Metro and suburban stores in New York City, Buffalo, Rochester, Albany, Syracuse (served by `WMT_DC_NY01` in Marcy, NY).

### Store Formats
- **Supercenter (55%):** 160,000–220,000 sq ft, 3,500–6,500 daily customers, full grocery and general merchandise, 100% pickup/delivery capability.
- **Neighborhood Market (30%):** 38,000–50,000 sq ft, 1,800–3,200 daily customers, grocery, fresh dairy, beverages, and pharmacy.
- **Small Format (15%):** 12,000–25,000 sq ft, 900–1,600 daily customers, convenience assortment.

---

## 3. Dataset Architecture & File Hierarchy

```
server/
├── data/
│   ├── raw/
│   │   ├── transactions.csv          # Dataset A: POS basket item transactions
│   │   ├── products.csv              # Dataset B: Master SKU taxonomy & pricing
│   │   ├── stores.csv                # Dataset C: Retail store network & DC distances
│   │   ├── inventory.csv             # Dataset D: Daily operational stock transitions
│   │   └── external_factors.csv      # Dataset E: Daily weather, holidays, and calendar
│   └── processed/
│       └── walmart_stocksense_master.csv  # Dataset F: 15,000 rows (Date x Store x Product)
├── reports/
│   ├── data_quality_report.csv       # 17 Automated quality check audits
│   ├── dataset_summary.csv           # Business KPIs, revenue, lost sales, stockout rates
│   └── relationship_validation.csv   # Statistical validation of causal relationships
└── metadata/
    ├── data_dictionary.csv           # Column-level schema, types, and constraints
    └── generation_metadata.json      # Audit ledger with hidden data-quality traps
```

### Master Dataset Grain
$$\text{Master Grain} = \text{ONE ROW} \iff \text{ONE DATE} \times \text{ONE STORE} \times \text{ONE PRODUCT}$$
- **Time Horizon:** 50 consecutive calendar days (`2026-01-01` to `2026-02-19`).
- **Active Focal Assortment:** 300 representative Store × Product pairs across all 35 stores and 14 merchandise departments.
- **Total Master Rows:** Exactly **15,000 rows**.

---

## 4. Raw Datasets Schema (A–E)

### A. `transactions.csv` (Sales Transactions)
Point-of-sale transaction logs decomposed from daily store-product demand:
- `transaction_id`: Unique identifier (e.g. `TXN_00012345`).
- `date`: Transaction date (`YYYY-MM-DD`).
- `store_id`, `product_id`: Associated store and SKU.
- `quantity`: Units purchased (typically 1–4 units).
- `selling_price`: Net transaction unit price.
- `discount_pct`, `promotion_flag`: Promotional discount metadata.
- `customer_id`: Synthetic customer identifier.
- `payment_mode`: `Credit Card`, `Debit Card`, `Walmart Pay`, `Cash`, `EBT`, `Gift Card`.
- `hour`: Transaction hour (7 to 22, peaking 11:00–19:00).
- `channel`: `Store`, `Pickup`, `Delivery`, `Online`.
- `fulfillment_type`: `In-Store`, `Pickup`, `Delivery`.
- `markdown_flag`, `rollback_flag`: Walmart pricing event indicators.

### B. `products.csv` (Product Master)
- Catalog of 350 SKUs across 14 Walmart merchandise departments:
  *Dairy, Beverages, Snacks, Grocery, Frozen, Household, Personal Care, Health & Wellness, Beauty, Electronics, Home, Apparel, Toys, Pet Supplies.*
- Key fields: `mrp`, `cost_price` ($cost < mrp$), `shelf_life_days` (perishable milk: 7–14d, yogurt: 14–30d, dry goods: 180–730d), `supplier_id`, `case_pack_qty` (4, 6, 12, 24), `perishable_flag`.

### C. `stores.csv` (Store Network Master)
- 35 representative retail facilities.
- Key fields: `store_id`, `state`, `city`, `store_type`, `floor_area_sqft`, `avg_daily_customers`, `region`, `distribution_center_id`, `distance_to_dc` (18 to 240 miles), `pickup_enabled`, `delivery_enabled`.

### D. `inventory.csv` (Operational Inventory Dynamics)
- Daily inventory ledger tracking physical inventory balance:
  $$\text{closing\_stock} = \max(0, \text{opening\_stock} + \text{received\_qty} + \text{transfer\_in\_qty} - \text{sold\_qty} - \text{transfer\_out\_qty})$$
- Key fields: `opening_stock`, `received_qty`, `sold_qty`, `closing_stock`, `incoming_stock`, `reorder_level`, `safety_stock`, `lead_days`, `transfer_in_qty`, `transfer_out_qty`, `stockout_flag`, `stockout_duration_hours`, `lost_sales_units`.
- **Physical Constraints:** Inventory cannot be negative. If demand exceeds on-hand stock, `sold_qty` equals available inventory, excess demand becomes `lost_sales_units`, `closing_stock = 0`, and `stockout_flag = 1`.

### E. `external_factors.csv` (Weather & Calendar)
- Daily observations for every store location:
  `temp_c`, `rain_mm`, `snow_mm`, `humidity_pct`, `wind_speed`, `holiday`, `holiday_name`, `festival`, `weekend`, `local_event`, `school_holiday`, `payday_flag`, `extreme_weather_flag`.
- Models real calendar dynamics in early 2026: New Year's Day, MLK Day, Super Bowl Sunday, Valentine's Day, Presidents' Day, and semi-monthly paydays (1st and 15th).

---

## 5. Causal Demand & Stockout Physics

The simulation generates demand using a multiplicative causal formulation:

$$\text{Demand}_{s,p,t} = \text{Base}_{p} \times \text{StoreMult}_{s} \times \text{DOW}_{t} \times \text{PromoLift}_{p,t} \times \text{WeatherMult}_{p,t} \times \text{EventMult}_{p,t} \times \text{Trend}_{t} + \epsilon$$

### Embedded Causal Mechanisms
1. **Promotions & Rollbacks:** Price elasticity lifts demand by 25%–55%, particularly in snacks, carbonated beverages, frozen meals, and personal care.
2. **Weekend Effect:** Friday–Sunday footfall increases sales velocity across fresh grocery and consumables (+12% to +28%).
3. **Weather Drivers:**
   - Ambient temperature $>22^\circ\text{C}$ increases cold beverage and ice cream demand ($r \approx 0.25 - 0.40$).
   - Sub-zero freezing temperatures lift hot coffee and soup demand.
   - Rain and snow shift omni-channel fulfillment from physical in-store shopping to curbside pickup and doorstep delivery.
4. **Holidays & Cultural Events:**
   - Super Bowl Sunday induces massive spikes (+65%) in salty snacks, tortilla chips, and soft drinks.
   - Valentine's Day spikes beauty, cosmetics, chocolates, and greeting cards (+50%).
   - Paydays (1st and 15th) expand discretionary and bulk household purchasing (+15%).
5. **Replenishment Delays & Stockout Genesis:**
   - Supplier lead times vary naturally (1–5 days) based on DC distance and vendor SLA.
   - A realistic 6% stochastic supplier delay simulates transportation bottlenecks. When deliveries miss scheduled arrival during high-demand windows, inventory collapses to zero, producing true operational stockouts and unfulfilled demand (`lost_sales_units > 0`).

---

## 6. Target Construction & Zero Data Leakage

### Forecasting Target: `next_7_day_demand`
For each Store $s$, Product $p$, and observation date $t$:
$$\text{next\_7\_day\_demand}_{s,p,t} = \sum_{k=1}^{7} \text{units\_sold}_{s,p,t+k}$$

> [!IMPORTANT]
> **Strict Leakage Prevention:**
> 1. Future sales, future inventory levels, future stockout flags, and future supplier receipts are **never** included in predictor columns.
> 2. All feature columns reflect solely state information available at the close of day $t$.
> 3. The final 7 days of the 50-day window (`2026-02-13` to `2026-02-19`) have uncompleted future windows, serving as the prospective out-of-sample evaluation test horizon.
> 4. Chronological train/validation/test splitting (e.g. 60% Train / 20% Val / 20% Test) must be maintained to reflect realistic production deployment.

### Classification Target: `stockout_flag` & `stockout_probability`
- Operational risk tiers:
  - **HIGH RISK:** $\ge 0.70$
  - **MEDIUM RISK:** $0.40 - <0.70$
  - **LOW RISK:** $< 0.40$

---

## 7. Data Quality Traps (Hackathon Round 1)

In accordance with Hackathon specifications, controlled and realistic anomalies were injected into the **raw** datasets (A–E). A hidden generation ledger (`metadata/generation_metadata.json`) tracks each injection:

| Dataset | Column | Anomaly Type | Count | Expected Remediation |
|---|---|---|---|---|
| `external_factors.csv` | `temp_c` | Missing Value (`NaN`) | 8 | Impute with regional 3-day rolling mean or same-day state average. |
| `products.csv` | `category` | Inconsistent Letter Case | 5 | Normalize using `.str.title()` or master taxonomy lookup. |
| `transactions.csv` | `transaction_id` | Duplicate Primary Key | 5 | Deduplicate keeping primary unique transaction record. |
| `transactions.csv` | `quantity` | Negative Quantity (Returns) | 3 | Filter out return transactions or split into separate returns ledger. |
| `inventory.csv` | `closing_stock` | Equation Arithmetic Mismatch | 3 | Recompute using physical continuity formula: $\max(0, \text{opening} + \text{received} + \text{transfer\_in} - \text{sold} - \text{transfer\_out})$. |

---

## 8. Replenishment Decision Engine & Action Framework

The dataset supports an explainable inventory replenishment decision engine that converts statistical forecasts into supply chain actions:

$$\text{Recommended Stock} = \widehat{\text{Demand}}_{7\text{d}} + \text{Safety Stock}$$
$$\text{Gross Order Deficit} = \max(0, \text{Recommended Stock} - \text{Current Stock} - \text{Incoming Stock})$$
$$\text{Recommended Order} = \left\lceil \frac{\text{Gross Order Deficit}}{\text{Case Pack Qty}} \right\rceil \times \text{Case Pack Qty}$$

### Manager-Ready Action Matrix
| Risk Level | Stockout Probability | Primary Root Cause | Recommended Manager Action |
|---|---|---|---|
| **HIGH** | $\ge 0.70$ | Upcoming Promo + Weekend Lift + Lead Time | *Raise emergency PO today; request expedited DC dispatch.* |
| **HIGH** | $\ge 0.70$ | Supplier Transit Delay + Zero Buffer | *Trigger inter-store stock transfer from nearest low-demand store.* |
| **MEDIUM** | $0.40 - <0.70$ | Increasing Sales Trend + Moderate Stock | *Advance scheduled replenishment PO by 48 hours.* |
| **LOW** | $<0.40$ | Adequate Coverage ($>\text{Reorder Level}$) | *Maintain regular review cycle; no manual intervention needed.* |

---

## 9. Business Impact & KPI Equations

The dataset enables computation of key retail performance indicators:
- **Total Revenue:** $\sum (\text{units\_sold} \times \text{selling\_price})$
- **Stockout Rate:** $\frac{\sum \text{stockout\_flag}}{N}$
- **Estimated Lost Sales Value:** $\sum (\text{lost\_sales\_units} \times \text{selling\_price})$
- **Days of Inventory (DOI):** $\frac{\text{Average Closing Inventory}}{\text{Average Daily Demand}}$
- **Promotion Lift (%):** $\frac{\bar{D}_{\text{promo}} - \bar{D}_{\text{non-promo}}}{\bar{D}_{\text{non-promo}}} \times 100$

All generated files and scripts adhere to clean, modular architecture in `server/src/`.
