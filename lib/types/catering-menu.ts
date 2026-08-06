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
}

export interface CateringSelectionLine {
  categoryId: string;
  categoryName: string;
  itemId: string;
  itemName: string;
  quantity: number;
}
