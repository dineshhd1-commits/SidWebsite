'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { TraditionalBorder } from '../ui/traditional-border';
import { BrandMark } from '../ui/brand-mark';
import { SITE } from '@/lib/site-config';
import { MOCK_EVENT_TYPES } from '@/lib/data/mock-catalog-data';

// Derived from the canonical event-type list rather than hardcoded, so the
// footer can't drift out of sync with the events actually offered in the
// builder the way it had (it used to list Destination Weddings, Photography &
// Videography and Maternity Photoshoot, none of which are event types, while
// missing eight that are).
const FOOTER_EVENT_TYPES = MOCK_EVENT_TYPES.filter((eventType) => eventType.active);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-maroon-950 text-silk-100 pt-12 sm:pt-16 pb-12 border-t-4 border-gold-400">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">

          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandMark className="w-14 h-14" />
              <span className="font-playfair font-bold text-xl tracking-wider gold-text-foil">
                SID Events
              </span>
            </div>
            <p className="text-xs text-silk-200/80 leading-relaxed font-sans font-light">
              Davanagere&apos;s premier event management company. Crafting extraordinary celebrations and creating timeless memories since {SITE.foundedYear}.
            </p>
            <div className="flex items-center gap-4 text-gold-400">
              <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold-200 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold-200 transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-gold-300 mb-4 border-b border-gold-400/20 pb-2 uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-silk-200/80 font-sans">
              {FOOTER_EVENT_TYPES.map((eventType) => (
                <li key={eventType.id}>
                  <Link href="/services" className="hover:text-gold-300 transition-colors">
                    {eventType.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-gold-300 mb-4 border-b border-gold-400/20 pb-2 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-silk-200/80 font-sans">
              <li><Link href="/packages" className="hover:text-gold-300 transition-colors">Events We Plan</Link></li>
              <li><Link href="/custom-builder" className="hover:text-gold-300 transition-colors">Custom Package Builder</Link></li>
              <li><Link href="/gallery" className="hover:text-gold-300 transition-colors">Gallery</Link></li>
              <li><Link href="/testimonials" className="hover:text-gold-300 transition-colors">Client Reviews</Link></li>
              <li><Link href="/about" className="hover:text-gold-300 transition-colors">About Us</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-gold-300 transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Details & Location Map */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold text-gold-300 border-b border-gold-400/20 pb-2 uppercase tracking-wider">
              Get in Touch & Location
            </h4>
            <ul className="space-y-3 text-xs text-silk-200/80 font-sans">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors leading-relaxed"
                >
                  {SITE.address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={SITE.phoneHref} className="hover:text-gold-300 transition-colors">{SITE.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-300 transition-colors">{SITE.email}</a>
              </li>
            </ul>

            {/* Embedded Interactive Google Map */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-gold-400/40 shadow-md relative group">
              <iframe
                title="SID Events Google Map Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent('S I D Events, 3434/1B1, 1st main, 6th Cross Road, MCC B Block, Davangere, Karnataka 577004')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-1 right-1 bg-maroon-950/90 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded border border-gold-400/50 hover:bg-gold-500 hover:text-maroon-950 transition-colors"
              >
                Open in Maps ↗
              </a>
            </div>
          </div>
        </div>

        <TraditionalBorder className="my-8 opacity-40" />

        <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-silk-200/70 gap-4 font-sans">
          <p>© {new Date().getFullYear()} {SITE.legalName}, Davanagere. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5 text-gold-300/90">
            <span>Designed &amp; Developed by</span>
            <a
              href="https://naazailabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 font-bold hover:text-white underline underline-offset-4 transition-colors"
            >
              naazailabs.com
            </a>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms-and-conditions" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
