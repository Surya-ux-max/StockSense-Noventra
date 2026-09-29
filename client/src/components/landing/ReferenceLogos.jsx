import React from 'react';

export function ReferenceLogos() {
  const clusters = [
    { name: 'California Supercenters', font: 'font-sans font-black tracking-tight' },
    { name: 'Texas Retail Hub', font: 'font-serif italic font-bold' },
    { name: 'Florida Supercenters', font: 'font-sans font-bold uppercase tracking-wider' },
    { name: 'New York Metro Cluster', font: 'font-serif font-black tracking-tight' },
    { name: 'Midwest Regional DC', font: 'font-mono font-bold tracking-tight' },
    { name: 'Neighborhood Markets', font: 'font-sans font-semibold tracking-wide' },
    { name: 'Cold Chain Dairy', font: 'font-serif italic font-bold' },
    { name: 'High-Velocity Grocery', font: 'font-sans font-black text-xs tracking-widest uppercase' }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 select-none">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-700">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Monitored Network Clusters :
        </span>
        {clusters.map((c, idx) => (
          <span
            key={idx}
            className={`text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-colors ${c.font}`}
          >
            {c.name}
          </span>
        ))}
      </div>
    </section>
  );
}
