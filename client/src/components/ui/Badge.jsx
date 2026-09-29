import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn, getRiskColorClass } from '../../utils/helpers';

export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-[#EBF5FF] text-[#0071CE] border-[#B9E1FF] font-semibold',
    orange: 'bg-[#FFF4EC] text-[#FF6600] border-[#FFD8BF] font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level, showProbability, probability, size = 'md', className = '' }) {
  const norm = level?.toUpperCase() || 'LOW';
  const colors = getRiskColorClass(norm);

  const icons = {
    HIGH: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    MEDIUM: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    LOW: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-extrabold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Risk level: ${norm}`}
    >
      {icons[norm] || icons.LOW}
      <span>{norm} RISK</span>
      {showProbability && probability !== undefined && (
        <span className="opacity-80 font-normal">
          ({Math.round(probability * 100)}%)
        </span>
      )}
    </span>
  );
}
