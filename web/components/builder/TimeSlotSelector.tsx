'use client';

import React from 'react';
import { CateringTiming } from '@/lib/types/catering-menu';

export interface TimeSlotOption {
  id: CateringTiming;
  label: string;
  hint: string;
}

const ALL_TIME_SLOTS: Record<CateringTiming, TimeSlotOption> = {
  morning: { id: 'morning', label: 'Morning', hint: 'Breakfast menu' },
  afternoon: { id: 'afternoon', label: 'Afternoon', hint: 'Lunch menu' },
  evening: { id: 'evening', label: 'Evening', hint: 'Dinner menu' },
};

interface TimeSlotSelectorProps {
  availableSlots: CateringTiming[];
  selectedSlot: CateringTiming | null;
  onSelectSlot: (slot: CateringTiming | null) => void;
  disabled?: boolean;
}

/**
 * Global Time-Slot Selector:
 * - Allows direct, seamless switching between available daytime periods (Morning, Afternoon, Evening).
 * - Clearly highlights the active time slot.
 * - Semantic radio buttons + fully keyboard accessible.
 */
export function TimeSlotSelector({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  disabled = false,
}: TimeSlotSelectorProps) {
  const handleClick = (slot: CateringTiming) => {
    if (disabled) return;
    // Direct switching between time slots
    onSelectSlot(slot);
  };

  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Catering Time Slot">
      {availableSlots.map((slotId) => {
        const option = ALL_TIME_SLOTS[slotId];
        const isSelected = selectedSlot === slotId;

        return (
          <button
            key={slotId}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => handleClick(slotId)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer min-w-[130px] ${
              isSelected
                ? 'bg-maroon-800 text-gold-300 border-gold-400 shadow-md ring-2 ring-gold-400/40 scale-[1.02]'
                : 'bg-white text-maroon-900 border-gold-300 hover:bg-gold-50/80 hover:border-gold-400 shadow-sm'
            }`}
            title={`Switch to ${option?.label || slotId} menu`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="block font-bold">{option?.label || slotId}</span>
              {isSelected && (
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">Active</span>
              )}
            </div>
            <span className="block text-[10px] font-medium opacity-75 mt-0.5">
              {option?.hint || ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
