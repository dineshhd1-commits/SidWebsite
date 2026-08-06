'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { GoldButton } from '../ui/gold-button';

interface FieldCheck {
  key: string;
  label: string;
  filled: boolean;
}

interface StepConfirmationModalProps {
  completed: FieldCheck[];
  missing: FieldCheck[];
  onContinue: () => void;
  onEditDetails: () => void;
}

export function StepConfirmationModal({ completed, missing, onContinue, onEditDetails }: StepConfirmationModalProps) {
  return (
    <div onClick={onEditDetails} className="fixed inset-0 z-[90] bg-maroon-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl space-y-5">
        <button onClick={onEditDetails} className="absolute top-4 right-4 text-maroon-700 hover:text-maroon-900" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">You&apos;re almost ready!</h3>
        </div>

        {completed.length > 0 && (
          <div className="space-y-1.5">
            {completed.map((f) => (
              <div key={f.key} className="flex items-center gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{f.label}</span>
              </div>
            ))}
          </div>
        )}

        {missing.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-gold-200">
            <p className="text-xs text-maroon-700/80">You haven&apos;t added:</p>
            {missing.map((f) => (
              <div key={f.key} className="flex items-center gap-2 text-xs text-maroon-800">
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-gold-500">&bull;</span>
                <span className="font-bold">{f.label}</span>
              </div>
            ))}
            <p className="text-[11px] text-maroon-700/70 pt-1">
              You can continue now or complete these later before submitting your enquiry.
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <GoldButton variant="gold" size="sm" fullWidth onClick={onContinue}>
            Continue
          </GoldButton>
          <GoldButton variant="outline" size="sm" fullWidth onClick={onEditDetails}>
            Edit Details
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
