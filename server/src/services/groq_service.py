import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Available Groq model
MODEL_NAME = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

def generate_realtime_forecast(store_id, product_data, recent_orders):
    """
    Uses Groq API to generate real-time demand forecast and replenishment advice
    based on live incoming orders.
    """
    client = get_groq_client()
    if not client:
        return {
            "error": "GROQ_API_KEY not configured in server/.env",
            "ai_forecast_units": product_data.get("predicted_7_day_demand", 150),
            "stockout_risk": "MEDIUM",
            "recommendation": "Review replenishment schedule."
        }

    prompt = f"""
You are the Walmart StockSense Real-Time Demand & Supply Chain Intelligence Engine.
Analyze the following real-time ordering activity and provide a forecast and decision recommendation.

STORE: {store_id}
PRODUCT: {product_data.get('product_name')} (ID: {product_data.get('product_id')})
CATEGORY: {product_data.get('category')} | DEPARTMENT: {product_data.get('department')}
CURRENT ON-HAND INVENTORY: {product_data.get('current_inventory')} units
BASE 7-DAY DEMAND: {product_data.get('predicted_7_day_demand')} units
CASE PACK SIZE: {product_data.get('case_pack_qty', 12)} units

RECENT LIVE ORDERS TODAY:
{json.dumps(recent_orders, indent=2)}

TOTAL LIVE UNITS ORDERED TODAY: {sum(o.get('quantity', 0) for o in recent_orders)} units

Provide a concise, professional JSON response with these exact keys:
{{
  "realtime_demand_velocity": "<e.g. HIGH ACCELERATION / STABLE / MODERATE>",
  "projected_7day_demand_with_orders": <integer updated 7-day forecast incorporating order spike>,
  "stockout_risk_level": "<CRITICAL | HIGH | MEDIUM | LOW>",
  "stockout_probability_pct": <number between 0 and 100>,
  "estimated_hours_until_stockout": <integer number of hours or null if safe>,
  "recommended_replenishment_units": <integer rounded to case pack>,
  "recommended_case_packs": <integer>,
  "executive_summary": "<2-3 clear business sentences explaining demand drain and reasoning>",
  "manager_action_items": [
    "<immediate operational action 1>",
    "<action 2>"
  ]
}}
Return ONLY valid JSON.
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a senior supply chain demand forecasting AI. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=600
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"[Groq AI Error] {e}")
        # Fallback calculation if rate limited or connection issue
        order_units = sum(o.get('quantity', 0) for o in recent_orders)
        curr = product_data.get('current_inventory', 20)
        remaining = max(0, curr - order_units)
        is_high = remaining < 15 or order_units > 10
        return {
            "realtime_demand_velocity": "HIGH ACCELERATION" if order_units > 15 else "MODERATE",
            "projected_7day_demand_with_orders": product_data.get('predicted_7_day_demand', 120) + (order_units * 3),
            "stockout_risk_level": "CRITICAL" if remaining == 0 else ("HIGH" if is_high else "MEDIUM"),
            "stockout_probability_pct": 88.5 if remaining == 0 else (74.2 if is_high else 42.0),
            "estimated_hours_until_stockout": 8 if is_high else 36,
            "recommended_replenishment_units": max(24, ((order_units // 12) + 2) * 12),
            "recommended_case_packs": max(2, (order_units // 12) + 2),
            "executive_summary": f"Recent order spike of {order_units} units has accelerated demand. On-hand inventory now stands at {remaining} units.",
            "manager_action_items": [
                "Expedite DC replenishment transfer for immediate shelf restock.",
                "Review shelf velocity scan rates across weekend cycles."
            ]
        }

def chat_with_demand_agent(store_id, question, active_context):
    """
    Interactive Q&A with Groq AI regarding real-time store demand, inventory, and orders.
    """
    client = get_groq_client()
    if not client:
        return "Groq API key is not configured in server/.env."

    system_prompt = f"""
You are the Walmart StockSense Real-Time Demand & Inventory Advisor for Store Node: {store_id}.
You assist store managers by explaining today's live orders, current store inventory levels, and when demand will be increasing.

Active Store Context:
{json.dumps(active_context, indent=2)}

Instructions:
1. When asked about today's orders or store inventory, provide exact item breakdowns, units ordered, and remaining stock buffers.
2. When asked about when demand will increase, explain demand velocity, promotional surge, and expected daily run-rate increases.
3. Keep answers clear, retail-focused, and concise with bullet points and bold SKU names (**Product Name**).
4. Do not mention any third-party model vendor names; refer to the predictive intelligence as the Walmart StockSense Model Engine.
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.3,
            max_tokens=400
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Groq AI Engine error: {str(e)}"
