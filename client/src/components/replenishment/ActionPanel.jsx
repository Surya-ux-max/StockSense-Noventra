import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RiskBadge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { Truck, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

export function ActionPanel({ item, isOpen, onClose, onApprove }) {
  const navigate = useNavigate();
  if (!item) return null;

  const casePack = item.case_pack_qty || 12;
  const cases = Math.ceil(item.recommended_order_qty / casePack);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Replenishment Order Review"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onClose();
              navigate(`/item/${item.product_id}`);
            }}
            icon={<ExternalLink className="w-4 h-4" />}
            iconPosition="right"
          >
            Item Deep Dive
          </Button>
          <Button
            variant="orange"
            size="sm"
            onClick={() => {
              onApprove(item.id);
              onClose();
            }}
            icon={<Truck className="w-4 h-4" />}
          >
            Authorize DC Order ({item.recommended_order_qty} Units)
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Item headline */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              {item.store_id} • {item.category}
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {item.product_name}
            </h3>
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {item.product_id}
            </span>
          </div>
          <RiskBadge level={item.risk_level} showProbability probability={item.stockout_probability} />
        </div>

        {/* Quantities breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE6DF] text-center">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Current Stock</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{item.current_inventory}</div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">In Transit</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{item.incoming_inventory || 0}</div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">7D Forecast</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{item.predicted_7_day_demand}</div>
          </div>
          <div className="bg-orange-50 rounded-lg py-1 border border-orange-200">
            <span className="text-[11px] font-black text-[#FF6600] uppercase">Recommended</span>
            <div className="text-lg font-black text-[#FF6600] mt-0.5">{item.recommended_order_qty}</div>
          </div>
        </div>

        {/* Case Pack explanation */}
        <div className="text-xs bg-blue-50/70 border border-blue-200/70 rounded-xl p-3.5 space-y-1">
          <div className="font-black text-[#0071CE] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Decision Engine Case-Pack Calculation
          </div>
          <p className="text-slate-600 font-medium">
            Supplier constraints require master carton delivery of <strong>{casePack} units/case</strong>. Order recommendation rounded up from continuous deficit to exactly <strong>{cases} full cases</strong> ({cases * casePack} units).
          </p>
        </div>

        {/* Manager Directive */}
        <div className="text-xs bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 space-y-1">
          <span className="font-black text-amber-900 uppercase tracking-wide">
            Manager Action Directive
          </span>
          <p className="font-bold text-slate-900">
            "{item.manager_action || 'Raise replenishment order immediately; request expedited DC transfer.'}"
          </p>
        </div>
      </div>
    </Modal>
  );
}
