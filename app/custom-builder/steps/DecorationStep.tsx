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

/** Event-wise decoration checklists - each event type only shows the
 * sections that are actually relevant to it (per the client's spec):
 * Wedding gets House + Venue + Couple Entry Concept (+ the existing Welcome
 * Girls add-on), Engagement/Reception get Venue + Couple Entry Concept,
 * Birthday gets Venue + Entry Concept, and Anniversary gets Venue only.
 * Every group id here is unique per event type (never shared across
 * events), so a selection always stays tied to the event it was picked
 * under - switching event types can never carry a decoration pick over. */
const CHECKLIST_GROUPS_BY_EVENT: Record<string, { id: string; label: string }[]> = {
  wedding: [
    { id: 'dec-home', label: 'House Decoration' },
    { id: 'dec-venue', label: 'Venue Decoration' },
    { id: 'dec-couple-entry', label: 'Couple Entry Concept' },
    { id: 'dec-welcome-girls', label: 'Welcome Girls' },
  ],
  engagement: [
    { id: 'dec-venue-engagement', label: 'Venue Decoration' },
    { id: 'dec-entry-engagement', label: 'Couple Entry Concept' },
  ],
  reception: [
    { id: 'dec-venue-reception', label: 'Venue Decoration' },
    { id: 'dec-entry-reception', label: 'Couple Entry Concept' },
  ],
  birthday: [
    { id: 'dec-venue-birthday', label: 'Venue Decoration' },
    { id: 'dec-entry-birthday', label: 'Entry Concept' },
  ],
  anniversary: [{ id: 'dec-venue-anniversary', label: 'Venue Decoration' }],
};

/** Event types where decoration is enquiry-only (a single "Enquire Now",
 * no browsable gallery, nothing added to the cart) - Corporate Event,
 * Get Together, Bachelor Party and Other Events use this flow. Birthday
 * moved to the normal checklist+cart flow above, alongside Wedding,
 * Engagement, Reception and Anniversary. */
const ENQUIRY_ONLY_EVENT_TYPES = ['corporate_event', 'get_together', 'bachelor_party', 'other_events'];

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: DecorationStepProps) {
  const checklistGroups = state.eventTypeId ? CHECKLIST_GROUPS_BY_EVENT[state.eventTypeId] : undefined;
  const hasChecklist = !!checklistGroups;
  const isEnquiryOnly = !!state.eventTypeId && ENQUIRY_ONLY_EVENT_TYPES.includes(state.eventTypeId);

  // Fetches the event-specific checklist groups above. Every other event
  // type (the enquiry-only ones) skips this and goes straight to the
  // enquiry-only flow instead.
  const [addonItems, setAddonItems] = useState<CatalogItem[] | null>(null);
  useEffect(() => {
    if (!hasChecklist || !state.eventTypeId) return;
    setAddonItems(null);
    const groupIds = checklistGroups!.map((g) => g.id);
    getCatalogItems(state.eventTypeId, 'decoration').then((items) => {
      setAddonItems(items.filter((i) => groupIds.includes(i.groupId || '')));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.eventTypeId, hasChecklist]);

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

  // The real client-photo gallery keeps working alongside the checklist
  // above wherever it already applies (Wedding has none - it uses the
  // checklist exclusively, as before) - the checklist is for booking a
  // named service, the gallery is for picking an actual look from real
  // photos, and neither replaces the other.
  const categories = !isEnquiryOnly && state.eventTypeId ? getDecorationCategoriesForEventType(state.eventTypeId) : [];

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
          {isEnquiryOnly
            ? "Decoration for this event is fully customised, so just tell us what you need and we'll follow up with pricing."
            : hasChecklist && categories.length > 0
            ? 'Choose your decoration services below, then browse our client photo gallery for inspiration.'
            : hasChecklist
            ? 'Choose your decoration services below.'
            : 'Browse our client photo catalog and tap any photo you like - you can pick as many as you want, across every category.'}
        </p>
      </div>

      {hasChecklist &&
        (addonItems === null ? (
          <LoadingState label="Loading decoration services..." />
        ) : addonItems.length === 0 ? (
          <EmptyState
            title="Decoration catalog not available yet"
            description="Our decoration services for this event type are still being added."
          />
        ) : (
          <div className="space-y-6">
            {checklistGroups!.map(({ id: groupId, label }) => {
              const groupItems = addonItems.filter((i) => i.groupId === groupId);
              if (groupItems.length === 0) return null;
              const selectedIds = new Set(groupItems.filter((i) => state.cart[i.id]).map((i) => i.id));
              const quantities = Object.fromEntries(groupItems.map((i) => [i.id, state.cart[i.id]?.quantity ?? 1]));
              return (
                <div key={groupId} className="space-y-3">
                  <h3 className="font-playfair text-lg font-bold text-maroon-900">{label}</h3>
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
        ))}

      {isEnquiryOnly && <CorporateDecorationSection state={state} />}

      {!isEnquiryOnly && categories.length > 0 && (
        <div className="space-y-3">
          {hasChecklist && (
            <h3 className="font-playfair text-lg font-bold text-maroon-900 pt-2 border-t border-gold-300/40">
              Decoration Photo Gallery
            </h3>
          )}
          <DecorationDiscovery categories={categories} selectedPhotoIds={selectedPhotoIds} onTogglePhoto={handleTogglePhoto} />
        </div>
      )}

      {!hasChecklist && !isEnquiryOnly && categories.length === 0 && (
        <EmptyState
          title="Decoration catalog not available yet"
          description="Our decoration options for this event type are still being added."
        />
      )}
    </div>
  );
}
