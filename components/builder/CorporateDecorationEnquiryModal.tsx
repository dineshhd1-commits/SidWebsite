'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { AlertCircle, Building2, CheckCircle2, X } from 'lucide-react';
import { GoldButton } from '@/components/ui/gold-button';
import { getCorporateDecorationEnquiryWhatsAppUrl } from '@/lib/whatsapp';
import { saveCorporateDecorationEnquiry } from '@/lib/store/admin-store';
import { SITE } from '@/lib/site-config';
import { CorporateDecorationEnquiryDetails } from '@/lib/builder/corporate-decoration-enquiry';
import { MAX_GUEST_COUNT } from '@/lib/builder/validation';

const CORPORATE_EVENT_TYPES = [
  'Conference / Seminar',
  'Product Launch',
  'Annual Day / Awards Ceremony',
  'Team Outing / Offsite',
  'Client Meet / Networking Event',
  'Office Inauguration',
  'Other',
];

interface CorporateDecorationEnquiryModalProps {
  eventTypeId: string;
  eventTypeLabel: string;
  /** Decoration option names the customer already checked before opening
   * this modal (e.g. clicking the section-level "Enquire Now"), or a single
   * option when opened from a row's own "Enquire Now" button. */
  selectedOptions: string[];
  prefill: { name: string; phone: string; email: string; date: string; location: string; guestCount: number };
  onClose: () => void;
}

/** Decoration is enquiry-only for these event types: this form never touches
 * state.cart/addToCart - submitting calls the same real backend the rest of
 * the site uses (Supabase `quotations` row for the admin CRM + a WhatsApp
 * deep link to the configured owner number), then shows an in-modal
 * confirmation with a reference number. Nothing here is a fake/mock
 * notification. Company Name / Corporate Event Type only render for
 * Corporate Event itself - every other event type gets a simpler form. */
export function CorporateDecorationEnquiryModal({ eventTypeId, eventTypeLabel, selectedOptions, prefill, onClose }: CorporateDecorationEnquiryModalProps) {
  const isCorporate = eventTypeId === 'corporate_event';
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    customerName: prefill.name,
    phone: prefill.phone,
    email: prefill.email,
    companyName: '',
    corporateEventType: CORPORATE_EVENT_TYPES[0],
    eventDate: prefill.date,
    location: prefill.location,
    guestCount: prefill.guestCount ? String(prefill.guestCount) : '',
    message: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.customerName.trim()) errs.push('Please enter your name.');
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.push('Please enter a valid 10-digit phone number.');
    if (isCorporate && !form.companyName.trim()) errs.push('Please enter your company name.');
    if (!form.eventDate) errs.push('Please choose an event date.');
    if (!form.location.trim()) errs.push('Please enter the event location.');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guards against a double-click or a second Enter firing a duplicate
    // enquiry once the first one has already gone through.
    if (isSubmitting || hasSubmitted) return;
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setIsSubmitting(true);

    const code = `CDE-${Math.floor(1000 + Math.random() * 9000)}`;
    const details: CorporateDecorationEnquiryDetails = {
      eventTypeId,
      eventTypeLabel,
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      companyName: isCorporate ? form.companyName : '',
      corporateEventType: isCorporate ? form.corporateEventType : '',
      eventDate: form.eventDate,
      location: form.location,
      guestCount: form.guestCount,
      message: form.message,
      selectedOptions,
    };

    const { savedToBackend } = await saveCorporateDecorationEnquiry(details, code);
    if (!savedToBackend) {
      // The admin CRM record didn't save - don't silently pretend this
      // reached the owner. WhatsApp (opened below) still gets it to them
      // even if the database write failed, matching the main booking flow's
      // fallback behaviour.
      console.warn('Decoration enquiry was not saved to the admin CRM backend; relying on WhatsApp notification only.');
    }

    const waUrl = getCorporateDecorationEnquiryWhatsAppUrl(details, code, SITE.whatsappNumber);
    window.open(waUrl, '_blank');

    setRefCode(code);
    setIsSubmitting(false);
    setHasSubmitted(true);
    confetti({ particleCount: 80, spread: 65, origin: { y: 0.5 } });
  };

  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-3xl border-2 border-gold-400 shadow-2xl overflow-hidden transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {hasSubmitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-600 border-4 border-gold-400 text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-2xl font-bold text-maroon-900">Enquiry Received!</h3>
              <p className="text-sm text-maroon-700/80">
                Your decoration enquiry has been sent. Our concerned representative will contact you shortly to discuss your requirements and pricing.
              </p>
            </div>
            <div className="bg-gold-50 border border-gold-300 rounded-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-xs font-bold text-maroon-900">Reference Number</span>
              <span className="font-bold text-maroon-900 bg-gold-200 px-3 py-0.5 rounded border border-gold-400">{refCode}</span>
            </div>
            <GoldButton fullWidth variant="dark" onClick={handleClose}>
              Close
            </GoldButton>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gold-200 bg-gold-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-maroon-800 text-gold-300 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-maroon-900">{eventTypeLabel} Decoration Enquiry</h3>
                  <p className="text-[11px] text-maroon-700/70">We&apos;ll get back to you with custom pricing.</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-maroon-700 bg-white p-2 rounded-full border border-gold-300 hover:bg-gold-100 shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
              {selectedOptions.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gold-700 mb-1.5">Enquiring About</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOptions.map((name) => (
                      <span
                        key={name}
                        className="text-xs font-bold text-maroon-900 bg-gold-100 border border-gold-300 rounded-full px-3 py-1"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <ul className="space-y-1">
                    {errors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form id="corporate-decoration-enquiry-form" onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">
                      Your Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                </div>

                <div className={`grid grid-cols-1 gap-3.5 ${isCorporate ? 'sm:grid-cols-2' : ''}`}>
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  {isCorporate && (
                    <div>
                      <label className="block text-xs font-bold text-maroon-900 mb-1">
                        Company Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Technologies"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                      />
                    </div>
                  )}
                </div>

                {isCorporate && (
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">Corporate Event Type</label>
                    <select
                      value={form.corporateEventType}
                      onChange={(e) => setForm({ ...form, corporateEventType: e.target.value })}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    >
                      {CORPORATE_EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">
                      Event Date <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-900 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      min={0}
                      max={MAX_GUEST_COUNT}
                      inputMode="numeric"
                      placeholder="e.g. 150"
                      value={form.guestCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setForm({
                          ...form,
                          guestCount: isNaN(val) ? '' : String(Math.max(0, Math.min(MAX_GUEST_COUNT, val))),
                        });
                      }}
                      className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">
                    Event Location <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Taj West End, Bengaluru"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Decoration Requirements / Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us the decoration style, theme, branding requirements, budget range, or anything else we should know..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>
              </form>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-gold-200 bg-gold-50/40">
              <p className="text-[10px] text-maroon-700/70 mb-2.5">
                This is an enquiry only - nothing is added to your package, and no pricing is charged now.
              </p>
              <GoldButton
                type="submit"
                form="corporate-decoration-enquiry-form"
                fullWidth
                variant="copper"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Enquiry...' : 'Enquire Now'}
              </GoldButton>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
