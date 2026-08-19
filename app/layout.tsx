import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Great_Vibes, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/navigation/site-chrome';
import { EventBuilderProvider } from '@/lib/store/event-builder-context';
import { SITE } from '@/lib/site-config';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#07090F',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: 'SID Events | Premium Event Management Company in Davanagere, Karnataka',
    template: '%s | SID Events',
  },
  description: "Davanagere's #1 event company. Weddings, corporate events, birthdays and more, plus a live custom wedding package builder to plan every detail.",
  keywords: ['Event Management Davanagere', 'Wedding Planner Davanagere', 'Corporate Events Karnataka', 'South Indian Wedding', 'Custom Wedding Builder', 'Maternity Photoshoot Davanagere', 'Naming Ceremony Decoration'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SID Events | Premium Event Management Company in Davanagere, Karnataka',
    description: "Davanagere's #1 event company — weddings, corporate events, birthdays and more.",
    siteName: 'SID Events',
    url: SITE.siteUrl,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SID Events | Premium Event Management Company in Davanagere, Karnataka',
    description: "Davanagere's #1 event company — weddings, corporate events, birthdays and more.",
    images: ['/logo.png'],
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventPlanningBusiness',
  name: SITE.name,
  description: "Davanagere's #1 event management company - weddings, corporate events, birthdays, naming ceremonies, housewarming and maternity photoshoots.",
  url: SITE.siteUrl,
  logo: `${SITE.siteUrl}/logo.png`,
  image: `${SITE.siteUrl}/logo.png`,
  telephone: SITE.phoneDisplay,
  email: SITE.email,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3434/1B1, 1st Main, 6th Cross Road, MCC B Block',
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    postalCode: '577004',
    addressCountry: 'IN',
  },
  areaServed: ['Davanagere', 'Karnataka'],
  foundingDate: String(SITE.foundedYear),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${greatVibes.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-silk-100 text-maroon-950 min-h-screen flex flex-col selection:bg-gold-400 selection:text-maroon-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* Some antivirus/ad-block browser extensions (e.g. Bitdefender's
            TrafficLight) inject a bis_skin_checked attribute into every
            element right after the page loads, before React hydrates. React
            then sees it as a server/client mismatch and logs a hydration
            warning even though nothing is actually broken. This can't be
            fixed from app code (it's third-party DOM tampering, not our
            markup), so this strips the attribute as early as possible and
            keeps stripping it if the extension re-adds it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function c(){document.querySelectorAll('[bis_skin_checked]').forEach(function(el){el.removeAttribute('bis_skin_checked')})}c();new MutationObserver(c).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']})})();`,
          }}
        />
        <EventBuilderProvider>
          <SiteChrome>{children}</SiteChrome>
        </EventBuilderProvider>
      </body>
    </html>
  );
}
