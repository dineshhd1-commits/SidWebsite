'use client';

import React, { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogItems } from '@/lib/data/catalog';
import { CatalogItemCard } from '@/components/builder/CatalogItemCard';
import { QuantityStepper } from '@/components/builder/QuantityStepper';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { GlassCard } from '@/components/ui/glass-card';

interface AdditionalServicesStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function AdditionalServicesStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: AdditionalServicesStepProps) {
  const [items, setItems] = useState<CatalogItem[] | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    getCatalogItems(state.eventTypeId, 'additional_services').then(setItems);
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

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 6: Additional Services</h2>
        <p className="text-xs text-maroon-700/80">Makeup, music, invitations and more - add anything else you need.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const cartLine = state.cart[item.id];
          const isSelected = !!cartLine;
          const isStepper = item.quantityMode === 'stepper';

          if (isSelected && isStepper) {
            return (
              <GlassCard key={item.id} variant="warm" className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-playfair text-lg font-bold text-maroon-900">{item.name}</h3>
                  </div>
                  <p className="text-xs text-maroon-700/80 mb-2 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-gold-200">
                  <QuantityStepper
                    value={cartLine.quantity}
                    onChange={(qty) => (qty <= 0 ? onRemoveFromCart(item.id) : onUpdateQuantity(item.id, qty))}
                    min={0}
                    max={item.maxQuantity ?? undefined}
                  />
                </div>
              </GlassCard>
            );
          }

          return (
            <CatalogItemCard
              key={item.id}
              item={item}
              isSelected={isSelected}
              isLocked={false}
              onSelect={() => (isSelected ? onRemoveFromCart(item.id) : onAddToCart(item))}
            />
          );
        })}
      </div>
    </div>
  );
}
