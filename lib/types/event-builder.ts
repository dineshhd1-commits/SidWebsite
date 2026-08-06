import { CatalogCategoryKey, PackageLevelId } from './catalog';
import { CateringSelectionLine, CateringTiming } from './catering-menu';

export type CartLineOrigin = 'included' | 'paid_extra' | 'requested_extra';

export interface CartLine {
  id: string;
  categoryKey: CatalogCategoryKey;
  groupId: string | null;
  name: string;
  imageUrl: string;
  packageLevel: PackageLevelId;
  unitPrice: number;
  quantity: number;
  origin: CartLineOrigin;
  notes?: string;
}

export interface EventDetails {
  date: string;
  guestCount: number;
  location: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequirements: string;
}

export interface EventBuilderState {
  eventTypeId: string | null;
  selectedPackageId: string | null;
  currentStepIndex: number;
  eventDetails: EventDetails;
  cart: Record<string, CartLine>;
  cateringTiming: CateringTiming | null;
  cateringSelections: Record<string, CateringSelectionLine>;
}

export const DEFAULT_EVENT_DETAILS: EventDetails = {
  date: '',
  guestCount: 300,
  location: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  specialRequirements: '',
};

export const DEFAULT_EVENT_BUILDER_STATE: EventBuilderState = {
  eventTypeId: null,
  selectedPackageId: null,
  currentStepIndex: 0,
  eventDetails: DEFAULT_EVENT_DETAILS,
  cart: {},
  cateringTiming: null,
  cateringSelections: {},
};
