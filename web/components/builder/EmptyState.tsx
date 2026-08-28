'use client';

import React from 'react';
import { GlassCard } from '../ui/glass-card';
import { GoldButton } from '../ui/gold-button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <GlassCard variant="warm" className="text-center space-y-4 py-12">
      {icon && <div className="flex justify-center text-gold-600">{icon}</div>}
      <h3 className="font-playfair text-xl font-bold text-maroon-900">{title}</h3>
      <p className="text-sm text-maroon-700/80 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <GoldButton variant="copper" size="md" onClick={onAction}>
            {actionLabel}
          </GoldButton>
        </div>
      )}
    </GlassCard>
  );
}

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-maroon-700/70">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}
