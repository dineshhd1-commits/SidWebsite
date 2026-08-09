'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CatalogGroup, CatalogItem, PackageGroupLimit } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogGroups, getCatalogItems, getPackageGroupLimits } from '@/lib/data/catalog';
import { canAddToGroup, isGroupLocked } from '@/lib/builder/limits';
import { getEffectiveGroupLimit, getGroupSelectionCount, getLinesByGroup } from '@/lib/builder/selectors';
import { CatalogItemCard } from '@/components/builder/CatalogItemCard';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';

// Only rendered once a photo is opened / a selection limit is hit - deferred
// out of the initial route bundle.
const ImageGalleryModal = dynamic(() => import('@/components/builder/ImageGalleryModal').then((m) => m.ImageGalleryModal));
const ReplaceSelectionModal = dynamic(() => import('@/components/builder/ReplaceSelectionModal').then((m) => m.ReplaceSelectionModal));

interface DecorationStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
}

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onReplace }: DecorationStepProps) {
  const [groups, setGroups] = useState<CatalogGroup[] | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [packageLimits, setPackageLimits] = useState<PackageGroupLimit[]>([]);
  const [galleryItem, setGalleryItem] = useState<CatalogItem | null>(null);
  const [pendingReplace, setPendingReplace] = useState<CatalogItem | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    Promise.all([
      getCatalogGroups(state.eventTypeId, 'decoration'),
      getCatalogItems(state.eventTypeId, 'decoration'),
      state.selectedPackageId ? getPackageGroupLimits(state.selectedPackageId) : Promise.resolve([]),
    ]).then(([g, i, pl]) => {
      setGroups(g);
      setItems(i);
      setPackageLimits(pl);
    });
  }, [state.eventTypeId, state.selectedPackageId]);

  if (groups === null) {
    return <LoadingState label="Loading decoration options..." />;
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        title="Decoration catalog not available yet"
        description="Our decoration designs for this event type are still being added. Please check back soon or contact us directly."
      />
    );
  }

  const packageLimitByGroup = new Map(packageLimits.map((pl) => [pl.groupId, pl]));
  const visibleItems = items;
  const activeGroup = groups[0] || null;

  const handleSelect = (item: CatalogItem) => {
    const isSelected = !!state.cart[item.id];
    if (isSelected) {
      onRemoveFromCart(item.id);
      return;
    }

    const group = groups.find((g) => g.id === item.groupId);
    if (!group) {
      onAddToCart(item);
      return;
    }

    const decision = canAddToGroup(state, group, packageLimitByGroup.get(group.id));
    if (decision.allowed) {
      onAddToCart(item);
    } else {
      setPendingReplace(item);
    }
  };

  const pendingGroup = pendingReplace ? groups.find((g) => g.id === pendingReplace.groupId) : null;

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 2: Decoration</h2>
        <p className="text-xs text-maroon-700/80">
          Choose one decoration tier - Silver, Gold or Platinum.
        </p>
      </div>

      {activeGroup && (() => {
        const { maxSelections } = getEffectiveGroupLimit(activeGroup, packageLimitByGroup.get(activeGroup.id));
        const count = getGroupSelectionCount(state, activeGroup.id);
        if (maxSelections !== null && count >= maxSelections) {
          return (
            <p className="text-xs font-bold text-maroon-800 bg-gold-100 border border-gold-300 rounded-xl px-4 py-2.5">
              You have reached the maximum selection limit ({maxSelections}) for {activeGroup.name}.
            </p>
          );
        }
        return null;
      })()}

      {visibleItems.length === 0 ? (
        <EmptyState title="No designs here yet" description="We're still adding designs to this category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {visibleItems.map((item) => {
            const isSelected = !!state.cart[item.id];
            const group = groups.find((g) => g.id === item.groupId);
            const locked = group ? isGroupLocked(state, group, packageLimitByGroup.get(group.id)) : false;
            return (
              <CatalogItemCard
                key={item.id}
                item={item}
                isSelected={isSelected}
                isLocked={locked}
                onSelect={() => handleSelect(item)}
                onOpenGallery={() => setGalleryItem(item)}
              />
            );
          })}
        </div>
      )}

      {galleryItem && (
        <ImageGalleryModal
          item={galleryItem}
          isSelected={!!state.cart[galleryItem.id]}
          isLocked={(() => {
            const group = groups.find((g) => g.id === galleryItem.groupId);
            return group ? isGroupLocked(state, group, packageLimitByGroup.get(group.id)) : false;
          })()}
          onClose={() => setGalleryItem(null)}
          onSelect={() => {
            handleSelect(galleryItem);
            setGalleryItem(null);
          }}
        />
      )}

      {pendingReplace && pendingGroup && (
        <ReplaceSelectionModal
          groupName={pendingGroup.name}
          pendingItemName={pendingReplace.name}
          selectedLines={getLinesByGroup(state, pendingGroup.id)}
          onReplace={(lineIdToRemove) => {
            onReplace(lineIdToRemove, pendingReplace);
            setPendingReplace(null);
          }}
          onCancel={() => setPendingReplace(null)}
        />
      )}
    </div>
  );
}
