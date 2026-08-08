'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, MessageCircle, Sparkles } from 'lucide-react';
import { SITE, getWhatsAppUrl } from '@/lib/site-config';

import { saveAdminInquiry } from '@/lib/store/admin-store';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    fullName: '',
    phone: '',
    notes: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    saveAdminInquiry({
      fullName: contactData.fullName,
      phone: contactData.phone,
      weddingDate: '',
      notes: contactData.notes,
    });

    const message = `
 Namaste! New General Inquiry for *SID Events*.

 *Name:* ${contactData.fullName}
 *Phone:* ${contactData.phone}
 ${contactData.notes ? `*Message:* ${contactData.notes}` : ''}
    `.trim();

    const waUrl = getWhatsAppUrl(message);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* General Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="space-y-6">
            <h3 className="font-playfair text-xl font-bold text-maroon-900 border-b border-gold-300 pb-3">
              General Questions
            </h3>
            <p className="text-xs text-maroon-700/70 -mt-3">
              For a specific event package or quote, use the custom builder above - it sends us your full selections. Use this form for anything else.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-center space-y-2">
                <h4 className="font-bold text-lg">Thank You! Message Received.</h4>
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
                    onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-maroon-900 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    placeholder="What would you like to know?"
                    value={contactData.notes}
                    onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                    className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 transition-all duration-200 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
                  ></textarea>
                </div>

                <GoldButton fullWidth variant="copper" icon={<Send className="w-4 h-4" />}>
                  Send Message
                </GoldButton>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-gold-400">
            <Image src="/Sid3.png" alt="SID Events studio storefront in Davanagere" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>

          <GlassCard variant="dark" className="border-2 border-gold-400 space-y-6">
            <h3 className="font-playfair text-xl font-bold text-gold-300 border-b border-gold-400/40 pb-3">
              Studio Location & Helpline
            </h3>

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
                  <span className="font-bold text-gold-300 block">Event Hotline</span>
                  <a href={SITE.phoneHref} className="hover:underline">{SITE.phoneDisplay}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-bold text-gold-300 block">Email Us</span>
                  <a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a>
                </div>
              </div>
            </div>

            <TraditionalBorder />

            <a
              href={getWhatsAppUrl('Hi! I would like to book a consultation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <GoldButton fullWidth variant="copper" icon={<MessageCircle className="w-4 h-4" />}>
                Instant WhatsApp Chat
              </GoldButton>
            </a>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
