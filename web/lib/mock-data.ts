import {
  WeddingService,
  StandardPackage,
  CustomBuilderState,
  GalleryItem,
  Testimonial,
} from './types/wedding';
import { toAssetUrl } from './asset-url';
import { WEDDING_PORTFOLIO_ASSETS as WEDDING_PORTFOLIO_ASSETS_LOCAL } from './data/wedding-portfolio-assets';
import { RECEPTION_PORTFOLIO_ASSETS as RECEPTION_PORTFOLIO_ASSETS_LOCAL } from './data/reception-portfolio-assets';
import { PREWEDDING_PORTFOLIO_ASSETS as PREWEDDING_PORTFOLIO_ASSETS_LOCAL } from './data/prewedding-portfolio-assets';
import { NAMING_PORTFOLIO_ASSETS as NAMING_PORTFOLIO_ASSETS_LOCAL } from './data/naming-portfolio-assets';
import { CRADLE_PORTFOLIO_ASSETS as CRADLE_PORTFOLIO_ASSETS_LOCAL } from './data/cradle-portfolio-assets';
import { GRIHA_PRAVESH_PORTFOLIO_ASSETS as GRIHA_PRAVESH_PORTFOLIO_ASSETS_LOCAL } from './data/griha-pravesh-portfolio-assets';
import { ANNIVERSARY_PORTFOLIO_ASSETS as ANNIVERSARY_PORTFOLIO_ASSETS_LOCAL } from './data/anniversary-portfolio-assets';
import { CORPORATE_PORTFOLIO_ASSETS as CORPORATE_PORTFOLIO_ASSETS_LOCAL } from './data/corporate-portfolio-assets';
import { HALDI_PORTFOLIO_ASSETS as HALDI_PORTFOLIO_ASSETS_LOCAL } from './data/haldi-portfolio-assets';
import { PHOTOBOOTH_PORTFOLIO_ASSETS as PHOTOBOOTH_PORTFOLIO_ASSETS_LOCAL } from './data/photobooth-portfolio-assets';
import { PASSAGE_PORTFOLIO_ASSETS as PASSAGE_PORTFOLIO_ASSETS_LOCAL } from './data/passage-portfolio-assets';
import { CANDID_PORTFOLIO_ASSETS as CANDID_PORTFOLIO_ASSETS_LOCAL } from './data/candid-portfolio-assets';

// These 13 arrays hold local /public paths (see lib/data/*-portfolio-assets.ts).
// Mapped once here through toAssetUrl() so every consumer below gets the
// Supabase Storage URL (once scripts/upload-site-assets.mjs has uploaded
// them there) without touching ~2000 lines of filenames or every render site.
const WEDDING_PORTFOLIO_ASSETS = WEDDING_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const RECEPTION_PORTFOLIO_ASSETS = RECEPTION_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const PREWEDDING_PORTFOLIO_ASSETS = PREWEDDING_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const NAMING_PORTFOLIO_ASSETS = NAMING_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const CRADLE_PORTFOLIO_ASSETS = CRADLE_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const GRIHA_PRAVESH_PORTFOLIO_ASSETS = GRIHA_PRAVESH_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const ANNIVERSARY_PORTFOLIO_ASSETS = ANNIVERSARY_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const CORPORATE_PORTFOLIO_ASSETS = CORPORATE_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const HALDI_PORTFOLIO_ASSETS = HALDI_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const PHOTOBOOTH_PORTFOLIO_ASSETS = PHOTOBOOTH_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const PASSAGE_PORTFOLIO_ASSETS = PASSAGE_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);
const CANDID_PORTFOLIO_ASSETS = CANDID_PORTFOLIO_ASSETS_LOCAL.map(toAssetUrl);

/** Generic deep-walk fallback for the handful of literal /public paths
 * scattered directly in MOCK_SERVICES/MOCK_STANDARD_PACKAGES/MOCK_GALLERY
 * below (hero images, service thumbnails, etc) that aren't already covered
 * by the portfolio-asset arrays above - converts any string field matching
 * a local asset path to its Supabase Storage URL, recursively, regardless
 * of field name. */
