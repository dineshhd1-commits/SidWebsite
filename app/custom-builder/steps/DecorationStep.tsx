'use client';

import React from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { DecorationPhoto } from '@/lib/types/decoration-inspiration';
import { decorationCartItemId, decorationPhotoIdFromCartItemId, decorationPhotoToCartItem } from '@/lib/data/decoration-inspiration';
import { DecorationDiscovery } from '@/components/builder/DecorationDiscovery';

interface DecorationStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
}

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onReplace }: DecorationStepProps) {
  const decorationLine = Object.values(state.cart).find((line) => line.categoryKey === 'decoration');
  const selectedPhotoId = decorationLine ? decorationPhotoIdFromCartItemId(decorationLine.id) : null;

  const handleSelectPhoto = (photo: DecorationPhoto) => {
    const newItem = decorationPhotoToCartItem(photo);
    if (decorationLine && decorationLine.id !== decorationCartItemId(photo.id)) {
      onReplace(decorationLine.id, newItem);
    } else {
      onAddToCart(newItem);
    }
  };

  const handleRemoveSelection = () => {
    if (decorationLine) onRemoveFromCart(decorationLine.id);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 2: Decoration</h2>
        <p className="text-xs text-maroon-700/80">
          Browse real decorations from our past events and pick the style you love.
        </p>
      </div>

      <DecorationDiscovery
        selectedPhotoId={selectedPhotoId}
        onSelectPhoto={handleSelectPhoto}
        onRemoveSelection={handleRemoveSelection}
      />
    </div>
  );
}
