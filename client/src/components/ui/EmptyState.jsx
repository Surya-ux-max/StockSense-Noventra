import React from 'react';
import { Inbox, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filters to locate items.',
  actionLabel,
  onAction,
  icon
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#F6EEDB] border border-[#EBDDC6] flex items-center justify-center text-slate-500 mb-4">
        {icon || <Inbox className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h4 className="text-base font-black text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Failed to load data',
  description = 'An error occurred while fetching information from the decision engine.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/70 rounded-3xl border border-red-200">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-black text-red-900 mb-1">{title}</h4>
      <p className="text-sm text-red-700 max-w-sm mb-4">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