function deepToAssetUrl<T>(value: T): T {
  if (typeof value === 'string') {
    return (/^\/.+\.(jpg|jpeg|png|webp|avif|svg|gif|mp4)$/i.test(value) ? toAssetUrl(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepToAssetUrl(v)) as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>)) {
      out[k] = deepToAssetUrl((value as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  return value;
}

const MOCK_SERVICES_LOCAL: WeddingService[] = [
  // Step 1 – Decoration (Featured & Entertainment)
  {
    id: 'dec-fog-machine',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Low Fog Cloud Effect Machine',
    description: 'Heavy cloud low fog dry ice effect for couple stage entry and first dance.',
    price: 15000,
    unit: 'event',
    imageUrl: '/Gemini_Generated_Image_drzo1ddrzo1ddrzo.webp',
    popular: true,
  },
  // Step 1 – Decoration (Home Functions)
  {
    id: 'dec-home-decor',
    category: 'decoration',
    subCategory: 'home_functions',
    name: 'Traditional Home Decoration',
    description: 'Fresh mango leaf toran, lotus urli welcome setup, flower rangoli & living room silk drapes.',
    price: 25000,
    unit: 'setup',
    imageUrl: '/sid-party28.jpeg',
    popular: true,
  },
  {
    id: 'dec-chepparam',
    category: 'decoration',
    subCategory: 'home_functions',
    name: 'Chepparam Manthapa Backdrop',
    description: 'Authentic temple architectural backdrop with brass lamps, bells, and golden silk drapes.',
    price: 45000,
    unit: 'setup',
    imageUrl: '/sid-party32.jpeg',
  },
  {
    id: 'dec-mehndi',
    category: 'decoration',
    subCategory: 'home_functions',
    name: 'Mehndi Ceremony Canopy',
    description: 'Vibrant marigold & green foliage canopy with traditional flower swing & bolster seating.',
    price: 30000,
    unit: 'setup',
    imageUrl: '/sid-party35.jpeg',
  },
  {
    id: 'dec-haldi',
    category: 'decoration',
    subCategory: 'home_functions',
    name: 'Haldi Ceremony Setup',
    description: 'Bright yellow marigold backdrop, brass urlis with flower petals & hand-painted mats.',
    price: 30000,
    unit: 'setup',
    imageUrl: '/WhatsApp Image 2026-07-26 at 4.47.06 PM (1).jpeg',
    popular: true,
  },
  {
    id: 'dec-house-lighting',
    category: 'decoration',
    subCategory: 'home_functions',
    name: 'Full House & Venue Illumination',
    description: 'Warm fairy light canopy, serial lamps, and dynamic floodlights for venue and home exterior.',
    price: 35000,
    unit: 'package',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },

  // Step 1 – Decoration (Wedding Hall)
  {
    id: 'dec-front-gate',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Front Gate Arch Decoration',
    description: 'Grand welcoming arch filled with fresh orchids, carnations & banana trunk pillars.',
    price: 35000,
    unit: 'entrance',
    imageUrl: '/sid-party24.jpeg',
  },
  {
    id: 'dec-pathway',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Floral Pathway & Lotus Pillars',
    description: 'Red carpet walkway lined with illuminated lotus brass pillars & flower urns.',
    price: 25000,
    unit: 'pathway',
    imageUrl: '/sid-party25.jpeg',
  },
  {
    id: 'dec-entrance-gate',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Entrance Foyer & Rangoli Setup',
    description: 'Grand entrance arch decorated with fresh flowers, traditional brass lamps & flower rangoli.',
    price: 40000,
    unit: 'foyer',
    imageUrl: '/Gemini_Generated_Image_p4o0ivp4o0ivp4o0.webp',
    popular: true,
  },
  {
    id: 'dec-photobooth',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'South Indian Heritage Photo Booth',
    description: 'Vintage brass mirror, silk drapes, peacock feather motif, and royal wooden swing setup.',
    price: 28000,
    unit: 'booth',
    imageUrl: '/Gemini_Generated_Image_110eey110eey110e.webp',
  },
  {
    id: 'dec-stage',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Royal Stage Floral Backdrop',
    description: 'Extravagant flower wall stage setup with royal couches, golden frame arches & ambient spotlights.',
    price: 85000,
    unit: 'stage',
    imageUrl: '/sid-party15.jpeg',
  },
  {
    id: 'dec-muhurtha-mandapam',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Traditional Muhurtha Manthapa',
    description: 'Sacred 4-pillar manthapa carved with wooden motifs, banana trees, fresh coconut flowers & hanging jasmine veni.',
    price: 120000,
    unit: 'setup',
    imageUrl: '/sid-party29.jpeg',
  },
  {
    id: 'dec-saptapadi-mandapam',
    category: 'decoration',
    subCategory: 'wedding_hall',
    name: 'Saptapadi Royal Brass Manthapa',
    description: 'Grand traditional brass manthapa decorated with fresh jasmine, marigold, lotus garlands & banana trunk pillars.',
    price: 150000,
    unit: 'setup',
    imageUrl: '/Gemini_Generated_Image_nlsfrwnlsfrwnlsf.webp',
    popular: true,
  },

  // Step 1 – Decoration (Floral Items)
  {
    id: 'dec-wedding-garlands',
    category: 'decoration',
    subCategory: 'floral_items',
    name: 'Sacred Wedding Garlands (Fresh Flower Varmala Pair)',
    description: 'Handcrafted fresh Jasmine, Red Rose, Orchids & Pink Lotus Varmala pair for bride & groom.',
    price: 18000,
    unit: 'pair',
    imageUrl: '/Gemini_Generated_Image_mwji35mwji35mwji.webp',
    popular: true,
  },

  // Step 1 – Decoration (Traditional Services)
  {
    id: 'dec-doli',
    category: 'decoration',
    subCategory: 'traditional_services',
    name: 'Royal Doli Valagam (Palanquin Bride Entry)',
    description: 'Hand-carved wooden floral Doli decorated with silk drapes & flowers, carried by 4 uniformed palanquin bearers.',
    price: 25000,
    unit: 'entry',
    imageUrl: '/Gemini_Generated_Image_mrs98imrs98imrs9.webp',
  },
  {
    id: 'dec-nadaswaram',
    category: 'decoration',
    subCategory: 'traditional_services',
    name: 'Live Nadhaswaram & Thavil Ensemble',
    description: 'Traditional auspicious live Nadaswaram music team playing classical ragas throughout the ceremony.',
    price: 35000,
    unit: 'per event',
    imageUrl: '/ChatGPT Image Jul 28, 2026, 04_57_21 PM.jpg',
    popular: true,
  },

  // Step 1 – Decoration (Entertainment)
  {
    id: 'dec-band-set',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Procession Brass Band Set (Jaanvasa / Barat)',
    description: '12-member traditional brass band with brass drums & trumpets welcoming groom procession.',
    price: 30000,
    unit: 'event',
    imageUrl: '/Gemini_Generated_Image_ccs34nccs34nccs3.webp',
  },
  {
    id: 'dec-orchestra',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Live Music Orchestra & Vocalists',
    description: 'Full live orchestra with vocalists performing South Indian film songs & classical melodies during reception.',
    price: 60000,
    unit: 'performance',
    imageUrl: '/Gemini_Generated_Image_8f6wrb8f6wrb8f6w.webp',
  },
  {
    id: 'dec-cold-fire',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Cold Fire Sparklers & Varmala Jets',
    description: 'Stunning 6 cold sparkler pyro jets for grand varmala & couple entry moments.',
    price: 18000,
    unit: 'event',
    imageUrl: '/Gemini_Generated_Image_la9ccmla9ccmla9c.webp',
  },
  {
    id: 'dec-crackers',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Safe Pyrotechnics & Flower Crackers',
    description: 'Eco-friendly aerial flower shots and sparklers for outdoor celebration.',
    price: 25000,
    unit: 'event',
    imageUrl: '/Gemini_Generated_Image_glaxgjglaxgjglax.webp',
  },
  {
    id: 'dec-colour-pots',
    category: 'decoration',
    subCategory: 'entertainment',
    name: 'Colour Smoke Pots & Flare Shots',
    description: 'Vibrant non-toxic colour smoke pots for lively haldi entry and couple photoshoots.',
    price: 12000,
    unit: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },

  // Step 2: Food & Catering Base Items
  {
    id: 'food-veg-standard',
    category: 'food',
    name: 'Standard Pure Veg Banana Leaf Feast',
    description: '28-item traditional banana leaf sadhya including Payasam, Bisi Bele Bath, Avial, Vadai & Mysuru Pak.',
    price: 450,
    unit: 'per plate',
    imageUrl: '/onam-sadhya-lunch-menu-1.webp',
  },
  {
    id: 'food-veg-silver',
    category: 'food',
    name: 'Silver Grand South Indian Buffet',
    description: '35-item lavish veg buffet with live Dosa counter, live Appam counter & 3 sweet varieties.',
    price: 650,
    unit: 'per plate',
    imageUrl: '/onam-sadhya-lunch-menu-1.webp',
    popular: true,
  },
  {
    id: 'food-veg-gold',
    category: 'food',
    name: 'Gold Royal Fusion & Traditional Buffet',
    description: '45-item extravaganza featuring South Indian, North Indian live tandoor, mocktail bar & artisan ice creams.',
    price: 950,
    unit: 'per plate',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'food-veg-premium',
    category: 'food',
    name: 'Premium Samrat International & Vedic Feast',
    description: 'Unlimited 55-item gourmet spread with live Chat stations, Italian pizza oven, live Jalebi & artisan ice creams.',
    price: 1250,
    unit: 'per plate',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },

  // Step 3: Photography
  {
    id: 'photo-candid-video',
    category: 'photography',
    name: 'Traditional & Candid Photography Team',
    description: '2 Candid Photographers + 2 Traditional Videographers + 4K Wedding Highlight Film.',
    price: 120000,
    unit: 'package',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },

  // Step 4: Makeup
  {
    id: 'makeup-bride-royal',
    category: 'makeup',
    name: 'Royal HD Bridal Makeup & Saree Draping',
    description: 'Airbrush HD Makeup, authentic temple jewelry styling, flower veni placement, & Kanchipuram drape.',
    price: 35000,
    unit: 'package',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },

  // Step 5: Purohit
  {
    id: 'purohit-vedic',
    category: 'purohit',
    name: 'Senior Vedic Purohit & Assistant Team',
    description: 'Experienced Vedic scholars performing complete Muhurtham, Ganapathi Homa, Saptapadi & Ashirvadam.',
    price: 30000,
    unit: 'package',
    imageUrl: '/ChatGPT Image Jul 28, 2026, 11_34_17 AM.jpg',
    popular: true,
  },

  // Step 6: Security
  {
    id: 'security-bouncer',
    category: 'security',
    name: 'Professional Event Bouncers (Male/Female)',
    description: 'Uniformed professional security personnel for crowd control & VIP management.',
    price: 2500,
    unit: 'per guard/day',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },

  // Step 7: Welcome Girls
  {
    id: 'welcome-girls',
    category: 'welcome_girls',
    name: 'Traditional Welcome Girls in Kanchipuram Silk',
    description: 'Graceful hostesses with floral Aarathi plates, chandan, kumkum & rose water spray.',
    price: 4000,
    unit: 'per hostess/day',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },

  // Step 8: Dancers & Cultural
  {
    id: 'dancers-dollu-kunitha',
    category: 'dancers',
    name: 'Traditional Dollu Kunitha / Chenda Melam Troupe',
    description: '10-member energetic traditional drum performance welcoming guests & groom procession.',
    price: 35000,
    unit: 'performance',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },
];

export interface BusinessOffering {
  id: string;
  title: string;
  description: string;
  iconKey: 'camera' | 'palette' | 'utensils' | 'makeup' | 'purohit' | 'music';
  /** Optional - services without a verified photo render an icon card instead
   * of borrowing a stock image that doesn't actually depict the service. */
  imageUrl?: string;
}

const BUSINESS_OFFERINGS_LOCAL: BusinessOffering[] = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Traditional and candid photography and videography, drone coverage, LED wall and live streaming.',
    iconKey: 'camera',
    imageUrl: '/photography-videography-collage.jpg',
  },
  {
    id: 'decoration',
    title: 'Decoration',
    description: 'Stage, manthapa, entrance and home decor in Silver, Gold and Platinum tiers with floral and lighting design.',
    iconKey: 'palette',
    imageUrl: '/sid-party29.jpeg',
  },
  {
    id: 'catering',
    title: 'Catering',
    description: 'Full South Indian menus for breakfast, lunch and dinner - from welcome drinks and starters to desserts and paan.',
    iconKey: 'utensils',
    imageUrl: '/onam-sadhya-lunch-menu-1.webp',
  },
  {
    id: 'makeup',
    title: 'Makeup',
    description: 'Bridal and groom makeup, HD and airbrush styling, hair and saree draping by professional artists.',
    iconKey: 'makeup',
    imageUrl: '/services/makeup.jpg',
  },
  {
    id: 'purohit',
    title: 'Purohit',
    description: 'Experienced purohit for all rituals, complete samagri arrangement and muhurtham guidance.',
    iconKey: 'purohit',
    imageUrl: '/services/purohit.jpg',
  },
  {
    id: 'sound-and-music',
    title: 'Sound & Music',
    description: 'DJ, live music, PA and sound systems, and traditional Nadaswaram ensembles for every function.',
    iconKey: 'music',
    imageUrl: '/services/sound-and-music.jpg',
  },
];
export const BUSINESS_OFFERINGS: BusinessOffering[] = deepToAssetUrl(BUSINESS_OFFERINGS_LOCAL);
export const MOCK_SERVICES: WeddingService[] = deepToAssetUrl(MOCK_SERVICES_LOCAL);

const MOCK_STANDARD_PACKAGES_LOCAL: StandardPackage[] = [
  {
    id: 'pkg-silver',
    name: 'Silver Wedding Package',
    tagline: 'Elegance and Tradition for Intimate Celebrations',
    tier: 'silver',
    basePrice: 350000,
    guestCapacity: 300,
    description: 'Ideal for 300 guests including essential manthapa decoration, banana leaf feast, candid photography & Purohit services.',
    breakdown: {
      decoration: 'Chepparam Fresh Flower Manthapa & Stage Setup',
      catering: '300 Guests Pure Veg Traditional Banana Leaf Sadhya (28 Items)',
      photography: '2 Event Photographers + 1 Standard Album',
      makeup: 'HD Bride Makeup & Saree Draping',
      purohit: 'Senior Vedic Pundit with Muhurtham Samagri',
      entertainment: 'Live Auspicious Nadhaswaram Artists (2 Hours)',
    },
    featuredInclusions: [
      'Chepparam Fresh Flower Manthapa',
      '300 Guests Pure Veg Banana Leaf Feast',
      'Candid Photography & 1 High-Quality Album',
      'Senior Vedic Purohit with Samagri',
      'Nadhaswaram Live Artists (2 Hours)',
      'Bridal Makeup & Saree Styling',
    ],
  },
  {
    id: 'pkg-gold',
    name: 'Gold Wedding Package',
    tagline: 'Our Most Popular South Indian Grand Wedding Experience',
    tier: 'gold',
    basePrice: 650000,
    guestCapacity: 600,
    isPopular: true,
    description: 'Comprehensive luxury setup for 600 guests featuring Brass Manthapa, Live Dosa/Chaats, Drone film, LED Wall & Welcome girls.',
    breakdown: {
      decoration: 'Saptapadi Royal Brass Manthapa with Jasmine & Lotus Arch',
      catering: '600 Guests Multi-Cuisine Fusion Buffet & Live Dosa Bar',
      photography: '2 Candid + 2 Videographers + 4K Drone + Karizma Album',
      makeup: 'Royal Airbrush Makeup for Bride & Groom Styling',
      purohit: 'Senior Vedic Pundit Team with Ganapathi Homa',
      entertainment: 'Live Chenda Melam / Dollu Kunitha & Cold Fire Pyrotechnics',
    },
    featuredInclusions: [
      'Saptapadi Brass Manthapa with Fresh Jasmine & Lotus',
      '600 Guests Multi-Cuisine Fusion Buffet',
      '4K Cinematic Drone Film + 2 Karizma Albums',
      'Vedic Purohit Team for All Pre & Post Rituals',
      '4 Traditional Welcome Girls in Silk Sarees',
      'Cold Fire & Low-Fog Varmala Entry',
      'Live Chenda Melam / Dollu Kunitha Troupe',
    ],
  },
  {
    id: 'pkg-diamond',
    name: 'Diamond Wedding Package',
    tagline: 'Opulent Splendor & Flawless Hospitality',
    tier: 'diamond',
    basePrice: 1200000,
    guestCapacity: 1000,
    description: 'Unmatched luxury for up to 1000 guests featuring grand floral pathways, live mocktail bars, 6 welcome hostesses & VIP bouncers.',
    breakdown: {
      decoration: 'Custom Temple Architecture Stage & Full Illumination Lighting',
      catering: '1000 Guests 45-Item Royal Buffet & Artisan Sweet Counters',
      photography: '6-Member Photo/Video Crew + Live LED Wall Backdrop + Non-Tearable Album',
      makeup: 'Celebrity HD Airbrush Makeup for Bride, Groom & 4 Family Members',
      purohit: 'Senior Pundits for Ganapathi & Navagraha Homa with Full Kit',
      entertainment: 'Live Music Orchestra + Nadhaswaram + Bharatanatyam Recital',
    },
    featuredInclusions: [
      'Custom Temple Architecture Stage & Full Venue Illumination',
      '1000 Guests 45-Item Royal Buffet & Live Dessert Station',
      'Comprehensive 6-Member Photo/Video Crew + LED Screen Backdrop',
      'Airbrush HD Makeup for Bride, Groom & 4 Family Members',
      '6 Welcome Girls + 6 Uniformed Security Bouncers',
      'Nadhaswaram Ensemble + Live Classical Bharatanatyam',
      'Dedicated Event Director & On-Site Managers',
    ],
  },
  {
    id: 'pkg-royal',
    name: 'Royal Wedding Package',
    tagline: 'The Pinnacle of Regal South Indian Weddings',
    tier: 'royal',
    basePrice: 2200000,
    guestCapacity: 1500,
    description: 'Bespoke palace-level celebration for 1500+ guests with infinite customization, luxury cars, celebrity Purohits & drone pyrotechnics.',
    breakdown: {
      decoration: 'Bespoke Palace Architectural Transformation with Exotic Imported Flowers',
      catering: '1500+ Guests Gourmet Multi-Cuisine Feast & Unlimited Live Counters',
      photography: 'Celebrity Cinema Crew + Same-Day Reel + 3D Pre-Wedding Shoot',
      makeup: 'Celebrity Makeup Artist + Groom Grooming + 8 Family Members',
      purohit: 'Traditional Complete Vedic Package with Senior Pundit Team',
      entertainment: 'Fireworks Display + Royal Doli Entry + Full Fusion Dance Troupe',
    },
    featuredInclusions: [
      'Full Venue Architectural Transformation with Exotic Imported Flowers',
      'Unlimited 1500+ Guests Multi-Cuisine Gourmet Feast & Live Counters',
      'Celebrity Cinema Photography Team + Same-Day Edit Trailer',
      '8 Welcome Girls + 12 VIP Bouncers + Valet Parking Crew',
      'Royal Doli Entry & Fireworks Display',
      'Complete Pre-wedding photoshoot & 3D Stage Visualization',
      '24/7 Dedicated Concierge & Logistics Management',
    ],
  },
];
export const MOCK_STANDARD_PACKAGES: StandardPackage[] = deepToAssetUrl(MOCK_STANDARD_PACKAGES_LOCAL);

export const DEFAULT_BUILDER_STATE: CustomBuilderState = {
  currentStep: 1,
  selectedServices: {
    'dec-saptapadi-mandapam': { serviceId: 'dec-saptapadi-mandapam', quantity: 1 },
    'dec-nadaswaram': { serviceId: 'dec-nadaswaram', quantity: 1 },
  },
  catering: {
    guestCount: 500,
    meals: ['lunch'],
    cuisine: 'veg',
    packageTier: 'silver',
    liveCounters: ['Live Dosa Bar', 'Jangri & Mysuru Pak Counter'],
    welcomeDrinks: ['Elaneer (Tender Coconut)', 'Jigarthanda'],
  },
  photography: {
    packageTier: 'gold',
    includeDrone: true,
    includeLedWall: false,
    albumType: 'karizma',
    extraPhotographers: 0,
  },
  makeup: {
    packageTier: 'gold',
    brideCount: 1,
    groomCount: 1,
    familyCount: 2,
    trialRequired: true,
  },
  purohit: {
    packageTier: 'premium',
    language: 'kannada',
    homaRequired: true,
    specialRituals: 'Moolamantra Japam & Ashirvadam',
  },
  security: {
    maleBouncers: 4,
    femaleBouncers: 2,
    vipSecurity: true,
    parkingStaffCount: 4,
  },
  welcomeGirls: {
    count: 4,
    attire: 'traditional_saree',
    includeFlowerBasket: true,
    includeWelcomePlate: true,
  },
  dancers: {
    style: 'dollu_kunitha',
    durationHours: 3,
    performerCount: 8,
  },
};

const MOCK_GALLERY_LOCAL: GalleryItem[] = [
  // 1. Traditional Wedding & Muhurtham Ceremony (max 30 assets)
  {
    id: 'gal-wedding-collection',
    title: 'Traditional Wedding & Muhurtham Ceremony',
    category: 'traditional',
    mediaType: 'image',
    url: '/sid-party7.jpeg',
    images: WEDDING_PORTFOLIO_ASSETS,
  },

  // 2. Grand Reception & Stage Celebration (max 30 assets)
  {
    id: 'gal-reception-collection',
    title: 'Grand Reception & Stage Decor Collection',
    category: 'reception',
    mediaType: 'image',
    url: '/sid-party15.jpeg',
    images: RECEPTION_PORTFOLIO_ASSETS,
  },

  // 3. Real couple photography - pre-wedding shoots (max 30 assets)
  {
    id: 'gal-prewedding-collection',
    title: 'Pre-Wedding Couple Shoot Collection',
    category: 'photography',
    mediaType: 'image',
    url: '/forest-pre-wedding-shoot/forest-shoot-01.jpeg',
    images: PREWEDDING_PORTFOLIO_ASSETS,
  },

  // 4. Real client event photography - Naming Ceremony (max 30 assets)
  {
    id: 'gal-naming-ceremony-collection',
    title: 'Naming Ceremony (Namakarana) Collection',
    category: 'traditional',
    mediaType: 'image',
    url: '/sid-party17.jpeg',
    images: NAMING_PORTFOLIO_ASSETS,
  },

  // 5. Real client event photography - Cradle Ceremony / Thottilu Sastra (max 30 assets)
  {
    id: 'gal-cradle-ceremony-collection',
    title: 'Cradle Ceremony (Thottilu Sastra) Collection',
    category: 'traditional',
    mediaType: 'image',
    url: '/sid-party21.jpeg',
    images: CRADLE_PORTFOLIO_ASSETS,
  },

  // 6. Real client event photography - Griha Pravesh & Housewarming (max 30 assets)
  {
    id: 'gal-grihapravesh-collection',
    title: 'Griha Pravesh & Housewarming Collection',
    category: 'traditional',
    mediaType: 'image',
    url: '/sid-party22.jpeg',
    images: GRIHA_PRAVESH_PORTFOLIO_ASSETS,
  },

  // 7. Real client event photography - Wedding Anniversaries (15 assets)
  {
    id: 'gal-anniversary-collection',
    title: 'Silver & Golden Wedding Anniversary Collection',
    category: 'decoration',
    mediaType: 'image',
    url: '/sid-party16.jpeg',
    images: ANNIVERSARY_PORTFOLIO_ASSETS,
  },

  // 8. Haldi Function & Yellow Floral Decor (30 assets)
  {
    id: 'gal-haldi-collection',
    title: 'Haldi Function & Floral Decor Collection',
    category: 'traditional',
    mediaType: 'image',
    url: HALDI_PORTFOLIO_ASSETS[0],
    images: HALDI_PORTFOLIO_ASSETS,
  },

  // 9. Corporate Events & Conference Staging (30 assets)
  {
    id: 'gal-corporate-collection',
    title: 'Corporate Events & Conference Staging',
    category: 'decoration',
    mediaType: 'image',
    url: CORPORATE_PORTFOLIO_ASSETS[0],
    images: CORPORATE_PORTFOLIO_ASSETS,
  },

  // 10. Photo Booth & Creative Backdrops (17 assets)
  {
    id: 'gal-photobooth-collection',
    title: 'Photo Booth & Creative Selfie Backdrops',
    category: 'decoration',
    mediaType: 'image',
    url: PHOTOBOOTH_PORTFOLIO_ASSETS[0],
    images: PHOTOBOOTH_PORTFOLIO_ASSETS,
  },

  // 11. Grand Entrance Passage & Walkway Decor (30 assets)
  {
    id: 'gal-passage-collection',
    title: 'Grand Entrance Passage & Walkway Decor',
    category: 'decoration',
    mediaType: 'image',
    url: PASSAGE_PORTFOLIO_ASSETS[0],
    images: PASSAGE_PORTFOLIO_ASSETS,
  },

  // 12. Candid Wedding Photography (16 assets)
  {
    id: 'gal-candid-collection',
    title: 'Candid Wedding Photography Collection',
    category: 'photography',
    mediaType: 'image',
    url: CANDID_PORTFOLIO_ASSETS[0],
    images: CANDID_PORTFOLIO_ASSETS,
  },
];
export const MOCK_GALLERY: GalleryItem[] = deepToAssetUrl(MOCK_GALLERY_LOCAL);

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    coupleNames: 'Supraja Suppi',
    weddingDate: 'Wedding Ceremony',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: "Thank you S I D Events for making my special day more beautiful... I didn't feel even once it as events because your involvement in my marriage is like your own sister's marriage! Thank you to the whole team of SID Events.",
    imageUrl: '',
  },
  {
    id: 'test-2',
    coupleNames: 'Ranganath K.B',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'The experience with SID EVENT MANAGEMENT was beyond expectations. Quality materials, excellent and in-time work, tasty food is the ultimate thing of this event and reasonable price!',
    imageUrl: '',
  },
  {
    id: 'test-3',
    coupleNames: 'Moksha M',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Hello SID Events, you guys are the best in every event you have done! Including my marriage, it was beyond expectations for me and my entire family. Thank you for being so good to us throughout the event.',
    imageUrl: '',
  },
  {
    id: 'test-4',
    coupleNames: 'Chandan Raj',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Best wedding photography planner for your dream occasion! Thanks Team SID Events for making my marriage most memorable with beautiful photos.',
    imageUrl: '',
  },
  {
    id: 'test-5',
    coupleNames: 'Sandeep Hiremath',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Incredible work! Beautiful photos, great team, and flawless execution. Highly recommended!',
    imageUrl: '',
  },
  {
    id: 'test-6',
    coupleNames: 'Nagendra Prasad',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Simple way to make your special days your most memorable moment... Just contact SID Events!',
    imageUrl: '',
  },
  {
    id: 'test-7',
    coupleNames: 'Channaveeraiah K M',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Excellent, affordable and friendly management.',
    imageUrl: '',
  },
  {
    id: 'test-8',
    coupleNames: 'Pavan Kumar H R',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Nice environment and place 😍 and service, management is also very good.',
    imageUrl: '',
  },
  {
    id: 'test-9',
    coupleNames: 'Malthesh Achar',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Excellent service at an affordable price ❤️',
    imageUrl: '',
  },
  {
    id: 'test-10',
    coupleNames: 'Veeresha G U',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Super entertainment event organiser! Thank you sir.',
    imageUrl: '',
  },
  {
    id: 'test-11',
    coupleNames: 'Niranjan Gowda',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'SID Events..!! Makes your memories long lasting..❤✌',
    imageUrl: '',
  },
  {
    id: 'test-12',
    coupleNames: 'Shanthkumar C.H',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Best choice to bring your dreams to reality 😊',
    imageUrl: '',
  },
  {
    id: 'test-13',
    coupleNames: 'Nagaraj D.J. Sounds',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Very good person. Handling event management where is friendly event manager.',
    imageUrl: '',
  },
  {
    id: 'test-14',
    coupleNames: 'Pinakapani Creations',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Talented team with good ambitions.',
    imageUrl: '',
  },
  {
    id: 'test-15',
    coupleNames: 'Vinay Chowkimath',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Great event management service and excellent execution for all family functions.',
    imageUrl: '',
  },
  {
    id: 'test-16',
    coupleNames: 'Harsha Harsha K M',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Coordination team members are super responsive and highly helpful throughout!',
    imageUrl: '',
  },
  {
    id: 'test-17',
    coupleNames: 'Muruli L Achar',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Very memorable event experience and wonderful service team.',
    imageUrl: '',
  },
  {
    id: 'test-18',
    coupleNames: 'Sachin Ndvg',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Great experience working with SID Events team for our family event.',
    imageUrl: '',
  },
  {
    id: 'test-19',
    coupleNames: 'Adarsh Mynalli',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'One of the best event management companies in Davanagere!',
    imageUrl: '',
  },
  {
    id: 'test-20',
    coupleNames: 'Ankush B. Mynalli',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Fantastic management and flawless execution!',
    imageUrl: '',
  },
  {
    id: 'test-21',
    coupleNames: 'Anusha M S',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Loved the decor and seamless hospitality.',
    imageUrl: '',
  },
  {
    id: 'test-22',
    coupleNames: 'Purendra Naik',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Very professional team and excellent arrangements.',
    imageUrl: '',
  },
  {
    id: 'test-23',
    coupleNames: 'Vinay Kgd',
    weddingDate: 'Local Guide Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Top notch event planning service.',
    imageUrl: '',
  },
  {
    id: 'test-24',
    coupleNames: 'Eshwar Achari',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Friendly staff and high quality arrangements.',
    imageUrl: '',
  },
  {
    id: 'test-25',
    coupleNames: 'Madhusudhan G R',
    weddingDate: 'Verified Review',
    location: 'Google Review • Davanagere',
    rating: 5,
    comment: 'Highly satisfied with the event planning and food quality.',
    imageUrl: '',
  },
];

