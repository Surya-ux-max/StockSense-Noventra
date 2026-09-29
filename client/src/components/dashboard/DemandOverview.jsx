import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { formatCompact } from '../../utils/formatters';

export function DemandOverview({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => Math.max(d.historicalDemand, d.forecastDemand)), 28000);
  const chartHeight = 180;
  const chartWidth = 520;

  // Compute SVG points
  const pointsHist = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (d.historicalDemand / maxVal) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const pointsFore = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (d.forecastDemand / maxVal) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const pathHist = pointsHist.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const pathFore = pointsFore.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="7-Day Network Demand Trajectory"
          subtitle="Validated Random Forest demand forecast vs 7-day prior sales scan"
          action={
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Historical
              </span>
              <span className="flex items-center gap-1.5 text-[#0071CE]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0071CE]" />
                Forecast (RF)
              </span>
            </div>
          }
        />

        {/* SVG Curve Display */}
        <div className="relative w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible select-none"
          >
            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const y = chartHeight - frac * (chartHeight - 30) - 15;
              return (
                <g key={idx}>
                  <line
                    x1="30"
                    y1={y}
                    x2={chartWidth - 30}
                    y2={y}
                    stroke="#F1EFE9"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="10"
                    y={y + 3}
                    fontSize="9"
                    fill="#94A3B8"
                    className="font-mono font-medium"
                  >
                    {formatCompact(maxVal * frac)}
                  </text>
                </g>
              );
            })}

            {/* Historical line (dashed slate) */}
            <path
              d={pathHist}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />

            {/* Forecast line (solid blue) */}
            <path
              d={pathFore}
              fill="none"
              stroke="#0071CE"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Points & Interactive Tooltip triggers */}
            {pointsFore.map((p, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === i ? 6 : 4}
                  fill="#0071CE"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />
                <circle
                  cx={pointsHist[i].x}
                  cy={pointsHist[i].y}
                  r="3.5"
                  fill="#94A3B8"
                />
                <text
                  x={p.x}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={hoveredIdx === i ? '#0F172A' : '#64748B'}
                >
                  {p.day}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover preview pill */}
          {hoveredIdx !== null && (
            <div className="absolute top-1 right-2 bg-slate-900 text-white text-xs rounded-xl px-3 py-1.5 shadow-lg pointer-events-none flex items-center gap-3">
              <span className="font-bold">{data[hoveredIdx].day}:</span>
              <span>Forecast: <strong className="text-[#60A5FA]">{formatCompact(data[hoveredIdx].forecastDemand)}</strong></span>
              <span className="text-slate-400">| Hist: {formatCompact(data[hoveredIdx].historicalDemand)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>RF Regressor: R² 93.32% • WAPE 13.49%</span>
        <span className="text-[#0071CE] font-bold">Safe Stock Cover: 2.3 Days</span>
      </div>
    </Card>
  );
}
