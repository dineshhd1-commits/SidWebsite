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
  description: "SID Events is an event management company based in Davanagere, Karnataka, planning weddings, engagements, receptions, traditional functions and corporate events - with decoration, photography and catering handled end-to-end.",
  keywords: [
    'Event Management Davanagere',
    'Best Wedding Planner Davanagere',
    'Event Organizers in Davanagere',
    'Wedding Decoration Karnataka',
    'Haldi Decoration Davanagere',
    'Stage Decoration Davanagere',
    'Catering Services Davanagere',
    'Brahmin Wedding Catering Karnataka',
    'Wedding Photography Davanagere',
    'Pre-Wedding Shoot Davanagere',
    'Reception Event Planner Davanagere',
    'Naming Ceremony Decoration Davanagere',
    'Corporate Events Karnataka',
    'South Indian Wedding Planner',
    'SID Events Davanagere',
  ],
  alternates: {
    canonical: '/',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'c_o4Q6vF5yXf8T3u',
  },
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Davanagere, Karnataka, India',
    'geo.position': '14.4644;75.9218',
    'ICBM': '14.4644, 75.9218',
  },
  openGraph: {
    title: 'SID Events | Event Management Company in Davanagere, Karnataka',
    description: 'Weddings, engagements, traditional functions and corporate events in Davanagere, Karnataka - decoration, photography and catering planned end-to-end.',
    siteName: 'SID Events',
    url: SITE.siteUrl,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'SID Events - Event Management in Davanagere, Karnataka',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SID Events | Event Management Company in Davanagere, Karnataka',
    description: 'Weddings, engagements, traditional functions and corporate events in Davanagere, Karnataka - decoration, photography and catering planned end-to-end.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventPlanningBusiness',
  '@id': `${SITE.siteUrl}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  description: 'SID Events plans and manages weddings, engagements, receptions, traditional home functions, housewarmings and corporate events in Davanagere, Karnataka, including decoration, photography, videography and catering.',
  url: SITE.siteUrl,
  logo: `${SITE.siteUrl}/logo.png`,
  image: `${SITE.siteUrl}/logo.png`,
  telephone: SITE.phoneDisplay,
  email: SITE.email,
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
  hasMap: `https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3434/1B1, 1st Main, 6th Cross Road, MCC B Block',
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    postalCode: '577004',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.4644,
    longitude: 75.9218,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Davanagere' },
    { '@type': 'City', name: 'Harihara' },
    { '@type': 'City', name: 'Chitradurga' },
    { '@type': 'City', name: 'Shivamogga' },
    { '@type': 'City', name: 'Ranebennur' },
    { '@type': 'City', name: 'Bhadravati' },
    { '@type': 'City', name: 'Hubballi' },
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Karnataka' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '128',
    bestRating: '5',
    worstRating: '1',
  },
  foundingDate: String(SITE.foundedYear),
  sameAs: [SITE.instagramUrl, SITE.facebookUrl],
  makesOffer: [
    'Wedding Event Management',
    'Engagement & Reception Events',
    'Traditional Home Functions (Haldi, Shrimanthakarya, Half-Saree Function, Housewarming)',
    'Corporate Events',
    'Event Decoration',
    'Photography & Videography',
    'Pre-Wedding Shoots',
    'Catering',
  ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best event management and wedding planning company in Davanagere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SID Events is widely recognized as the leading full-service event management company in Davanagere, Karnataka. With over a decade of experience, SID Events specializes in weddings, traditional ceremonies, housewarmings, photography, decor, and authentic South Indian catering.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I calculate the cost of a wedding or event in Davanagere online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can use the SID Events Custom Package Builder on our website to select your event type, guest count, decoration concepts, photography tiers, and full catering menus. An itemized quote with total price estimate is generated instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide authentic South Indian vegetarian catering for traditional weddings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SID Events provides master chef-prepared authentic South Indian and North Indian vegetarian catering, including traditional plantain leaf banquet menus, breakfast, lunch, high tea, and grand reception dinner spreads with signature regional delicacies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which locations does SID Events serve across Karnataka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SID Events is headquartered in Davanagere and manages events across Central and Southern Karnataka, including Harihara, Chitradurga, Shivamogga, Ranebennur, Haveri, Hubballi, and Bengaluru.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book my wedding or ceremony with SID Events?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend booking 1 to 3 months in advance for prime wedding dates and auspicious muhurtham days to ensure complete date exclusivity, vendor coordination, and customized stage fabrication.',
      },
    },
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.siteUrl}/#website`,
  name: SITE.name,
  url: SITE.siteUrl,
  publisher: {
    '@id': `${SITE.siteUrl}/#organization`,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
            __html: `(function(){
              function c(){document.querySelectorAll('[bis_skin_checked]').forEach(function(el){el.removeAttribute('bis_skin_checked')})}
              c();
              new MutationObserver(c).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});
              function preventMediaMenu(e){
                var t = e.target;
                if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.tagName === 'SOURCE' || t.closest('img') || t.closest('video') || t.closest('[data-lightbox]') || t.closest('.no-context-menu'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
              window.addEventListener('contextmenu', preventMediaMenu, true);
              document.addEventListener('contextmenu', preventMediaMenu, true);
              window.addEventListener('dragstart', function(e){
                var t = e.target;
                if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);
            })();`,
          }}
        />
        <EventBuilderProvider>
          <SiteChrome>{children}</SiteChrome>
        </EventBuilderProvider>
      </body>
    </html>
  );
}
