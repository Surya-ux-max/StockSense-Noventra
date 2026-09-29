import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Check, PackagePlus, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

export function InteractivePreview() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.dashboard.overview('ALL')
      .then(res => {
        if (isMounted && res?.priorityActions?.length > 0) {
          setItems(res.priorityActions);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const currentItem = items[selectedIdx] || items[0] || {
    id: 'WMT_CA_006_PRD_0043',
    store_id: 'WMT_CA_006',
    product_id: 'PRD_0043',
    product_name: 'Sprite Lemon Lime Soda (12 pk)',
    category: 'Soft Drinks',
    department: 'Beverages',
    risk_level: 'HIGH',
    stockout_probability: 0.7262,
    current_inventory: 16,
    incoming_inventory: 204,
    predicted_7_day_demand: 348,
    recommended_order_qty: 156,
    case_pack_qty: 12
  };

  const casePack = currentItem.case_pack_qty || 12;
  const cases = Math.ceil(currentItem.recommended_order_qty / casePack);

  const displayList = items.length > 0 ? items : [currentItem];

  return (
    <section id="preview" className="py-20 px-6 bg-[#F6EEDB] border-t border-[#EBDDC6] select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#EA7A18]">
            Interactive Demonstration
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Test the Decision Engine Live
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Select any prioritized Walmart SKU to simulate the decision flow from risk detection to replenishment approval.
          </p>
        </div>

        {/* SKU Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {displayList.map((item, idx) => (
            <button
              key={item.id || item.product_id}
              onClick={() => {
                setSelectedIdx(idx);
                setApproved(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-[#FCF8EE] text-slate-700 border border-[#EBDDC6] hover:bg-[#EFE4CF]'
              }`}
            >
              {item.product_name.split('(')[0]} ({item.store_id})
            </button>
          ))}
        </div>

        {/* Live Preview Card */}
        <div className="bg-[#FCF8EE] rounded-3xl border-2 border-[#005CE6]/30 shadow-xl max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EBDDC6]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                <span>{currentItem.store_id}</span>
                <span>•</span>
                <span>{currentItem.department}</span>
                <span>•</span>
                <span className="font-mono bg-[#EBDDC6]/50 px-1.5 rounded text-slate-700">{currentItem.product_id}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {currentItem.product_name}
              </h3>
            </div>
            <RiskBadge level={currentItem.risk_level} showProbability probability={currentItem.stockout_probability} size="lg" />
          </div>

          {/* 4 Balances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">On-Hand Stock</span>
              <div className="text-2xl font-black text-red-600 mt-0.5">{currentItem.current_inventory}</div>
              <span className="text-[10px] text-slate-500 font-medium">Critical deficit</span>
            </div>
            <div className="p-3.5 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">7-Day Demand</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{currentItem.predicted_7_day_demand}</div>
              <span className="text-[10px] text-slate-500 font-medium">RF Regressor</span>
            </div>
            <div className="p-3.5 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Scheduled DC</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{currentItem.incoming_inventory || 0}</div>
              <span className="text-[10px] text-slate-500 font-medium">In-transit buffer</span>
            </div>
            <div className="p-3.5 bg-blue-100/70 rounded-2xl border border-blue-200">
              <span className="text-[11px] font-bold text-[#005CE6] uppercase">Recommended</span>
              <div className="text-2xl font-black text-[#005CE6] mt-0.5">{currentItem.recommended_order_qty}u</div>
              <span className="text-[10px] text-[#005CE6] font-bold">{cases} cs × {casePack}/pk</span>
            </div>
          </div>

          {/* Explainability Reason */}
          <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-black text-amber-950 uppercase">Why this SKU is at risk:</span>
              <p className="text-slate-800 font-medium mt-0.5">
                {currentItem.primary_reason}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
              Manager Directive: <strong>"{currentItem.manager_action}"</strong>
            </div>
            <div className="flex items-center gap-3">
              {approved ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                  <Check className="w-4 h-4" />
                  Order Dispatched
                </div>
              ) : (
                <Button
                  variant="orange"
                  size="md"
                  onClick={() => setApproved(true)}
                  icon={<PackagePlus className="w-4 h-4" />}
                >
                  Authorize {currentItem.recommended_order_qty} Units
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/item/${currentItem.product_id}`)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Full SKU Intelligence
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
