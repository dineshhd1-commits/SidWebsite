'use client';

import React, { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { DecorationPhoto } from '@/lib/types/decoration-inspiration';
import { decorationCartItemId, decorationPhotoIdFromCartItemId, decorationPhotoToCartItem } from '@/lib/data/decoration-inspiration';
import { getCatalogItems } from '@/lib/data/catalog';
import { DecorationDiscovery } from '@/components/builder/DecorationDiscovery';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';

interface DecorationStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

/** Wedding-only decoration add-on services, organised as three ordered
 * checklists (Home Decoration, Venue Decoration, Couple Entry) - separate
 * from the photo-based "pick your style" gallery above, and additive to it. */
const ADDON_GROUP_IDS = ['dec-home', 'dec-venue', 'dec-couple-entry'];
const ADDON_GROUP_LABELS: Record<string, string> = {
  'dec-home': 'Home Decoration',
  'dec-venue': 'Venue Decoration',
  'dec-couple-entry': 'Couple Entry',
};

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onReplace, onUpdateQuantity }: DecorationStepProps) {
  const decorationLine = Object.values(state.cart).find((line) => line.categoryKey === 'decoration' && line.groupId === 'decoration-inspiration');
  const selectedPhotoId = decorationLine ? decorationPhotoIdFromCartItemId(decorationLine.id) : null;

  const [addonItems, setAddonItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    getCatalogItems(state.eventTypeId, 'decoration').then((items) => {
      setAddonItems(items.filter((i) => ADDON_GROUP_IDS.includes(i.groupId || '')));
    });
  }, [state.eventTypeId]);

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

      {addonItems && addonItems.length > 0 && (
        <div className="space-y-6 pt-2">
          {ADDON_GROUP_IDS.map((groupId) => {
            const groupItems = addonItems.filter((i) => i.groupId === groupId);
            if (groupItems.length === 0) return null;
            const selectedIds = new Set(groupItems.filter((i) => state.cart[i.id]).map((i) => i.id));
            const quantities = Object.fromEntries(groupItems.map((i) => [i.id, state.cart[i.id]?.quantity ?? 1]));
            return (
              <div key={groupId} className="space-y-3">
                <h3 className="font-playfair text-lg font-bold text-maroon-900">{ADDON_GROUP_LABELS[groupId]}</h3>
                <CatalogChecklist
                  items={groupItems}
                  selectedIds={selectedIds}
                  quantities={quantities}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
