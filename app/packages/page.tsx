'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { GoldButton } from '@/components/ui/gold-button';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { PackageLevelBadge } from '@/components/builder/PackageLevelBadge';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { getCatalogItems, getPackageDefinitions, getPackageIncludedItems } from '@/lib/data/catalog';
import { CatalogItem, PackageDefinition } from '@/lib/types/catalog';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

interface PackageWithBreakdown extends PackageDefinition {
  breakdown: Record<string, string[]>;
}

export default function PackagesPage() {
  const [showComparison, setShowComparison] = useState(false);
  const [packages, setPackages] = useState<PackageWithBreakdown[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [defs, allItems] = await Promise.all([getPackageDefinitions('wedding'), getCatalogItems('wedding')]);
      const itemsById = new Map<string, CatalogItem>(allItems.map((i) => [i.id, i]));

      const withBreakdown: PackageWithBreakdown[] = await Promise.all(
        defs.map(async (def) => {
          const included = await getPackageIncludedItems(def.id);
          const breakdown: Record<string, string[]> = {};
          for (const inc of included) {
            const item = itemsById.get(inc.catalogItemId);
            if (!item) continue;
            const label = CATEGORY_LABELS[item.categoryKey] || item.categoryKey;
            breakdown[label] = [...(breakdown[label] || []), item.name];
          }
          return { ...def, breakdown };
        })
      );

      if (!cancelled) setPackages(withBreakdown);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const comparisonMatrix = [
    { feature: 'Guest Capacity', values: (packages || []).map((p) => `${p.guestCapacity} guests`) },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
          Royal Tier Collections
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-maroon-900">
          Standard South Indian Packages
        </h1>
        <p className="text-maroon-700/80 text-sm sm:text-base leading-relaxed">
          Select an all-inclusive standard wedding package crafted for traditional elegance, or seamlessly load it into our custom builder to tailor every line item.
        </p>
        <TraditionalBorder />

        {packages && packages.length > 0 && (
          <div className="pt-2">
            <GoldButton
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              icon={showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            >
              {showComparison ? 'Hide Feature Matrix' : 'Compare Package Features'}
            </GoldButton>
          </div>
        )}
      </div>

      {/* Feature Comparison Matrix */}
      {showComparison && packages && packages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="bg-ivory border-2 border-gold-400 rounded-3xl p-6 shadow-xl overflow-x-auto"
        >
          <h3 className="font-playfair text-2xl font-bold text-maroon-900 mb-6 text-center">
            Detailed Feature Comparison Matrix
          </h3>
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-gold-400 bg-maroon-800 text-gold-300">
                <th className="p-4 font-bold">Feature</th>
                {packages.map((p) => (
                  <th key={p.id} className="p-4 font-bold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="border-b border-gold-200/60 hover:bg-gold-50/60 transition-colors">
                  <td className="p-4 font-bold text-maroon-900">{row.feature}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-4 text-maroon-800">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Packages Grid */}
      {packages === null ? (
        <LoadingState label="Loading packages..." />
      ) : packages.length === 0 ? (
        <EmptyState
          title="Packages not available yet"
          description="Our standard package catalog is being set up. Use the custom builder to plan your event in the meantime."
          actionLabel="Open Custom Builder"
          onAction={() => (window.location.href = '/custom-builder')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg) => (
            <GlassCard
              key={pkg.id}
              variant={pkg.isPopular ? 'warm' : 'light'}
              className="flex flex-col justify-between space-y-6 relative"
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 right-6 bg-maroon-700 text-gold-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gold-400">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PackageLevelBadge level={pkg.packageLevel} />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-maroon-900">{pkg.name}</h3>
                <p className="text-xs text-maroon-700/80 mb-4">{pkg.description}</p>

                <div className="bg-maroon-900 text-ivory p-4 rounded-xl mb-6 border border-gold-400/40">
                  <span className="text-[11px] text-gold-300 uppercase block font-semibold">Guest Capacity</span>
                  <span className="text-2xl font-bold font-heading text-gold-400">Up to {pkg.guestCapacity}</span>
                  <span className="text-[11px] text-gold-200/70 block mt-0.5">Pricing confirmed after enquiry</span>
                </div>

                {Object.keys(pkg.breakdown).length > 0 && (
                  <div className="space-y-2 mb-6 text-xs text-maroon-900 bg-gold-50/70 p-4 rounded-xl border border-gold-200">
                    <div className="border-b border-gold-200/60 pb-1 font-bold text-maroon-950 uppercase text-[10px] tracking-wider">
                      Included Services:
                    </div>
                    {Object.entries(pkg.breakdown).map(([category, names]) => (
                      <div key={category}>
                        <strong className="text-gold-800 font-semibold">{category}:</strong> {names.join(', ')}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gold-300/40">
                <Link href={`/custom-builder?package=${pkg.id}`}>
                  <GoldButton fullWidth variant={pkg.isPopular ? 'copper' : 'dark'} size="sm">
                    Select This Package
                  </GoldButton>
                </Link>
                <Link href={`/custom-builder?package=${pkg.id}`}>
                  <button className="w-full text-center text-xs font-bold text-gold-700 hover:text-maroon-900 py-1 transition-colors">
                    Customize This Package →
                  </button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
