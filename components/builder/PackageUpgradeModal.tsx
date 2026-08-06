'use client';

import React from 'react';
import { X, ArrowUpCircle } from 'lucide-react';
import { PackageLevelBadge } from './PackageLevelBadge';
import { GoldButton } from '../ui/gold-button';
import { PackageLevelId } from '@/lib/types/catalog';

interface PackageUpgradeModalProps {
  itemName: string;
  requiredLevel: PackageLevelId;
  requiredLevelName: string;
  onUpgrade: () => void;
  onAddAsPaidExtra: () => void;
  onContactVendor: () => void;
  onCancel: () => void;
}

export function PackageUpgradeModal({
  itemName,
  requiredLevel,
  requiredLevelName,
  onUpgrade,
  onAddAsPaidExtra,
  onContactVendor,
  onCancel,
}: PackageUpgradeModalProps) {
  return (
    <div onClick={onCancel} className="fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-gold-400 shadow-2xl space-y-5">
        <button onClick={onCancel} className="absolute top-4 right-4 text-maroon-700 hover:text-maroon-900" aria-label="Cancel">
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center">
          <ArrowUpCircle className="w-10 h-10 text-gold-600" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">Package Upgrade Needed</h3>
          <p className="text-xs text-maroon-700/80">
            <strong>{itemName}</strong> is included in the <PackageLevelBadge level={requiredLevel} className="mx-1" /> Package.
          </p>
        </div>

        <div className="space-y-2">
          <GoldButton variant="gold" size="sm" fullWidth onClick={onUpgrade}>
            Upgrade to {requiredLevelName}
          </GoldButton>
          <GoldButton variant="outline" size="sm" fullWidth onClick={onAddAsPaidExtra}>
            Add as Paid Extra Instead
          </GoldButton>
          <GoldButton variant="dark" size="sm" fullWidth onClick={onContactVendor}>
            Contact Vendor
          </GoldButton>
          <button onClick={onCancel} className="w-full text-center text-xs text-maroon-700/70 hover:text-maroon-900 py-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
