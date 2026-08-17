'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEventBuilder } from '@/lib/store/event-builder-context';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { AlertCircle, ShieldCheck } from 'lucide-react';

import { getWhatsAppBookingRequestUrl } from '@/lib/whatsapp';
import { saveAdminQuote } from '@/lib/store/admin-store';
import { SITE } from '@/lib/site-config';
import { getCartLines, getEstimatedTotal } from '@/lib/builder/selectors';
import { buildEnquiryDetails, mergeBookingFormIntoState } from '@/lib/builder/enquiry';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

export default function BookingPage() {
  const router = useRouter();
  const { state, resetBuilder } = useEventBuilder();
  const cartLines = getCartLines(state);
  const estimatedTotal = getEstimatedTotal(state);

  const [formData, setFormData] = useState(() => ({
    fullName: state.eventDetails.customerName,
    email: state.eventDetails.customerEmail,
    phone: state.eventDetails.customerPhone,
    weddingDate: state.eventDetails.date,
    venueCity: state.eventDetails.location || 'Davanagere',
    venueAddress: '',
    notes: state.eventDetails.specialRequirements,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Guards against a second submit (double-click, back-button, etc.) firing
  // a duplicate enquiry once the first one has already gone through.
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [friendlyErrors, setFriendlyErrors] = useState<string[]>([]);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.fullName.trim()) errors.push('We still need your name before submitting your enquiry.');
    if (!/^\d{10}$/.test(formData.phone.trim())) errors.push('We still need a valid 10-digit phone number before submitting your enquiry.');
    if (!formData.weddingDate) errors.push('Please choose a valid event date.');
    return errors;
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || hasSubmitted) return;
    const errors = validate();
    if (errors.length > 0) {
      setFriendlyErrors(errors);
      return;
    }
    setFriendlyErrors([]);
    setIsSubmitting(true);

    const refCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Single source of truth for "everything the customer selected" - same
    // structure used for the owner's WhatsApp notification and the admin
    // CRM record, built dynamically from whatever categories/items are
    // actually in the cart right now (nothing category-specific hard-coded).
    const mergedState = mergeBookingFormIntoState(state, formData);
    const fullDetails = buildEnquiryDetails(mergedState);
    const categorySummary = Array.from(new Set(fullDetails.sections.map((s) => s.label))).join(', ') || 'custom';

    const { savedToBackend } = await saveAdminQuote({
      refCode,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      weddingDate: formData.weddingDate,
      venueCity: formData.venueCity,
      venueAddress: formData.venueAddress,
      guestCount: state.eventDetails.guestCount,
      cateringTier: categorySummary,
      photographyTier: fullDetails.eventTypeLabel,
      purohitTier: state.selectedPackageId || 'custom',
      selectedServicesCount: fullDetails.totalSelectionsCount,
      estimatedCost: estimatedTotal,
      notes: formData.notes,
      fullDetails,
    });

    if (!savedToBackend) {
      // The admin CRM record didn't save - don't silently pretend this
      // reached the owner. WhatsApp (opened below) is the fallback channel
      // that still gets it to them even if the database write failed.
      console.warn('Enquiry was not saved to the admin CRM backend; relying on WhatsApp notification only.');
    }

    const waUrl = getWhatsAppBookingRequestUrl(formData, state, refCode, SITE.whatsappNumber);

    setHasSubmitted(true);
    setIsSubmitting(false);
    window.open(waUrl, '_blank');
    // Reset the whole builder (cart, catering picks, event details) only now
    // that submission has actually succeeded, so re-visiting the builder
    // starts a fresh request instead of re-showing an already-sent one.
    resetBuilder();
    router.push(`/request-received?ref=${refCode}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
          Request A Quote
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          Send Us Your Event Details
        </h1>
        <p className="text-maroon-700/80 text-sm max-w-xl mx-auto">
          No payment or fixed price here &mdash; share your details and our team will follow up with a custom quote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Customer Details Form (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="space-y-6">
            <h3 className="font-playfair text-xl font-bold text-maroon-900 border-b border-gold-300 pb-3">
              Event & Customer Contact Information
            </h3>

            {friendlyErrors.length > 0 && (
              <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <ul className="space-y-1">
                  {friendlyErrors.map((err) => <li key={err}>{err}</li>)}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold text-maroon-900 mb-1">Full Name <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Hegde"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Phone Number <span className="text-rose-600">*</span></label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="aditya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Event Date <span className="text-rose-600">*</span></label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Venue City</label>
                  <select
                    value={formData.venueCity}
                    onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  >
                    <option value="Davanagere">Davanagere</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Hubballi">Hubballi</option>
                    <option value="Chitradurga">Chitradurga</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon-900 mb-1">Venue Address / Hall Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kamana Bhavana, PJ Extension"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon-900 mb-1">Anything Else We Should Know?</label>
                <textarea
                  rows={4}
                  placeholder="Special requests, themes, or questions about your package..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                />
              </div>

              <div className="pt-2">
                <GoldButton fullWidth variant="copper" size="lg" disabled={isSubmitting || hasSubmitted}>
                  {isSubmitting ? 'Submitting...' : hasSubmitted ? 'Request Sent' : 'Submit Event Request'}
                </GoldButton>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Selections Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard variant="dark" className="border-2 border-gold-400 space-y-6">
            <h3 className="font-playfair text-lg font-bold text-gold-300 border-b border-gold-400/40 pb-3">
              Your Custom Package Selections
            </h3>

            <div className="space-y-2 text-xs text-gold-100/90">
              <div className="flex justify-between">
                <span>Guest Count:</span>
                <span className="font-bold">{state.eventDetails.guestCount} guests</span>
              </div>
              {cartLines.length === 0 ? (
                <p className="text-gold-200/70 py-2">No selections yet - you can still send this request and add details on a call.</p>
              ) : (
                cartLines.map((line) => (
                  <div key={line.id} className="flex justify-between">
                    <span>{CATEGORY_LABELS[line.categoryKey] || line.categoryKey}:</span>
                    <span className="font-bold">{line.name}{line.quantity > 1 ? ` x${line.quantity}` : ''}</span>
                  </div>
                ))
              )}
            </div>

            <div className="bg-maroon-950 p-4 rounded-xl border border-gold-400/30 space-y-2 text-[11px] text-gold-200">
              <div className="flex items-center gap-2 font-bold text-gold-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Payment Required
              </div>
              <p>This is a quote request, not a checkout. Our team will reach out with pricing based on what you&apos;ve selected.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
