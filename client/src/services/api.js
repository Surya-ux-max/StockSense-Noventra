/**
 * StockSense API Client
 * Connects directly to the live Walmart StockSense Decision Support Backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchFromApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${res.statusText} ${errBody}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[StockSense API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  dashboard: {
    async overview(storeId = 'ALL') {
      return await fetchFromApi(`/api/dashboard/overview?store_id=${storeId}`);
    }
  },

  risk: {
    async list(filters = {}) {
      const query = new URLSearchParams();
      if (filters.storeId) query.set('store_id', filters.storeId);
      if (filters.department) query.set('department', filters.department);
      if (filters.riskLevel) query.set('risk_level', filters.riskLevel);
      if (filters.search) query.set('q', filters.search);

      return await fetchFromApi(`/api/risk?${query.toString()}`);
    },

    async getById(productId, storeId = 'WMT_CA_006') {
      return await fetchFromApi(`/api/item/${productId}?store_id=${storeId}`);
    }
  },

  forecast: {
    async get(filters = {}) {
      return await fetchFromApi(`/api/forecast`);
    }
  },

  replenishment: {
    async list(filters = {}) {
      const query = new URLSearchParams();
      if (filters.storeId) query.set('store_id', filters.storeId);
      return await fetchFromApi(`/api/replenishment?${query.toString()}`);
    }
  },

  stores: {
    async list() {
      return await fetchFromApi(`/api/stores`);
    },

    async get(id) {
      return await fetchFromApi(`/api/stores/${id}`);
    }
  },

  models: {
    async performance() {
      return await fetchFromApi(`/api/models/performance`);
    }
  },

  simulation: {
    async run(payload) {
      return await fetchFromApi('/api/simulate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  },

  portal: {
    async getProducts(category = 'ALL', search = '') {
      const q = new URLSearchParams();
      if (category && category !== 'ALL') q.set('category', category);
      if (search) q.set('q', search);
      return await fetchFromApi(`/api/products?${q.toString()}`);
    },

    async createOrder(orderData) {
      return await fetchFromApi('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },

    async getOrders(storeId = 'ALL') {
      return await fetchFromApi(`/api/orders?store_id=${storeId}`);
    }
  },

  manager: {
    async getRealtimeDemand(storeId = 'WMT_CA_006') {
      return await fetchFromApi(`/api/manager/realtime-demand?store_id=${storeId}`);
    },

    async getAIForecast(storeId, productId) {
      return await fetchFromApi('/api/manager/ai-forecast', {
        method: 'POST',
        body: JSON.stringify({ store_id: storeId, product_id: productId })
      });
    },

    async chatWithAgent(storeId, question) {
      return await fetchFromApi('/api/manager/ai-chat', {
        method: 'POST',
        body: JSON.stringify({ store_id: storeId, question })
      });
    }
  }
};
