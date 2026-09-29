import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#EA7A18] text-white text-xs sm:text-sm font-bold py-2.5 px-4 flex items-center justify-between text-center relative select-none shadow-xs">
      <div className="flex-1 flex items-center justify-center gap-2 px-4 truncate">
        <Sparkles className="w-4 h-4 text-[#FFDD55] shrink-0" />
        <span>Walmart Fiscal W13 Operations Active — Live Decision-Support for 37 Stores, 15,000 SKUs & Case-Pack Replenishment</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-1 hover:bg-black/15 rounded-lg transition-colors text-white shrink-0 cursor-pointer"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
