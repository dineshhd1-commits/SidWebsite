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
import { getPackageGroupLimits, getPackageIncludedItems, getCatalogItems, getAllCatalogItemIds } from '../data/catalog';
import { getCategoriesForTiming } from '../data/catering-menu';

interface EventBuilderContextType {
  state: EventBuilderState;
  isLoaded: boolean;
  setEventType: (eventTypeId: string) => void;
  changeEventType: (eventTypeId: string) => Promise<void>;
  selectPackage: (packageId: string) => Promise<void>;
  goToStep: (index: number) => void;
  nextStep: (lastIndex: number) => void;
  prevStep: () => void;
  updateEventDetails: (partial: Partial<EventDetails>) => void;
  setCateringTiming: (timing: CateringTiming) => void;
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

  /** Switches event type while keeping event details and any cart lines that are
   * still valid for the new event (e.g. a shared Photography item) - removes only
   * the incompatible ones, never a silent full reset. */
  const changeEventType = useCallback(async (eventTypeId: string) => {
    const compatibleIds = await getAllCatalogItemIds(eventTypeId);
    setState((prev) => {
      const cart: Record<string, CartLine> = {};
      for (const [id, line] of Object.entries(prev.cart)) {
        if (compatibleIds.has(id)) cart[id] = line;
      }

      let cateringSelections = prev.cateringSelections;
      if (prev.cateringTiming) {
        const validItemIds = new Set(
          getCategoriesForTiming(prev.cateringTiming, eventTypeId).flatMap((c) => c.items.map((i) => i.id))
        );
        cateringSelections = Object.fromEntries(
          Object.entries(prev.cateringSelections).filter(([itemId]) => validItemIds.has(itemId))
        );
      }

      return { ...prev, eventTypeId, selectedPackageId: null, cart, cateringSelections };
    });
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

  const toggleCateringMenuItem = useCallback((categoryId: string, categoryName: string, itemId: string, itemName: string) => {
    setState((prev) => {
      const cateringSelections = { ...prev.cateringSelections };
      if (cateringSelections[itemId]) {
        delete cateringSelections[itemId];
      } else {
        cateringSelections[itemId] = { categoryId, categoryName, itemId, itemName, quantity: 1 };
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
    setState((prev) => ({
      ...prev,
      cart: { ...prev.cart, [item.id]: cartLineFromItem(item, quantity, origin) },
    }));
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
      setEventType,
      changeEventType,
      selectPackage,
      goToStep,
      nextStep,
      prevStep,
      updateEventDetails,
      setCateringTiming,
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
      setEventType,
      changeEventType,
      selectPackage,
      goToStep,
      nextStep,
      prevStep,
      updateEventDetails,
      setCateringTiming,
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
