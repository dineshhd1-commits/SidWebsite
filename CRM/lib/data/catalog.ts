import { supabase, isSupabaseConfigured } from '../supabase';
import {
  CatalogCategoryKey,
  CatalogGroup,
  CatalogItem,
  PackageDefinition,
  PackageGroupLimit,
  PackageIncludedItem,
  PackageLevel,
} from '../types/catalog';
import {
  MOCK_CATALOG_GROUPS,
  MOCK_CATALOG_ITEMS,
  MOCK_PACKAGE_DEFINITIONS,
  MOCK_PACKAGE_GROUP_LIMITS,
  MOCK_PACKAGE_INCLUDED_ITEMS,
  MOCK_PACKAGE_LEVELS,
} from './mock-catalog-data';

// Simple in-memory, session-lived cache so revisiting a wizard step doesn't
// re-fetch and re-flash a loading state. Cleared automatically on page reload.
const groupsCache = new Map<string, Promise<CatalogGroup[]>>();
const itemsCache = new Map<string, Promise<CatalogItem[]>>();

function mapGroup(row: any): CatalogGroup {
  return {
    id: row.id,
    supportedEventTypes: Array.isArray(row.supported_event_types) ? row.supported_event_types : [],
    categoryKey: row.category_key,
    name: row.name,
    defaultMaxSelections: row.default_max_selections,
    freeIncludedCount: row.free_included_count ?? 0,
    requiresApprovalAfterLimit: !!row.requires_approval_after_limit,
    approvalMessage: row.approval_message,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
    meals: Array.isArray(row.meals) && row.meals.length > 0 ? row.meals : undefined,
  };
}

function mapItem(row: any): CatalogItem {
  return {
    id: row.id,
    supportedEventTypes: Array.isArray(row.supported_event_types) ? row.supported_event_types : [],
    categoryKey: row.category_key,
    groupId: row.group_id,
    name: row.name,
    description: row.description || '',
    imageUrl: row.image_url || '',
    images: Array.isArray(row.images) ? row.images : [],
    packageLevel: row.package_level,
    price: Number(row.price) || 0,
    unit: row.unit || 'item',
    quantityMode: row.quantity_mode || 'single',
    maxQuantity: row.max_quantity,
    maxSelectionsOverride: row.max_selections_override,
    metadata: row.metadata || {},
    active: row.active !== false,
    displayOrder: row.display_order ?? 0,
  };
}

function mapPackageLevel(row: any): PackageLevel {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
  };
}

function mapPackageDefinition(row: any): PackageDefinition {
  return {
    id: row.id,
    eventTypeId: row.event_type_id,
    name: row.name,
    tagline: row.tagline || '',
    packageLevel: row.package_level,
    basePrice: Number(row.base_price) || 0,
    guestCapacity: row.guest_capacity ?? 0,
    description: row.description || '',
    isPopular: !!row.is_popular,
  };
}

async function getCatalogGroupsUncached(eventTypeId: string, categoryKey?: CatalogCategoryKey): Promise<CatalogGroup[]> {
  const mockFallback = () =>
    MOCK_CATALOG_GROUPS.filter((g) => g.supportedEventTypes.includes(eventTypeId) && (!categoryKey || g.categoryKey === categoryKey));

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    let query = supabase.from('catalog_groups').select('*').contains('supported_event_types', [eventTypeId]).eq('active', true);
    if (categoryKey) query = query.eq('category_key', categoryKey);
    const { data, error } = await query.order('display_order', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return mockFallback();
    return data.map(mapGroup);
  } catch (e) {
    console.warn('getCatalogGroups failed, falling back to mock data:', e);
    return mockFallback();
  }
}

export function getCatalogGroups(eventTypeId: string, categoryKey?: CatalogCategoryKey): Promise<CatalogGroup[]> {
  const key = `${eventTypeId}:${categoryKey || 'all'}`;
  let cached = groupsCache.get(key);
  if (!cached) {
    cached = getCatalogGroupsUncached(eventTypeId, categoryKey);
    groupsCache.set(key, cached);
  }
  return cached;
}

