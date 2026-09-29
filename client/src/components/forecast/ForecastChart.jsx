import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { formatCompact, formatUnits } from '../../utils/formatters';

export function ForecastChart({ series = [] }) {
  const [activeTab, setActiveTab] = useState('chart');

  if (!series || series.length === 0) return null;

  const maxVal = Math.max(...series.map(d => Math.max(d.historical || 0, d.forecast || 0)), 80);
  const chartHeight = 220;
  const chartWidth = 700;

  const points = series.map((d, i) => {
    const x = (i / (series.length - 1)) * (chartWidth - 80) + 40;
    const yVal = d.historical !== null ? d.historical : d.forecast;
    const y = chartHeight - (yVal / maxVal) * (chartHeight - 40) - 20;
    return { x, y, yVal, ...d };
  });

  const histPoints = points.filter(p => p.historical !== null);
  const histPath = histPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  const forePoints = points.filter(p => p.forecast !== null);
  const forePath = forePoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <Card className="mb-6">
      <CardHeader
        title="Store & SKU Demand Trajectory"
        subtitle="Walmart 7-day sales run-rate transitioning into validated Random Forest demand predictions"
        action={
          <div className="flex items-center gap-2 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE6DF]">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chart' ? 'bg-white shadow-xs text-[#0071CE]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Visual Chart
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'table' ? 'bg-white shadow-xs text-[#0071CE]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Day-by-Day Table
            </button>
          </div>
        }
      />

      {activeTab === 'chart' ? (
        <div className="relative w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-64 overflow-visible select-none"
          >
            {/* Split boundary */}
            {points.find(p => p.day === 'Today') && (
              <line
                x1={points.find(p => p.day === 'Today').x}
                y1="10"
                x2={points.find(p => p.day === 'Today').x}
                y2={chartHeight - 20}
                stroke="#0071CE"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
            )}

            {/* Grid */}
            {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const y = chartHeight - frac * (chartHeight - 40) - 20;
              return (
                <g key={idx}>
                  <line
                    x1="40"
                    y1={y}
                    x2={chartWidth - 20}
                    y2={y}
                    stroke="#F1EFE9"
                    strokeDasharray="4 4"
                  />
                  <text x="10" y={y + 3} fontSize="10" fill="#94A3B8" className="font-mono">
                    {Math.round(maxVal * frac)}
                  </text>
                </g>
              );
            })}

            {/* Historical curve */}
            <path
              d={histPath}
              fill="none"
              stroke="#64748B"
              strokeWidth="3"
              strokeDasharray="5 5"
            />

            {/* Forecast curve */}
            <path
              d={forePath}
              fill="none"
              stroke="#0071CE"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.day === 'Today' ? 6 : 4}
                  fill={p.forecast !== null ? '#0071CE' : '#64748B'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight={p.day === 'Today' ? 'bold' : 'normal'}
                  fill={p.day === 'Today' ? '#0071CE' : '#64748B'}
                >
                  {p.day}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                Historical POS Scan
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[#0071CE]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0071CE]" />
                Predicted 7-Day Demand
              </span>
            </div>
            <span className="text-slate-400">Strictly deterministic point predictions from Task 2 model</span>
          </div>
        </div>
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Day Label</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="text-right">Historical Actual</TableHeader>
              <TableHeader className="text-right">Predicted Demand</TableHeader>
              <TableHeader>Variance / Status</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {series.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-bold text-slate-800">{row.day}</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{row.date}</TableCell>
                <TableCell className="text-right font-semibold text-slate-700">
                  {row.historical !== null ? `${row.historical} units` : '—'}
                </TableCell>
                <TableCell className="text-right font-black text-[#0071CE]">
                  {row.forecast !== null ? `${row.forecast} units` : '—'}
                </TableCell>
                <TableCell>
                  {row.day === 'Today' ? (
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0071CE] font-bold text-xs">Cycle Anchor</span>
                  ) : row.forecast !== null ? (
                    <span className="text-xs text-slate-500 font-medium">Model Forecasted</span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Verified Scan Record</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
