'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { getWhatsAppUrl } from '@/lib/site-config';

function RequestReceivedContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || 'BK-9845';

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-emerald-600 border-4 border-gold-400 text-ivory flex items-center justify-center mx-auto shadow-2xl animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Quote Request Received!
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          Thank You!
        </h1>
        <p className="text-maroon-700/80 text-sm max-w-md mx-auto">
          We&apos;ve received your event details. Our team will get back to you shortly with a custom quote &mdash; no payment needed right now.
        </p>
      </div>

      <GlassCard variant="warm" className="text-left space-y-4 p-8 border-2 border-gold-400">
        <div className="flex justify-between items-center border-b border-gold-300 pb-3">
          <span className="text-xs font-bold text-maroon-900">Request Reference Number</span>
          <span className="font-bold text-maroon-900 font-heading text-base bg-gold-200 px-3 py-0.5 rounded border border-gold-400">
            {refCode}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-maroon-800">Status</span>
          <span className="font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded">RECEIVED &mdash; AWAITING QUOTE</span>
        </div>
      </GlassCard>

      <TraditionalBorder />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <GoldButton variant="dark" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </GoldButton>
        </Link>

        <a
          href={getWhatsAppUrl(`Hi! My request reference is ${refCode}. I'd like to follow up on my quote request.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GoldButton variant="copper" icon={<MessageCircle className="w-4 h-4" />}>
            Follow Up on WhatsApp
          </GoldButton>
        </a>
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
