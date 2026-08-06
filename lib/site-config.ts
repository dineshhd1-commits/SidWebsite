export const SITE = {
  name: 'SID Events',
  legalName: 'SID Events',
  tagline: "Davanagere's Top 1 Event Company",
  foundedYear: 2014,
  city: 'Davanagere',
  state: 'Karnataka',
  address: 'S I D Events, 3434/1B1, 1st main, 6th Cross Road, behind गुंडी विद्यालय, MCC B Block, Davangere, Karnataka 577004',
  phoneDisplay: '+91 80954 08404',
  phoneHref: 'tel:+918095408404',
  whatsappNumber: '918095408404',
  email: 'sideventsdvg@gmail.com',
  instagramUrl: 'https://www.instagram.com/sideventsdvg/',
  facebookUrl: 'https://www.facebook.com/sideventsdvg/',
  googleRating: '4.9/5',
  // IMPORTANT: replace with the real production domain before/at deploy time.
  // Used for the sitemap, robots.txt, canonical/OG metadata and JSON-LD.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

export const SITE_STATS = [
  { label: 'EVENTS MANAGED', value: '500+' },
  { label: 'YEARS EXPERIENCE', value: '10+' },
  { label: 'HAPPY CLIENTS', value: '100+' },
  { label: 'GOOGLE RATING', value: '4.9/5' },
] as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
