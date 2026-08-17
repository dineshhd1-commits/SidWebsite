'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CatalogItem } from '../types/catalog';
import {
  CartLine,
  CartLineOrigin,
  DEFAULT_EVENT_BUILDER_STATE,
  EventBuilderState,
  EventDetails,
} from '../types/event-builder';
import { CateringTiming } from '../types/catering-menu';
import { getPackageGroupLimits, getPackageIncludedItems, getCatalogItems } from '../data/catalog';
import { getCateringCategoryById } from '../data/catering-menu';

/** Fired whenever something genuinely new lands in the cart/catering
 * selections (not on removal, not on a quantity-only change) - purely
 * transient UI feedback, so it's tracked outside the persisted `state`
 * on purpose (nothing here should survive a reload or count as builder
 * progress). `token` makes every firing distinct even if the same item
 * is re-added later. */
export interface LastAddedSelection {
  id: string;
  name: string;
  token: number;
}

interface EventBuilderContextType {
  state: EventBuilderState;
  isLoaded: boolean;
  lastAdded: LastAddedSelection | null;
  setEventType: (eventTypeId: string) => void;
  changeEventType: (eventTypeId: string) => void;
  selectPackage: (packageId: string) => Promise<void>;
  goToStep: (index: number) => void;
  nextStep: (lastIndex: number) => void;
  prevStep: () => void;
  updateEventDetails: (partial: Partial<EventDetails>) => void;
  setCateringTiming: (timing: CateringTiming) => void;
  setCateringGuestCount: (timing: CateringTiming, guestCount: number) => void;
  toggleCateringMenuItem: (categoryId: string, categoryName: string, itemId: string, itemName: string) => void;
  updateCateringMenuItemQuantity: (itemId: string, quantity: number) => void;
  addToCart: (item: CatalogItem, quantity?: number, origin?: CartLineOrigin) => void;
  removeFromCart: (catalogItemId: string) => void;
  updateQuantity: (catalogItemId: string, quantity: number) => void;
  replaceInCart: (oldCatalogItemId: string, item: CatalogItem, quantity?: number, origin?: CartLineOrigin) => void;
  requestExtraApproval: (item: CatalogItem, quantity?: number) => void;
  clearCart: () => void;
  resetBuilder: () => void;
}

const EventBuilderContext = createContext<EventBuilderContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'sid_events_builder_draft_v2';
const LOCAL_STORAGE_KEY = 'sid_events_builder_draft_v2';

function mergeWithDefaultState(parsed: any): EventBuilderState {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_EVENT_BUILDER_STATE;
  return {
    ...DEFAULT_EVENT_BUILDER_STATE,
    ...parsed,
    eventDetails: { ...DEFAULT_EVENT_BUILDER_STATE.eventDetails, ...(parsed.eventDetails || {}) },
    cart: parsed.cart || {},
    cateringSelections: parsed.cateringSelections || {},
    cateringGuestCounts: parsed.cateringGuestCounts || {},
  };
}

function cartLineFromItem(item: CatalogItem, quantity: number, origin: CartLineOrigin): CartLine {
  return {
    id: item.id,
    categoryKey: item.categoryKey,
    groupId: item.groupId,
    name: item.name,
    imageUrl: item.imageUrl,
    packageLevel: item.packageLevel,
    unitPrice: item.price,
    quantity,
    origin,
  };
}

