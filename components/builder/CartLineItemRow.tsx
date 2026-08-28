'use client';

import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { CartLine } from '@/lib/types/event-builder';

interface CartLineItemRowProps {
  line: CartLine;
  onRemove: (id: string) => void;
  onViewDetails?: (line: CartLine) => void;
  compact?: boolean;
  /** Briefly true right after this exact line was added, so the sidebar can
   * flash it and scroll it into view within its own list. */
  highlighted?: boolean;
}

export function CartLineItemRow({ line, onRemove, onViewDetails, compact, highlighted }: CartLineItemRowProps) {
  const imgUrls = line.imageUrl
    ? line.imageUrl
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const hasMultipleDesigns = imgUrls.length > 1;

  return (
    <div
      data-line-id={line.id}
      className={`flex items-center justify-between gap-3 ${compact ? 'py-1.5' : 'py-2.5'} px-1.5 -mx-1.5 rounded-lg border-b border-gold-400/20 last:border-b-0 transition-colors duration-700 ${
        highlighted ? 'bg-gold-400/30' : 'bg-transparent'
      }`}
    >
      <button
        type="button"
        onClick={() => onViewDetails?.(line)}
        className="flex-1 min-w-0 text-left cursor-pointer"
        disabled={!onViewDetails}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gold-100 truncate">{line.name}</span>
          {hasMultipleDesigns && (
            <span className="text-[9px] font-bold text-gold-300 bg-maroon-800/80 px-1.5 py-0.5 rounded border border-gold-400/30">
              {imgUrls.length} Designs
            </span>
          )}
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
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        className="p-1 text-gold-300/60 hover:text-gold-100 shrink-0 cursor-pointer"
        aria-label={`Remove ${line.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
