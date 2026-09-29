import React from 'react';
import { cn } from '../../utils/helpers';

export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#FCF8EE] rounded-2xl border border-[#EBDDC6] shadow-[0_2px_12px_rgba(30,25,10,0.04)] p-6 transition-all duration-200',
        hover && 'hover:shadow-[0_8px_24px_rgba(30,25,10,0.08)] hover:-translate-y-0.5 cursor-pointer hover:border-[#D9C4A5]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, badge, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
