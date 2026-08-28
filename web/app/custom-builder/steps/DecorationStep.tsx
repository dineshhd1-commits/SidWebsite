'use client';

import React, { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types/catalog';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getCatalogItems } from '@/lib/data/catalog';
import { CatalogChecklist } from '@/components/builder/CatalogChecklist';
import { CorporateDecorationSection } from '@/components/builder/CorporateDecorationSection';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { isDecorationEnquiryOnly } from '@/lib/builder/event-rules';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { Sparkles, ArrowRight, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DecorationStepProps {
  state: EventBuilderState;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CHECKLIST_GROUPS_BY_EVENT: Record<string, { id: string; label: string }[]> = {
  wedding: [
    { id: 'dec-home', label: 'House Decoration' },
    { id: 'dec-venue', label: 'Venue Decoration' },
    { id: 'dec-couple-entry', label: 'Couple Entry Concept' },
    { id: 'dec-security', label: 'Bouncers & Security' },
  ],
  engagement: [
    { id: 'dec-venue-engagement', label: 'Venue Decoration' },
    { id: 'dec-entry-engagement', label: 'Couple Entry Concept' },
    { id: 'dec-security', label: 'Bouncers & Security' },
  ],
  reception: [
    { id: 'dec-venue-reception', label: 'Venue Decoration' },
    { id: 'dec-entry-reception', label: 'Couple Entry Concept' },
    { id: 'dec-security', label: 'Bouncers & Security' },
  ],
  anniversary: [
    { id: 'dec-venue-anniversary', label: 'Venue Decoration' },
    { id: 'dec-security', label: 'Bouncers & Security' },
  ],
};

export function DecorationStep({ state, onAddToCart, onRemoveFromCart, onUpdateQuantity }: DecorationStepProps) {
  const router = useRouter();
  const eventTypeId = state.eventTypeId;
  const isEnquiryOnly = isDecorationEnquiryOnly(eventTypeId);
  const checklistGroups = eventTypeId ? CHECKLIST_GROUPS_BY_EVENT[eventTypeId] : undefined;
  const hasChecklist = !isEnquiryOnly && !!checklistGroups;

  // Track single active option displaying images across the entire tab
  const [activeExpandedItemId, setActiveExpandedItemId] = useState<string | null>(null);

  const [addonItems, setAddonItems] = useState<CatalogItem[] | null>(null);
  useEffect(() => {
    if (!hasChecklist || !eventTypeId) return;
    setAddonItems(null);
    const groupIds = checklistGroups!.map((g) => g.id);
    getCatalogItems(eventTypeId, 'decoration').then((items) => {
      setAddonItems(items.filter((i) => groupIds.includes(i.groupId || '')));
    });
  }, [eventTypeId, hasChecklist]);

  // Handle Birthday direct inquiry navigation
  const handleBirthdayInquiry = () => {
    const params = new URLSearchParams({
      event: 'birthday',
      service: 'decoration',
      name: state.eventDetails.customerName || '',
      phone: state.eventDetails.customerPhone || '',
      email: state.eventDetails.customerEmail || '',
      date: state.eventDetails.date || '',
      guests: state.eventDetails.guestCount ? String(state.eventDetails.guestCount) : '',
      location: state.eventDetails.location || '',
      notes: state.eventDetails.specialRequirements || 'Birthday decoration inquiry',
    });
    router.push(`/contact?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Step 2: Decoration</h2>
        <p className="text-xs text-maroon-700/80">
          {eventTypeId === 'birthday'
            ? 'Decoration for Birthday celebrations is bespoke and themed to your preference. Enquire directly for custom themes and quotes.'
            : isEnquiryOnly
            ? "Decoration for this celebration is fully customised. Tell us what you envision and we'll follow up with custom designs and pricing."
            : 'Select any decoration option below to view its specific designs and photos.'}
        </p>
      </div>

      {/* Birthday Specific Direct Inquiry Rule */}
      {eventTypeId === 'birthday' && (
        <GlassCard variant="warm" className="p-6 sm:p-8 text-center space-y-5 border-2 border-gold-400">
          <div className="w-12 h-12 rounded-full bg-gold-200 text-maroon-900 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6 text-maroon-900" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900">
              Custom Birthday Themes &amp; Décor
            </h3>
            <p className="text-sm text-maroon-800/85 leading-relaxed">
              Every birthday celebration is unique &mdash; from jungle and fairytale themes to balloon arches and LED backdrop setups. Share your ideas with our creative team for a personalized design proposal and quotation.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GoldButton size="lg" onClick={handleBirthdayInquiry} className="w-full sm:w-auto">
              Enquire For Birthday Décor <ArrowRight className="w-4 h-4 ml-1.5" />
            </GoldButton>
          </div>
        </GlassCard>
      )}

      {/* Other Enquiry-Only Events (Corporate, Get Together, etc.) */}
      {isEnquiryOnly && eventTypeId !== 'birthday' && (
        <CorporateDecorationSection state={state} />
      )}

      {/* Checklist-based Decoration with Option-controlled Images */}
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
              const selectedImageUrls = Object.fromEntries(
                groupItems.filter((i) => state.cart[i.id]).map((i) => [i.id, state.cart[i.id].imageUrl])
              );
              const quantities = Object.fromEntries(groupItems.map((i) => [i.id, state.cart[i.id]?.quantity ?? 1]));
              return (
                <div key={groupId} className="space-y-3">
                  <h3 className="font-playfair text-lg font-bold text-maroon-900">{label}</h3>
                  <CatalogChecklist
                    items={groupItems}
                    selectedIds={selectedIds}
                    selectedImageUrls={selectedImageUrls}
                    quantities={quantities}
                    activeExpandedItemId={activeExpandedItemId}
                    setActiveExpandedItemId={setActiveExpandedItemId}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
