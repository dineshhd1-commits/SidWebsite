'use client';

import React from 'react';
import Image from 'next/image';
import { Lock, Check, Images, ImageOff } from 'lucide-react';
import { CatalogItem } from '@/lib/types/catalog';
import { PackageLevelBadge } from './PackageLevelBadge';
import { GlassCard } from '../ui/glass-card';
import { GoldButton } from '../ui/gold-button';

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

interface CatalogItemCardProps {
  item: CatalogItem;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onOpenGallery?: () => void;
  actionLabel?: string;
}

export function CatalogItemCard({ item, isSelected, isLocked, onSelect, onOpenGallery, actionLabel }: CatalogItemCardProps) {
  const locked = isLocked && !isSelected;

  return (
    <GlassCard variant={isSelected ? 'warm' : 'light'} className="flex flex-col justify-between space-y-4">
      <button
        type="button"
        onClick={item.imageUrl ? onOpenGallery : undefined}
        disabled={!onOpenGallery || !item.imageUrl}
        className="relative h-44 rounded-xl overflow-hidden mb-2 block w-full"
      >
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gold-50 text-gold-700/70">
            <ImageOff className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Photo coming soon</span>
          </div>
        )}
        {item.images.length > 1 && (
          <span className="absolute top-2 left-2 bg-maroon-900/80 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border border-gold-400/30 inline-flex items-center gap-1">
            <Images className="w-3 h-3" /> {item.images.length}
          </span>
        )}
        {isSelected && (
          <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Check className="w-3 h-3" /> Selected
          </span>
        )}
        {locked && !isSelected && (
          <div className="absolute inset-0 bg-maroon-950/60 flex items-center justify-center">
            <span className="text-gold-200 text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Limit Reached
            </span>
          </div>
        )}
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">{item.name}</h3>
          <PackageLevelBadge level={item.packageLevel} />
        </div>
        <p className="text-xs text-maroon-700/80 mb-2 line-clamp-2">{item.description}</p>
        <p className="text-sm font-bold text-maroon-900">
          {formatCurrency(item.price)} <span className="text-[11px] font-normal text-maroon-700/70">/ {item.unit}</span>
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-gold-200">
        <GoldButton
          size="sm"
          variant={isSelected ? 'dark' : 'gold'}
          onClick={onSelect}
          disabled={locked}
          fullWidth
        >
          {isSelected ? 'Remove' : locked ? 'Limit Reached' : actionLabel || 'Select'}
        </GoldButton>
      </div>
    </GlassCard>
  );
}
