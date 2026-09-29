import { DRIVER_LABELS } from './constants';

export function formatCompact(value) {
  if (value === undefined || value === null) return '0';
  const num = Number(value);
  if (isNaN(num)) return String(value);

  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

export function formatUnits(value) {
  if (value === undefined || value === null) return '0 units';
  const num = Math.round(Number(value));
  return `${num.toLocaleString()} units`;
}

export function formatPercent(value) {
  if (value === undefined || value === null) return '0.0%';
  const num = Number(value);
  if (isNaN(num)) return '0.0%';
  // If already in 0-100 scale
  if (num > 1.0) {
    return `${num.toFixed(1)}%`;
  }
  return `${(num * 100).toFixed(1)}%`;
}

export function formatCurrency(value) {
  if (value === undefined || value === null) return '$0';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatDriver(driverKey) {
  if (!driverKey) return 'Standard replenishment buffer';
  return DRIVER_LABELS[driverKey] || driverKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function formatDays(value) {
  if (value === undefined || value === null) return '0 days';
  const num = Number(value);
  return `${num.toFixed(1)} days`;
}
