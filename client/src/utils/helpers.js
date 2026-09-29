export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getRiskColorClass(level) {
  switch (level?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badgeBg: 'bg-red-600',
        badgeText: 'text-white',
        dot: 'bg-red-500',
        hover: 'hover:bg-red-50/50'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-white',
        dot: 'bg-amber-500',
        hover: 'hover:bg-amber-50/50'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-600',
        badgeText: 'text-white',
        dot: 'bg-emerald-500',
        hover: 'hover:bg-emerald-50/50'
      };
  }
}