export const EventBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EventBuilderState>(DEFAULT_EVENT_BUILDER_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastAdded, setLastAdded] = useState<LastAddedSelection | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
      const saved = savedSession || savedLocal;
      if (saved) {
        try {
          setState(mergeWithDefaultState(JSON.parse(saved)));
        } catch (e) {
          console.error('Failed to parse saved builder draft:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      const serialized = JSON.stringify(state);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
        localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
      } catch (e) {
        console.error('Error saving builder draft to browser cache:', e);
      }
    }
  }, [state, isLoaded]);

  const setEventType = useCallback((eventTypeId: string) => {
    setState((prev) => ({ ...DEFAULT_EVENT_BUILDER_STATE, eventDetails: prev.eventDetails, eventTypeId, currentStepIndex: 0 }));
  }, []);

  /** Switches event type and starts the build completely over: every cart line,
   * catering selection, catering timing, package choice AND all the entered
   * event details (name, phone, email, date, guest count, location, special
   * requirements) are wiped, and the wizard returns to step 1. Nothing at all
   * carries over from the previous event - the only thing kept is the newly
   * chosen event type itself. */
  const changeEventType = useCallback((eventTypeId: string) => {
    setState({ ...DEFAULT_EVENT_BUILDER_STATE, eventTypeId });
  }, []);

  /** Applies a package's included items on top of the current cart - never wipes
   * paid_extra/requested_extra lines the customer already picked in other steps.
   * Only lines with origin 'included' are replaced (dropped if no longer part of
   * the new package, replaced/added if they are). */
  const selectPackage = useCallback(async (packageId: string) => {
    const [includedItems, groupLimits] = await Promise.all([
      getPackageIncludedItems(packageId),
      getPackageGroupLimits(packageId),
    ]);
    if (includedItems.length === 0) {
      setState((prev) => ({
        ...prev,
        selectedPackageId: packageId,
        cart: Object.fromEntries(Object.entries(prev.cart).filter(([, line]) => line.origin !== 'included')),
      }));
      return;
    }
    if (!state.eventTypeId) return;
    const allItems = await getCatalogItems(state.eventTypeId);
    const itemsById = new Map(allItems.map((i) => [i.id, i]));

    setState((prev) => {
      const cart: Record<string, CartLine> = Object.fromEntries(
        Object.entries(prev.cart).filter(([, line]) => line.origin !== 'included')
      );
      for (const included of includedItems) {
        const item = itemsById.get(included.catalogItemId);
        if (!item) continue;
        cart[item.id] = cartLineFromItem(item, included.quantity, 'included');
      }
      return { ...prev, selectedPackageId: packageId, cart };
    });
    void groupLimits; // consumed by step components via getPackageGroupLimits(packageId) directly
  }, [state.eventTypeId]);

  const goToStep = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentStepIndex: Math.max(0, index) }));
  }, []);

  const nextStep = useCallback((lastIndex: number) => {
    setState((prev) => ({ ...prev, currentStepIndex: Math.min(prev.currentStepIndex + 1, lastIndex) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStepIndex: Math.max(prev.currentStepIndex - 1, 0) }));
  }, []);

  const updateEventDetails = useCallback((partial: Partial<EventDetails>) => {
    setState((prev) => ({ ...prev, eventDetails: { ...prev.eventDetails, ...partial } }));
  }, []);

  /** Timing determines which meal (Breakfast/Lunch/Dinner) the menu shows - switching
   * it away from the meal a selection belongs to would leave orphaned selections the
   * user can no longer see or edit, so we drop those instead of hiding them silently. */
  const setCateringTiming = useCallback((timing: CateringTiming) => {
    setState((prev) => ({ ...prev, cateringTiming: timing, cateringSelections: {} }));
  }, []);

  /** Guest count is kept per meal timing, so a number entered for one meal
   * survives switching to another and back. */
  const setCateringGuestCount = useCallback((timing: CateringTiming, guestCount: number) => {
    setState((prev) => ({
      ...prev,
      cateringGuestCounts: { ...prev.cateringGuestCounts, [timing]: Math.max(0, guestCount) },
    }));
  }, []);

  /** Enforced here too (not just disabled in the UI) so the cap holds no
   * matter which entry point calls this. Deselecting is always allowed;
   * selecting a new item is blocked once the category's maxSelections is
   * already met - a no-op rather than an error, since the UI's own disabled
   * state is what explains why to the customer. */
  const toggleCateringMenuItem = useCallback((categoryId: string, categoryName: string, itemId: string, itemName: string) => {
    setState((prev) => {
      const cateringSelections = { ...prev.cateringSelections };
      if (cateringSelections[itemId]) {
        delete cateringSelections[itemId];
      } else {
        const maxSelections = getCateringCategoryById(categoryId)?.maxSelections;
        if (maxSelections !== undefined) {
          const currentCount = Object.values(prev.cateringSelections).filter((s) => s.categoryId === categoryId).length;
          if (currentCount >= maxSelections) return prev;
        }
        cateringSelections[itemId] = { categoryId, categoryName, itemId, itemName, quantity: 1 };
        setLastAdded({ id: itemId, name: itemName, token: Date.now() });
      }
      return { ...prev, cateringSelections };
    });
  }, []);

  const updateCateringMenuItemQuantity = useCallback((itemId: string, quantity: number) => {
    setState((prev) => {
      const existing = prev.cateringSelections[itemId];
      if (!existing) return prev;
      if (quantity <= 0) {
        const cateringSelections = { ...prev.cateringSelections };
        delete cateringSelections[itemId];
        return { ...prev, cateringSelections };
      }
      return { ...prev, cateringSelections: { ...prev.cateringSelections, [itemId]: { ...existing, quantity } } };
    });
  }, []);

  const addToCart = useCallback((item: CatalogItem, quantity: number = 1, origin: CartLineOrigin = 'paid_extra') => {
    setState((prev) => {
      // Only flag it as a fresh addition if it genuinely wasn't in the cart
      // before - a quantity bump on an already-selected item shouldn't
      // retrigger the "added" toast/highlight.
      if (!prev.cart[item.id]) {
        setLastAdded({ id: item.id, name: item.name, token: Date.now() });
      }
      return {
        ...prev,
        cart: { ...prev.cart, [item.id]: cartLineFromItem(item, quantity, origin) },
      };
    });
  }, []);

  const removeFromCart = useCallback((catalogItemId: string) => {
    setState((prev) => {
      const cart = { ...prev.cart };
      delete cart[catalogItemId];
      return { ...prev, cart };
    });
  }, []);

  const updateQuantity = useCallback((catalogItemId: string, quantity: number) => {
    setState((prev) => {
      const existing = prev.cart[catalogItemId];
      if (!existing) return prev;
      if (quantity <= 0) {
        const cart = { ...prev.cart };
        delete cart[catalogItemId];
        return { ...prev, cart };
      }
      return { ...prev, cart: { ...prev.cart, [catalogItemId]: { ...existing, quantity } } };
    });
  }, []);

  const replaceInCart = useCallback((oldCatalogItemId: string, item: CatalogItem, quantity: number = 1, origin: CartLineOrigin = 'paid_extra') => {
    setState((prev) => {
      const cart = { ...prev.cart };
      delete cart[oldCatalogItemId];
      cart[item.id] = cartLineFromItem(item, quantity, origin);
      return { ...prev, cart };
    });
    setLastAdded({ id: item.id, name: item.name, token: Date.now() });
  }, []);

  const requestExtraApproval = useCallback((item: CatalogItem, quantity: number = 1) => {
    addToCart(item, quantity, 'requested_extra');
  }, [addToCart]);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: {} }));
  }, []);

  const resetBuilder = useCallback(() => {
    setState(DEFAULT_EVENT_BUILDER_STATE);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const value = useMemo<EventBuilderContextType>(
    () => ({
      state,
      isLoaded,
      lastAdded,
      setEventType,
      changeEventType,
      selectPackage,
      goToStep,
      nextStep,
      prevStep,
      updateEventDetails,
      setCateringTiming,
      setCateringGuestCount,
      toggleCateringMenuItem,
      updateCateringMenuItemQuantity,
      addToCart,
      removeFromCart,
      updateQuantity,
      replaceInCart,
      requestExtraApproval,
      clearCart,
      resetBuilder,
    }),
    [
      state,
      isLoaded,
      lastAdded,
      setEventType,
      changeEventType,
      selectPackage,
      goToStep,
      nextStep,
      prevStep,
      updateEventDetails,
      setCateringTiming,
      setCateringGuestCount,
      toggleCateringMenuItem,
      updateCateringMenuItemQuantity,
      addToCart,
      removeFromCart,
      updateQuantity,
      replaceInCart,
      requestExtraApproval,
      clearCart,
      resetBuilder,
    ]
  );

  return <EventBuilderContext.Provider value={value}>{children}</EventBuilderContext.Provider>;
};

export const useEventBuilder = () => {
  const context = useContext(EventBuilderContext);
  if (!context) {
    throw new Error('useEventBuilder must be used within an EventBuilderProvider');
  }
  return context;
};
