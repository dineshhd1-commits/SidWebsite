'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, MessageCircle, Sparkles } from 'lucide-react';
import { SITE, getWhatsAppUrl } from '@/lib/site-config';
import { isAlphaSpaceOnly, sanitizeAlphaInput } from '@/lib/text-validation';
import { saveAdminInquiry } from '@/lib/store/admin-store';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [contactData, setContactData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: '',
    anniversaryType: '',
    guestCount: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    if (!searchParams) return;
    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';
    const email = searchParams.get('email') || '';
    const date = searchParams.get('date') || '';
    const event = searchParams.get('event') || '';
    const annType = searchParams.get('anniversaryType') || '';
    const guests = searchParams.get('guests') || '';
    const location = searchParams.get('location') || '';
    const notes = searchParams.get('notes') || '';
    const service = searchParams.get('service') || '';

    let initialNotes = notes;
    if (annType && !initialNotes.includes(annType)) {
      initialNotes = `Inquiry for ${annType} celebration.\n${initialNotes}`.trim();
    } else if (event === 'birthday' && service === 'decoration') {
      initialNotes = `Bespoke Birthday Decoration Inquiry.\n${initialNotes}`.trim();
    }

    setContactData((prev) => ({
      ...prev,
      fullName: name || prev.fullName,
      phone: phone || prev.phone,
      email: email || prev.email,
      eventDate: date || prev.eventDate,
      eventType: event || prev.eventType,
      anniversaryType: annType || prev.anniversaryType,
      guestCount: guests || prev.guestCount,
      location: location || prev.location,
      notes: initialNotes || prev.notes,
    }));
  }, [searchParams]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = contactData.fullName.trim();
    if (!trimmedName || !isAlphaSpaceOnly(trimmedName)) {
      setNameError('Please enter your name using letters only.');
      return;
    }
    setNameError(null);
    setSubmitted(true);

    saveAdminInquiry({
      fullName: contactData.fullName,
      phone: contactData.phone,
      weddingDate: contactData.eventDate,
      notes: `${contactData.anniversaryType ? `[${contactData.anniversaryType}] ` : ''}${contactData.notes}`,
    });

    const lines = [
      ` Namaste! New Inquiry for *SID Events*.`,
      ``,
      ` *Name:* ${contactData.fullName}`,
      ` *Phone:* ${contactData.phone}`,
    ];

    if (contactData.eventType) {
      lines.push(` *Event Type:* ${contactData.eventType.toUpperCase()}`);
    }
    if (contactData.anniversaryType) {
      lines.push(` *Anniversary Type:* ${contactData.anniversaryType}`);
    }
    if (contactData.eventDate) {
      lines.push(` *Date:* ${contactData.eventDate}`);
    }
    if (contactData.guestCount) {
      lines.push(` *Guests:* ${contactData.guestCount}`);
    }
    if (contactData.location) {
      lines.push(` *Location:* ${contactData.location}`);
    }
    if (contactData.notes) {
      lines.push(` *Message / Requirements:* ${contactData.notes}`);
    }

    const message = lines.join('\n').trim();
    const waUrl = getWhatsAppUrl(message);
    window.open(waUrl, '_blank');
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* General Contact Form (7 cols) */}
      <div className="lg:col-span-7">
        <GlassCard className="space-y-6">
          <h2 className="font-playfair text-xl font-bold text-maroon-900 border-b border-gold-300 pb-3">
            {contactData.anniversaryType
              ? `${contactData.anniversaryType} Inquiry`
              : contactData.eventType === 'birthday'
              ? 'Birthday Celebration Inquiry'
              : 'Direct Event Inquiry & Consultation'}
          </h2>
          <p className="text-xs text-maroon-700/70 -mt-3">
            {contactData.anniversaryType
              ? `We have received your basic event details for ${contactData.anniversaryType}. Fill in any additional notes below to consult with our specialist team.`
              : 'For a specific event package or quote, use the custom builder - or submit your requirements below for direct consultation.'}
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-center space-y-2">
              <h3 className="font-bold text-lg">Thank You! Message Received.</h3>
              <p className="text-xs">Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-maroon-900 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soundarya"
                  value={contactData.fullName}
                  onChange={(e) => {
                    setContactData({ ...contactData, fullName: sanitizeAlphaInput(e.target.value) });
                    if (nameError) setNameError(null);
                  }}
                  aria-invalid={!!nameError}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    nameError
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-400/30'
                      : 'border-gold-300 focus:border-gold-500 focus:ring-gold-400/30'
                  }`}
                />
                {nameError && <p className="text-[11px] text-rose-600 font-bold mt-1">{nameError}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={contactData.phone}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Event Date (if known)</label>
                  <input
                    type="date"
                    value={contactData.eventDate}
                    onChange={(e) => setContactData({ ...contactData, eventDate: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>
              </div>

              {contactData.anniversaryType && (
                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Anniversary Type</label>
                  <input
                    type="text"
                    readOnly
                    value={contactData.anniversaryType}
                    className="w-full bg-gold-50 border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-maroon-900 mb-1">Your Message / Requirements</label>
                <textarea
                  rows={4}
                  placeholder="What would you like to know or discuss with our team?"
                  value={contactData.notes}
                  onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                  className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                ></textarea>
              </div>

              <GoldButton fullWidth variant="copper" icon={<Send className="w-4 h-4" />}>
                Send Message &amp; Chat on WhatsApp
              </GoldButton>
            </form>
          )}
        </GlassCard>
      </div>

      {/* Contact Info (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="relative h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-gold-400">
          <Image
            src="/Sid3.jpg"
            alt="SID Events studio storefront in Davanagere"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>

        <GlassCard variant="dark" className="border-2 border-gold-400 space-y-6">
          <h2 className="font-playfair text-xl font-bold text-gold-300 border-b border-gold-400/40 pb-3">
            Studio Location &amp; Helpline
          </h2>

          <div className="space-y-4 text-xs text-gold-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gold-300 block">Davanagere Office</span>
                <span>{SITE.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <span className="font-bold text-gold-300 block">Phone Support</span>
                <a href={SITE.phoneHref} className="hover:text-gold-300 underline font-semibold">
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <span className="font-bold text-gold-300 block">Email Us</span>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-300 underline font-semibold">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gold-400/30">
            <a
              href={getWhatsAppUrl('Namaste! I would like to inquire about event services from SID Events.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp Directly
            </a>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default function ContactPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE.siteUrl}/contact` },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
          Get In Touch
        </span>
        <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-maroon-900">
          Connect with Our Event Consultants
        </h1>
        <p className="text-maroon-700/80 text-base">
          Already have an event in mind? Build your custom package first - it&apos;s the fastest way for us to help you.
        </p>
        <TraditionalBorder />

        <div className="pt-2">
          <Link href="/custom-builder">
            <GoldButton variant="gold" size="lg" icon={<Sparkles className="w-4 h-4" />}>
              Start Planning Your Event
            </GoldButton>
          </Link>
        </div>
      </section>

      <Suspense fallback={<div className="text-center py-10 text-maroon-800">Loading inquiry form...</div>}>
        <ContactFormInner />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
