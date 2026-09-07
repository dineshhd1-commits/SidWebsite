'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Smartphone,
  Users,
  Camera,
  Cookie,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';

function PrivacySection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard variant="warm" className="space-y-4">
      <div className="flex items-center gap-3 border-b border-gold-200 pb-3">
        <span className="w-9 h-9 rounded-lg bg-maroon-900 text-gold-300 flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-5 h-5" />
        </span>
        <h2 className="font-playfair text-lg sm:text-xl font-bold text-maroon-900">{title}</h2>
      </div>
      <div className="space-y-3 text-sm text-maroon-900/90 leading-relaxed">{children}</div>
    </GlassCard>
  );
}

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sideventsmanagement.com' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://sideventsmanagement.com/privacy' },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-100 text-maroon-900 border border-gold-300">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
          Transparency &amp; Trust
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-900">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-maroon-800 max-w-2xl mx-auto">
          SID Events Management is committed to protecting your personal information and event details.
          This policy explains how we collect, use, and safeguard your data.
        </p>
        <p className="text-xs text-maroon-600/80">Last Updated: September 2026 | Effective Date: September 2026</p>
      </div>

      <TraditionalBorder />

      {/* 1. Introduction */}
      <PrivacySection icon={ShieldCheck} title="1. Introduction & Overview">
        <p>
          Welcome to <strong>SID Events</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), Davanagere&apos;s premier event
          management, catering, and celebration company. We respect your privacy and are committed to maintaining the confidentiality
          and integrity of your personal information.
        </p>
        <p>
          This Privacy Policy describes our practices regarding the information collected through our website
          (<strong>sideventsmanagement.com</strong>), our custom event package builder, inquiry forms, direct calls,
          and WhatsApp communications.
        </p>
      </PrivacySection>

      {/* 2. Information We Collect */}
      <PrivacySection icon={Eye} title="2. Information We Collect">
        <p>To provide seamless event planning and quotation services, we may collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-maroon-900/90">
          <li>
            <strong>Contact Details:</strong> Full name, phone number, WhatsApp contact, and email address.
          </li>
          <li>
            <strong>Event Particulars:</strong> Event type (e.g., Wedding, Reception, Birthday, Corporate), event date,
            timings (Morning, Afternoon, Evening), venue location, and expected guest count.
          </li>
          <li>
            <strong>Service Preferences:</strong> Selected catering menus, dietary restrictions, decoration concepts, stage preferences,
            photography packages, and entertainment options chosen via our Custom Package Builder.
          </li>
          <li>
            <strong>Technical Data:</strong> Browser type, device details, and general interaction data collected automatically via cookies
            to ensure fast and error-free booking experiences.
          </li>
        </ul>
      </PrivacySection>

      {/* 3. How We Use Your Information */}
      <PrivacySection icon={FileText} title="3. How We Use Your Information">
        <p>We use your information strictly for legitimate event management and customer service purposes, including:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-gold-50/70 border border-gold-200">
            <h3 className="font-semibold text-maroon-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Quotation Generation
            </h3>
            <p className="text-xs text-maroon-800">
              Generating transparent, itemized PDF estimates tailored to your guest count and chosen menus.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gold-50/70 border border-gold-200">
            <h3 className="font-semibold text-maroon-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Event Coordination
            </h3>
            <p className="text-xs text-maroon-800">
              Coordinating venue setup, catering preparation, photography timelines, and vendor schedules.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gold-50/70 border border-gold-200">
            <h3 className="font-semibold text-maroon-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Customer Support
            </h3>
            <p className="text-xs text-maroon-800">
              Answering queries, updating date reservations, managing changes, and providing post-event assistance.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gold-50/70 border border-gold-200">
            <h3 className="font-semibold text-maroon-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Invoicing &amp; CRM
            </h3>
            <p className="text-xs text-maroon-800">
              Maintaining accurate transaction records, milestone advance payment receipts, and booking vouchers.
            </p>
          </div>
        </div>
      </PrivacySection>

      {/* 4. WhatsApp & Communication */}
      <PrivacySection icon={Smartphone} title="4. WhatsApp & Communication Policy">
        <p>
          When you submit an inquiry or build an event package, you consent to receive communications from SID Events via phone call,
          SMS, and WhatsApp regarding your quotation and event planning.
        </p>
        <p>
          <strong>No Spam Guarantee:</strong> We do not spam or sell your contact numbers. You will only receive relevant event
          updates, PDF summaries, payment receipts, or coordination messages from our dedicated team. You may opt out of promotional messages
          at any time by replying &ldquo;STOP&rdquo; or notifying your event coordinator.
        </p>
      </PrivacySection>

      {/* 5. Sharing of Information */}
      <PrivacySection icon={Users} title="5. Vendor Sharing &amp; Third Parties">
        <p>
          We do <strong>not</strong> sell, rent, or lease your personal information to third-party marketing companies.
        </p>
        <p>
          We share event details (such as venue location, guest count, and catering requirements) solely with our verified operational
          partners—such as our master chefs, florists, stage fabricators, and certified photographers—strictly on a need-to-know basis
          to successfully deliver your event.
        </p>
      </PrivacySection>

      {/* 6. Data Security */}
      <PrivacySection icon={Lock} title="6. Data Protection & Security">
        <p>
          We implement industry-standard physical, electronic, and procedural safeguards to protect your personal information against
          unauthorized access, loss, misuse, or alteration.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-maroon-900/90">
          <li>All web interactions are encrypted using Secure Socket Layer (SSL / HTTPS) technology.</li>
          <li>Database records and event files in our CRM are protected by strict role-based access controls.</li>
          <li>We do not store your credit card, debit card, or net-banking PINs on our servers.</li>
        </ul>
      </PrivacySection>

      {/* 7. Photography & Portfolio Consent */}
      <PrivacySection icon={Camera} title="7. Photography &amp; Event Media Policy">
        <p>
          As a creative event design studio, we take pride in showcasing decor, floral artistry, stage setups, and culinary
          presentations in our gallery and social media portfolio.
        </p>
        <p>
          If you prefer your private celebrations, family portraits, or decor to remain completely private and excluded from our public
          portfolio, simply notify us in writing before or at the time of signing your booking agreement, and we will strictly honour your
          preference.
        </p>
      </PrivacySection>

      {/* 8. Cookies */}
      <PrivacySection icon={Cookie} title="8. Cookies & Local Storage">
        <p>
          Our website uses standard session cookies and browser local storage to preserve your selections as you navigate through our
          Custom Package Builder (such as your chosen event type, catering dishes, and estimated calculations). These cookies do not contain
          sensitive personal data and can be cleared through your browser settings at any time.
        </p>
      </PrivacySection>

      {/* 9. Contact & Grievance */}
      <GlassCard variant="warm" className="space-y-4 border-2 border-gold-400">
        <div className="flex items-center gap-3 border-b border-gold-200 pb-3">
          <span className="w-9 h-9 rounded-lg bg-maroon-900 text-gold-300 flex items-center justify-center shrink-0 shadow-sm">
            <Mail className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-maroon-900">
              9. Contact Us &amp; Grievance Redressal
            </h2>
            <p className="text-xs text-maroon-700">Have questions about your data or wish to update your details?</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-maroon-900 pt-1">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-maroon-950">Office Address</p>
              <p className="text-xs text-maroon-800">Davanagere, Karnataka, India</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-gold-700 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-maroon-950">Phone / WhatsApp</p>
              <a href="tel:+919876543210" className="text-xs text-maroon-800 hover:text-maroon-950 underline">
                +91 91136 67355
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-gold-700 shrink-0 mt-1" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-maroon-950">Email Inquiries</p>
              <a href="mailto:info@sideventsmanagement.com" className="text-xs text-maroon-800 hover:text-maroon-950 underline">
                contact@sideventsmanagement.com
              </a>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-gold-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <Link
            href="/terms-and-conditions"
            className="text-maroon-800 hover:text-maroon-950 underline font-medium inline-flex items-center gap-1"
          >
            <span>View Terms &amp; Conditions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/custom-builder"
            className="px-4 py-2 rounded-xl bg-maroon-900 text-gold-200 hover:text-white font-medium shadow transition-all border border-gold-400/40"
          >
            Plan Your Event
          </Link>
        </div>
      </GlassCard>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
