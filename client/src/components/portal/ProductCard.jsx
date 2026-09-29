import React, { useState } from 'react';
import { Plus, Minus, Check, ShoppingBag, Package } from 'lucide-react';

export function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 flex flex-col justify-between hover:border-[#EA7A18]/60 hover:shadow-md transition-all group">
      <div>
        {/* Category & Badge */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span className="uppercase text-[11px] text-[#005CE6] font-black tracking-wide">
            {product.department}
          </span>
          <span className="bg-[#F6EEDB] px-2 py-0.5 rounded-md font-mono text-[10px] text-slate-600">
            {product.product_id}
          </span>
        </div>

        {/* Product Name & Brand */}
        <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-[#005CE6] transition-colors line-clamp-2">
          {product.product_name}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Brand: <span className="text-slate-800 font-bold">{product.brand}</span>
        </p>

        {/* Metadata info */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-600 font-semibold bg-[#F6EEDB] p-2.5 rounded-xl border border-[#EBDDC6]/70">
          <div className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[#EA7A18]" />
            <span>Case: {product.case_pack_qty}u</span>
          </div>
          <span className="text-[#EBDDC6]">|</span>
          <div>
            <span>Shelf: {product.shelf_life_days}d</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#EBDDC6]/80 flex items-center justify-between gap-3">
        {/* Price */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Unit Price</span>
          <span className="text-xl font-black text-slate-900">${product.unit_price.toFixed(2)}</span>
        </div>

        {/* Quantity and Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F6EEDB] border border-[#EBDDC6] rounded-xl px-1.5 py-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-1 hover:text-slate-900 text-slate-600 rounded cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-black text-slate-900">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="p-1 hover:text-slate-900 text-slate-600 rounded cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
