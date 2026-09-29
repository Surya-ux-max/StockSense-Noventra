import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Activity, ShoppingBag } from 'lucide-react';

export function OrderConfirmationModal({ order, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FCF8EE] border-2 border-[#EA7A18]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#EA7A18]">
            Order Successfully Dispatched
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            Real-Time Order Placed!
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Your inventory order has been logged and sent live to the Walmart Store Node.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#F6EEDB] rounded-2xl p-4 border border-[#EBDDC6] text-left space-y-2.5 text-xs">
          <div className="flex justify-between pb-2 border-b border-[#EBDDC6]">
            <span className="text-slate-500 font-bold">Order ID:</span>
            <span className="font-mono font-black text-slate-900">{order.id}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#EBDDC6]">
            <span className="text-slate-500 font-bold">Store Node:</span>
            <span className="font-black text-[#005CE6]">{order.store_id}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#EBDDC6]">
            <span className="text-slate-500 font-bold">Units Ordered:</span>
            <span className="font-black text-slate-900">{order.total_units} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold">Total Amount:</span>
            <span className="font-black text-slate-900">${order.total_amount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/manager');
            }}
            className="w-full bg-[#005CE6] hover:bg-[#004BB8] text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer text-xs"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>View Demand Impact in Manager Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full bg-[#F6EEDB] hover:bg-[#EFE4CF] text-slate-800 font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-xs border border-[#EBDDC6]"
          >
            Continue Ordering Products
          </button>
        </div>
      </div>
    </div>
  );
}
