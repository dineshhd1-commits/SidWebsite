export type CateringMealPeriod = 'breakfast' | 'lunch' | 'dinner';

export type CateringTiming = 'morning' | 'afternoon' | 'evening';

export interface CateringMenuItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CateringMenuCategory {
  id: string;
  name: string;
  items: CateringMenuItem[];
  maxSelections?: number;
}

export interface CateringMenuSection {
  name: string;
  categories: CateringMenuCategory[];
}

export interface CateringSelectionLine {
  menuType: CateringTiming;
  categoryId: string;
  categoryName: string;
  itemId: string;
  itemName: string;
  quantity: number;
}
