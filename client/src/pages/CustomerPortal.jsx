import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Filter, Sparkles, Store, Check, ArrowRight } from 'lucide-react';
import { PortalHeader } from '../components/portal/PortalHeader';
import { ProductCard } from '../components/portal/ProductCard';
import { CartDrawer } from '../components/portal/CartDrawer';
import { OrderConfirmationModal } from '../components/portal/OrderConfirmationModal';
import { api } from '../services/api';
import { DEPARTMENTS } from '../utils/constants';

export function CustomerPortal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('WMT_CA_006');
  
  // Confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.portal.getProducts(selectedCategory, searchQuery)
      .then((res) => {
        if (isMounted) {
          setProducts(res?.products || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product, quantity) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQty = (productId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleCheckout = async (orderPayload) => {
    const res = await api.portal.createOrder(orderPayload);
    if (res?.status === 'success') {
      setConfirmedOrder(res.order);
      setCart([]);
      setIsCartOpen(false);
      setIsConfirmOpen(true);
    }
  };

  const totalCartUnits = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF5E8] flex flex-col">
      <PortalHeader
        activePortal="store"
        cartCount={totalCartUnits}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-[#F6EEDB] rounded-3xl border border-[#EBDDC6] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA7A18]/15 text-[#EA7A18] text-xs font-black uppercase">
              <ShoppingBag className="w-3.5 h-3.5" />
              Walmart Store Ordering Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Order Real-Time Store Inventory
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Browse products, select order quantities, and dispatch replenishment demands live to store nodes. Orders instantly update the Manager Demand Portal!
            </p>
          </div>

          <div className="bg-[#FCF8EE] p-4 rounded-2xl border border-[#EBDDC6] flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#005CE6] text-white flex items-center justify-center font-black">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Store Destination</span>
              <div className="text-xs font-black text-slate-900">{selectedStore}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Live Demand Linked</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by brand, item name, or SKU..."
                className="w-full bg-[#FCF8EE] border border-[#EBDDC6] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#EA7A18]"
              />
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-900 font-black">{products.length}</span> Walmart SKUs
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-[#FCF8EE] text-slate-700 border border-[#EBDDC6] hover:bg-[#F6EEDB]'
              }`}
            >
              All Categories
            </button>
            {DEPARTMENTS.filter((d) => d !== 'All Departments').map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedCategory(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  selectedCategory === dept
                    ? 'bg-[#005CE6] text-white shadow-xs'
                    : 'bg-[#FCF8EE] text-slate-700 border border-[#EBDDC6] hover:bg-[#F6EEDB]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 h-64 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-200 rounded-2xl" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6]">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No products matched your search.</h3>
            <p className="text-xs text-slate-500">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p.product_id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        selectedStore={selectedStore}
        onChangeStore={setSelectedStore}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

export default CustomerPortal;
