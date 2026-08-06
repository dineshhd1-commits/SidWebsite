'use client';

import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { CartLine } from '@/lib/types/event-builder';
import { formatCurrency } from './useCartSummary';

interface CartLineItemRowProps {
  line: CartLine;
  onRemove: (id: string) => void;
  onViewDetails?: (line: CartLine) => void;
  compact?: boolean;
}

export function CartLineItemRow({ line, onRemove, onViewDetails, compact }: CartLineItemRowProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${compact ? 'py-1.5' : 'py-2.5'} border-b border-gold-400/20 last:border-b-0`}>
      <button
        type="button"
        onClick={() => onViewDetails?.(line)}
        className="flex-1 min-w-0 text-left"
        disabled={!onViewDetails}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gold-100 truncate">{line.name}</span>
          {line.quantity > 1 && <span className="text-[10px] text-gold-300/80">x{line.quantity}</span>}
          {line.origin === 'paid_extra' && (
            <span className="text-[9px] uppercase font-bold text-gold-400 bg-maroon-900/60 px-1.5 py-0.5 rounded">Paid Extra</span>
          )}
          {line.origin === 'requested_extra' && (
            <span className="text-[9px] uppercase font-bold text-amber-300 bg-maroon-900/60 px-1.5 py-0.5 rounded flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5" /> Pending Approval
            </span>
          )}
        </div>
      </button>
      <span className="text-xs font-bold text-gold-200 shrink-0">
        {line.origin === 'requested_extra' ? '—' : formatCurrency(line.unitPrice * line.quantity)}
      </span>
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        className="p-1 text-gold-300/60 hover:text-gold-100 shrink-0"
        aria-label={`Remove ${line.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
