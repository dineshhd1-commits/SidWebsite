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

/**
 * Returns whether a given anniversary type should proceed in the custom builder
 * or be redirected to the direct Inquiry Form.
 */
export function isCoupleAnniversary(anniversaryType?: string): boolean {
  if (!anniversaryType) return false;
  const normalized = anniversaryType.trim().toLowerCase();
  return normalized === 'couple anniversary' || normalized === 'couple_anniversary';
}

/**
 * Returns whether the event type uses direct inquiry for decoration
 * rather than the custom decoration checklist.
 */
export function isDecorationEnquiryOnly(eventTypeId: string | null): boolean {
  if (!eventTypeId) return false;
  // housewarming/haldi_function/traditional_home_function/shrimantha_karya/
  // half_saree_function have no entry in DecorationStep's CHECKLIST_GROUPS_BY_EVENT
  // map - without being enquiry-only here too, Step 2 renders nothing at all for
  // them (no checklist, no enquiry card, no error).
  return [
    'birthday',
    'corporate_event',
    'get_together',
    'bachelor_party',
    'other_events',
    'housewarming',
    'haldi_function',
    'traditional_home_function',
    'shrimantha_karya',
    'half_saree_function',
  ].includes(eventTypeId);
}

/**
 * Centralized rule engine for available catering time slots across all events.
 *
 * - Engagement: Morning, Afternoon only. Evening is never offered.
 * - Reception: Default Afternoon and Evening. Morning only appears conditionally
 *   when Afternoon is currently selected.
 * - Anniversary: Afternoon and Evening only. Morning is never offered.
 * - All other events: Morning, Afternoon, Evening.
 */
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
      // Reception conditional rule: Morning only appears when Afternoon is selected.
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

/**
 * Checks whether a given catering category is permitted for an event and timing.
 * - Engagement + Afternoon: Welcome Drinks is prohibited.
 */
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

/**
 * Checks whether an additional service is permitted for a given event type.
 * - Engagement: LED Wall is prohibited.
 * - Anchor Service is allowed globally across all events.
 */
export function isAdditionalServiceAllowed(eventTypeId: string | null, serviceId: string): boolean {
  const normId = serviceId.toLowerCase();
  if (eventTypeId === 'engagement') {
    if (normId.includes('led-wall') || normId.includes('led_wall')) {
      return false;
    }
  }
  return true;
}

/**
 * Deterministically cleans up state when event type, time slot, or options change.
 * Ensures invalid selections never reach Cart, Review Cart, PDF, WhatsApp, or API payloads.
 */
export function cleanEventBuilderState(state: EventBuilderState): EventBuilderState {
  let hasChanges = false;
  let newCart = { ...state.cart };
  let newCateringSelections = { ...state.cateringSelections };
  let newTiming = state.cateringTiming;

  const eventTypeId = state.eventTypeId;

  // 1. Validate and clean Catering Timing against allowed slots
  if (newTiming) {
    const allowedTimings = getAvailableCateringTimeSlots(eventTypeId, newTiming);
    if (!allowedTimings.includes(newTiming)) {
      newTiming = null;
      hasChanges = true;
    }
  }

  // 2. Engagement specific cleanup
  if (eventTypeId === 'engagement') {
    // Prohibit LED wall in cart
    for (const [id, line] of Object.entries(newCart)) {
      if (line.id.toLowerCase().includes('led-wall') || line.name.toLowerCase().includes('led wall')) {
        delete newCart[id];
        hasChanges = true;
      }
    }

    // Prohibit Welcome Drinks when Afternoon is active
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

  // 3. Birthday specific cleanup: decoration is enquiry only, clear any incomplete builder decoration lines
  if (eventTypeId === 'birthday') {
    for (const [id, line] of Object.entries(newCart)) {
      if (line.categoryKey === 'decoration') {
        delete newCart[id];
        hasChanges = true;
      }
    }
  }

  // 4. Clean any catering selections belonging to timings that are no longer valid for this event
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
