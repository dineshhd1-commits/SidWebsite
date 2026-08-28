import { CateringTiming } from '../types/catering-menu';
import { EventBuilderState, EventDetails } from '../types/event-builder';

export const ANNIVERSARY_TYPES = [
  'Couple Anniversary',
  'Silver Jubilee',
  'Golden Jubilee',
  'School Anniversary',
  'College Anniversary',
  'Corporate Anniversary',
  'Other',
] as const;

export type AnniversaryType = (typeof ANNIVERSARY_TYPES)[number];

export function isCoupleAnniversary(anniversaryType?: string): boolean {
  if (!anniversaryType) return false;
  const normalized = anniversaryType.trim().toLowerCase();
  return normalized === 'couple anniversary' || normalized === 'couple_anniversary';
}

export function isDecorationEnquiryOnly(eventTypeId: string | null): boolean {
  if (!eventTypeId) return false;
  return ['birthday', 'corporate_event', 'get_together', 'bachelor_party', 'other_events'].includes(eventTypeId);
}

export function getAvailableCateringTimeSlots(
  eventTypeId: string | null,
  currentTiming: CateringTiming | null
): CateringTiming[] {
  if (!eventTypeId) {
    return ['morning', 'afternoon', 'evening'];
  }

  switch (eventTypeId) {
    case 'engagement':
      return ['morning', 'afternoon'];

    case 'reception':
      if (currentTiming === 'afternoon') {
        return ['afternoon', 'evening', 'morning'];
      }
      return ['afternoon', 'evening'];

    case 'anniversary':
      return ['afternoon', 'evening'];

    default:
      return ['morning', 'afternoon', 'evening'];
  }
}

export function isCateringCategoryAllowed(
  eventTypeId: string | null,
  timing: CateringTiming | null,
  categoryId: string
): boolean {
  const normCat = categoryId.toLowerCase();
  if (eventTypeId === 'engagement' && timing === 'afternoon') {
    if (normCat.includes('welcome_drinks') || normCat.includes('welcome-drinks') || normCat === 'welcome drinks') {
      return false;
    }
  }
  return true;
}

export function isAdditionalServiceAllowed(eventTypeId: string | null, serviceId: string): boolean {
  const normId = serviceId.toLowerCase();
  if (eventTypeId === 'engagement') {
    if (normId.includes('led-wall') || normId.includes('led_wall')) {
      return false;
    }
  }
  return true;
}

export function cleanEventBuilderState(state: EventBuilderState): EventBuilderState {
  let hasChanges = false;
  let newCart = { ...state.cart };
  let newCateringSelections = { ...state.cateringSelections };
  let newTiming = state.cateringTiming;

  const eventTypeId = state.eventTypeId;

  if (newTiming) {
    const allowedTimings = getAvailableCateringTimeSlots(eventTypeId, newTiming);
    if (!allowedTimings.includes(newTiming)) {
      newTiming = null;
      hasChanges = true;
    }
  }

  if (eventTypeId === 'engagement') {
    for (const [id, line] of Object.entries(newCart)) {
      if (line.id.toLowerCase().includes('led-wall') || line.name.toLowerCase().includes('led wall')) {
        delete newCart[id];
        hasChanges = true;
      }
    }

    if (newTiming === 'afternoon') {
      for (const [key, selection] of Object.entries(newCateringSelections)) {
        if (
          selection.menuType === 'afternoon' &&
          (selection.categoryId.toLowerCase().includes('welcome_drinks') ||
            selection.categoryName.toLowerCase().includes('welcome drinks'))
        ) {
          delete newCateringSelections[key];
          hasChanges = true;
        }
      }
    }
  }

  if (eventTypeId === 'birthday') {
    for (const [id, line] of Object.entries(newCart)) {
      if (line.categoryKey === 'decoration') {
        delete newCart[id];
        hasChanges = true;
      }
    }
  }

  for (const [key, selection] of Object.entries(newCateringSelections)) {
    const allowed = getAvailableCateringTimeSlots(eventTypeId, selection.menuType);
    if (!allowed.includes(selection.menuType)) {
      delete newCateringSelections[key];
      hasChanges = true;
    }
  }

  if (!hasChanges && newTiming === state.cateringTiming) {
    return state;
  }

  return {
    ...state,
    cart: newCart,
    cateringTiming: newTiming,
    cateringSelections: newCateringSelections,
  };
}
