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
  anniversaryType?: string;
}

export interface EventBuilderState {
  eventTypeId: string | null;
  selectedPackageId: string | null;
  currentStepIndex: number;
  /** The furthest step index the customer has legitimately reached by
   * advancing forward (via Next Step / Skip Photography / Continue) - only
   * ever increases. This, not currentStepIndex, is what gates navigation:
   * goToStep() clamps to this so a stepper click, an "Edit" link, or any
   * other jump can never land on a step the customer hasn't earned yet, and
   * it's part of the persisted state so a refresh can't re-lock steps that
   * were already unlocked or (more importantly) can't be used to unlock
   * steps that weren't. */
  furthestStepIndex: number;
  eventDetails: EventDetails;
  cart: Record<string, CartLine>;
  cateringTiming: CateringTiming | null;
  cateringSelections: Record<string, CateringSelectionLine>;
  /** How many guests are expected for each meal, kept per timing so switching
   * between Morning/Afternoon/Evening doesn't lose a number already entered.
   * 0 or missing means "not entered yet". */
  cateringGuestCounts: Partial<Record<CateringTiming, number>>;
  /** Indicates whether the customer intentionally skipped the catering step. */
  cateringSkipped?: boolean;
}

export const DEFAULT_EVENT_DETAILS: EventDetails = {
  date: '',
  // 0 means "not entered yet" - the field renders empty for it, so a fresh
  // build (and a build restarted by changing event type) starts blank rather
  // than pre-filled with a number the customer never chose.
  guestCount: 0,
  location: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  specialRequirements: '',
  anniversaryType: '',
};

export const DEFAULT_EVENT_BUILDER_STATE: EventBuilderState = {
  eventTypeId: null,
  selectedPackageId: null,
  currentStepIndex: 0,
  furthestStepIndex: 0,
  eventDetails: DEFAULT_EVENT_DETAILS,
  cart: {},
  cateringTiming: null,
  cateringSelections: {},
  cateringGuestCounts: {},
  cateringSkipped: false,
};
