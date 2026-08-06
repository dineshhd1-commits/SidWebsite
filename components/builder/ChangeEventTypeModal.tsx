'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { GoldButton } from '../ui/gold-button';

interface ChangeEventTypeModalProps {
  newEventTypeName: string;
  onContinueAndReset: () => void;
  onKeepCurrentEvent: () => void;
  onCancel: () => void;
}

export function ChangeEventTypeModal({ newEventTypeName, onContinueAndReset, onKeepCurrentEvent, onCancel }: ChangeEventTypeModalProps) {
  return (
    <div onClick={onCancel} className="fixed inset-0 z-[90] bg-maroon-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl space-y-5">
        <button onClick={onCancel} className="absolute top-4 right-4 text-maroon-700 hover:text-maroon-900" aria-label="Cancel">
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">Change Event Type?</h3>
          <p className="text-xs text-maroon-700/80">
            Changing to <strong>{newEventTypeName}</strong> may remove services that are not available for the new event.
            Do you want to continue?
          </p>
        </div>

        <div className="space-y-2">
          <GoldButton variant="gold" size="sm" fullWidth onClick={onContinueAndReset}>
            Continue and Reset Incompatible Items
          </GoldButton>
          <GoldButton variant="outline" size="sm" fullWidth onClick={onKeepCurrentEvent}>
            Keep Current Event
          </GoldButton>
          <button onClick={onCancel} className="w-full text-center text-xs text-maroon-700/70 hover:text-maroon-900 py-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
