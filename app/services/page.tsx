'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, Camera, UtensilsCrossed, Sparkles, Flame, Music, ArrowRight } from 'lucide-react';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { GoldButton } from '@/components/ui/gold-button';
import { BUSINESS_OFFERINGS, BusinessOffering } from '@/lib/mock-data';
import { getWhatsAppUrl, SITE } from '@/lib/site-config';

/** Genuine, factual answers to what customers actually ask before enquiring
 * - written for both human readers and AI answer engines (ChatGPT Search,
 * Perplexity, etc.) to quote directly. Kept in sync with what the rest of
 * the site actually offers; nothing here is invented for search purposes. */
const SERVICE_FAQS = [
  {
    question: 'What services does SID Events provide?',
    answer:
      'SID Events plans and manages weddings, engagements, receptions, traditional home functions (Haldi, Shrimanthakarya, Half-Saree Function, Housewarming) and corporate events, including decoration, photography, videography and catering.',
  },
  {
    question: 'Where is SID Events based, and which areas do you serve?',
    answer: `SID Events is based in ${SITE.city}, ${SITE.state}, and serves events across ${SITE.city} and the surrounding ${SITE.state} region.`,
  },
  {
    question: 'Do you provide wedding decoration?',
    answer:
      'Yes - stage decoration, venue decoration, home decoration and couple entry concepts are all part of our wedding decoration service, using our own photo gallery to help customers pick a look.',
  },
  {
    question: 'Do you provide catering?',
    answer:
      'Yes. Catering is organized by meal (morning, afternoon and evening menus) with categories such as welcome drinks, starters, main course, rice and desserts that customers select from directly while planning their event.',
  },
  {
    question: 'Do you provide wedding photography and pre-wedding shoots?',
    answer:
      'Yes - traditional and candid photography and videography, drone coverage where applicable, and dedicated pre-wedding shoot packages are available.',
  },
  {
    question: 'Do you handle corporate events?',
    answer: 'Yes, alongside weddings and traditional functions, SID Events also plans and decorates corporate events.',
  },
  {
    question: 'How can I request a quotation?',
    answer:
      'Use the custom package builder to select your event type, decoration, photography, catering and any additional services, then submit your details on the request-a-quote page - or contact us directly by phone or WhatsApp.',
  },
  {
    question: 'Can I customize my event package?',
    answer:
      'Yes - the custom package builder lets you pick your own combination of decoration, photography, catering and additional services rather than being limited to a fixed package.',
  },
];

const ICONS: Record<BusinessOffering['iconKey'], React.ReactNode> = {
  camera: <Camera className="w-10 h-10" />,
  palette: <Palette className="w-10 h-10" />,
  utensils: <UtensilsCrossed className="w-10 h-10" />,
  makeup: <Sparkles className="w-10 h-10" />,
  purohit: <Flame className="w-10 h-10" />,
  music: <Music className="w-10 h-10" />,
};

export default function ServicesPage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Full-Width Full-Screen Hero Banner Section */}
      <section className="relative w-full min-h-screen-dvh sm:min-h-[100dvh] flex items-center justify-center overflow-hidden border-b-2 border-gold-400/40 bg-maroon-950 pt-20 sm:pt-24">
        <Image
          src="/Sid1.jpg"
          alt="Dream. Plan. Create. Celebrate. - SID Events"
          fill
          sizes="100vw"
          className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/40 to-maroon-950/20" />

        <div className="relative z-10 text-center space-y-5 max-w-4xl mx-auto px-4 py-20">
          <span className="text-gold-300 font-bold text-xs uppercase tracking-widest bg-transparent px-5 py-2 rounded-full border border-gold-400/60 backdrop-blur-sm shadow-lg inline-block">
            What We Do
          </span>
          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-silk-50 drop-shadow-md">
            Our Services
          </h1>
          <p className="text-silk-100/90 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            From dream weddings to grand corporate experiences, we plan, design, and execute every occasion end to end.
          </p>
          <div className="pt-2">
            <TraditionalBorder />
          </div>
        </div>
      </section>

      {/* Main Services Grid & CTA Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <nav aria-label="Breadcrumb" className="text-xs font-bold text-maroon-700/70">
          <Link href="/" className="hover:text-gold-700 hover:underline">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-maroon-900">Services</span>
        </nav>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {BUSINESS_OFFERINGS.map((offering) => (
            <div
              key={offering.id}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-gold-50">
                {offering.imageUrl ? (
                  <Image src={offering.imageUrl} alt={offering.title} fill sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-contain object-center" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gold-100 border-b border-gold-200 text-gold-700/70">
                    {ICONS[offering.iconKey]}
                  </div>
                )}
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-maroon-900">{offering.title}</h3>
                  <p className="text-xs text-maroon-700/80 leading-relaxed mt-1">{offering.description}</p>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-maroon-900 mt-4">
                  Enquire About This <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-maroon-950 rounded-3xl p-10 text-center space-y-5 border border-gold-400/30">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-silk-50">
            Planning a wedding specifically? Try our live package builder.
          </h2>
          <p className="text-sm text-gold-100/80 max-w-xl mx-auto">
            Build a custom South Indian wedding package step by step and request a detailed quote from our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/custom-builder">
              <GoldButton variant="gold" size="md">Build Your Wedding Package</GoldButton>
            </Link>
            <a href={getWhatsAppUrl('Hi! I would like to enquire about your services.')} target="_blank" rel="noopener noreferrer">
              <GoldButton variant="dark" size="md">Chat on WhatsApp</GoldButton>
            </a>
          </div>
        </div>

        {/* FAQ - answers the questions customers (and AI search assistants
            summarizing this page) actually ask before enquiring. */}
        <div className="space-y-6">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
            {SERVICE_FAQS.map((faq) => (
              <div key={faq.question} className="bg-white rounded-2xl p-5 shadow-sm border border-gold-200">
                <h3 className="font-playfair text-base font-bold text-maroon-900">{faq.question}</h3>
                <p className="text-sm text-maroon-700/85 leading-relaxed mt-1.5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related pages - keeps every important page reachable through a
            crawlable link and gives readers (human and AI) a clear next step. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-gold-700">
          <Link href="/packages" className="hover:text-maroon-900 hover:underline">Wedding & Event Packages</Link>
          <Link href="/gallery" className="hover:text-maroon-900 hover:underline">Decoration Gallery</Link>
          <Link href="/testimonials" className="hover:text-maroon-900 hover:underline">Client Reviews</Link>
          <Link href="/about" className="hover:text-maroon-900 hover:underline">About SID Events</Link>
          <Link href="/contact" className="hover:text-maroon-900 hover:underline">Contact Us</Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: SERVICE_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.siteUrl}/` },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.siteUrl}/services` },
            ],
          }),
        }}
      />
    </div>
  );
}
