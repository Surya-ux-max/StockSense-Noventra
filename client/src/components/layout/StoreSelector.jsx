import React, { useState, useEffect } from 'react';
import { Store, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { STORES_LIST } from '../../utils/constants';

export function StoreSelector({ currentStore, onChangeStore }) {
  const [stores, setStores] = useState(STORES_LIST);

  useEffect(() => {
    let isMounted = true;
    api.stores.list()
      .then(res => {
        if (isMounted && res?.stores?.length > 0) {
          setStores(res.stores.map(s => ({
            id: s.store_id,
            name: `${s.name} - ${s.city}`,
            state: s.state
          })));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 bg-[#F6EEDB] border border-[#EBDDC6] hover:border-[#D9C4A5] rounded-xl px-3 py-1.5 shadow-xs transition-colors">
        <Store className="w-4 h-4 text-[#005CE6]" />
        <select
          value={currentStore}
          onChange={(e) => onChangeStore(e.target.value)}
          className="appearance-none bg-transparent pr-6 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          aria-label="Select active Walmart store"
        >
          <option value="ALL">All Network Stores ({stores.length})</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.id} — {store.name} ({store.state})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
}
