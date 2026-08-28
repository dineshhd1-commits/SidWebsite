import { supabase, isSupabaseConfigured } from '../supabase';
import { EventType } from '../types/catalog';
import { MOCK_EVENT_TYPES } from './mock-catalog-data';

function mapRow(row: any): EventType {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description || '',
    imageUrl: row.image_url || '',
    isCatalogReady: !!row.is_catalog_ready,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
  };
}

// Session-lived cache, same pattern as lib/data/catalog.ts - avoids a repeat
// network round-trip if the user navigates back to the builder later.
let eventTypesCache: Promise<EventType[]> | null = null;

/** Reads from Supabase; falls back to local mock event types (matching
 * supabase/seed_event_builder.sql) when the table doesn't exist yet or is
 * genuinely empty, so the builder is reviewable before migrations are run. */
export function getEventTypes(): Promise<EventType[]> {
  if (!eventTypesCache) eventTypesCache = getEventTypesUncached();
  return eventTypesCache;
}

async function getEventTypesUncached(): Promise<EventType[]> {
  if (!isSupabaseConfigured()) return MOCK_EVENT_TYPES;
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return MOCK_EVENT_TYPES;
    return data.map(mapRow);
  } catch (e) {
    console.warn('getEventTypes failed, falling back to mock event types:', e);
    return MOCK_EVENT_TYPES;
  }
}

export async function getEventType(id: string): Promise<EventType | null> {
  const all = await getEventTypes();
  return all.find((et) => et.id === id) || null;
}
