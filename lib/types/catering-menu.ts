export type CateringMealPeriod = 'breakfast' | 'lunch' | 'dinner';

export type CateringTiming = 'morning' | 'afternoon' | 'evening';

export interface CateringMenuItem {
  id: string;
  name: string;
  /** Not every dish has a verified photo extracted from the source menu - the UI
   * falls back to a placeholder when this image 404s. */
  imageUrl: string;
}

export interface CateringMenuCategory {
  id: string;
  name: string;
  items: CateringMenuItem[];
  /** Cap on how many dishes can be selected from this category. Undefined
   * means no cap (e.g. Snacks). */
  maxSelections?: number;
}

/** A named grouping of categories within a meal's menu - currently only the
 * Evening/Dinner menu is split this way (Snacks / Main Course). Meals with no
 * entry here render their categories as a single flat list, unchanged. */
export interface CateringMenuSection {
  name: string;
  categories: CateringMenuCategory[];
}

export interface CateringSelectionLine {
  categoryId: string;
  categoryName: string;
  itemId: string;
  itemName: string;
  quantity: number;
}
