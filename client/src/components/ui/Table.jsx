import React from 'react';
import { cn } from '../../utils/helpers';

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#EBDDC6] bg-[#FCF8EE] shadow-xs">
      <table className={cn('w-full text-left border-collapse text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <thead className={cn('bg-[#F6EEDB] border-b border-[#EBDDC6] text-xs font-bold uppercase tracking-wider text-slate-600', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={cn('divide-y divide-[#EBDDC6]/60 font-medium text-slate-800', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', hover = true, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors duration-150',
        hover && 'hover:bg-[#F6EEDB]/70',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <th className={cn('px-4 py-3.5 select-none whitespace-nowrap', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={cn('px-4 py-3.5 whitespace-nowrap', className)}>
      {children}
    </td>
  );
}
