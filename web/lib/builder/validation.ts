import { EventBuilderState } from '../types/event-builder';
import { CatalogCategoryKey } from '../types/catalog';
import { getCartLines } from './selectors';

export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'pending';

/** Hard ceiling on Number of Guests, enforced both in the field itself
 * (frontend) and again right before an enquiry is actually submitted
 * (booking page / saveAdminQuote path) so it can't be bypassed by editing
 * the input's value via devtools or any other client-side manipulation. */
export const MAX_GUEST_COUNT = 5000;

export interface FieldCheck {
  key: string;
  label: string;
  filled: boolean;
}

/** Accepted email shape for the event-details form - a standard, permissive
 * email pattern (not restricted to any one provider; customers use Gmail,
 * Yahoo, Outlook, business addresses, etc). */
const CUSTOMER_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The email field is optional, so an empty value is fine; anything actually
 * typed has to match the accepted shape. */
export function isValidCustomerEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length === 0 || CUSTOMER_EMAIL_PATTERN.test(trimmed);
}

/** Event Details field completion, split into required vs optional - drives both
 * the step-confirmation modal and the step-status dot for step 0. */
export function getEventDetailsFieldChecks(state: EventBuilderState): { required: FieldCheck[]; optional: FieldCheck[] } {
  const { eventDetails, eventTypeId } = state;
  const required: FieldCheck[] = [
    { key: 'eventType', label: 'Event Type', filled: !!eventTypeId },
  ];

  if (eventTypeId === 'anniversary') {
    required.push({
      key: 'anniversaryType',
      label: 'Anniversary Type',
      filled: !!eventDetails.anniversaryType && eventDetails.anniversaryType.trim().length > 0,
    });
  }

  required.push(
    { key: 'date', label: 'Event Date', filled: !!eventDetails.date },
    {
      key: 'guestCount',
      label: 'Number of Guests',
      filled: eventDetails.guestCount > 0 && eventDetails.guestCount <= MAX_GUEST_COUNT,
    },
    { key: 'location', label: 'Event Location', filled: !!eventDetails.location.trim() },
    { key: 'customerName', label: 'Your Name', filled: !!eventDetails.customerName.trim() },
    { key: 'customerPhone', label: 'Phone Number', filled: /^\d{10}$/.test(eventDetails.customerPhone.trim()) }
  );

  return {
    required,
    optional: [
      { key: 'customerEmail', label: 'Email Address', filled: !!eventDetails.customerEmail.trim() },
      { key: 'specialRequirements', label: 'Special Requirements', filled: !!eventDetails.specialRequirements.trim() },
    ],
  };
}

/** Required fields that gate final enquiry submission (not step navigation). */
export function getMissingRequiredFieldsForSubmit(state: EventBuilderState): FieldCheck[] {
  return getEventDetailsFieldChecks(state).required.filter((f) => !f.filled);
}

export function canSubmitEnquiry(state: EventBuilderState): boolean {
  return getMissingRequiredFieldsForSubmit(state).length === 0;
}

/** Friendly, specific guidance instead of generic "Field required" messages. */
export function getFriendlyMissingFieldMessage(fieldKey: string): string {
  const messages: Record<string, string> = {
    eventType: "We still need to know what type of event you're planning.",
    anniversaryType: 'Please select an Anniversary Type before proceeding.',
    date: 'Please choose a valid event date before submitting.',
    guestCount: `Let us know roughly how many guests to expect. Maximum guest capacity is ${MAX_GUEST_COUNT.toLocaleString('en-IN')}.`,
    location: 'We still need your event location before submitting your enquiry.',
    customerName: 'We still need your name before submitting your enquiry.',
    customerPhone: 'We still need a valid 10-digit phone number before submitting your enquiry.',
  };
  return messages[fieldKey] || 'This detail is still missing.';
}

/** Steps the customer can skip entirely without leaving the build looking
 * incomplete. */
const OPTIONAL_STEP_CATEGORIES = new Set<CatalogCategoryKey>(['photography', 'additional_services']);

const STEP_CATEGORY_KEYS: (CatalogCategoryKey | null)[] = [
  null, // Event Details - handled separately
  'decoration',
  'photography',
  'catering',
  'additional_services',
  null, // Review - handled separately
];

/** Status per wizard step, used to render the 🟢/🟡/⚪ indicator in the stepper. */
export function getStepStatus(state: EventBuilderState, stepIndex: number, lastIndex: number): StepStatus {
  if (stepIndex === 0) {
    const { required } = getEventDetailsFieldChecks(state);
    const filledCount = required.filter((f) => f.filled).length;
    if (filledCount === 0) return 'not_started';
    return filledCount === required.length ? 'completed' : 'in_progress';
  }

  if (stepIndex === lastIndex) {
    return state.currentStepIndex >= lastIndex ? 'pending' : 'not_started';
  }

  const categoryKey = STEP_CATEGORY_KEYS[stepIndex];
  if (!categoryKey) return 'not_started';

  if (categoryKey === 'catering' && state.cateringSkipped) {
    return 'completed';
  }

  const hasItemsInCategory = getCartLines(state).some((line) => line.categoryKey === categoryKey);
  const hasCateringSelections = categoryKey === 'catering' && Object.keys(state.cateringSelections).length > 0;
  if (hasItemsInCategory || hasCateringSelections) return 'completed';
  // Optional steps stay neutral when skipped instead of sitting on "In Progress"
  // forever, which reads as an unfinished requirement.
  if (OPTIONAL_STEP_CATEGORIES.has(categoryKey)) return 'not_started';
  return state.currentStepIndex > stepIndex ? 'in_progress' : 'not_started';
}
