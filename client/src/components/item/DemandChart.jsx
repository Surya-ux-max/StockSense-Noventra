import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';

export function DemandChart({ series = [] }) {
  const [hovered, setHovered] = useState(null);

  if (!series || series.length === 0) return null;

  const maxVal = Math.max(
    ...series.map(d => Math.max(d.historical || 0, d.forecast || 0)),
    80
  );

  const chartHeight = 200;
  const chartWidth = 640;

  // Split into points
  const points = series.map((d, i) => {
    const x = (i / (series.length - 1)) * (chartWidth - 80) + 40;
    const yVal = d.historical !== null ? d.historical : d.forecast;
    const y = chartHeight - (yVal / maxVal) * (chartHeight - 40) - 20;
    return { x, y, yVal, ...d };
  });

  // Historical path (indices with non-null historical)
  const histPoints = points.filter(p => p.historical !== null);
  const histPath = histPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  // Forecast path (from today onward)
  const forePoints = points.filter(p => p.forecast !== null);
  const forePath = forePoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <Card className="mb-6">
      <CardHeader
        title="Demand Trajectory: 7-Day History vs 7-Day Forecast"
        subtitle="Walmart point-of-sale scan velocity transitioning into predicted cycle run-rate"
        action={
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Historical Scan
            </span>
            <span className="flex items-center gap-1.5 text-[#0071CE]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071CE]" />
              7-Day Forecast (RF)
            </span>
          </div>
        }
      />

      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 overflow-visible select-none"
        >
          {/* Subtle vertical divide at 'Today' */}
          {points.find(p => p.day === 'Today') && (
            <line
              x1={points.find(p => p.day === 'Today').x}
              y1="10"
              x2={points.find(p => p.day === 'Today').x}
              y2={chartHeight - 20}
              stroke="#0071CE"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = chartHeight - frac * (chartHeight - 40) - 20;
            return (
              <g key={idx}>
                <line
                  x1="40"
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="#F3F0E8"
                  strokeDasharray="4 4"
                />
                <text x="10" y={y + 3} fontSize="10" fill="#94A3B8" className="font-mono">
                  {Math.round(maxVal * frac)}
                </text>
              </g>
            );
          })}

          {/* Historical line (slate) */}
          <path
            d={histPath}
            fill="none"
            stroke="#64748B"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Forecast line (solid blue) */}
          <path
            d={forePath}
            fill="none"
            stroke="#0071CE"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Forecast Area Fill */}
          {forePoints.length > 0 && (
            <path
              d={`${forePath} L ${forePoints[forePoints.length - 1].x} ${chartHeight - 20} L ${forePoints[0].x} ${chartHeight - 20} Z`}
              fill="rgba(0, 113, 206, 0.08)"
            />
          )}

          {/* Interactive circles and labels */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered?.day === p.day ? 6 : p.day === 'Today' ? 5 : 3.5}
                fill={p.forecast !== null ? '#0071CE' : '#64748B'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={chartHeight - 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight={p.day === 'Today' ? 'bold' : 'normal'}
                fill={p.day === 'Today' ? '#0071CE' : '#94A3B8'}
              >
                {p.day}
              </text>
            </g>
          ))}
        </svg>

        {hovered && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg pointer-events-none space-y-0.5">
            <div className="font-bold text-slate-300">{hovered.day} ({hovered.date})</div>
            <div className="text-sm font-black">
              {hovered.forecast !== null ? (
                <span className="text-[#60A5FA]">Forecast: {hovered.forecast} units</span>
              ) : (
                <span className="text-slate-100">Historical: {hovered.historical} units</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>No fabricated confidence intervals • Direct backend RF prediction</span>
        <span className="text-slate-700 font-bold">Predicted 7-Day Total: {series.filter(s => s.forecast).reduce((a, b) => a + (b.forecast || 0), 0)} units</span>
      </div>
    </Card>
  );
}
