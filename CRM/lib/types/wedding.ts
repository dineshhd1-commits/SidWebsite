export type ServiceCategory = 
  | 'decoration' 
  | 'food' 
  | 'photography' 
  | 'makeup' 
  | 'purohit' 
  | 'security' 
  | 'welcome_girls' 
  | 'dancers';

export interface WeddingService {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  popular?: boolean;
  tier?: 'standard' | 'silver' | 'gold' | 'diamond' | 'royal' | 'premium';
  subCategory?: 'home_functions' | 'wedding_hall' | 'floral_items' | 'traditional_services' | 'entertainment';
}

export type Service = WeddingService;

export interface StandardPackageBreakdown {
  decoration: string;
  catering: string;
  photography: string;
  makeup: string;
  purohit: string;
  entertainment: string;
}

export interface StandardPackage {
  id: string;
  name: string;
  tagline: string;
  tier: 'silver' | 'gold' | 'diamond' | 'royal';
  basePrice: number;
  description: string;
  featuredInclusions: string[];
  guestCapacity: number;
  isPopular?: boolean;
  breakdown?: StandardPackageBreakdown;
}

export interface SelectedServiceItem {
  serviceId: string;
  quantity: number;
  notes?: string;
}

export interface CateringSelection {
  guestCount: number;
  meals: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[];
  cuisine: 'veg' | 'non_veg' | 'multi_cuisine';
  packageTier: 'standard' | 'silver' | 'gold' | 'premium';
  liveCounters: string[];
  welcomeDrinks: string[];
}

export interface PhotographySelection {
  packageTier: 'standard' | 'silver' | 'gold' | 'diamond';
  includeDrone: boolean;
  includeLedWall: boolean;
  albumType: 'standard' | 'karizma' | 'non_tearable';
  extraPhotographers: number;
}

export interface MakeupSelection {
  packageTier: 'standard' | 'silver' | 'gold' | 'premium';
  brideCount: number;
  groomCount: number;
  familyCount: number;
  trialRequired: boolean;
}

export interface PurohitSelection {
  packageTier: 'standard' | 'premium' | 'traditional';
  language: 'kannada' | 'tamil' | 'telugu' | 'sanskrit';
  homaRequired: boolean;
  specialRituals: string;
}

export interface SecuritySelection {
  maleBouncers: number;
  femaleBouncers: number;
  vipSecurity: boolean;
  parkingStaffCount: number;
}

export interface WelcomeGirlsSelection {
  count: 2 | 4 | 6 | 8;
  attire: 'traditional_saree' | 'modern_lehenga';
  includeFlowerBasket: boolean;
  includeWelcomePlate: boolean;
}

export interface DancersSelection {
  style: 'classical_bharatanatyam' | 'dollu_kunitha' | 'chenda_melam' | 'folk' | 'bollywood';
  durationHours: number;
  performerCount: number;
}

export interface CustomBuilderState {
  currentStep: number;
  selectedServices: Record<string, SelectedServiceItem>;
  catering: CateringSelection;
  photography: PhotographySelection;
  makeup: MakeupSelection;
  purohit: PurohitSelection;
  security: SecuritySelection;
  welcomeGirls: WelcomeGirlsSelection;
  dancers: DancersSelection;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'decoration' | 'photography' | 'reception' | 'traditional';
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  images?: string[];
  rotateClass?: string;
  rotate?: number;
}

export interface Testimonial {
  id: string;
  coupleNames: string;
  weddingDate: string;
  location: string;
  rating: number;
  comment: string;
  imageUrl: string;
  weddingVideoUrl?: string;
}
