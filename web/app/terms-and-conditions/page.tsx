'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Camera,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Gavel,
  Languages,
  Megaphone,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';

function TermsPoint({
  number,
  note,
  children,
}: {
  number: number;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-7 h-7 rounded-full bg-maroon-800 text-gold-300 text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
        {number}
      </span>
      <div className="pt-0.5">
        <p className="text-sm text-maroon-900 leading-relaxed">{children}</p>
        {note && (
          <p className="text-xs text-maroon-700/80 italic mt-1.5 pl-3 border-l-2 border-gold-300">
            {note}
          </p>
        )}
      </div>
    </li>
  );
}

function TermsCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 text-sm shadow-xs">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function TermsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="space-y-4">
      <h2 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900 border-b border-gold-300 pb-3 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-maroon-800 text-gold-300 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        {title}
      </h2>
      <ol className="space-y-4">{children}</ol>
    </GlassCard>
  );
}

export default function TermsAndConditionsPage() {
  const [lang, setLang] = useState<'en' | 'kn'>('en');

  const isKn = lang === 'kn';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sideventsmanagement.com/' },
      { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: 'https://sideventsmanagement.com/terms-and-conditions' },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header & Language Toggle */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> {isKn ? 'ಓದಲೇಬೇಕಾದ ನಿಯಮಗಳು' : 'Must Read'}
          </span>

          {/* Language Switcher Pill */}
          <div className="inline-flex p-1 rounded-full bg-white border border-gold-400 shadow-sm">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isKn
                  ? 'bg-maroon-800 text-gold-200 shadow-xs'
                  : 'text-maroon-900 hover:bg-gold-50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isKn
                  ? 'bg-maroon-800 text-gold-200 shadow-xs'
                  : 'text-maroon-900 hover:bg-gold-50'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
          </div>
        </div>

        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          {isKn
            ? 'ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು'
            : 'Event Management Terms & Conditions'}
        </h1>
        <p className="text-maroon-700/80 text-sm leading-relaxed">
          {isKn
            ? 'SID Events ನೊಂದಿಗೆ ನಿಮ್ಮ ಬುಕಿಂಗ್ ಅನ್ನು ದೃಢೀಕರಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಈ ನಿಯಮಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ. ನಿಯಮಗಳ ಸಂಖ್ಯೆಯು ಒಪ್ಪಂದದಂತೆಯೇ ಇರುತ್ತದೆ.'
            : 'Please read these terms carefully before confirming your booking with SID Events. Numbering follows the agreement exactly as issued.'}
        </p>
        <TraditionalBorder />
      </section>

      {isKn ? (
        /* KANNADA TRANSLATIONS */
        <>
          <TermsSection icon={Camera} title="೧. ಛಾಯಾಗ್ರಹಣ ಮತ್ತು ಡೇಟಾ ವಿತರಣೆ (Photography & Data Delivery)">
            <TermsPoint number={1}>
              ಶೂಟ್ ಮುಗಿದ ನಂತರ <strong>10-15 ದಿನಗಳಲ್ಲಿ</strong> 10 ಎಡಿಟ್ ಮಾಡಿದ ಛಾಯಾಚಿತ್ರಗಳ ಪೂರ್ವವೀಕ್ಷಣೆ (Preview) ಸೆಟ್ ಅನ್ನು ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={2}>
              ಶೂಟ್‌ನ <strong>30 ದಿನಗಳಲ್ಲಿ</strong> ಸಂಪೂರ್ಣ RAW ಡೇಟಾವನ್ನು ವಿತರಿಸಲಾಗುತ್ತದೆ. ಡೇಟಾ ವರ್ಗಾವಣೆಗೆ ಕ್ಲೈಂಟ್ ಹಾರ್ಡ್ ಡ್ರೈವ್ ಅನ್ನು ಒದಗಿಸಬೇಕು.
            </TermsPoint>
            <TermsPoint
              number={3}
              note="ಗಮನಿಸಿ: ಪ್ರತಿಕ್ರಿಯೆ ಅಥವಾ ಪರಿಷ್ಕರಣೆಗಾಗಿ ಕ್ಲೈಂಟ್ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯವನ್ನು ಈ ವಿತರಣಾ ಕಾಲಮಿತಿಯಲ್ಲಿ ಲೆಕ್ಕಹಾಕಲಾಗುವುದಿಲ್ಲ."
            >
              ಅಂತಿಮವಾಗಿ ಎಡಿಟ್ ಮಾಡಿದ ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳನ್ನು (ಆನ್‌ಲೈನ್ ಆಲ್ಬಮ್ ಸೇರಿದಂತೆ) ಈವೆಂಟ್ ದಿನಾಂಕದಿಂದ <strong>3 ತಿಂಗಳೊಳಗೆ</strong> ತಲುಪಿಸಲಾಗುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={4}>
              ಕ್ಲೈಂಟ್ ಫೋಟೋಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ <strong>30 ದಿನಗಳಲ್ಲಿ</strong> ಪ್ರಿಂಟೆಡ್ ಆಲ್ಬಮ್ ಅನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ ಮುದ್ರಿಸಲಾಗುತ್ತದೆ. ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡುವುದು ಕ್ಲೈಂಟ್‌ನ ಜವಾಬ್ದಾರಿಯಾಗಿದೆ.
            </TermsPoint>
            <TermsPoint number={5}>
              RAW ಡೇಟಾವನ್ನು <strong>ಹಾರ್ಡ್ ಡ್ರೈವ್ / ಪೆನ್ ಡ್ರೈವ್ (ಕ್ಲೈಂಟ್ ಒದಗಿಸಿದ್ದು)</strong> ಮೂಲಕ ಹಸ್ತಾಂತರಿಸಲಾಗುತ್ತದೆ ಅಥವಾ <strong>Google Drive (ಫೋಟೋಗಳು ಮಾತ್ರ)</strong> ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={CreditCard} title="೨. ಪಾವತಿ ನಿಯಮಗಳು (Payment Terms)">
            <TermsPoint number={6}>
              ಬುಕಿಂಗ್ ದೃಢೀಕರಣದ ಸಮಯದಲ್ಲಿ <strong>50% ಮುಂಗಡ ಪಾವತಿ</strong> ಕಡ್ಡಾಯವಾಗಿದೆ.
            </TermsPoint>
            <TermsPoint number={7}>
              ಮದುವೆ/ಈವೆಂಟ್ ದಿನದಂದು <strong>49% ಪಾವತಿಯನ್ನು</strong> ಪೂರ್ಣಗೊಳಿಸಬೇಕು.
            </TermsPoint>
            <TermsPoint number={8}>
              RAW ಡೇಟಾ ವಿತರಣೆ ಅಥವಾ ಮುದ್ರಣ ಡೆಲಿವರಿ ಪಡೆಯುವ ಸಮಯದಲ್ಲಿ <strong>1% ಅಂತಿಮ ಪಾವತಿ</strong> ಮಾಡಬೇಕು.
            </TermsPoint>
            <li>
              <TermsCallout>
                ಗಮನಿಸಿ: ನಿಗದಿತ ದಿನಾಂಕವನ್ನು ಮೀರಿ ಪಾವತಿ ವಿಳಂಬವಾದರೆ, ಪಾವತಿ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ವಿತರಣೆಗಳು, ಎಡಿಟಿಂಗ್ ಮತ್ತು ಮುದ್ರಣವನ್ನು ತಡೆಹಿಡಿಯಲಾಗುತ್ತದೆ.
              </TermsCallout>
            </li>
          </TermsSection>

          <TermsSection icon={CalendarClock} title="೩. ಮುಂದೂಡಿಕೆ ಮತ್ತು ರದ್ದತಿ ನೀತಿ (Postponement & Cancellation Policy)">
            <TermsPoint number={10}>
              ನಿಗದಿತ ದಿನಾಂಕಕ್ಕಿಂತ <strong>40 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಮುಂಚಿತವಾಗಿ</strong> ಈವೆಂಟ್ ಅನ್ನು ಮುಂದೂಡಿದರೆ, ಸಂಪೂರ್ಣ ಮುಂಗಡ ಮೊತ್ತವನ್ನು ಹೊಸ ದಿನಾಂಕಕ್ಕೆ ಹೊಂದಿಸಲಾಗುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={11}>
              <strong>40 ದಿನಗಳೊಳಗೆ</strong> ಮುಂದೂಡಿದರೆ, <strong>10-15% ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ</strong> ಅನ್ವಯವಾಗಬಹುದು.
            </TermsPoint>
            <TermsPoint number={12}>
              <strong>40 ದಿನಗಳೊಳಗೆ ರದ್ದುಗೊಳಿಸಿದ</strong> ಸಂದರ್ಭದಲ್ಲಿ, ಒಟ್ಟು ಇನ್‌ವಾಯ್ಸ್‌ನ <strong>15% ರದ್ದತಿ ಶುಲ್ಕ</strong> ಅನ್ವಯವಾಗುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ <strong>ತೆರಿಗೆ ಮರುಪಾವತಿ ಮಾಡಲಾಗುವುದಿಲ್ಲ</strong>.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Package} title="೪. ವಿತರಣಾ ಕಾಲಮಿತಿ (Delivery Timeline)">
            <TermsPoint number={13}>ಶೂಟ್ ದಿನಾಂಕದಿಂದ <strong>15 ದಿನಗಳೊಳಗೆ</strong> ಪ್ರಿವ್ಯೂ ಫೋಟೋಗಳನ್ನು ತಲುಪಿಸಲಾಗುತ್ತದೆ.</TermsPoint>
            <TermsPoint number={14}><strong>30 ದಿನಗಳೊಳಗೆ</strong> RAW ಛಾಯಾಚಿತ್ರಗಳನ್ನು ವಿತರಿಸಲಾಗುತ್ತದೆ.</TermsPoint>
            <TermsPoint number={15}><strong>60 ದಿನಗಳೊಳಗೆ</strong> ಅಂತಿಮ ಎಡಿಟ್ ಮಾಡಿದ ಫೋಟೋಗಳು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಲ್ಬಮ್ ಅನ್ನು ತಲುಪಿಸಲಾಗುತ್ತದೆ.</TermsPoint>
            <TermsPoint number={16}><strong>90 ದಿನಗಳೊಳಗೆ</strong> ಎಡಿಟ್ ಮಾಡಿದ ವೀಡಿಯೊಗಳನ್ನು ತಲುಪಿಸಲಾಗುತ್ತದೆ.</TermsPoint>
            <TermsPoint number={17}>
              ಶೂಟ್ ದಿನಾಂಕದಿಂದ <strong>3 ತಿಂಗಳೊಳಗೆ</strong> ಕ್ಲೈಂಟ್‌ಗಳು RAW ಡೇಟಾವನ್ನು ಸಂಗ್ರಹಿಸಬೇಕು. ಈ ಅವಧಿಯನ್ನು ಮೀರಿದ ನಂತರ ಡೇಟಾ ನಷ್ಟಕ್ಕೆ ಸಂಸ್ಥೆಯು ಜವಾಬ್ದಾರರಾಗಿರುವುದಿಲ್ಲ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Gavel} title="೫. ಕೃತಿಸ್ವಾಮ್ಯ ಮತ್ತು ಬಳಕೆ (Copyright & Usage)">
            <TermsPoint number={18}>
              ಉತ್ಪಾದಿಸಲಾದ ಎಲ್ಲಾ ಛಾಯಾಚಿತ್ರಗಳು, ವೀಡಿಯೊಗಳು ಮತ್ತು ವಿಷಯಗಳು <strong>ಸಂಸ್ಥೆಯ (L.I.F.) ಬೌದ್ಧಿಕ ಆಸ್ತಿಯಾಗಿದೆ</strong>.
            </TermsPoint>
            <TermsPoint number={19}>
              ಸಂಸ್ಥೆಯು ಸಂಪೂರ್ಣ ಕೃತಿಸ್ವಾಮ್ಯವನ್ನು ಹೊಂದಿರುತ್ತದೆ ಮತ್ತು ತನ್ನ ವೆಬ್‌ಸೈಟ್ ಹಾಗೂ ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಳಲ್ಲಿ <strong>ಮಾರ್ಕೆಟಿಂಗ್ ಮತ್ತು ಪ್ರಚಾರ ಉದ್ದೇಶಗಳಿಗಾಗಿ</strong> ವಿಷಯವನ್ನು ಬಳಸಬಹುದು.
            </TermsPoint>
            <TermsPoint number={20}>
              ಲಿಖಿತ ಪೂರ್ವಾನುಮತಿ ಇಲ್ಲದೆ ಅನಧಿಕೃತ ಪುನರುತ್ಪಾದನೆ ಅಥವಾ ವಿತರಣೆಯು <strong>ಕೃತಿಸ್ವಾಮ್ಯ ಕಾಯ್ದೆ, 1957 ರ ಅಡಿಯಲ್ಲಿ</strong> ಕಾನೂನು ಕ್ರಮಕ್ಕೆ ಒಳಪಡುತ್ತದೆ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={UtensilsCrossed} title="೬. ಆಹಾರ ಮತ್ತು ಊಟದ ನೀತಿ (Food & Meals Policy)">
            <TermsPoint number={21}>
              ಈವೆಂಟ್ ತಂಡಕ್ಕೆ ಊಟದ ವ್ಯವಸ್ಥೆಯನ್ನು ಕ್ಲೈಂಟ್ ಮಾಡಬೇಕು. ಇಲ್ಲದಿದ್ದರೆ, ತಂಡಕ್ಕೆ ಊಟಕ್ಕಾಗಿ ನಿಗದಿತ ವಿರಾಮಗಳ ಅಗತ್ಯವಿರುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={22}>
              <strong>ಆಹಾರ ಮೆನು ಬದಲಾವಣೆಗಳನ್ನು ಈವೆಂಟ್‌ಗೆ ಕನಿಷ್ಠ 15 ದಿನಗಳ ಮೊದಲು</strong> ತಿಳಿಸಬೇಕು.
            </TermsPoint>
            <TermsPoint number={23}>
              ಅಂತಿಮ ಒಪ್ಪಂದದ ನಂತರ ಮೆನುವಿನಲ್ಲಿ ಮಾಡುವ ಬದಲಾವಣೆಗಳು <strong>ಪರಿಷ್ಕೃತ ವೆಚ್ಚಕ್ಕೆ</strong> ಒಳಪಡುತ್ತವೆ. ಕ್ಲೈಂಟ್‌ಗಳು ಈ ಬದಲಾವಣೆಗಳನ್ನು ಔಪಚಾರಿಕವಾಗಿ ಅನುಮೋದಿಸಬೇಕು.
            </TermsPoint>
            <TermsPoint number={24}>
              <strong>ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ ಹೆಚ್ಚಾದರೆ</strong>, ಕ್ಲೈಂಟ್ 15 ದಿನಗಳ ಮೊದಲು ತಿಳಿಸಬೇಕು. ಈವೆಂಟ್ ದಿನದಂದು ತಿಳಿಸಿದರೆ, ಪ್ರತಿ ಪ್ಲೇಟ್‌ಗೆ <strong>₹300 ರಿಂದ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕಗಳು</strong> ಅನ್ವಯಿಸುತ್ತವೆ.
            </TermsPoint>
            <TermsPoint number={25}>
              <strong>ಅತಿಥಿಗಳ ಸಂಖ್ಯೆ ಕಡಿಮೆಯಾದರೆ</strong>, ಒಪ್ಪಿಕೊಂಡ ಬೆಲೆಯಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆಗಳನ್ನು ಮಾಡಲಾಗುವುದಿಲ್ಲ; ಶುಲ್ಕವು ಮೂಲ ಒಪ್ಪಂದದಂತೆಯೇ ಇರುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={26}>
              ಅಗತ್ಯ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಮಾಡಲು ಊಟದ ವ್ಯವಸ್ಥೆಯು <strong>ಬಫೆ ಅಥವಾ ಪ್ಲೇಟ್ ಸರ್ವಿಸ್</strong> ಆಗಿರುತ್ತದೆಯೇ ಎಂಬುದನ್ನು ಕ್ಲೈಂಟ್ ಕನಿಷ್ಠ <strong>15 ದಿನಗಳ ಮೊದಲು</strong> ದೃಢೀಕರಿಸಬೇಕು.
            </TermsPoint>
            <TermsPoint number={27}>
              ಪೂರ್ವಾನುಮತಿ ಇಲ್ಲದೆ ಕ್ಲೈಂಟ್ ಕಡೆಯಿಂದ <strong>ಯಾರೂ ಅಡುಗೆಮನೆಗೆ ಪ್ರವೇಶಿಸಲು ಅನುಮತಿಯಿಲ್ಲ</strong>. ಈವೆಂಟ್ ತಂಡವು ಬಡಿಸುವಿಕೆ ಮತ್ತು ಆಹಾರ ನಿರ್ವಹಣೆಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿರ್ವಹಿಸುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={28}><strong>ಉಳಿದ ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳು/ರೇಷನ್ ವಸ್ತುಗಳನ್ನು</strong> ಕ್ಲೈಂಟ್‌ಗಳು ತೆಗೆದುಕೊಂಡು ಹೋಗಲು ಅವಕಾಶವಿಲ್ಲ.</TermsPoint>
            <TermsPoint number={29}>
              ಕ್ಲೈಂಟ್‌ಗಳು <strong>ಉಳಿದ ಸಿಹಿತಿಂಡಿಗಳನ್ನು</strong> ತೆಗೆದುಕೊಳ್ಳಲು ಬಯಸಿದರೆ, ಇದನ್ನು ಈವೆಂಟ್ ಮ್ಯಾನೇಜರ್‌ಗೆ ಮುಂಚಿತವಾಗಿ ತಿಳಿಸಬೇಕು. ಕ್ಲೈಂಟ್ ಸೂಕ್ತವಾದ ಪ್ಯಾಕೇಜಿಂಗ್ ಒದಗಿಸಬೇಕು; ಈವೆಂಟ್ ತಂಡವು ಬಾಕ್ಸ್‌ಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ.
            </TermsPoint>
            <TermsPoint number={30}>
              ಪೂರ್ವ ಒಪ್ಪಂದದ ಊಟದ ಯೋಜನೆಯನ್ನು ಮೀರಿದ <strong>ಹೆಚ್ಚುವರಿ ನೀರಿನ ಬಾಟಲಿಗಳನ್ನು</strong> ಒದಗಿಸಲಾಗುವುದಿಲ್ಲ. ಆದಾಗ್ಯೂ, ಸಾಮಾನ್ಯ ಅತಿಥಿ ಬಳಕೆಗಾಗಿ ಎರಡು ವಾಟರ್ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗುತ್ತದೆ.
            </TermsPoint>
            <TermsPoint number={31}>
              ಪಾನ್ ಬೀಡಾ, ಐಸ್ ಕ್ರೀಮ್ ಅಥವಾ ವಿಶೇಷ ಸಿಹಿತಿಂಡಿಗಳಂತಹ ಯಾವುದೇ <strong>ವಿಶೇಷ ವಸ್ತುಗಳನ್ನು ಒಮ್ಮೆ ಮಾತ್ರ</strong> ನೀಡಲಾಗುತ್ತದೆ. ನಿರ್ದಿಷ್ಟಪಡಿಸದ ಹೊರತು ಸಾಮಾನ್ಯ ಆಹಾರ ಪದಾರ್ಥಗಳನ್ನು <strong>ಅನಿಯಮಿತವಾಗಿ</strong> ಬಡಿಸಲಾಗುತ್ತದೆ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Building2} title="೭. ಸ್ಥಳ, ಸ್ವಚ್ಛತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ ನೀತಿ (Venue, Cleaning & Infrastructure Policy)">
            <TermsPoint number={32}>
              ಕಲ್ಯಾಣ ಮಂಟಪವನ್ನು ಕ್ಲೈಂಟ್ ಬುಕ್ ಮಾಡಿದ್ದರೆ, <strong>ಸ್ವಚ್ಛತೆಯ ಸಂಪೂರ್ಣ ಜವಾಬ್ದಾರಿ ಕ್ಲೈಂಟ್‌ನ ಮೇಲಿರುತ್ತದೆ</strong>. ಈವೆಂಟ್ ತಂಡವು ಈ ಕೆಲಸಕ್ಕೆ ಸಿಬ್ಬಂದಿಯನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ.
            </TermsPoint>
            <TermsPoint number={33}>
              ಗ್ರೈಂಡರ್ ಮತ್ತು ಪಾತ್ರೆ ತೊಳೆಯುವುದು ಸೇರಿದಂತೆ ಸ್ಥಳಕ್ಕೆ <strong>ನೀರು, ವಿದ್ಯುತ್, ಸಿಲಿಂಡರ್ ಮರುಪೂರಣ ಮತ್ತು ಸ್ವಚ್ಛತಾ ಸಾಮಗ್ರಿಗಳನ್ನು</strong> ವ್ಯವಸ್ಥೆ ಮಾಡಲು ಕ್ಲೈಂಟ್ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ.
            </TermsPoint>
            <TermsPoint number={34}>
              <strong>ಸ್ಟೇಜ್ ಅಲಂಕಾರದ ನಂತರ ಹಾಲ್ ಸ್ವಚ್ಛತೆ ಮತ್ತು ರೂಮ್ ಸ್ವಚ್ಛತೆಯು</strong> ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ತಂಡದ ಜವಾಬ್ದಾರಿಯಲ್ಲ.
            </TermsPoint>
            <TermsPoint number={35}>
              ಈವೆಂಟ್ ಸಮಯದಲ್ಲಿ <strong>ಅತಿಥಿಗಳ ಅಥವಾ ಕ್ಲೈಂಟ್‌ನ ವೈಯಕ್ತಿಕ ವಸ್ತುಗಳ ಸುರಕ್ಷತೆಗೆ</strong> ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ತಂಡವು ಜವಾಬ್ದಾರರಾಗಿರುವುದಿಲ್ಲ.
            </TermsPoint>
            <TermsPoint number={36}>
              <strong>ಅತಿಥಿ ಕೊಠಡಿ ವ್ಯವಸ್ಥೆಗಳು ಕ್ಲೈಂಟ್‌ನ ಸಂಪೂರ್ಣ ಜವಾಬ್ದಾರಿಯಾಗಿದೆ</strong>. ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ತಂಡವು ಅತಿಥಿ ವಸತಿಗಳನ್ನು ನಿರ್ವಹಿಸುವುದಿಲ್ಲ.
            </TermsPoint>
            <TermsPoint number={37}>
              ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ತಂಡಕ್ಕಾಗಿ ಕ್ಲೈಂಟ್ <strong>ಪ್ರತ್ಯೇಕವಾಗಿ ಒಂದು ಕೊಠಡಿಯನ್ನು ಕಾಯ್ದಿರಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ</strong>. ತಂಡದ ಅನುಕೂಲಕ್ಕಾಗಿ ಈ ಕೊಠಡಿಯು <strong>ಕಲ್ಯಾಣ ಮಂಟಪದ ಆವರಣದೊಳಗೆ ಇರಬೇಕು</strong>.
            </TermsPoint>
            <TermsPoint number={38}>
              ಡೈನಿಂಗ್ ಹಾಲ್ ಸೆಟಪ್, ಟೇಬಲ್ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಕುರ್ಚಿ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ತಂಡವು ನಿರ್ವಹಿಸುವುದಿಲ್ಲ. ಕ್ಲೈಂಟ್ ಇವುಗಳಿಗೆ ಪ್ರತ್ಯೇಕ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಮಾಡಿಕೊಳ್ಳಬೇಕು.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Truck} title="೮. ಸಾರಿಗೆ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ (Transportation & Liability)">
            <TermsPoint number={39}>
              ಪ್ಯಾಕೇಜ್‌ನಲ್ಲಿ ಸಾರಿಗೆಯನ್ನು ಸೇರಿಸಿದ್ದರೆ, ಯಾವುದೇ <strong>ಅಪಘಾತಗಳು, ಕಾನೂನು ದಂಡಗಳು ಅಥವಾ ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿಗಳು</strong> ಕ್ಲೈಂಟ್‌ನ ವೆಚ್ಚದಲ್ಲಿರುತ್ತವೆ. ಈವೆಂಟ್ ತಂಡವು ಈ ವೆಚ್ಚಗಳನ್ನು ಭರಿಸುವುದಿಲ್ಲ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Megaphone} title="೯. ಅನುಮತಿಗಳು ಮತ್ತು ಶಬ್ದ ನಿಯಮಗಳು (Permissions & Noise Regulations)">
            <TermsPoint number={40}>
              ಸರ್ಕಾರದ ನಿಯಮಗಳ ಪ್ರಕಾರ, <strong>ರಾತ್ರಿ 10:00 ಗಂಟೆಯ ನಂತರ ಮ್ಯೂಸಿಕ್ ಸಿಸ್ಟಮ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಲಾಗುತ್ತದೆ</strong>. ಮುಂದುವರಿದ ಬಳಕೆಯು ದೂರುಗಳಿಗೆ ಕಾರಣವಾದರೆ, ಅವುಗಳನ್ನು ಪರಿಹರಿಸಲು ಕ್ಲೈಂಟ್ ಸಂಪೂರ್ಣ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ.
            </TermsPoint>
            <TermsPoint number={41}>
              ಪಟಾಕಿ, ಫಾಗ್ ಸಿಸ್ಟಮ್ ಅಥವಾ ಹೊರಾಂಗಣ ಅಲಂಕಾರಕ್ಕಾಗಿ ಯಾವುದೇ <strong>ವಿಶೇಷ ಅನುಮತಿಗಳನ್ನು ಕ್ಲೈಂಟ್ ಪಡೆಯಬೇಕು</strong>. ಇವುಗಳಿಂದ ಉಂಟಾಗುವ ಯಾವುದೇ <strong>ಆಸ್ತಿ ಹಾನಿಗೆ ಕ್ಲೈಂಟ್ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ</strong>.
            </TermsPoint>
            <TermsPoint number={42}>
              ಸ್ಥಳದಲ್ಲಿ <strong>ಶಾರ್ಟ್ ಸರ್ಕ್ಯೂಟ್ ಸಮಸ್ಯೆಗಳು ಅಥವಾ ವಿದ್ಯುತ್ ದೋಷಗಳಿಗೆ</strong> ಕ್ಲೈಂಟ್ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ.
            </TermsPoint>
            <TermsPoint number={43}>
              ಕ್ಲೈಂಟ್ ಅಥವಾ ಅವರ ಅತಿಥಿಗಳಿಂದ ಈವೆಂಟ್ ಆಸ್ತಿಗೆ ಉಂಟಾಗುವ ಯಾವುದೇ <strong>ಭೌತಿಕ ಹಾನಿಗೆ ಕ್ಲೈಂಟ್ ಆರ್ಥಿಕ ಹೊಣೆಗಾರರಾಗಿರುತ್ತಾರೆ</strong>.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Sparkles} title="೧೦. ಅಲಂಕಾರ ಮತ್ತು ಪ್ರಸ್ತುತಿ ನೀತಿ (Decor & Presentation Policy)">
            <TermsPoint number={44}>
              ಸ್ಥಳವನ್ನು ಅವಲಂಬಿಸಿ ಅಲಂಕಾರಗಳು <strong>ಒಪ್ಪಿಕೊಂಡ ಪರಿಕಲ್ಪನೆಗೆ 70-80% ನಿಖರತೆಯೊಂದಿಗೆ</strong> ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತವೆ.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={RefreshCw} title="೧೧. ಈವೆಂಟ್ ಬದಲಾವಣೆಗಳ ನೀತಿ (Event Changes Policy)">
            <TermsPoint number={45}>
              ಈವೆಂಟ್ ರಚನೆ, ವಿನ್ಯಾಸ ಅಥವಾ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆಗಳನ್ನು ಹೊಂದಾಣಿಕೆಗೆ ಸಮಯಾವಕಾಶ ನೀಡಲು ಈವೆಂಟ್‌ಗೆ <strong>ಕನಿಷ್ಠ 30 ದಿನಗಳ ಮೊದಲು</strong> ತಿಳಿಸಬೇಕು. <strong>ಸ್ಥಳದಲ್ಲೇ ಮಾಡುವ ಬದಲಾವಣೆಗಳಿಗೆ ಖಾತರಿ ಇಲ್ಲ</strong> ಮತ್ತು ಹೆಚ್ಚುವರಿ ಶುಲ್ಕಗಳು ಅನ್ವಯಿಸಬಹುದು.
            </TermsPoint>
          </TermsSection>

          <GlassCard variant="warm" className="space-y-4 text-center border-2 border-gold-400">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900 flex items-center justify-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              ಕ್ಲೈಂಟ್ ದೃಢೀಕರಣ (Client Confirmation)
            </h2>
            <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
              ಬುಕಿಂಗ್ ಅನ್ನು ದೃಢೀಕರಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಎಲ್ಲಾ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.
            </p>
            <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
              ಈ ಒಪ್ಪಂದದ ಸ್ವೀಕಾರವು ಮೇಲೆ ತಿಳಿಸಲಾದ ಎಲ್ಲಾ ನೀತಿಗಳಿಗೆ ಕ್ಲೈಂಟ್‌ನ ಅಂಗೀಕಾರ ಮತ್ತು ಸಮ್ಮತಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.
            </p>
            <p className="text-xs text-maroon-700/80 italic">ಈವೆಂಟ್‌ಗೆ ಮುಂಚಿತವಾಗಿ ಸಹಿ ಮಾಡಿದ ಪ್ರತಿಯ ಅಗತ್ಯವಿರುತ್ತದೆ.</p>
          </GlassCard>
        </>
      ) : (
        /* ENGLISH TRANSLATIONS */
        <>
          <TermsSection icon={Camera} title="Photography & Data Delivery">
            <TermsPoint number={1}>
              A preview set of 10 edited photographs will be shared within <strong>10-15 days</strong> after the shoot is
              completed.
            </TermsPoint>
            <TermsPoint number={2}>
              Full RAW data will be delivered within <strong>30 days</strong> of the shoot. The client must provide a hard
              drive for data transfer.
            </TermsPoint>
            <TermsPoint
              number={3}
              note="Note: Client response time for feedback or revisions is not counted in this delivery timeline."
            >
              Final edited photos and videos, including the online album, will be delivered within{' '}
              <strong>3 months</strong> of the event date.
            </TermsPoint>
            <TermsPoint number={4}>
              The printed album will be designed and printed within <strong>30 days</strong> after the client selects the
              photographs. Photo selection is the client&apos;s responsibility.
            </TermsPoint>
            <TermsPoint number={5}>
              RAW data will be handed over via <strong>hard drive / pen drive (provided by the client)</strong> or shared
              via <strong>Google Drive (Photos only)</strong>.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={CreditCard} title="Payment Terms">
            <TermsPoint number={6}>
              <strong>50% advance payment</strong> is required at the time of booking confirmation.
            </TermsPoint>
            <TermsPoint number={7}>
              <strong>49% payment</strong> should be cleared on the wedding/event day.
            </TermsPoint>
            <TermsPoint number={8}>
              <strong>1% payment</strong> upon RAW data delivery or taking printing delivery.
            </TermsPoint>
            <li>
              <TermsCallout>
                Note: Delayed payments beyond the due date will result in deliveries, editing, and printing being put on
                hold until cleared.
              </TermsCallout>
            </li>
          </TermsSection>

          <TermsSection icon={CalendarClock} title="Postponement & Cancellation Policy">
            <TermsPoint number={10}>
              If the event is postponed <strong>more than 40 days</strong> before the scheduled date, the entire advance
              amount will be adjusted for the new date.
            </TermsPoint>
            <TermsPoint number={11}>
              If postponed <strong>within 40 days</strong>, an additional charge of <strong>10-15%</strong> may apply.
            </TermsPoint>
            <TermsPoint number={12}>
              In the case of cancellation <strong>within 40 days</strong>, a cancellation charge of{' '}
              <strong>15%</strong> of the total invoice will be applicable and <strong>no tax refund</strong> will be
              made.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Package} title="Delivery Timeline">
            <TermsPoint number={13}>Preview photos will be delivered within <strong>15 days</strong> from the shoot date.</TermsPoint>
            <TermsPoint number={14}>RAW photographs will be delivered within <strong>30 days</strong>.</TermsPoint>
            <TermsPoint number={15}>Final edited photos and digital album will be delivered within <strong>60 days</strong>.</TermsPoint>
            <TermsPoint number={16}>Edited videos will be delivered within <strong>90 days</strong>.</TermsPoint>
            <TermsPoint number={17}>
              Clients must collect RAW data within <strong>3 months</strong> from the shoot date. The agency will not be
              responsible for data loss beyond this period.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Gavel} title="Copyright & Usage">
            <TermsPoint number={18}>
              All photographs, videos, and content produced are the <strong>intellectual property of the agency
              (L.I.F.)</strong>.
            </TermsPoint>
            <TermsPoint number={19}>
              The agency retains full copyright and may use content for <strong>marketing and promotional</strong>{' '}
              purposes on its website and social media platforms.
            </TermsPoint>
            <TermsPoint number={20}>
              Unauthorized reproduction or distribution without prior written permission will invite legal action under{' '}
              <strong>The Copyright Act, 1957</strong>.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={UtensilsCrossed} title="Food & Meals Policy">
            <TermsPoint number={21}>
              Meals for the event team must be arranged by the client. If not, the team will require designated breaks
              for meals.
            </TermsPoint>
            <TermsPoint number={22}>
              <strong>Food menu changes must be communicated at least 15 days</strong> prior to the event for
              adjustments.
            </TermsPoint>
            <TermsPoint number={23}>
              Changes to the menu <strong>after final agreement</strong> will result in revised costs. Clients must
              approve these changes formally.
            </TermsPoint>
            <TermsPoint number={24}>
              If the <strong>guest count increases</strong>, the client must inform 15 days prior. If informed{' '}
              <strong>on the event day</strong>, extra charges apply starting from <strong>₹300 per plate</strong>.
            </TermsPoint>
            <TermsPoint number={25}>
              If the <strong>guest count decreases</strong>, no changes will be made to the agreed price; the charge will
              remain as per the original agreement.
            </TermsPoint>
            <TermsPoint number={26}>
              The client must confirm whether the meal system will be <strong>Buffet or Plate Service</strong> at least{' '}
              <strong>15 days prior</strong> to allow necessary arrangements.
            </TermsPoint>
            <TermsPoint number={27}>
              <strong>No one from the client&apos;s side is permitted to enter the kitchen</strong> without prior
              permission. The event team will fully manage serving and food handling.
            </TermsPoint>
            <TermsPoint number={28}><strong>Leftover raw materials/rations</strong> are not to be carried away by clients.</TermsPoint>
            <TermsPoint number={29}>
              If clients wish to take away <strong>leftover sweets</strong>, this must be pre-informed to the event
              manager. The client must provide appropriate packaging; the event team will not supply boxes.
            </TermsPoint>
            <TermsPoint number={30}>
              <strong>Extra water bottles</strong> beyond the pre-agreed meal plan will not be provided. However, two
              water filters will be arranged for general guest use.
            </TermsPoint>
            <TermsPoint number={31}>
              Any <strong>special items</strong> like Pan Beda, Ice Cream, or Specialty Sweets will be provided{' '}
              <strong>once</strong> as per the agreed menu. General food items will be served <strong>unlimited</strong>{' '}
              unless otherwise specified.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Building2} title="Venue, Cleaning & Infrastructure Policy">
            <TermsPoint number={32}>
              If the <strong>marriage hall is booked by the client</strong>, <strong>cleaning responsibilities</strong>{' '}
              fall entirely on the client. The event team will not provide manpower for this task.
            </TermsPoint>
            <TermsPoint number={33}>
              The client is responsible for arranging <strong>water, electricity, cylinder refills, and</strong>{' '}
              cleaning supplies for the venue, including grinder and vessel washing.
            </TermsPoint>
            <TermsPoint number={34}>
              <strong>Stage decoration, hall cleaning, and room cleaning</strong> are not the responsibility of the event
              management team.
            </TermsPoint>
            <TermsPoint number={35}>
              The event management team will also not be responsible for <strong>guests&apos; personal belongings or
              client&apos;s belongings during the event</strong>.
            </TermsPoint>
            <TermsPoint number={36}>
              <strong>Guest room arrangements are the sole responsibility of the client</strong>. The event management
              team will not handle or arrange guest accommodations.
            </TermsPoint>
            <TermsPoint number={37}>
              It is <strong>mandatory</strong> for the client to <strong>book one room</strong> exclusively for the event
              management team. <strong>This room should be located within the marriage hall premises</strong> for the
              convenience of the team.
            </TermsPoint>
            <TermsPoint number={38}>
              Dining hall setup, table arrangements, and chair arrangements will not be handled by the event management
              team. The client must make separate arrangements for these.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Truck} title="Transportation & Liability">
            <TermsPoint number={39}>
              If transportation is included in the package, any <strong>accidents, legal fines, or medical
              emergencies</strong> will be at the client&apos;s expense. The event management team will not cover these
              costs.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Megaphone} title="Permissions & Noise Regulations">
            <TermsPoint number={40}>
              As per government rules, <strong>music systems will be turned off after 10:00 PM</strong>. If continued use
              leads to complaints, the client is solely responsible for resolving them.
            </TermsPoint>
            <TermsPoint number={41}>
              Any <strong>special permissions</strong> for fireworks, fog systems, or outdoor decor must be obtained by
              the client. Any <strong>property damage caused by these</strong> will be the client&apos;s liability.
            </TermsPoint>
            <TermsPoint number={42}>
              The client is responsible for <strong>shock circuit issues</strong> or electrical faults at the venue.
            </TermsPoint>
            <TermsPoint number={43}>
              Any <strong>physical damage</strong> to event property caused by the client or their guests will be the
              client&apos;s financial responsibility.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={Sparkles} title="Decor & Presentation Policy">
            <TermsPoint number={44}>
              Decorations will match the <strong>agreed concept with 70-80% accuracy</strong>, depending on the location.
            </TermsPoint>
          </TermsSection>

          <TermsSection icon={RefreshCw} title="Event Changes Policy">
            <TermsPoint number={45}>
              Any changes to the event structure, design, or arrangements must be informed at least{' '}
              <strong>30 days before the event</strong> to allow time for adjustments.{' '}
              <strong>On-spot changes are not guaranteed</strong> and may incur extra charges.
            </TermsPoint>
          </TermsSection>

          <GlassCard variant="warm" className="space-y-4 text-center border-2 border-gold-400">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900 flex items-center justify-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              Client Confirmation
            </h2>
            <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
              Please carefully read and understand all terms and conditions before confirming the booking.
            </p>
            <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
              Acceptance of this agreement implies the client&apos;s acknowledgment and consent to the policies mentioned
              above.
            </p>
            <p className="text-xs text-maroon-700/80 italic">Signed copy required prior to the event.</p>
          </GlassCard>
        </>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
