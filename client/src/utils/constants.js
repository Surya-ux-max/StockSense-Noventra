export const STORES_LIST = [
  { id: 'WMT_CA_006', name: 'Supercenter #1042 - Los Angeles', city: 'Los Angeles', state: 'CA', type: 'Supercenter', region: 'West' },
  { id: 'WMT_CA_001', name: 'Supercenter #1001 - Los Angeles', city: 'Los Angeles', state: 'CA', type: 'Supercenter', region: 'West' },
  { id: 'WMT_CA_002', name: 'Neighborhood #1002 - San Diego', city: 'San Diego', state: 'CA', type: 'Small Format', region: 'West' },
  { id: 'WMT_CA_003', name: 'Market #1003 - San Jose', city: 'San Jose', state: 'CA', type: 'Neighborhood Market', region: 'West' },
  { id: 'WMT_TX_010', name: 'Supercenter #2010 - Dallas', city: 'Dallas', state: 'TX', type: 'Supercenter', region: 'Southwest' },
  { id: 'WMT_TX_012', name: 'Supercenter #2012 - Austin', city: 'Austin', state: 'TX', type: 'Supercenter', region: 'Southwest' },
  { id: 'WMT_TX_013', name: 'Supercenter #2013 - San Antonio', city: 'San Antonio', state: 'TX', type: 'Supercenter', region: 'Southwest' },
  { id: 'WMT_FL_022', name: 'Supercenter #3022 - Miami', city: 'Miami', state: 'FL', type: 'Supercenter', region: 'Southeast' },
  { id: 'WMT_FL_025', name: 'Supercenter #3025 - Orlando', city: 'Orlando', state: 'FL', type: 'Supercenter', region: 'Southeast' },
  { id: 'WMT_NY_029', name: 'Supercenter #4029 - Buffalo', city: 'Buffalo', state: 'NY', type: 'Supercenter', region: 'Northeast' },
  { id: 'WMT_NY_031', name: 'Supercenter #4031 - Rochester', city: 'Rocheration', state: 'NY', type: 'Supercenter', region: 'Northeast' },
  { id: 'WMT_WI_020', name: 'Supercenter #5020 - Milwaukee', city: 'Milwaukee', state: 'WI', type: 'Supercenter', region: 'Midwest' }
];

export const DEPARTMENTS = [
  'All Departments',
  'Beverages',
  'Dairy',
  'Grocery',
  'Snacks',
  'Frozen',
  'Household',
  'Personal Care',
  'Pet Supplies'
];

export const RISK_LEVELS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export const DRIVER_LABELS = {
  LOW_INVENTORY_COVERAGE: 'Low Inventory Coverage (< 2 Days DOI)',
  EVENT_HOLIDAY_SURGE: 'Holiday Demand Surge Expected',
  ACTIVE_PROMOTION_CAMPAIGN: 'Active Price Rollback / Promo Lift',
  SEASONAL_VELOCITY_TREND: 'High Seasonal Velocity Trend',
  EXTENDED_SUPPLIER_LEAD_TIME: 'Extended Supplier Lead Time',
  STOCKOUT_HISTORY_FLAG: 'Previous Stockout Pattern Detected'
};
