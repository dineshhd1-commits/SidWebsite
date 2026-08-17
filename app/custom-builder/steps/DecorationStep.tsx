'use client';

import React, { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogItems } from '@/lib/data/catalog';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';

interface DecorationStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

/** Wedding-only decoration add-on services, organised as three ordered
 * checklists in the exact order specified: Home Decoration, Venue Decoration,
 * Couple Entry. */
const ADDON_GROUP_IDS = ['dec-home', 'dec-venue', 'dec-couple-entry'];
const ADDON_GROUP_LABELS: Record<string, string> = {
  'dec-home': 'Home Decoration',
  'dec-venue': 'Venue Decoration',
  'dec-couple-entry': 'Couple Entry',
};

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: DecorationStepProps) {
  const [addonItems, setAddonItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    getCatalogItems(state.eventTypeId, 'decoration').then((items) => {
      setAddonItems(items.filter((i) => ADDON_GROUP_IDS.includes(i.groupId || '')));
    });
  }, [state.eventTypeId]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 2: Decoration</h2>
        <p className="text-xs text-maroon-700/80">
          Choose your decoration add-on services below.
        </p>
      </div>

      {addonItems === null ? (
        <LoadingState label="Loading decoration services..." />
      ) : addonItems.length === 0 ? (
        <EmptyState
          title="Decoration catalog not available yet"
          description="Our decoration services for this event type are still being added."
        />
      ) : (
        <div className="space-y-6">
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
