"""
StockSense-Noventra Configuration Module
Defines simulation parameters, random seeds, paths, and domain constants.
"""

from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
REPORTS_DIR = BASE_DIR / "reports"
METADATA_DIR = BASE_DIR / "metadata"

# Create directories if they do not exist
for d in [RAW_DATA_DIR, PROCESSED_DATA_DIR, REPORTS_DIR, METADATA_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Random Seed for Reproducibility
RANDOM_SEED = 42

# Time Horizon
START_DATE = "2026-01-01"
END_DATE = "2026-02-19"  # 50 days
NUM_DAYS = 50

# Dimensions
NUM_STORES = 35
NUM_PRODUCTS = 350
NUM_ACTIVE_PAIRS = 300  # 300 active Store x Product pairs across 50 days = 15,000 master rows
TARGET_MASTER_ROWS = 15000

# Geographic Regions & Walmart Distribution Centers
REGIONS = {
    "West": {
        "state": "CA",
        "cities": ["Los Angeles", "San Diego", "San Jose", "Sacramento", "Fresno"],
        "dc_id": "WMT_DC_CA01",
        "dc_location": "Bakersfield, CA",
        "climate_base_temp": 16.0
    },
    "Southwest": {
        "state": "TX",
        "cities": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
        "dc_id": "WMT_DC_TX01",
        "dc_location": "Waxahachie, TX",
        "climate_base_temp": 14.0
    },
    "Midwest": {
        "state": "WI",
        "cities": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Appleton"],
        "dc_id": "WMT_DC_WI01",
        "dc_location": "Beaver Dam, WI",
        "climate_base_temp": -4.0
    },
    "Southeast": {
        "state": "FL",
        "cities": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
        "dc_id": "WMT_DC_FL01",
        "dc_location": "Macclenny, FL",
        "climate_base_temp": 20.0
    },
    "Northeast": {
        "state": "NY",
        "cities": ["New York", "Buffalo", "Rochester", "Albany", "Syracuse"],
        "dc_id": "WMT_DC_NY01",
        "dc_location": "Marcy, NY",
        "climate_base_temp": -1.0
    }
}

# Store Types and Profiles
STORE_FORMATS = {
    "Supercenter": {
        "weight": 0.55,
        "sqft_range": (160000, 220000),
        "cust_range": (3500, 6500),
        "demand_mult": 1.35,
        "pickup_prob": 1.0,
        "delivery_prob": 0.95
    },
    "Neighborhood Market": {
        "weight": 0.30,
        "sqft_range": (38000, 50000),
        "cust_range": (1800, 3200),
        "demand_mult": 1.0,
        "pickup_prob": 0.95,
        "delivery_prob": 0.85
    },
    "Small Format": {
        "weight": 0.15,
        "sqft_range": (12000, 25000),
        "cust_range": (900, 1600),
        "demand_mult": 0.70,
        "pickup_prob": 0.70,
        "delivery_prob": 0.50
    }
}
