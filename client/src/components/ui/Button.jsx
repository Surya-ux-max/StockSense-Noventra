import React from 'react';
import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-[#005CE6] hover:bg-[#004EC2] text-white shadow-md shadow-[#005CE6]/20 focus:ring-[#005CE6]/40',
    orange: 'bg-[#EA7A18] hover:bg-[#D56B10] text-white shadow-md shadow-[#EA7A18]/25 focus:ring-[#EA7A18]/40',
    secondary: 'bg-[#FCF8EE] hover:bg-[#F6EEDB] text-slate-800 border border-[#EBDDC6] shadow-xs focus:ring-[#EBDDC6]',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-[#F6EEDB] text-slate-700 focus:ring-slate-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-400'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
