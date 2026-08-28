'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import {
  getAdminQuotesFromBackend,
  updateAdminQuote,
  updateQuoteStatus,
  deleteAdminQuote,
  getAdminInquiries,
  saveAdminInquiry,
  updateInquiryStatus,
  deleteAdminInquiry,
  AdminQuoteRequest,
  AdminQuoteStatus,
  AdminInquiry,
} from '@/lib/store/admin-store';
import {
  FileText,
  Users,
  IndianRupee,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Search,
  Trash2,
  Filter,
  Plus,
  Edit3,
  LogOut,
  Package,
  Layers,
  X,
  Save,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  adminListCatalogItems,
  adminSaveCatalogItem,
  adminDeleteCatalogItem,
  adminToggleCatalogItemActive,
  adminListEventTypes,
  adminUpdateEventType,
  adminListCatalogGroups,
  adminUploadImage,
  adminListPackages,
  adminGetPackageDetail,
  adminSavePackageDetail,
  AdminPackageSummary,
  AdminPackageDetail,
} from '@/lib/store/catalog-admin-client';
import {
  adminListGalleryItems,
  adminSaveGalleryItem,
  adminDeleteGalleryItem,
  adminToggleGalleryItemActive,
  adminListTestimonials,
  adminSaveTestimonial,
  adminDeleteTestimonial,
  adminToggleTestimonialActive,
  AdminGalleryItem,
  AdminTestimonial,
} from '@/lib/store/content-admin-client';
import { CatalogCategoryKey, CatalogGroup, CatalogItem, EventType, PackageLevelId } from '@/lib/types/catalog';
import { PackageLevelBadge } from '@/components/builder/PackageLevelBadge';

const CATEGORY_OPTIONS: { value: CatalogCategoryKey; label: string }[] = [
  { value: 'decoration', label: 'Decoration' },
  { value: 'photography', label: 'Photography & Videography' },
  { value: 'catering', label: 'Catering' },
  { value: 'venue', label: 'Venue' },
  { value: 'additional_services', label: 'Additional Services' },
];

const PACKAGE_LEVEL_OPTIONS: PackageLevelId[] = ['normal', 'standard', 'silver', 'gold', 'premium', 'luxury'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getAdminImageSrc(src: string): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return src.startsWith('/') ? src : `/${src}`;
}

const EMPTY_CATALOG_ITEM_FORM: CatalogItem = {
  id: '',
  supportedEventTypes: ['wedding'],
  categoryKey: 'decoration',
  groupId: null,
  name: '',
  description: '',
  imageUrl: '',
  images: [],
  packageLevel: 'standard',
  price: 0,
  unit: 'item',
  quantityMode: 'single',
  maxQuantity: null,
  maxSelectionsOverride: null,
  metadata: {},
  active: true,
  displayOrder: 0,
};

const EMPTY_GALLERY_FORM: AdminGalleryItem = {
  id: '',
  title: '',
  category: 'decoration',
  mediaType: 'image',
  url: '',
  active: true,
  displayOrder: 0,
};

const EMPTY_TESTIMONIAL_FORM: AdminTestimonial = {
  id: '',
  coupleNames: '',
  weddingDate: '',
  location: '',
  rating: 5,
  comment: '',
  imageUrl: '',
  isGoogleVerified: true,
  active: true,
  displayOrder: 0,
};

