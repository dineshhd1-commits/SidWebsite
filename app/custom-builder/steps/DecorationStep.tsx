'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { DecorationPhoto } from '@/lib/types/decoration-inspiration';
import {
  decorationCartItemId,
  decorationPhotoIdFromCartItemId,
  decorationPhotoToCartItem,
  getDecorationCategoriesForEventType,
} from '@/lib/data/decoration-inspiration';
import { getCatalogItems } from '@/lib/data/catalog';
import { DecorationDiscovery } from '@/components/builder/DecorationDiscovery';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';
import { CorporateDecorationSection } from '@/components/builder/CorporateDecorationSection';
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
const ADDON_GROUP_IDS = ['dec-home', 'dec-venue', 'dec-couple-entry', 'dec-welcome-girls'];
const ADDON_GROUP_LABELS: Record<string, string> = {
  'dec-home': 'Home Decoration',
  'dec-venue': 'Venue Decoration',
  'dec-couple-entry': 'Couple Entry',
  'dec-welcome-girls': 'Welcome Girls',
};

/** Event types where decoration is enquiry-only (a single "Enquire Now",
 * no browsable gallery, nothing added to the cart) - Corporate Event
 * started this, now Get Together, Bachelor Party, Birthday and Other
 * Events use the exact same flow. */
const ENQUIRY_ONLY_EVENT_TYPES = ['corporate_event', 'get_together', 'bachelor_party', 'birthday', 'other_events'];

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: DecorationStepProps) {
  const isWedding = state.eventTypeId === 'wedding';
  const isEnquiryOnly = !!state.eventTypeId && ENQUIRY_ONLY_EVENT_TYPES.includes(state.eventTypeId);

  // Wedding: fetch the three add-on checklists. Every other event type
  // browses the real decoration photo gallery instead, scoped to only the
  // categories relevant to that event type (see getDecorationCategoriesForEventType).
  const [addonItems, setAddonItems] = useState<CatalogItem[] | null>(null);
  useEffect(() => {
    if (!isWedding || !state.eventTypeId) return;
    setAddonItems(null);
    getCatalogItems(state.eventTypeId, 'decoration').then((items) => {
      setAddonItems(items.filter((i) => ADDON_GROUP_IDS.includes(i.groupId || '')));
    });
  }, [state.eventTypeId, isWedding]);

  // Every decoration photo currently in the cart, keyed by the photo's own id
  // (not the cart item id) - the gallery is multi-select, so any number of
  // these can be selected at once, across any number of categories. Memoized
  // on state.cart alone so the gallery's ~150+ memoized photo tiles don't get
  // a new Set (and re-render) every time DecorationStep re-renders for a
  // reason that has nothing to do with the cart.
  const selectedPhotoIds = useMemo(
    () =>
      new Set(
        Object.values(state.cart)
          .filter((line) => line.categoryKey === 'decoration' && line.groupId === 'decoration-inspiration')
          .map((line) => decorationPhotoIdFromCartItemId(line.id))
          .filter((id): id is string => !!id)
      ),
    [state.cart]
  );

  const categories = !isWedding && !isEnquiryOnly && state.eventTypeId ? getDecorationCategoriesForEventType(state.eventTypeId) : [];

  /** Clicking a photo is the entire interaction: toggles that exact photo
   * in/out of Your Selections immediately, right where the customer is
   * browsing - no detail view, no replace-the-old-pick logic (every photo
   * is now its own independent cart line, so multiple photos - from the
   * same category or different ones - can be selected at once). Clicking an
   * already-selected photo removes it; nothing is ever duplicated since the
   * cart is keyed by the photo's own id. Stable across renders (only changes
   * when the cart or the add/remove handlers do) so memoized photo tiles can
   * actually skip re-rendering instead of the callback identity forcing them
   * to re-render anyway. */
  const handleTogglePhoto = useCallback(
    (photo: DecorationPhoto) => {
      const cartId = decorationCartItemId(photo.id);
      if (state.cart[cartId]) {
        onRemoveFromCart(cartId);
      } else {
        onAddToCart(decorationPhotoToCartItem(photo));
      }
    },
    [state.cart, onAddToCart, onRemoveFromCart]
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 2: Decoration</h2>
        <p className="text-xs text-maroon-700/80">
          {isWedding
            ? 'Choose your decoration add-on services below.'
            : isEnquiryOnly
            ? "Decoration for this event is fully customised, so just tell us what you need and we'll follow up with pricing."
            : 'Browse our client photo catalog and tap any photo you like - you can pick as many as you want, across every category.'}
        </p>
      </div>

      {isWedding ? (
        addonItems === null ? (
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
        )
      ) : isEnquiryOnly ? (
        <CorporateDecorationSection state={state} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Decoration catalog not available yet"
          description="Our decoration photos for this event type are still being added."
        />
      ) : (
        <DecorationDiscovery categories={categories} selectedPhotoIds={selectedPhotoIds} onTogglePhoto={handleTogglePhoto} />
      )}
    </div>
  );
}
