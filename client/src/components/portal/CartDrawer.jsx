import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Store, ShoppingBag, Loader2 } from 'lucide-react';
import { STORES_LIST } from '../../utils/constants';

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  selectedStore,
  onChangeStore
}) {
  const [customerName, setCustomerName] = useState('Front Store Associate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalUnits = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cart.reduce((acc, i) => acc + i.quantity * i.unit_price, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await onCheckout({
        store_id: selectedStore,
        customer_name: customerName,
        items: cart
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF5E8] h-full shadow-2xl flex flex-col justify-between border-l border-[#EBDDC6] z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#EBDDC6] bg-[#FCF8EE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#EA7A18]" />
            <h2 className="text-lg font-black text-slate-900">Store Order Cart</h2>
            <span className="bg-[#F6EEDB] text-slate-800 text-xs font-black px-2 py-0.5 rounded-full border border-[#EBDDC6]">
              {totalUnits} units
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F6EEDB] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Store Selector */}
          <div className="p-4 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6] space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Store className="w-4 h-4 text-[#005CE6]" />
              <span>Ordering For Store Node:</span>
            </div>
            <select
              value={selectedStore}
              onChange={(e) => onChangeStore(e.target.value)}
              className="w-full bg-[#FCF8EE] border border-[#EBDDC6] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
            >
              {STORES_LIST.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.name} ({s.state})
                </option>
              ))}
            </select>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Requester / Order Tag
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Aisle 4 Team or Customer Name"
                className="w-full bg-[#FCF8EE] border border-[#EBDDC6] rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">Your order cart is empty.</p>
              <p className="text-xs text-slate-400">Add products from the catalog to place real-time orders.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Order Line Items
              </span>
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-[#FCF8EE] p-3.5 rounded-2xl border border-[#EBDDC6] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {item.product_name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      ${item.unit_price.toFixed(2)} / unit • Case Pack: {item.case_pack_qty || 12}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#F6EEDB] rounded-lg px-2 py-1 border border-[#EBDDC6]">
                      <button
                        onClick={() => onUpdateQty(item.product_id, Math.max(1, item.quantity - 1))}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-900 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer px-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product_id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#EBDDC6] bg-[#FCF8EE] space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Total Units Ordered:</span>
                <span className="text-slate-900 font-black">{totalUnits} units</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900">
                <span>Total Order Value:</span>
                <span className="text-[#005CE6]">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#EA7A18] hover:bg-[#D96B0D] disabled:opacity-50 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting to Store Node...</span>
                </>
              ) : (
                <>
                  <span>Place Real-Time Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500 font-medium">
              ⚡ Instantly streams to the Manager Live Demand Portal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