function CatalogItemFormFields({
  form,
  onChange,
  groups,
  eventTypes,
  uploadingImage,
  onImageUpload,
}: {
  form: CatalogItem;
  onChange: (partial: Partial<CatalogItem>) => void;
  groups: CatalogGroup[];
  eventTypes: EventType[];
  uploadingImage: boolean;
  onImageUpload: (file: File) => void;
}) {
  const groupsForCategory = groups.filter((g) => g.categoryKey === form.categoryKey);

  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block font-bold mb-1">Item Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Supported Event Types</label>
        <div className="flex flex-wrap gap-2 border border-gold-300 rounded-lg p-2">
          {(eventTypes.length > 0 ? eventTypes : [{ id: 'wedding', name: 'Wedding' } as EventType]).map((et) => {
            const checked = form.supportedEventTypes.includes(et.id);
            return (
              <label
                key={et.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer border ${
                  checked ? 'bg-maroon-800 text-gold-300 border-gold-400' : 'bg-white text-maroon-900 border-gold-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      supportedEventTypes: checked
                        ? form.supportedEventTypes.filter((id) => id !== et.id)
                        : [...form.supportedEventTypes, et.id],
                    })
                  }
                />
                {et.name}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">Category</label>
        <select
          value={form.categoryKey}
          onChange={(e) => onChange({ categoryKey: e.target.value as CatalogCategoryKey, groupId: null })}
          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold mb-1">Subcategory / Group</label>
        <select
          value={form.groupId || ''}
          onChange={(e) => onChange({ groupId: e.target.value || null })}
          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
        >
          <option value="">No group</option>
          {groupsForCategory.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold mb-1">Package Level</label>
          <select
            value={form.packageLevel}
            onChange={(e) => onChange({ packageLevel: e.target.value as PackageLevelId })}
            className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
          >
            {PACKAGE_LEVEL_OPTIONS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">Price (₹)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold mb-1">Unit</label>
          <input
            type="text"
            value={form.unit}
            onChange={(e) => onChange({ unit: e.target.value })}
            className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Display Order</label>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => onChange({ displayOrder: Number(e.target.value) })}
            className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Image</label>
        <div className="flex items-center gap-3">
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gold-300" />
          )}
          <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-gold-400 rounded-lg p-2 cursor-pointer hover:bg-gold-50 text-maroon-800">
            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            <span className="font-bold">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              disabled={uploadingImage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.active} onChange={(e) => onChange({ active: e.target.checked })} />
        <span className="font-bold">Active (visible to customers)</span>
      </label>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [quotesActionError, setQuotesActionError] = useState<string | null>(null);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);

  const [activeTab, setActiveTab] = useState<
    'quotes' | 'inquiries' | 'catalog' | 'eventTypes' | 'packages' | 'portfolio' | 'testimonials'
  >('quotes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Catalog Manager (Supabase-backed) state
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [catalogGroups, setCatalogGroups] = useState<CatalogGroup[]>([]);
  const [eventTypesAdmin, setEventTypesAdmin] = useState<EventType[]>([]);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<CatalogCategoryKey>('decoration');
  const [catalogEventTypeFilter, setCatalogEventTypeFilter] = useState<string>('wedding');
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogItemModal, setCatalogItemModal] = useState<CatalogItem | null>(null);
  const [isNewCatalogItemModal, setIsNewCatalogItemModal] = useState(false);
  const [catalogItemForm, setCatalogItemForm] = useState<CatalogItem>(EMPTY_CATALOG_ITEM_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Packages Manager state
  const [packagesAdmin, setPackagesAdmin] = useState<AdminPackageSummary[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packagesError, setPackagesError] = useState<string | null>(null);
  const [editPackageId, setEditPackageId] = useState<string | null>(null);
  const [editPackageDetail, setEditPackageDetail] = useState<AdminPackageDetail | null>(null);
  const [savingPackageDetail, setSavingPackageDetail] = useState(false);

  // Portfolio (Gallery) Manager state
  const [galleryItemsAdmin, setGalleryItemsAdmin] = useState<AdminGalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryItemModal, setGalleryItemModal] = useState<AdminGalleryItem | null>(null);
  const [isNewGalleryModal, setIsNewGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState<AdminGalleryItem>(EMPTY_GALLERY_FORM);

  // Testimonials Manager state
  const [testimonialsAdmin, setTestimonialsAdmin] = useState<AdminTestimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null);
  const [testimonialModal, setTestimonialModal] = useState<AdminTestimonial | null>(null);
  const [isNewTestimonialModal, setIsNewTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<AdminTestimonial>(EMPTY_TESTIMONIAL_FORM);

  // Modals state
  const [editQuoteModal, setEditQuoteModal] = useState<AdminQuoteRequest | null>(null);

  // Real access control is enforced server-side by middleware.ts (checks the
  // httpOnly admin session cookie) - reaching this component at all means the
  // request already passed that check. This effect just loads the initial data.
  const loadQuotes = async () => {
    setQuotesLoading(true);
    try {
      setQuotes(await getAdminQuotesFromBackend());
    } finally {
      setQuotesLoading(false);
    }
  };

  useEffect(() => {
    setIsAuthenticated(true);
    loadQuotes();
    loadCatalogData();
    setInquiries(getAdminInquiries());
  }, []);

  const loadCatalogData = async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const [items, groups, eventTypesList] = await Promise.all([
        adminListCatalogItems(catalogEventTypeFilter || undefined),
        adminListCatalogGroups(catalogEventTypeFilter || undefined),
        adminListEventTypes(),
      ]);
      setCatalogItems(items);
      setCatalogGroups(groups);
      setEventTypesAdmin(eventTypesList);
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to load catalog data. Have you run the Supabase migrations yet?');
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (activeTab === 'catalog' || activeTab === 'eventTypes')) {
      loadCatalogData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab, catalogEventTypeFilter]);

  const loadPackagesData = async () => {
    setPackagesLoading(true);
    setPackagesError(null);
    try {
      setPackagesAdmin(await adminListPackages());
    } catch (e) {
      setPackagesError(e instanceof Error ? e.message : 'Failed to load packages. Have you run the Supabase migrations yet?');
    } finally {
      setPackagesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'packages') {
      loadPackagesData();
      if (catalogItems.length === 0) loadCatalogData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

  const openPackageEditor = async (pkg: AdminPackageSummary) => {
    setEditPackageId(pkg.id);
    setEditPackageDetail(await adminGetPackageDetail(pkg.id));
  };

  const toggleIncludedItem = (itemId: string) => {
    setEditPackageDetail((prev) => {
      if (!prev) return prev;
      const included = prev.includedItemIds.includes(itemId)
        ? prev.includedItemIds.filter((id) => id !== itemId)
        : [...prev.includedItemIds, itemId];
      return { ...prev, includedItemIds: included };
    });
  };

  const updateGroupLimit = (groupId: string, partial: Partial<{ maxSelections: number; freeIncludedCount: number }>) => {
    setEditPackageDetail((prev) => {
      if (!prev) return prev;
      const existing = prev.groupLimits.find((l) => l.groupId === groupId);
      const groupLimits = existing
        ? prev.groupLimits.map((l) => (l.groupId === groupId ? { ...l, ...partial } : l))
        : [...prev.groupLimits, { groupId, maxSelections: 1, freeIncludedCount: 0, ...partial }];
      return { ...prev, groupLimits };
    });
  };

  const handleSavePackageDetail = async () => {
    if (!editPackageId || !editPackageDetail) return;
    setSavingPackageDetail(true);
    try {
      await adminSavePackageDetail(editPackageId, editPackageDetail);
      setEditPackageId(null);
      setEditPackageDetail(null);
    } catch (e) {
      setPackagesError(e instanceof Error ? e.message : 'Failed to save package.');
    } finally {
      setSavingPackageDetail(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await adminUploadImage(file);
      setCatalogItemForm((prev) => ({ ...prev, imageUrl: url, images: [...prev.images, url] }));
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = catalogItemForm.id || `${catalogItemForm.categoryKey}-${slugify(catalogItemForm.name)}-${Date.now().toString(36)}`;
    try {
      await adminSaveCatalogItem({ ...catalogItemForm, id });
      setIsNewCatalogItemModal(false);
      setCatalogItemForm(EMPTY_CATALOG_ITEM_FORM);
      loadCatalogData();
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to save catalog item.');
    }
  };

  const handleSaveCatalogItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogItemModal) return;
    try {
      await adminSaveCatalogItem(catalogItemModal);
      setCatalogItemModal(null);
      loadCatalogData();
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to save catalog item.');
    }
  };

  const handleDeleteCatalogItem = async (id: string) => {
    if (!confirm('Delete this catalog item? This cannot be undone.')) return;
    try {
      await adminDeleteCatalogItem(id);
      loadCatalogData();
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to delete catalog item.');
    }
  };

  const handleToggleCatalogItemActive = async (item: CatalogItem) => {
    try {
      await adminToggleCatalogItemActive(item.id, !item.active);
      loadCatalogData();
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to update catalog item.');
    }
  };

  const handleToggleEventTypeReady = async (eventType: EventType) => {
    try {
      await adminUpdateEventType(eventType.id, { isCatalogReady: !eventType.isCatalogReady });
      loadCatalogData();
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Failed to update event type.');
    }
  };

  const loadGalleryData = async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      setGalleryItemsAdmin(await adminListGalleryItems());
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Failed to load portfolio. Have you run the Supabase migrations yet?');
    } finally {
      setGalleryLoading(false);
    }
  };

  const loadTestimonialsData = async () => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      setTestimonialsAdmin(await adminListTestimonials());
    } catch (e) {
      setTestimonialsError(e instanceof Error ? e.message : 'Failed to load testimonials. Have you run the Supabase migrations yet?');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'portfolio') loadGalleryData();
    if (isAuthenticated && activeTab === 'testimonials') loadTestimonialsData();
  }, [isAuthenticated, activeTab]);

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = galleryForm.id || `gallery-${slugify(galleryForm.title)}-${Date.now().toString(36)}`;
    try {
      await adminSaveGalleryItem({ ...galleryForm, id });
      setIsNewGalleryModal(false);
      setGalleryForm(EMPTY_GALLERY_FORM);
      loadGalleryData();
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Failed to save portfolio item.');
    }
  };

  const handleSaveGalleryItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryItemModal) return;
    try {
      await adminSaveGalleryItem(galleryItemModal);
      setGalleryItemModal(null);
      loadGalleryData();
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Failed to save portfolio item.');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      await adminDeleteGalleryItem(id);
      loadGalleryData();
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Failed to delete portfolio item.');
    }
  };

  const handleToggleGalleryActive = async (item: AdminGalleryItem) => {
    try {
      await adminToggleGalleryItemActive(item.id, !item.active);
      loadGalleryData();
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Failed to update portfolio item.');
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = testimonialForm.id || `testimonial-${slugify(testimonialForm.coupleNames)}-${Date.now().toString(36)}`;
    try {
      await adminSaveTestimonial({ ...testimonialForm, id });
      setIsNewTestimonialModal(false);
      setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
      loadTestimonialsData();
    } catch (e) {
      setTestimonialsError(e instanceof Error ? e.message : 'Failed to save testimonial.');
    }
  };

  const handleSaveTestimonialEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialModal) return;
    try {
      await adminSaveTestimonial(testimonialModal);
      setTestimonialModal(null);
      loadTestimonialsData();
    } catch (e) {
      setTestimonialsError(e instanceof Error ? e.message : 'Failed to save testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await adminDeleteTestimonial(id);
      loadTestimonialsData();
    } catch (e) {
      setTestimonialsError(e instanceof Error ? e.message : 'Failed to delete testimonial.');
    }
  };

  const handleToggleTestimonialActive = async (item: AdminTestimonial) => {
    try {
      await adminToggleTestimonialActive(item.id, !item.active);
      loadTestimonialsData();
    } catch (e) {
      setTestimonialsError(e instanceof Error ? e.message : 'Failed to update testimonial.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // --- Quote Operations ---
  // Each handler applies the optimistic UI update first (the on-screen list
  // is Supabase-sourced, so the store function's own local-cache return
  // value isn't what's shown), then awaits the real backend write; if that
  // write fails, it re-syncs from the backend via loadQuotes() instead of
  // leaving the UI showing a change that never actually persisted, and
  // surfaces the failure so the admin knows to retry.
  const handleUpdateQuoteStatus = async (id: string, refCode: string, status: AdminQuoteStatus) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    try {
      await updateQuoteStatus(id, refCode, status);
    } catch (e) {
      console.error(e);
      setQuotesActionError('Failed to update status - please try again.');
      await loadQuotes();
    }
  };

  const handleDeleteQuote = async (id: string, refCode: string) => {
    if (confirm('Are you sure you want to delete this quote request?')) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      try {
        await deleteAdminQuote(id, refCode);
      } catch (e) {
        console.error(e);
        setQuotesActionError('Failed to delete quote - please try again.');
        await loadQuotes();
      }
    }
  };

  const handleSaveQuoteEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editQuoteModal) {
      setQuotes((prev) => prev.map((q) => (q.id === editQuoteModal.id ? editQuoteModal : q)));
      setEditQuoteModal(null);
      try {
        await updateAdminQuote(editQuoteModal);
      } catch (e) {
        console.error(e);
        setQuotesActionError('Failed to save changes - please try again.');
        await loadQuotes();
      }
    }
  };

  // --- Inquiry Operations ---
  const handleDeleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      const updated = deleteAdminInquiry(id);
      setInquiries(updated);
    }
  };

  const handleUpdateInquiryStatus = (id: string, status: AdminInquiry['status']) => {
    const updated = updateInquiryStatus(id, status);
    setInquiries(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-silk-100 text-maroon-900 flex items-center justify-center font-bold text-sm">
        Verifying Access...
      </div>
    );
  }

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerPhone.includes(searchQuery) ||
      q.venueCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenuePipeline = quotes.reduce((acc, q) => acc + q.estimatedCost, 0);
  const pendingCount = quotes.filter((q) => q.status === 'New').length;
  const confirmedCount = quotes.filter((q) => q.status === 'Confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 min-h-screen">
      
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gold-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-gold-600 font-bold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              Admin Portal
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
              Supabase Live Data Sync
            </span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900 mt-2">
            SID Events Control Center
          </h1>
          <p className="text-maroon-700/80 text-sm mt-1">
            Manage quotes, customer bookings, service catalog prices and wedding packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GoldButton variant="dark" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </GoldButton>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard variant="warm" className="p-6 space-y-2 border-l-4 border-l-gold-500">
          <div className="flex items-center justify-between text-maroon-700">
            <span className="text-xs font-bold uppercase tracking-wider">Quote Requests</span>
            <FileText className="w-5 h-5 text-gold-600" />
          </div>
          <p className="font-playfair text-3xl font-bold text-maroon-900">{quotes.length}</p>
          <p className="text-[11px] text-maroon-700/70">{pendingCount} pending review</p>
        </GlassCard>

        <GlassCard variant="warm" className="p-6 space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-maroon-700">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Value</span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-playfair text-3xl font-bold text-maroon-900">
            ₹{totalRevenuePipeline.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-maroon-700/70">Total value in pipeline</p>
        </GlassCard>

        <GlassCard variant="warm" className="p-6 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-maroon-700">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Bookings</span>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-playfair text-3xl font-bold text-maroon-900">{confirmedCount}</p>
          <p className="text-[11px] text-maroon-700/70">Ready for execution</p>
        </GlassCard>

        <GlassCard variant="warm" className="p-6 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-maroon-700">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog Items</span>
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <p className="font-playfair text-3xl font-bold text-maroon-900">{catalogItems.filter((i) => i.active).length}</p>
          <p className="text-[11px] text-maroon-700/70">Configured offerings</p>
        </GlassCard>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gold-300 gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'quotes'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Quote Requests ({quotes.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Online Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Event Builder Catalog
        </button>

        <button
          onClick={() => setActiveTab('eventTypes')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'eventTypes'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Event Types
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'packages'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Packages
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Portfolio
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'testimonials'
              ? 'border-gold-600 text-maroon-900'
              : 'border-transparent text-maroon-700/60 hover:text-maroon-900'
          }`}
        >
          Testimonials
        </button>
      </div>

      {/* TAB 1: QUOTES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-700/50" />
              <input
                type="text"
                placeholder="Search name, ref code or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gold-300 rounded-xl pl-9 pr-4 py-2 text-xs text-maroon-900 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gold-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gold-300 rounded-xl px-3 py-2 text-xs text-maroon-900 focus:outline-none focus:border-gold-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={loadQuotes}
                disabled={quotesLoading}
                className="p-2 rounded-lg bg-white border border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors disabled:opacity-50"
                title="Refresh enquiries"
              >
                <RefreshCw className={`w-4 h-4 ${quotesLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {quotesActionError && (
            <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
              <span>{quotesActionError}</span>
              <button type="button" onClick={() => setQuotesActionError(null)} className="text-rose-600 hover:text-rose-800 font-bold">Dismiss</button>
            </div>
          )}

          {quotesLoading && quotes.length === 0 ? (
            <div className="text-center py-16 text-maroon-700/70 text-sm">Loading enquiries...</div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-16 text-maroon-700/70 text-sm">No enquiries yet.</div>
          ) : (
          <div className="space-y-4">
            {filteredQuotes.map((q) => (
              <GlassCard key={q.id} className="p-6 space-y-4 border border-gold-300 hover:border-gold-500 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-gold-700 bg-gold-100 border border-gold-300 px-2.5 py-0.5 rounded-md font-mono">
                        #{q.refCode}
                      </span>
                      <h3 className="font-playfair text-lg font-bold text-maroon-900">{q.customerName}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-maroon-700/80 font-sans">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gold-600" /> {q.customerPhone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gold-600" /> {q.customerEmail}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-600" /> {q.weddingDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold-600" /> {q.venueCity} &mdash; {q.venueAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={q.status}
                      onChange={(e) => handleUpdateQuoteStatus(q.id, q.refCode, e.target.value as AdminQuoteStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                        q.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : q.status === 'Quoted'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : q.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : q.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setEditQuoteModal(q)}
                      className="p-2 rounded-lg bg-gold-100 text-gold-800 hover:bg-gold-200 transition-colors"
                      title="Edit Record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${q.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Namaste ${q.customerName}! Thank you for choosing SID Events. We are following up regarding quote request #${q.refCode}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {q.pdfUrl && (
                      <a
                        href={q.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-maroon-800 text-gold-200 hover:bg-maroon-900 border border-gold-400/50 transition-colors shadow-sm inline-flex items-center gap-1.5 text-xs font-bold"
                        title="View & Download Event Quotation PDF"
                      >
                        <FileText className="w-4 h-4 text-gold-300" />
                        <span>PDF</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteQuote(q.id, q.refCode)}
                      className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                      title="Delete Quote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-xs bg-white/60 p-4 rounded-xl border border-gold-200">
                  <div>
                    <span className="text-maroon-700/60 block font-semibold">Guests</span>
                    <span className="font-bold text-maroon-900">{q.guestCount} Guests</span>
                  </div>
                  <div>
                    <span className="text-maroon-700/60 block font-semibold">Event Type</span>
                    <span className="font-bold text-maroon-900 capitalize">{q.fullDetails?.eventTypeLabel || q.photographyTier}</span>
                  </div>
                  <div>
                    <span className="text-maroon-700/60 block font-semibold">Selections</span>
                    <span className="font-bold text-maroon-900">{q.selectedServicesCount} Selected</span>
                  </div>
                  <div>
                    <span className="text-maroon-700/60 block font-semibold">Est. Package Total</span>
                    <span className="font-bold text-emerald-700">₹{q.estimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {q.notes && (
                  <div className="text-xs bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-amber-900">
                    <span className="font-bold">Customer Notes:</span> &ldquo;{q.notes}&rdquo;
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedQuoteId(expandedQuoteId === q.id ? null : q.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-maroon-900"
                >
                  {expandedQuoteId === q.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {expandedQuoteId === q.id ? 'Hide Full Selections' : 'View Full Selections'}
                </button>

                {expandedQuoteId === q.id && (
                  <div className="space-y-4 bg-amber-50/80 text-maroon-950 p-5 rounded-2xl border-2 border-gold-300 shadow-sm">
                    {!q.fullDetails ? (
                      <p className="text-xs text-maroon-700/70">
                        This older enquiry was saved before the detailed breakdown existed - only the summary above is available.
                      </p>
                    ) : (
                      <>
                        {q.fullDetails.specialRequirements && (
                          <div className="text-xs bg-amber-100/80 border border-amber-300 text-amber-950 p-3.5 rounded-xl">
                            <span className="font-bold text-amber-900">Special Requirements: </span>
                            {q.fullDetails.specialRequirements}
                          </div>
                        )}

                        {q.fullDetails.sections.length === 0 && q.fullDetails.cateringMenus.length === 0 ? (
                          <p className="text-xs text-maroon-700/70">No services were selected for this enquiry.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {q.fullDetails.sections.map((section) => (
                              <div key={section.categoryKey} className="space-y-2 bg-white/80 p-4 rounded-xl border border-gold-200 shadow-xs">
                                <span className="text-xs font-bold uppercase tracking-wider text-maroon-900 flex items-center gap-1.5 border-b border-gold-200/80 pb-2">
                                  <span>{section.icon}</span>
                                  <span>{section.label}</span>
                                </span>
                                <ul className="text-xs text-maroon-900 space-y-2.5">
                                  {section.lines.map((line, i) => {
                                    const photos = line.imageUrl
                                      ? line.imageUrl.startsWith('data:')
                                        ? [line.imageUrl]
                                        : line.imageUrl.split(',').map((u) => u.trim()).filter(Boolean)
                                      : [];

                                    return (
                                      <li key={i} className="flex items-start gap-2.5 pt-1">
                                        {photos.length > 0 && (
                                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap max-w-[150px]">
                                            {photos.map((pUrl, pIdx) => (
                                              <img
                                                key={pIdx}
                                                src={getAdminImageSrc(pUrl)}
                                                alt={`${line.name} ${pIdx + 1}`}
                                                className="w-12 h-12 rounded-lg object-cover border border-gold-300 bg-gold-50 shadow-xs hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                  const target = e.currentTarget;
                                                  if (!target.dataset.triedFallback && target.src.includes('localhost:3001')) {
                                                    target.dataset.triedFallback = 'true';
                                                    target.src = target.src.replace('localhost:3001', 'localhost:3000');
                                                  } else {
                                                    target.style.display = 'none';
                                                  }
                                                }}
                                              />
                                            ))}
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <span className="font-semibold text-maroon-950 block">
                                            {line.name}
                                            {line.quantity > 1 ? ` (x${line.quantity})` : ''}
                                          </span>
                                          {photos.length > 1 && (
                                            <span className="text-[11px] text-gold-800 font-bold block">
                                              {photos.length} Designs Selected
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}

                            {q.fullDetails.cateringMenus.length > 0 && (
                              <div className="space-y-3 sm:col-span-2 bg-white/90 p-4 rounded-xl border border-gold-200 shadow-xs">
                                <span className="text-xs font-bold uppercase tracking-wider text-maroon-900 flex items-center gap-1.5 border-b border-gold-200/80 pb-2">
                                  <span>🍽️</span> Catering Menu Breakdown
                                </span>
                                {q.fullDetails.cateringMenus.map((menu) => (
                                  <div key={menu.menuType} className="space-y-1.5 bg-gold-50/50 p-3 rounded-lg border border-gold-200/60">
                                    <p className="text-xs font-bold text-maroon-900">
                                      {menu.menuLabel}
                                      {menu.guestCount ? ` (${menu.guestCount} guests)` : ''}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-maroon-800 pl-2">
                                      {menu.sections.map((section) => (
                                        <div key={section.categoryName}>
                                          <span className="font-bold text-maroon-950">{section.categoryName}: </span>
                                          <span>{section.lines.map((l) => `${l.name}${l.quantity > 1 ? ` x${l.quantity}` : ''}`).join(', ')}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {q.fullDetails.requestedExtras.length > 0 && (
                          <div className="text-xs bg-amber-100/90 border border-amber-300 text-amber-950 p-3 rounded-lg">
                            <span className="font-bold">Pending Approval Requests: </span>
                            {q.fullDetails.requestedExtras.map((l) => l.name).join(', ')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
          )}
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <GlassCard key={inq.id} className="p-6 space-y-3 border border-gold-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-playfair text-base font-bold text-maroon-900">{inq.fullName}</h4>
                <div className="flex items-center gap-4 text-xs text-maroon-700/80 font-sans">
                  <span>Phone: {inq.phone}</span>
                  <span>Event Date: {inq.weddingDate}</span>
                </div>
                {inq.notes && <p className="text-xs text-maroon-900 italic">&ldquo;{inq.notes}&rdquo;</p>}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={inq.status}
                  onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gold-300 bg-white"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => handleDeleteInquiry(inq.id)}
                  className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* TAB 5: EVENT BUILDER CATALOG MANAGER */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-playfair text-xl font-bold text-maroon-900">Event Builder Catalog</h3>
              <p className="text-xs text-maroon-700/70">Designs, services, catering items, venues and add-ons used by the custom event builder.</p>
            </div>
            <GoldButton
              size="sm"
              variant="gold"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setCatalogItemForm({ ...EMPTY_CATALOG_ITEM_FORM, supportedEventTypes: [catalogEventTypeFilter], categoryKey: catalogCategoryFilter });
                setIsNewCatalogItemModal(true);
              }}
            >
              Add Catalog Item
            </GoldButton>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={catalogEventTypeFilter}
              onChange={(e) => setCatalogEventTypeFilter(e.target.value)}
              className="bg-white border border-gold-300 rounded-xl px-3 py-2 text-xs font-bold text-maroon-900 focus:outline-none focus:border-gold-500"
            >
              {(eventTypesAdmin.length > 0 ? eventTypesAdmin : [{ id: 'wedding', name: 'Wedding' } as EventType]).map((et) => (
                <option key={et.id} value={et.id}>{et.name}</option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCatalogCategoryFilter(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    catalogCategoryFilter === c.value
                      ? 'bg-maroon-800 text-gold-300 border-gold-400'
                      : 'bg-white text-maroon-900 border-gold-300 hover:bg-gold-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {catalogError && (
            <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3">
              {catalogError}
            </div>
          )}

          {catalogLoading ? (
            <div className="flex items-center gap-2 text-xs text-maroon-700 py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems
                .filter((i) => i.categoryKey === catalogCategoryFilter)
                .map((item) => (
                  <GlassCard key={item.id} className={`p-5 space-y-3 relative border flex flex-col justify-between ${item.active ? 'border-gold-300' : 'border-gray-300 opacity-60'}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                          {catalogGroups.find((g) => g.id === item.groupId)?.name || 'Ungrouped'}
                        </span>
                        <PackageLevelBadge level={item.packageLevel} />
                      </div>
                      {item.imageUrl && (
                        <div className="relative h-28 rounded-lg overflow-hidden bg-gold-50">
                          <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      )}
                      <h4 className="font-playfair font-bold text-base text-maroon-900">{item.name}</h4>
                      <p className="text-xs text-maroon-700/80 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                      <span className="font-bold text-sm text-emerald-800">
                        ₹{item.price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-maroon-700">/{item.unit}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCatalogItemActive(item)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {item.active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setCatalogItemModal(item)}
                          className="p-1.5 rounded-md bg-gold-100 text-gold-800 hover:bg-gold-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCatalogItem(item.id)}
                          className="p-1.5 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              {catalogItems.filter((i) => i.categoryKey === catalogCategoryFilter).length === 0 && (
                <p className="text-xs text-maroon-700/70 col-span-full py-8 text-center">
                  No items yet in this category for this event type. Add one to get started.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: EVENT TYPES MANAGER */}
      {activeTab === 'eventTypes' && (
        <div className="space-y-6">
          <h3 className="font-playfair text-xl font-bold text-maroon-900">Event Types</h3>
          <p className="text-xs text-maroon-700/70 -mt-4">
            Toggle which event types show a full package builder vs. a &ldquo;request a custom quote&rdquo; card on the site.
          </p>

          {catalogError && (
            <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3">{catalogError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypesAdmin.map((et) => (
              <GlassCard key={et.id} className="p-5 space-y-3 border border-gold-300 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-playfair font-bold text-base text-maroon-900">{et.name}</h4>
                  <p className="text-xs text-maroon-700/80 line-clamp-2">{et.shortDescription}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${et.isCatalogReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {et.isCatalogReady ? 'Full Builder Live' : 'Custom Quote Only'}
                  </span>
                  <button
                    onClick={() => handleToggleEventTypeReady(et)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gold-100 text-gold-900 hover:bg-gold-200"
                  >
                    Toggle
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PACKAGES MANAGER */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">Wedding Packages</h3>
            <p className="text-xs text-maroon-700/70">Edit which catalog items are included in each package, and category selection limits.</p>
          </div>

          {packagesError && <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3">{packagesError}</div>}

          {packagesLoading ? (
            <div className="flex items-center gap-2 text-xs text-maroon-700 py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading packages...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packagesAdmin.map((pkg) => (
                <GlassCard key={pkg.id} className="p-6 space-y-3 border-2 border-gold-400 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
                        {pkg.packageLevel}
                      </span>
                      <span className="font-playfair font-bold text-lg text-emerald-800">₹{pkg.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <h3 className="font-playfair font-bold text-xl text-maroon-900">{pkg.name}</h3>
                    <p className="text-xs text-maroon-700 font-medium">&ldquo;{pkg.tagline}&rdquo;</p>
                  </div>
                  <button
                    onClick={() => openPackageEditor(pkg)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gold-100 text-gold-900 hover:bg-gold-200 self-start"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Inclusions & Limits
                  </button>
                </GlassCard>
              ))}
              {packagesAdmin.length === 0 && (
                <p className="text-xs text-maroon-700/70 col-span-full py-8 text-center">No packages found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: PORTFOLIO MANAGER */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-playfair text-xl font-bold text-maroon-900">Portfolio / Gallery</h3>
              <p className="text-xs text-maroon-700/70">Manage images shown on the public Portfolio page.</p>
            </div>
            <GoldButton
              size="sm"
              variant="gold"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setGalleryForm(EMPTY_GALLERY_FORM);
                setIsNewGalleryModal(true);
              }}
            >
              Add Portfolio Item
            </GoldButton>
          </div>

          {galleryError && <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3">{galleryError}</div>}

          {galleryLoading ? (
            <div className="flex items-center gap-2 text-xs text-maroon-700 py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading portfolio...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItemsAdmin.map((item) => (
                <GlassCard key={item.id} className={`p-5 space-y-3 border flex flex-col justify-between ${item.active ? 'border-gold-300' : 'border-gray-300 opacity-60'}`}>
                  <div className="space-y-2">
                    {item.url && item.mediaType === 'image' && (
                      <div className="relative h-28 rounded-lg overflow-hidden bg-gold-50">
                        <img src={item.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                      {item.category}
                    </span>
                    <h4 className="font-playfair font-bold text-base text-maroon-900">{item.title}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                    <button
                      onClick={() => handleToggleGalleryActive(item)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {item.active ? 'Active' : 'Inactive'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setGalleryItemModal(item)} className="p-1.5 rounded-md bg-gold-100 text-gold-800 hover:bg-gold-200">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteGalleryItem(item.id)} className="p-1.5 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {galleryItemsAdmin.length === 0 && (
                <p className="text-xs text-maroon-700/70 col-span-full py-8 text-center">No portfolio items yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: TESTIMONIALS MANAGER */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-playfair text-xl font-bold text-maroon-900">Testimonials & Google Reviews</h3>
              <p className="text-xs text-maroon-700/70">Manage reviews shown on the public Testimonials page. Only use real, verified reviews.</p>
            </div>
            <GoldButton
              size="sm"
              variant="gold"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
                setIsNewTestimonialModal(true);
              }}
            >
              Add Testimonial
            </GoldButton>
          </div>

          {testimonialsError && <div className="text-xs bg-rose-50 border border-rose-300 text-rose-800 rounded-xl px-4 py-3">{testimonialsError}</div>}

          {testimonialsLoading ? (
            <div className="flex items-center gap-2 text-xs text-maroon-700 py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading testimonials...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialsAdmin.map((t) => (
                <GlassCard key={t.id} className={`p-5 space-y-3 border flex flex-col justify-between ${t.active ? 'border-gold-300' : 'border-gray-300 opacity-60'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-playfair font-bold text-base text-maroon-900">{t.coupleNames}</h4>
                      {t.isGoogleVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-maroon-700/80 line-clamp-3 italic">&ldquo;{t.comment}&rdquo;</p>
                    <p className="text-[11px] text-maroon-700/60">{t.location} &middot; {t.rating}★</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                    <button
                      onClick={() => handleToggleTestimonialActive(t)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${t.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {t.active ? 'Active' : 'Inactive'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setTestimonialModal(t)} className="p-1.5 rounded-md bg-gold-100 text-gold-800 hover:bg-gold-200">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {testimonialsAdmin.length === 0 && (
                <p className="text-xs text-maroon-700/70 col-span-full py-8 text-center">No testimonials yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* EDIT QUOTE MODAL */}
      {editQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="max-w-lg w-full p-6 space-y-4 relative bg-white">
            <button onClick={() => setEditQuoteModal(null)} className="absolute top-4 right-4 text-maroon-800">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-playfair text-xl font-bold text-maroon-900">Edit Quote #{editQuoteModal.refCode}</h3>

            <form onSubmit={handleSaveQuoteEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editQuoteModal.customerName}
                  onChange={(e) => setEditQuoteModal({ ...editQuoteModal, customerName: e.target.value })}
                  className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editQuoteModal.customerPhone}
                    onChange={(e) => setEditQuoteModal({ ...editQuoteModal, customerPhone: e.target.value })}
                    className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editQuoteModal.customerEmail}
                    onChange={(e) => setEditQuoteModal({ ...editQuoteModal, customerEmail: e.target.value })}
                    className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={editQuoteModal.estimatedCost}
                    onChange={(e) => setEditQuoteModal({ ...editQuoteModal, estimatedCost: Number(e.target.value) })}
                    className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Status</label>
                  <select
                    value={editQuoteModal.status}
                    onChange={(e) => setEditQuoteModal({ ...editQuoteModal, status: e.target.value as AdminQuoteStatus })}
                    className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editQuoteModal.notes || ''}
                  onChange={(e) => setEditQuoteModal({ ...editQuoteModal, notes: e.target.value })}
                  className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                />
              </div>

              <GoldButton fullWidth variant="gold" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* NEW CATALOG ITEM MODAL */}
      {isNewCatalogItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <GlassCard className="max-w-md w-full p-6 space-y-4 relative bg-white my-8">
            <button onClick={() => setIsNewCatalogItemModal(false)} className="absolute top-4 right-4 text-maroon-800">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">Add Catalog Item</h3>
            <form onSubmit={handleCreateCatalogItem} className="space-y-4">
              <CatalogItemFormFields
                form={catalogItemForm}
                onChange={(partial) => setCatalogItemForm((prev) => ({ ...prev, ...partial }))}
                groups={catalogGroups}
                eventTypes={eventTypesAdmin}
                uploadingImage={uploadingImage}
                onImageUpload={handleImageUpload}
              />
              <GoldButton fullWidth variant="gold" icon={<Plus className="w-4 h-4" />}>
                Create Catalog Item
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* EDIT CATALOG ITEM MODAL */}
      {catalogItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <GlassCard className="max-w-md w-full p-6 space-y-4 relative bg-white my-8">
            <button onClick={() => setCatalogItemModal(null)} className="absolute top-4 right-4 text-maroon-800">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">Edit: {catalogItemModal.name}</h3>
            <form onSubmit={handleSaveCatalogItemEdit} className="space-y-4">
              <CatalogItemFormFields
                form={catalogItemModal}
                onChange={(partial) => setCatalogItemModal((prev) => (prev ? { ...prev, ...partial } : prev))}
                groups={catalogGroups}
                eventTypes={eventTypesAdmin}
                uploadingImage={uploadingImage}
                onImageUpload={async (file) => {
                  setUploadingImage(true);
                  try {
                    const url = await adminUploadImage(file);
                    setCatalogItemModal((prev) => (prev ? { ...prev, imageUrl: url, images: [...prev.images, url] } : prev));
                  } catch (e) {
                    setCatalogError(e instanceof Error ? e.message : 'Image upload failed.');
                  } finally {
                    setUploadingImage(false);
                  }
                }}
              />
              <GoldButton fullWidth variant="gold" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* NEW / EDIT GALLERY MODAL */}
      {(isNewGalleryModal || galleryItemModal) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <GlassCard className="max-w-md w-full p-6 space-y-4 relative bg-white my-8">
            <button
              onClick={() => {
                setIsNewGalleryModal(false);
                setGalleryItemModal(null);
              }}
              className="absolute top-4 right-4 text-maroon-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">
              {galleryItemModal ? `Edit: ${galleryItemModal.title}` : 'Add Portfolio Item'}
            </h3>
            <form onSubmit={galleryItemModal ? handleSaveGalleryItemEdit : handleCreateGalleryItem} className="space-y-3 text-xs">
              {(() => {
                const form = galleryItemModal || galleryForm;
                const setForm = (partial: Partial<AdminGalleryItem>) =>
                  galleryItemModal ? setGalleryItemModal({ ...galleryItemModal, ...partial }) : setGalleryForm({ ...galleryForm, ...partial });
                return (
                  <>
                    <div>
                      <label className="block font-bold mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ title: e.target.value })}
                        className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ category: e.target.value as any })}
                          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                        >
                          <option value="decoration">Decoration</option>
                          <option value="photography">Photography</option>
                          <option value="reception">Reception</option>
                          <option value="traditional">Traditional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Media Type</label>
                        <select
                          value={form.mediaType}
                          onChange={(e) => setForm({ mediaType: e.target.value as 'image' | 'video' })}
                          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Media {form.mediaType === 'image' ? '(Upload)' : '(Video URL)'}</label>
                      {form.mediaType === 'image' ? (
                        <div className="flex items-center gap-3">
                          {form.url && <img src={form.url} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gold-300" />}
                          <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-gold-400 rounded-lg p-2 cursor-pointer hover:bg-gold-50 text-maroon-800">
                            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            <span className="font-bold">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              className="hidden"
                              disabled={uploadingImage}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingImage(true);
                                try {
                                  const url = await adminUploadImage(file);
                                  setForm({ url });
                                } catch (err) {
                                  setGalleryError(err instanceof Error ? err.message : 'Upload failed.');
                                } finally {
                                  setUploadingImage(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="/video-file.mp4"
                          value={form.url}
                          onChange={(e) => setForm({ url: e.target.value })}
                          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.active} onChange={(e) => setForm({ active: e.target.checked })} />
                      <span className="font-bold">Active</span>
                    </label>
                  </>
                );
              })()}
              <GoldButton fullWidth variant="gold" icon={galleryItemModal ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
                {galleryItemModal ? 'Save Changes' : 'Create Portfolio Item'}
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* NEW / EDIT TESTIMONIAL MODAL */}
      {(isNewTestimonialModal || testimonialModal) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <GlassCard className="max-w-md w-full p-6 space-y-4 relative bg-white my-8">
            <button
              onClick={() => {
                setIsNewTestimonialModal(false);
                setTestimonialModal(null);
              }}
              className="absolute top-4 right-4 text-maroon-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">
              {testimonialModal ? `Edit: ${testimonialModal.coupleNames}` : 'Add Testimonial'}
            </h3>
            <form onSubmit={testimonialModal ? handleSaveTestimonialEdit : handleCreateTestimonial} className="space-y-3 text-xs">
              {(() => {
                const form = testimonialModal || testimonialForm;
                const setForm = (partial: Partial<AdminTestimonial>) =>
                  testimonialModal ? setTestimonialModal({ ...testimonialModal, ...partial }) : setTestimonialForm({ ...testimonialForm, ...partial });
                return (
                  <>
                    <div>
                      <label className="block font-bold mb-1">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={form.coupleNames}
                        onChange={(e) => setForm({ coupleNames: e.target.value })}
                        className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">Location / Source</label>
                        <input
                          type="text"
                          placeholder="Google Review • Davanagere"
                          value={form.location}
                          onChange={(e) => setForm({ location: e.target.value })}
                          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Rating (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={form.rating}
                          onChange={(e) => setForm({ rating: Number(e.target.value) })}
                          className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Review Text</label>
                      <textarea
                        rows={3}
                        required
                        value={form.comment}
                        onChange={(e) => setForm({ comment: e.target.value })}
                        className="w-full border border-gold-300 rounded-lg p-2 text-maroon-900"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.isGoogleVerified} onChange={(e) => setForm({ isGoogleVerified: e.target.checked })} />
                      <span className="font-bold">Google Verified</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.active} onChange={(e) => setForm({ active: e.target.checked })} />
                      <span className="font-bold">Active</span>
                    </label>
                  </>
                );
              })()}
              <GoldButton fullWidth variant="gold" icon={testimonialModal ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
                {testimonialModal ? 'Save Changes' : 'Create Testimonial'}
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* EDIT PACKAGE INCLUSIONS & LIMITS MODAL */}
      {editPackageId && editPackageDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <GlassCard className="max-w-2xl w-full p-6 space-y-5 relative bg-white my-8">
            <button
              onClick={() => { setEditPackageId(null); setEditPackageDetail(null); }}
              className="absolute top-4 right-4 text-maroon-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-playfair text-xl font-bold text-maroon-900">
              Edit: {packagesAdmin.find((p) => p.id === editPackageId)?.name}
            </h3>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Category Limits</h4>
              {['cat-starters'].map((groupId) => {
                const limit = editPackageDetail.groupLimits.find((l) => l.groupId === groupId);
                const groupName = catalogGroups.find((g) => g.id === groupId)?.name || groupId;
                return (
                  <div key={groupId} className="grid grid-cols-3 items-center gap-3 text-xs bg-gold-50/70 p-3 rounded-lg border border-gold-200">
                    <span className="font-bold text-maroon-900">{groupName}</span>
                    <label className="flex items-center gap-2">
                      Max:
                      <input
                        type="number"
                        min={1}
                        value={limit?.maxSelections ?? 1}
                        onChange={(e) => updateGroupLimit(groupId, { maxSelections: Number(e.target.value) })}
                        className="w-16 border border-gold-300 rounded p-1"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      Free:
                      <input
                        type="number"
                        min={0}
                        value={limit?.freeIncludedCount ?? 0}
                        onChange={(e) => updateGroupLimit(groupId, { freeIncludedCount: Number(e.target.value) })}
                        className="w-16 border border-gold-300 rounded p-1"
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Included Catalog Items</h4>
              <div className="max-h-72 overflow-y-auto border border-gold-200 rounded-lg p-2 space-y-1">
                {catalogItems.filter((i) => i.supportedEventTypes.includes('wedding')).map((item) => {
                  const checked = editPackageDetail.includedItemIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer ${checked ? 'bg-maroon-800 text-gold-300' : 'hover:bg-gold-50 text-maroon-900'}`}
                    >
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={() => toggleIncludedItem(item.id)} />
                        {item.name}
                      </span>
                      <span className="font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <GoldButton fullWidth variant="gold" icon={<Save className="w-4 h-4" />} onClick={handleSavePackageDetail} disabled={savingPackageDetail}>
              {savingPackageDetail ? 'Saving...' : 'Save Changes'}
            </GoldButton>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
