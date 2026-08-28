'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';

function RequestReceivedContent() {
  const searchParams = useSearchParams();
  const rawRef = searchParams.get('ref') || 'BK-9845';
  const refCode = rawRef.startsWith('#') ? rawRef : `#${rawRef}`;

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

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
          Congratulations!
        </h1>
        <p className="text-maroon-800 text-base max-w-md mx-auto leading-relaxed">
          We&apos;ve received your event details. Our team will contact you shortly regarding your booking.
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

        <div className="flex justify-between items-center text-xs">
          <span className="text-maroon-800 font-medium">Booking Status</span>
          <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
            REQUEST RECEIVED &mdash; OUR TEAM WILL CONTACT YOU SHORTLY
          </span>
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
