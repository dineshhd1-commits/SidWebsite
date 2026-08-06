'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Users, CheckCircle2, ImageOff } from 'lucide-react';
import { CatalogGroup, CatalogItem, PackageDefinition, PackageGroupLimit } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogGroups, getCatalogItems, getPackageDefinition, getPackageDefinitions, getPackageGroupLimits } from '@/lib/data/catalog';
import { canAddToGroup, isGroupLocked } from '@/lib/builder/limits';
import { isGatedByPackage, PACKAGE_LEVEL_NAMES } from '@/lib/builder/package-levels';
import { PackageLevelBadge } from '@/components/builder/PackageLevelBadge';
import { ReplaceSelectionModal } from '@/components/builder/ReplaceSelectionModal';
import { PackageUpgradeModal } from '@/components/builder/PackageUpgradeModal';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { getLinesByGroup } from '@/lib/builder/selectors';
import { SITE } from '@/lib/site-config';

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

interface VenueStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onReplace: (oldId: string, item: CatalogItem) => void;
  onSelectPackage: (packageId: string) => void;
}

export function VenueStep({ state, onAddToCart, onRemoveFromCart, onReplace, onSelectPackage }: VenueStepProps) {
  const [groups, setGroups] = useState<CatalogGroup[] | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [packageLimits, setPackageLimits] = useState<PackageGroupLimit[]>([]);
  const [currentPackage, setCurrentPackage] = useState<PackageDefinition | null>(null);
  const [allPackages, setAllPackages] = useState<PackageDefinition[]>([]);
  const [pendingReplace, setPendingReplace] = useState<CatalogItem | null>(null);
  const [pendingUpgrade, setPendingUpgrade] = useState<CatalogItem | null>(null);

  useEffect(() => {
    if (!state.eventTypeId) return;
    Promise.all([
      getCatalogGroups(state.eventTypeId, 'venue'),
      getCatalogItems(state.eventTypeId, 'venue'),
      getPackageDefinitions(state.eventTypeId),
      state.selectedPackageId ? getPackageGroupLimits(state.selectedPackageId) : Promise.resolve([]),
      state.selectedPackageId ? getPackageDefinition(state.selectedPackageId) : Promise.resolve(null),
    ]).then(([g, i, allPkgs, pl, pkg]) => {
      setGroups(g);
      setItems(i);
      setAllPackages(allPkgs);
      setPackageLimits(pl);
      setCurrentPackage(pkg);
    });
  }, [state.eventTypeId, state.selectedPackageId]);

  if (groups === null) {
    return <LoadingState label="Loading venues..." />;
  }

  if (groups.length === 0 || items.length === 0) {
    return (
      <EmptyState title="Venue catalog not available yet" description="Our venue options for this event type are still being added." />
    );
  }

  const group = groups[0];
  const packageLimitByGroup = new Map(packageLimits.map((pl) => [pl.groupId, pl]));
  const locked = isGroupLocked(state, group, packageLimitByGroup.get(group.id));
  const upgradeTargetPackage = pendingUpgrade ? allPackages.find((p) => p.packageLevel === pendingUpgrade.packageLevel) : null;

  const handleSelect = (item: CatalogItem) => {
    if (state.cart[item.id]) {
      onRemoveFromCart(item.id);
      return;
    }

    if (isGatedByPackage(item.packageLevel, currentPackage?.packageLevel ?? null)) {
      setPendingUpgrade(item);
      return;
    }

    const decision = canAddToGroup(state, group, packageLimitByGroup.get(group.id));
    if (decision.allowed) {
      onAddToCart(item);
    } else {
      setPendingReplace(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 5: Venue</h2>
        <p className="text-xs text-maroon-700/80">
          Select the venue for your event. Premium venues may require a package upgrade.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const isSelected = !!state.cart[item.id];
          const metadata = item.metadata as { capacity?: number; location?: string; facilities?: string[] };
          return (
            <GlassCard key={item.id} variant={isSelected ? 'warm' : 'light'} className="flex flex-col justify-between space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden mb-2">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gold-50 text-gold-700/70">
                    <ImageOff className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Photo coming soon</span>
                  </div>
                )}
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-playfair text-lg font-bold text-maroon-900">{item.name}</h3>
                  <PackageLevelBadge level={item.packageLevel} />
                </div>
                <p className="text-xs text-maroon-700/80 mb-2">{item.description}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-maroon-700 mb-2">
                  {metadata.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {metadata.location}</span>
                  )}
                  {metadata.capacity && (
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to {metadata.capacity} guests</span>
                  )}
                </div>
                {metadata.facilities && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {metadata.facilities.map((f) => (
                      <span key={f} className="text-[10px] bg-gold-50 border border-gold-200 text-maroon-800 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm font-bold text-maroon-900">{formatCurrency(item.price)} <span className="text-[11px] font-normal text-maroon-700/70">/ {item.unit}</span></p>
              </div>
              <GoldButton
                size="sm"
                variant={isSelected ? 'dark' : 'gold'}
                onClick={() => handleSelect(item)}
                disabled={locked && !isSelected}
                fullWidth
              >
                {isSelected ? 'Remove' : locked ? 'Limit Reached' : 'Select This Venue'}
              </GoldButton>
            </GlassCard>
          );
        })}
      </div>

      {pendingReplace && (
        <ReplaceSelectionModal
          groupName={group.name}
          pendingItemName={pendingReplace.name}
          selectedLines={getLinesByGroup(state, group.id)}
          onReplace={(lineIdToRemove) => {
            onReplace(lineIdToRemove, pendingReplace);
            setPendingReplace(null);
          }}
          onCancel={() => setPendingReplace(null)}
        />
      )}

      {pendingUpgrade && (
        <PackageUpgradeModal
          itemName={pendingUpgrade.name}
          requiredLevel={pendingUpgrade.packageLevel}
          requiredLevelName={PACKAGE_LEVEL_NAMES[pendingUpgrade.packageLevel]}
          onUpgrade={() => {
            if (upgradeTargetPackage) onSelectPackage(upgradeTargetPackage.id);
            setPendingUpgrade(null);
          }}
          onAddAsPaidExtra={() => {
            onAddToCart(pendingUpgrade);
            setPendingUpgrade(null);
          }}
          onContactVendor={() => {
            window.open(SITE.phoneHref, '_blank');
            setPendingUpgrade(null);
          }}
          onCancel={() => setPendingUpgrade(null)}
        />
      )}
    </div>
  );
}
