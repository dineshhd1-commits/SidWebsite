'use client';

import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { CartLine } from '@/lib/types/event-builder';
import { GoldButton } from '../ui/gold-button';

interface ReplaceSelectionModalProps {
  groupName: string;
  pendingItemName: string;
  selectedLines: CartLine[];
  onReplace: (lineIdToRemove: string) => void;
  onCancel: () => void;
}

export function ReplaceSelectionModal({ groupName, pendingItemName, selectedLines, onReplace, onCancel }: ReplaceSelectionModalProps) {
  return (
    <div onClick={onCancel} className="fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl space-y-5"
      >
        <button onClick={onCancel} className="absolute top-4 right-4 text-maroon-700 hover:text-maroon-900" aria-label="Cancel">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">Selection Limit Reached</h3>
          <p className="text-xs text-maroon-700/80">
            You have already reached the selection limit for <strong>{groupName}</strong>. Would you like to replace one of your
            existing selections with <strong>{pendingItemName}</strong>?
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-maroon-700">Your Current Selections</p>
          {selectedLines.map((line) => (
            <div key={line.id} className="flex items-center justify-between gap-3 bg-gold-50/70 border border-gold-200 rounded-xl px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-bold text-maroon-900 truncate">{line.name}</p>
              </div>
              <button
                onClick={() => onReplace(line.id)}
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold text-maroon-900 bg-white border border-gold-400 rounded-lg px-3 py-1.5 hover:bg-gold-100"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replace This
              </button>
            </div>
          ))}
        </div>

        <GoldButton variant="outline" size="sm" fullWidth onClick={onCancel}>
          Cancel
        </GoldButton>
      </div>
    </div>
  );
}
