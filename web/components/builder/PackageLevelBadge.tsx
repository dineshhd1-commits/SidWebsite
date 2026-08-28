'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { PackageLevelId } from '@/lib/types/catalog';

const LEVEL_LABELS: Record<PackageLevelId, string> = {
  normal: 'Normal',
  standard: 'Standard',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Premium',
  luxury: 'Luxury',
  platinum: 'Platinum',
};

const LEVEL_CLASSES: Record<PackageLevelId, string> = {
  normal: 'bg-gray-100 text-gray-700 border-gray-300',
  standard: 'bg-blue-50 text-blue-700 border-blue-200',
  silver: 'bg-slate-100 text-slate-700 border-slate-300',
  gold: 'bg-gold-100 text-maroon-900 border-gold-400',
  premium: 'bg-maroon-100 text-maroon-900 border-maroon-300',
  luxury: 'bg-maroon-900 text-gold-300 border-gold-500',
  platinum: 'bg-zinc-800 text-zinc-100 border-zinc-500',
};

export function PackageLevelBadge({ level, className }: { level: PackageLevelId; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
        LEVEL_CLASSES[level] || LEVEL_CLASSES.standard,
        className
      )}
    >
      {LEVEL_LABELS[level] || level}
    </span>
  );
}
