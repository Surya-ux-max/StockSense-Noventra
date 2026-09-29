"""
External Factors Generator Module
Generates daily weather, calendar, and event features for each store location (external_factors.csv).
"""

import numpy as np
import pandas as pd
from datetime import datetime
from server.src.config import REGIONS, START_DATE, NUM_DAYS, RANDOM_SEED, RAW_DATA_DIR

# Defined calendar events in Jan 1 - Feb 19, 2026
EVENTS_MAP = {
    "2026-01-01": {"holiday": 1, "holiday_name": "New Year's Day", "festival": 1, "school_holiday": 1},
    "2026-01-02": {"holiday": 0, "holiday_name": "None", "festival": 0, "school_holiday": 1},
    "2026-01-19": {"holiday": 1, "holiday_name": "MLK Day", "festival": 0, "school_holiday": 1},
    "2026-02-08": {"holiday": 0, "holiday_name": "Super Bowl Sunday", "festival": 1, "school_holiday": 0, "local_event": 1},
    "2026-02-14": {"holiday": 0, "holiday_name": "Valentine's Day", "festival": 1, "school_holiday": 0},
    "2026-02-16": {"holiday": 1, "holiday_name": "Presidents Day", "festival": 0, "school_holiday": 1}
}

def generate_external_factors(stores_df: pd.DataFrame, seed: int = RANDOM_SEED) -> pd.DataFrame:
    np.random.seed(seed)
    
    dates = pd.date_range(start=START_DATE, periods=NUM_DAYS, freq="D").strftime("%Y-%m-%d").tolist()
    unique_locations = stores_df[["city", "state"]].drop_duplicates().to_dict(orient="records")
    
    # State climate parameters
    climate_params = {
        "CA": {"base_temp": 16.0, "temp_std": 2.5, "rain_prob": 0.18, "snow_prob": 0.0},
        "TX": {"base_temp": 13.5, "temp_std": 3.8, "rain_prob": 0.22, "snow_prob": 0.02},
        "WI": {"base_temp": -6.5, "temp_std": 4.5, "rain_prob": 0.10, "snow_prob": 0.40},
        "FL": {"base_temp": 21.0, "temp_std": 2.2, "rain_prob": 0.25, "snow_prob": 0.0},
        "NY": {"base_temp": -1.5, "temp_std": 4.0, "rain_prob": 0.25, "snow_prob": 0.35}
    }
    
    records = []
    
    for dt_str in dates:
        dt = datetime.strptime(dt_str, "%Y-%m-%d")
        day_of_week = dt.weekday()
        is_weekend = 1 if day_of_week in [5, 6] else 0
        is_payday = 1 if dt.day in [1, 15] else 0
        
        event_info = EVENTS_MAP.get(dt_str, {
            "holiday": 0,
            "holiday_name": "None",
            "festival": 0,
            "school_holiday": 0,
            "local_event": 0
        })
        
        for loc in unique_locations:
            city = loc["city"]
            state = loc["state"]
            params = climate_params.get(state, {"base_temp": 10.0, "temp_std": 3.0, "rain_prob": 0.2, "snow_prob": 0.1})
            
            # Daily temperature with realistic day-to-day continuity
            temp_c = round(float(np.random.normal(params["base_temp"], params["temp_std"])), 1)
            
            # Extreme cold/weather event
            extreme_weather = 0
            if state in ["WI", "NY"] and temp_c < -15.0:
                extreme_weather = 1
            elif state in ["TX", "FL"] and temp_c > 28.0:
                extreme_weather = 1
                
            # Precipitation
            rain_mm = 0.0
            snow_mm = 0.0
            
            if np.random.random() < params["rain_prob"]:
                rain_mm = round(float(np.random.exponential(scale=6.5) + 0.5), 1)
                
            if np.random.random() < params["snow_prob"] and temp_c <= 1.0:
                snow_mm = round(float(np.random.exponential(scale=8.0) + 1.0), 1)
                if snow_mm > 15.0:
                    extreme_weather = 1
                    
            humidity_pct = int(np.clip(np.random.normal(68, 12) + (15 if (rain_mm > 0 or snow_mm > 0) else 0), 25, 99))
            wind_speed = round(float(np.random.gamma(shape=3.0, scale=4.0)), 1)
            
            # Local event (occasional sports, concerts, community fairs)
            local_event = event_info.get("local_event", 0)
            if local_event == 0 and np.random.random() < 0.04:
                local_event = 1
                
            records.append({
                "date": dt_str,
                "city": city,
                "state": state,
                "temp_c": temp_c,
                "rain_mm": rain_mm,
                "snow_mm": snow_mm,
                "humidity_pct": humidity_pct,
                "wind_speed": wind_speed,
                "holiday": event_info["holiday"],
                "holiday_name": event_info["holiday_name"],
                "festival": event_info["festival"],
                "weekend": is_weekend,
                "local_event": local_event,
                "school_holiday": event_info["school_holiday"],
                "payday_flag": is_payday,
                "extreme_weather_flag": extreme_weather
            })
            
    df_ext = pd.DataFrame(records)
    return df_ext

if __name__ == "__main__":
    from server.src.stores_generator import generate_stores
    stores_df = generate_stores()
    df_ext = generate_external_factors(stores_df)
    out_path = RAW_DATA_DIR / "external_factors.csv"
    df_ext.to_csv(out_path, index=False)
    print(f"Generated {len(df_ext)} external factor rows -> {out_path}")
