export type EventTypeSlug =
  | 'wedding'
  | 'engagement'
  | 'reception'
  | 'birthday'
  | 'anniversary'
  | 'get_together'
  | 'bachelor_party'
  | 'housewarming'
  | 'haldi_function'
  | 'corporate_event'
  | 'traditional_home_function'
  | 'other_events';

export interface EventType {
  id: EventTypeSlug;
  name: string;
  shortDescription: string;
  imageUrl: string;
  isCatalogReady: boolean;
  displayOrder: number;
  active: boolean;
}

export type PackageLevelId = 'normal' | 'standard' | 'silver' | 'gold' | 'premium' | 'luxury';

export interface PackageLevel {
  id: PackageLevelId;
  name: string;
  rank: number;
  displayOrder: number;
  active: boolean;
}

export type CatalogCategoryKey = 'decoration' | 'photography' | 'catering' | 'venue' | 'additional_services';

/** Meal period a catering menu group is served under. Only meaningful for
 * categoryKey: 'catering' groups - other categories leave this undefined. */
export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export interface CatalogGroup {
  id: string;
  supportedEventTypes: string[];
  categoryKey: CatalogCategoryKey;
  name: string;
  defaultMaxSelections: number | null;
  freeIncludedCount: number;
  requiresApprovalAfterLimit: boolean;
  approvalMessage: string | null;
  displayOrder: number;
  active: boolean;
  meals?: MealPeriod[];
}

export type QuantityMode = 'single' | 'stepper' | 'team_size';

export interface CatalogItem {
  id: string;
  supportedEventTypes: string[];
  categoryKey: CatalogCategoryKey;
  groupId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  images: string[];
  packageLevel: PackageLevelId;
  price: number;
  unit: string;
  quantityMode: QuantityMode;
  maxQuantity: number | null;
  maxSelectionsOverride: number | null;
  metadata: Record<string, unknown>;
  active: boolean;
  displayOrder: number;
}

export interface PackageDefinition {
  id: string;
  eventTypeId: string;
  name: string;
  tagline: string;
  packageLevel: PackageLevelId;
  basePrice: number;
  guestCapacity: number;
  description: string;
  isPopular: boolean;
}

export interface PackageIncludedItem {
  packageId: string;
  catalogItemId: string;
  quantity: number;
}

export interface PackageGroupLimit {
  packageId: string;
  groupId: string;
  maxSelections: number;
  freeIncludedCount: number;
}
