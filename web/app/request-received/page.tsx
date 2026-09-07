'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { SITE } from '@/lib/site-config';
import type { LastBookingCookie } from '@/lib/cookies';

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function RequestReceivedContent() {
  const searchParams = useSearchParams();
  const rawParamRef = searchParams.get('ref');
  const [booking, setBooking] = useState<LastBookingCookie | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const rawRef = rawParamRef || booking?.refCode || 'BK-CONFIRMED';
  const refCode = rawRef.startsWith('#') ? rawRef : `#${rawRef}`;

  useEffect(() => {
    import('@/lib/cookies').then(({ getLastBookingCookie }) => {
      const b = getLastBookingCookie();
      setBooking(b);

      let resolvedUrl = b?.whatsappUrl || '';
      if (!resolvedUrl && typeof window !== 'undefined') {
        resolvedUrl =
          localStorage.getItem(`sid_whatsapp_url_${rawRef}`) ||
          localStorage.getItem('sid_last_whatsapp_url') ||
          '';
      }

      if (!resolvedUrl) {
        const lines = [
          '---------------------------------',
          '*EVENT BOOKING ENQUIRY - SID EVENTS*',
          '---------------------------------',
          `*Booking Reference:* ${refCode}`,
          b?.customerName ? `*Customer:* ${b.customerName}` : '',
          b?.customerPhone ? `*Phone:* ${b.customerPhone}` : '',
          b?.weddingDate ? `*Event Date:* ${b.weddingDate}` : '',
          b?.venueCity ? `*Venue / City:* ${b.venueCity}` : '',
          b?.guestCount ? `*Guest Count:* ${b.guestCount} Guests` : '',
          b?.pdfUrl ? `*Summary PDF:* ${b.pdfUrl}` : '',
          '---------------------------------',
          'Namaste SID Events team! I have submitted this event booking. Please verify availability and guide me with the next steps.',
        ].filter(Boolean);
        resolvedUrl = `https://wa.me/${SITE.whatsappNumber || '918095408404'}?text=${encodeURIComponent(lines.join('\n'))}`;
      }

      setWhatsappUrl(resolvedUrl);
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, [rawRef, refCode]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-emerald-600 border-4 border-gold-400 text-white flex items-center justify-center mx-auto shadow-2xl animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Congratulations!
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          {booking?.customerName ? `Congratulations, ${booking.customerName}!` : 'Congratulations!'}
        </h1>
        <p className="text-maroon-800 text-base max-w-md mx-auto leading-relaxed">
          We&apos;ve received your event details. Our team will contact you shortly regarding your custom quotation.
        </p>
      </div>

      <GlassCard variant="warm" className="text-left space-y-5 p-8 border-2 border-gold-400 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-300 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-maroon-800">
            Booking Reference Number
          </span>
          <span className="font-bold text-maroon-950 font-mono text-xl bg-gold-200 px-4 py-1 rounded-lg border border-gold-400 shadow-inner">
            {refCode}
          </span>
        </div>

        {booking?.weddingDate && (
          <div className="flex justify-between items-center text-xs border-b border-gold-200/80 pb-3">
            <span className="text-maroon-800 font-medium">Event Date</span>
            <span className="font-bold text-maroon-950">{booking.weddingDate}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs pb-3 border-b border-gold-200/80">
          <span className="text-maroon-800 font-medium">Booking Status</span>
          <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
            REQUEST RECEIVED &mdash; CONFIRMED
          </span>
        </div>

        {/* WhatsApp Send Complete Details Button */}
        <div className="pt-2 space-y-2">
          <div className="text-xs font-bold text-maroon-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Send Details to Our Team
            </span>
            <span className="text-[11px] text-maroon-700/80 font-normal">Fastest Response</span>
          </div>

          <a
            href={whatsappUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 bg-[#25D366] hover:bg-[#20bd5a] text-sm sm:text-base cursor-pointer group"
          >
            <WhatsAppIcon className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:scale-110" />
            Send Complete Details on WhatsApp
          </a>

          <p className="text-[11px] text-maroon-700/80 text-center leading-relaxed">
            Click to instantly send all event selections, menus, decor, and booking reference directly to our planning team on WhatsApp.
          </p>
        </div>
      </GlassCard>

      <TraditionalBorder />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <GoldButton variant="gold" size="lg" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </GoldButton>
        </Link>

        <Link href="/packages">
          <GoldButton variant="dark" size="lg">
            Explore Events We Plan
          </GoldButton>
        </Link>
      </div>
    </div>
  );
}

export default function RequestReceivedPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-maroon-900 font-bold">Loading...</div>}>
      <RequestReceivedContent />
    </Suspense>
  );
}
