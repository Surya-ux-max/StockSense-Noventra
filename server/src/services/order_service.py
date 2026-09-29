import time
from datetime import datetime

# In-memory store for real-time orders
# Seeded with initial realistic orders
REALTIME_ORDERS = [
    {
        "id": "ORD-89412",
        "store_id": "WMT_CA_006",
        "customer_name": "Store Front End - Shelf Restock",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "COMPLETED",
        "items": [
            {
                "product_id": "PRD_0043",
                "product_name": "Sprite Lemon Lime Soda (12 pk)",
                "category": "Soft Drinks",
                "quantity": 14,
                "unit_price": 6.98
            },
            {
                "product_id": "PRD_0088",
                "product_name": "Great Value Whole Milk (1 Gal)",
                "category": "Dairy",
                "quantity": 20,
                "unit_price": 3.48
            }
        ],
        "total_units": 34,
        "total_amount": 167.32
    },
    {
        "id": "ORD-89413",
        "store_id": "WMT_CA_006",
        "customer_name": "Online Grocery Pickup #402",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "PROCESSING",
        "items": [
            {
                "product_id": "PRD_0043",
                "product_name": "Sprite Lemon Lime Soda (12 pk)",
                "category": "Soft Drinks",
                "quantity": 8,
                "unit_price": 6.98
            },
            {
                "product_id": "PRD_0112",
                "product_name": "Lay's Classic Potato Chips (Party Size)",
                "category": "Snacks",
                "quantity": 12,
                "unit_price": 4.98
            }
        ],
        "total_units": 20,
        "total_amount": 115.60
    }
]

def add_order(store_id, items, customer_name="Customer Direct Order"):
    """
    Records a real-time order and returns the generated order record.
    """
    total_units = sum(item.get("quantity", 1) for item in items)
    total_amount = sum(item.get("quantity", 1) * item.get("unit_price", 0.0) for item in items)
    
    order_id = f"ORD-{int(time.time() * 1000) % 1000000}"
    new_order = {
        "id": order_id,
        "store_id": store_id,
        "customer_name": customer_name,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "CONFIRMED",
        "items": items,
        "total_units": total_units,
        "total_amount": round(total_amount, 2)
    }
    
    REALTIME_ORDERS.insert(0, new_order)
    return new_order

def get_orders(store_id=None, limit=50):
    """
    Retrieves orders filtered by store_id if provided.
    """
    if store_id and store_id != "ALL":
        filtered = [o for o in REALTIME_ORDERS if o.get("store_id") == store_id]
        return filtered[:limit]
    return REALTIME_ORDERS[:limit]

def get_realtime_product_demand(store_id=None):
    """
    Calculates total units ordered in real time per product_id.
    """
    demand_by_product = {}
    orders = get_orders(store_id)
    
    for order in orders:
        for itm in order.get("items", []):
            pid = itm.get("product_id")
            qty = itm.get("quantity", 0)
            if pid not in demand_by_product:
                demand_by_product[pid] = {
                    "product_id": pid,
                    "product_name": itm.get("product_name"),
                    "category": itm.get("category"),
                    "total_ordered_units": 0,
                    "order_count": 0,
                    "recent_orders": []
                }
            demand_by_product[pid]["total_ordered_units"] += qty
            demand_by_product[pid]["order_count"] += 1
            demand_by_product[pid]["recent_orders"].append({
                "order_id": order.get("id"),
                "timestamp": order.get("timestamp"),
                "quantity": qty
            })
            
    return demand_by_product
