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
 * Global Time-Slot Selector adhering to the locking specification:
 * - When one slot is selected, all other available slots become greyed out and disabled.
 * - Clicking the currently selected slot again deselects it and unlocks all other slots.
 * - Semantic disabled state + keyboard accessible.
 */
export function TimeSlotSelector({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  disabled = false,
}: TimeSlotSelectorProps) {
  const handleClick = (slot: CateringTiming) => {
    if (disabled) return;
    if (selectedSlot === slot) {
      // Re-clicking selected slot unlocks and deselects
      onSelectSlot(null);
    } else if (selectedSlot === null) {
      // Selecting slot locks others
      onSelectSlot(slot);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Catering Time Slot">
      {availableSlots.map((slotId) => {
        const option = ALL_TIME_SLOTS[slotId];
        const isSelected = selectedSlot === slotId;
        const isLockedOut = selectedSlot !== null && !isSelected;
        const isDisabled = disabled || isLockedOut;

        return (
          <button
            key={slotId}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => handleClick(slotId)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer min-w-[130px] ${
              isSelected
                ? 'bg-maroon-800 text-gold-300 border-gold-400 shadow-md ring-2 ring-gold-400/40'
                : isLockedOut
                ? 'bg-gray-100/70 text-gray-400 border-gray-200 opacity-45 cursor-not-allowed'
                : 'bg-white text-maroon-900 border-gold-300 hover:bg-gold-50/80 hover:border-gold-400 shadow-sm'
            }`}
            title={
              isSelected
                ? 'Click again to deselect and unlock other time slots'
                : isLockedOut
                ? 'Deselect the currently active time slot first to choose this option'
                : undefined
            }
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
