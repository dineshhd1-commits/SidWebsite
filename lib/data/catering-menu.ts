import rawMenu from './catering-menu.json';
import { CateringMealPeriod, CateringMenuCategory, CateringTiming } from '../types/catering-menu';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const TIMING_TO_MEAL: Record<CateringTiming, CateringMealPeriod> = {
  morning: 'breakfast',
  afternoon: 'lunch',
  evening: 'dinner',
};

export const BREAKFAST_EVENT_TYPES: string[] = rawMenu.breakfastEventTypes;

const ALL_CATEGORIES: CateringMenuCategory[] = rawMenu.categories.map((category) => ({
  id: category.id,
  name: category.name,
  items: category.items.map((name) => {
    const id = `${category.id}__${slugify(name)}`;
    return { id, name, imageUrl: `/catering/${id}.jpg` };
  }),
}));

const CATEGORY_BY_ID = new Map(ALL_CATEGORIES.map((c) => [c.id, c]));

const MEAL_CATEGORY_IDS: Record<CateringMealPeriod, string[]> = rawMenu.mealCategoryIds as Record<CateringMealPeriod, string[]>;

export function getAllCateringCategories(): CateringMenuCategory[] {
  return ALL_CATEGORIES;
}

export function isBreakfastAvailableForEventType(eventTypeId: string | null): boolean {
  return !!eventTypeId && BREAKFAST_EVENT_TYPES.includes(eventTypeId);
}

/** Returns the catering menu categories to show for a given timing selection,
 * respecting which event types get a Breakfast menu (Morning timing only applies
 * to those event types - everyone else only ever sees Lunch/Afternoon and
 * Dinner/Evening). */
export function getCategoriesForTiming(timing: CateringTiming, eventTypeId: string | null): CateringMenuCategory[] {
  const meal = TIMING_TO_MEAL[timing];
  if (meal === 'breakfast' && !isBreakfastAvailableForEventType(eventTypeId)) {
    return [];
  }
  const categoryIds = MEAL_CATEGORY_IDS[meal] || [];
  return categoryIds.map((id) => CATEGORY_BY_ID.get(id)).filter((c): c is CateringMenuCategory => !!c);
}

export function getCateringCategoryById(categoryId: string): CateringMenuCategory | undefined {
  return CATEGORY_BY_ID.get(categoryId);
}
