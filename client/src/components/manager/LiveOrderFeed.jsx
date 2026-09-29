import React from 'react';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export function LiveOrderFeed({ orders = [] }) {
  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#EBDDC6]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-base font-black text-slate-900">Live Incoming Orders Stream</h3>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-[#F6EEDB] px-2.5 py-0.5 rounded-full border border-[#EBDDC6]">
          {orders.length} Orders Logged
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs font-medium space-y-2">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <p>No real-time orders logged yet today.</p>
          <p className="text-[11px] text-slate-400">Orders placed in the Store Portal will appear here live.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#F6EEDB] rounded-2xl p-4 border border-[#EBDDC6] space-y-2 hover:border-[#EA7A18]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-900 bg-[#FCF8EE] px-2 py-0.5 rounded-md border border-[#EBDDC6]">
                    {order.id}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {order.customer_name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{order.timestamp?.split(' ')[1] || order.timestamp}</span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-1 pt-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 truncate max-w-[220px]">
                      {item.product_name}
                    </span>
                    <span className="font-black text-slate-900 shrink-0">
                      × {item.quantity}u (${(item.quantity * item.unit_price).toFixed(2)})
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EBDDC6]/70 flex justify-between items-center text-xs">
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Demand Impacted
                </span>
                <span className="font-black text-slate-900">
                  Total: {order.total_units} units (${order.total_amount?.toFixed(2)})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
