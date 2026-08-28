'use client';

import React, { useEffect, useState } from 'react';
import { CatalogGroup, CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogGroups, getCatalogItems } from '@/lib/data/catalog';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';

interface PhotographyStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
}

const PREWEDDING_DURATION_GROUP_ID = 'photo-prewedding-duration';
const PREWEDDING_SERVICES_GROUP_ID = 'photo-prewedding-services';

/** Pre-Wedding Shoot is its own section: pick a duration (1 Day / 2 Days,
 * single choice) first, which unlocks the service checklist below it. Kept
 * separate from the generic group loop below because the duration picker is
 * a pill-choice, not a checklist row. */
function PreWeddingShootSection({
  durationItems,
  serviceItems,
  state,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onReplace,
}: {
  durationItems: CatalogItem[];
  serviceItems: CatalogItem[];
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
}) {
  const selectedDuration = durationItems.find((d) => state.cart[d.id]) || null;

  const handleSelectDuration = (durationItem: CatalogItem) => {
    if (selectedDuration?.id === durationItem.id) {
      onRemoveFromCart(durationItem.id);
    } else if (selectedDuration) {
      onReplace(selectedDuration.id, durationItem);
    } else {
      onAddToCart(durationItem);
    }
  };

  const selectedServiceIds = new Set(serviceItems.filter((i) => state.cart[i.id]).map((i) => i.id));
  const serviceQuantities = Object.fromEntries(serviceItems.map((i) => [i.id, state.cart[i.id]?.quantity ?? 1]));

  return (
    <div className="space-y-3">
      <h3 className="font-playfair text-lg font-bold text-maroon-900">Pre-Wedding Shoot</h3>

      <div className="space-y-1.5">
        <p className="text-xs font-bold text-maroon-900">
          Number of Days <span className="text-rose-600">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {durationItems.map((durationItem) => {
            const isSelected = selectedDuration?.id === durationItem.id;
            return (
              <button
                key={durationItem.id}
                type="button"
                onClick={() => handleSelectDuration(durationItem)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-maroon-800 text-gold-300 border-gold-400 shadow-sm'
                    : 'bg-white text-maroon-900 border-gold-300 hover:bg-gold-50'
                }`}
              >
                {durationItem.name}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDuration ? (
        <CatalogChecklist
          items={serviceItems}
          selectedIds={selectedServiceIds}
          quantities={serviceQuantities}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      ) : (
        <p className="text-xs text-maroon-700/70 italic px-1">Select the number of days to see photography options.</p>
      )}
    </div>
  );
}

export function PhotographyStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity, onReplace }: PhotographyStepProps) {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [groups, setGroups] = useState<CatalogGroup[]>([]);

  useEffect(() => {
    if (!state.eventTypeId) return;
    Promise.all([
      getCatalogItems(state.eventTypeId, 'photography'),
      getCatalogGroups(state.eventTypeId, 'photography'),
    ]).then(([i, g]) => {
      setItems(i);
      setGroups(g);
    });
  }, [state.eventTypeId]);

  if (items === null) {
    return <LoadingState label="Loading photography services..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Photography catalog not available yet"
        description="Our photography and videography services for this event type are still being added."
      />
    );
  }

  // Pre-Wedding Shoot gets its own bespoke section below - pulled out of the
  // generic group loop so its duration groups never render as plain checklists.
  const preweddingDurationItems = items.filter((i) => i.groupId === PREWEDDING_DURATION_GROUP_ID);
  const preweddingServiceItems = items.filter((i) => i.groupId === PREWEDDING_SERVICES_GROUP_ID);
  const hasPreweddingShoot = preweddingDurationItems.length > 0;

  const remainingGroups = groups.filter(
    (g) => g.id !== PREWEDDING_DURATION_GROUP_ID && g.id !== PREWEDDING_SERVICES_GROUP_ID
  );

  // Wedding splits its coverage across two groups (Deverakarya / Wedding Hall),
  // so those get a heading each. Event types with a single group keep the plain
  // ungrouped list they already had.
  const groupsWithItems = remainingGroups
    .map((g) => ({ group: g, groupItems: items.filter((i) => i.groupId === g.id) }))
    .filter((entry) => entry.groupItems.length > 0);
  const showGroupHeadings = groupsWithItems.length > 1 || hasPreweddingShoot;

  const renderGroupChecklist = (groupItems: CatalogItem[]) => {
    const selectedIds = new Set(groupItems.filter((i) => state.cart[i.id]).map((i) => i.id));
    const quantities = Object.fromEntries(groupItems.map((i) => [i.id, state.cart[i.id]?.quantity ?? 1]));
    return (
      <CatalogChecklist
        items={groupItems}
        selectedIds={selectedIds}
        quantities={quantities}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">
          Step 3: Photography &amp; Videography{' '}
          <span className="text-sm font-sans font-bold text-maroon-700/60">(Optional)</span>
        </h2>
        <p className="text-xs text-maroon-700/80">
          Select as many compatible services as you need - no limit here. You can skip this step if you don&apos;t need coverage.
        </p>
      </div>

      {showGroupHeadings ? (
        <div className="space-y-6">
          {hasPreweddingShoot && (
            <PreWeddingShootSection
              durationItems={preweddingDurationItems}
              serviceItems={preweddingServiceItems}
              state={state}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
              onReplace={onReplace}
            />
          )}

          {groupsWithItems.map(({ group, groupItems }) => (
            <div key={group.id} className="space-y-3">
              <h3 className="font-playfair text-lg font-bold text-maroon-900">{group.name}</h3>
              {renderGroupChecklist(groupItems)}
            </div>
          ))}
        </div>
      ) : (
        renderGroupChecklist(items)
      )}
    </div>
  );
}