async function getCatalogItemsUncached(eventTypeId: string, categoryKey?: CatalogCategoryKey): Promise<CatalogItem[]> {
  const mockFallback = () =>
    MOCK_CATALOG_ITEMS.filter((i) => i.supportedEventTypes.includes(eventTypeId) && (!categoryKey || i.categoryKey === categoryKey));

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    let query = supabase.from('catalog_items').select('*').contains('supported_event_types', [eventTypeId]).eq('active', true);
    if (categoryKey) query = query.eq('category_key', categoryKey);
    const { data, error } = await query.order('display_order', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return mockFallback();
    return data.map(mapItem);
  } catch (e) {
    console.warn('getCatalogItems failed, falling back to mock data:', e);
    return mockFallback();
  }
}

export function getCatalogItems(eventTypeId: string, categoryKey?: CatalogCategoryKey): Promise<CatalogItem[]> {
  const key = `${eventTypeId}:${categoryKey || 'all'}`;
  let cached = itemsCache.get(key);
  if (!cached) {
    cached = getCatalogItemsUncached(eventTypeId, categoryKey);
    itemsCache.set(key, cached);
  }
  return cached;
}

export async function getPackageLevels(): Promise<PackageLevel[]> {
  if (!isSupabaseConfigured()) return MOCK_PACKAGE_LEVELS;
  try {
    const { data, error } = await supabase.from('package_levels').select('*').eq('active', true).order('rank', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return MOCK_PACKAGE_LEVELS;
    return data.map(mapPackageLevel);
  } catch (e) {
    console.warn('getPackageLevels failed, falling back to mock data:', e);
    return MOCK_PACKAGE_LEVELS;
  }
}

export async function getPackageDefinitions(eventTypeId: string): Promise<PackageDefinition[]> {
  const mockFallback = () => MOCK_PACKAGE_DEFINITIONS.filter((p) => p.eventTypeId === eventTypeId);

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    const { data, error } = await supabase
      .from('wedding_packages')
      .select('*')
      .eq('event_type_id', eventTypeId)
      .not('package_level', 'is', null)
      .order('base_price', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return mockFallback();
    return data.map(mapPackageDefinition);
  } catch (e) {
    console.warn('getPackageDefinitions failed, falling back to mock data:', e);
    return mockFallback();
  }
}

export async function getPackageDefinition(packageId: string): Promise<PackageDefinition | null> {
  const mockFallback = () => MOCK_PACKAGE_DEFINITIONS.find((p) => p.id === packageId) || null;

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    const { data, error } = await supabase.from('wedding_packages').select('*').eq('id', packageId).maybeSingle();
    if (error) throw error;
    if (!data) return mockFallback();
    return mapPackageDefinition(data);
  } catch (e) {
    console.warn('getPackageDefinition failed, falling back to mock data:', e);
    return mockFallback();
  }
}

export async function getPackageIncludedItems(packageId: string): Promise<PackageIncludedItem[]> {
  const mockFallback = () => MOCK_PACKAGE_INCLUDED_ITEMS.filter((i) => i.packageId === packageId);

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    const { data, error } = await supabase.from('package_included_items').select('*').eq('package_id', packageId);
    if (error) throw error;
    if (!data || data.length === 0) return mockFallback();
    return data.map((row: any) => ({
      packageId: row.package_id,
      catalogItemId: row.catalog_item_id,
      quantity: row.quantity ?? 1,
    }));
  } catch (e) {
    console.warn('getPackageIncludedItems failed, falling back to mock data:', e);
    return mockFallback();
  }
}

export async function getPackageGroupLimits(packageId: string): Promise<PackageGroupLimit[]> {
  const mockFallback = () => MOCK_PACKAGE_GROUP_LIMITS.filter((l) => l.packageId === packageId);

  if (!isSupabaseConfigured()) return mockFallback();
  try {
    const { data, error } = await supabase.from('package_group_limits').select('*').eq('package_id', packageId);
    if (error) throw error;
    if (!data || data.length === 0) return mockFallback();
    return data.map((row: any) => ({
      packageId: row.package_id,
      groupId: row.group_id,
      maxSelections: row.max_selections,
      freeIncludedCount: row.free_included_count ?? 0,
    }));
  } catch (e) {
    console.warn('getPackageGroupLimits failed, falling back to mock data:', e);
    return mockFallback();
  }
}

/** All catalog items across every category for a given event type - used when
 * changing event type to check which existing cart lines are still compatible. */
export async function getAllCatalogItemIds(eventTypeId: string): Promise<Set<string>> {
  const items = await getCatalogItems(eventTypeId);
  return new Set(items.map((i) => i.id));
}
