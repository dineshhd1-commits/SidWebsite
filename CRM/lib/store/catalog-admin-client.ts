import { CatalogGroup, CatalogItem, EventType } from '../types/catalog';

async function parseJsonOrThrow(res: Response) {
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.message || body?.error || 'Request failed');
  return body;
}

export async function adminListCatalogItems(eventTypeId?: string): Promise<CatalogItem[]> {
  const url = eventTypeId ? `/api/admin/catalog-items?eventTypeId=${encodeURIComponent(eventTypeId)}` : '/api/admin/catalog-items';
  const res = await fetch(url);
  const body = await parseJsonOrThrow(res);
  return (body.items || []).map((row: any) => ({
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
  }));
}

export async function adminSaveCatalogItem(item: CatalogItem): Promise<void> {
  const res = await fetch('/api/admin/catalog-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  await parseJsonOrThrow(res);
}

export async function adminDeleteCatalogItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/catalog-items/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await parseJsonOrThrow(res);
}

export async function adminToggleCatalogItemActive(id: string, active: boolean): Promise<void> {
  const res = await fetch(`/api/admin/catalog-items/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });
  await parseJsonOrThrow(res);
}

export async function adminListEventTypes(): Promise<EventType[]> {
  const res = await fetch('/api/admin/event-types');
  const body = await parseJsonOrThrow(res);
  return (body.eventTypes || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    shortDescription: row.short_description || '',
    imageUrl: row.image_url || '',
    isCatalogReady: !!row.is_catalog_ready,
    displayOrder: row.display_order ?? 0,
    active: row.active !== false,
  }));
}

export async function adminUpdateEventType(id: string, partial: { isCatalogReady?: boolean; active?: boolean }): Promise<void> {
  const res = await fetch(`/api/admin/event-types/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial),
  });
  await parseJsonOrThrow(res);
}

export async function adminListCatalogGroups(eventTypeId?: string): Promise<CatalogGroup[]> {
  const params = new URLSearchParams();
  if (eventTypeId) params.set('eventTypeId', eventTypeId);
  const res = await fetch(`/api/admin/catalog-groups${params.toString() ? `?${params}` : ''}`);
  const body = await parseJsonOrThrow(res);
  return (body.groups || []).map((row: any) => ({
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
  }));
}

export async function adminUploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  const body = await parseJsonOrThrow(res);
  return body.url;
}

export interface AdminPackageSummary {
  id: string;
  name: string;
  tagline: string;
  packageLevel: string;
  basePrice: number;
  guestCapacity: number;
  isPopular: boolean;
}

export interface AdminPackageDetail {
  includedItemIds: string[];
  groupLimits: { groupId: string; maxSelections: number; freeIncludedCount: number }[];
}

export async function adminListPackages(): Promise<AdminPackageSummary[]> {
  const res = await fetch('/api/admin/packages');
  const body = await parseJsonOrThrow(res);
  return (body.packages || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    tagline: row.tagline || '',
    packageLevel: row.package_level,
    basePrice: Number(row.base_price) || 0,
    guestCapacity: row.guest_capacity ?? 0,
    isPopular: !!row.is_popular,
  }));
}

export async function adminGetPackageDetail(id: string): Promise<AdminPackageDetail> {
  const res = await fetch(`/api/admin/packages/${encodeURIComponent(id)}`);
  return parseJsonOrThrow(res);
}

export async function adminSavePackageDetail(id: string, detail: AdminPackageDetail): Promise<void> {
  const res = await fetch(`/api/admin/packages/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detail),
  });
  await parseJsonOrThrow(res);
}
