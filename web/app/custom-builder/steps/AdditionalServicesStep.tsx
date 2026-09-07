'use client';

import React, { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogItems } from '@/lib/data/catalog';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { isAdditionalServiceAllowed } from '@/lib/builder/event-rules';

interface AdditionalServicesStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function AdditionalServicesStep({
  state,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
}: AdditionalServicesStepProps) {
  const [items, setItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    getCatalogItems(state.eventTypeId, 'additional_services').then((catalogItems) => {
      setItems(catalogItems.filter((item) => isAdditionalServiceAllowed(state.eventTypeId, item.id)));
    });
  }, [state.eventTypeId]);

  if (items === null) {
    return <LoadingState label="Loading additional services..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Additional services not available yet"
        description="Add-on services for this event type are still being added."
      />
    );
  }

  const selectedCount = items.filter((item) => !!state.cart[item.id]).length;
  const selectedIds = new Set(items.filter((item) => !!state.cart[item.id]).map((item) => item.id));
  const quantities = Object.fromEntries(items.map((item) => [item.id, state.cart[item.id]?.quantity ?? 1]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-300/40 pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-maroon-900">
            Step 5: Additional Services{' '}
            <span className="text-sm font-sans font-bold text-maroon-700/60">(Optional)</span>
          </h2>
          <p className="text-xs text-maroon-700/80">
            Makeup, live music, fog machines, entries and more &mdash; add anything else you need.
          </p>
        </div>
        {selectedCount > 0 && (
          <span className="self-start sm:self-auto text-xs font-bold bg-maroon-900 text-gold-300 px-3 py-1 rounded-full border border-gold-400/40 shadow-sm">
            {selectedCount} {selectedCount === 1 ? 'Service' : 'Services'} Selected
          </span>
        )}
      </div>

      <CatalogChecklist
        items={items}
        selectedIds={selectedIds}
        quantities={quantities}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    </div>
  );
}
