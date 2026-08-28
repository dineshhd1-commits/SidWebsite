'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogItems } from '@/lib/data/catalog';
import { NumericQuantityInput } from '@/components/builder/NumericQuantityInput';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { isAdditionalServiceAllowed } from '@/lib/builder/event-rules';
import { Plus, Check, Sparkles } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-300/40 pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 6: Additional Services</h2>
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

      {/* List Format for Additional Services */}
      <div className="space-y-3">
        {items.map((item) => {
          const cartLine = state.cart[item.id];
          const isSelected = !!cartLine;
          const isStepper = item.quantityMode === 'stepper';
          const imageUrl = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : null);

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-gold-50/90 border-gold-400 shadow-md ring-1 ring-gold-400/50'
                  : 'bg-white/80 hover:bg-gold-50/40 border-gold-200/80 hover:border-gold-300 shadow-sm'
              }`}
            >
              {/* Left Column: Image Thumbnail + Item Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gold-100 shrink-0 border border-gold-300/60 shadow-inner flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-gold-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-playfair text-base sm:text-lg font-bold text-maroon-900">
                      {item.name}
                    </h3>
                    {item.price > 0 && (
                      <span className="text-xs font-bold text-gold-800 bg-gold-100 border border-gold-300 rounded-full px-2 py-0.5">
                        ₹{item.price.toLocaleString('en-IN')}{item.unit ? ` / ${item.unit}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-maroon-700/80 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions / Stepper / Add Button */}
              <div className="w-full sm:w-auto flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gold-200/60 shrink-0">
                {isSelected && isStepper ? (
                  <div className="flex items-center gap-2">
                    <NumericQuantityInput
                      value={cartLine.quantity}
                      onChange={(qty) => onUpdateQuantity(item.id, qty)}
                      onRemove={() => onRemoveFromCart(item.id)}
                      min={1}
                      max={item.maxQuantity ?? undefined}
                      unitLabel={item.unit ? `(${item.unit})` : undefined}
                    />
                  </div>
                ) : isSelected ? (
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-rose-700 transition-colors shadow-sm cursor-pointer group"
                  >
                    <Check className="w-3.5 h-3.5 group-hover:hidden" />
                    <span className="group-hover:hidden">Added</span>
                    <span className="hidden group-hover:inline">Remove</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddToCart(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-maroon-900 hover:bg-maroon-950 text-gold-200 border border-gold-400/60 hover:border-gold-300 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add to Event</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
