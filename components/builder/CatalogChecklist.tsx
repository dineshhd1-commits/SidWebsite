'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, ZoomIn, ChevronDown } from 'lucide-react';
import { CatalogItem } from '@/lib/types/catalog';
import { QuantityStepper } from '@/components/builder/QuantityStepper';
import { getDecorationPhotosForItem, getWatermarkedDecorationSrc } from '@/lib/data/decoration-inspiration';
import { SharedImageLightbox } from '@/components/ui/shared-image-lightbox';

export interface CatalogChecklistRowProps {
  item: CatalogItem;
  isSelected: boolean;
  selectedImageUrl?: string | null;
  isExpanded?: boolean;
  quantity: number;
  onToggleExpand: () => void;
  onSelectImage: (imageUrl: string) => void;
  onDeselectImage: () => void;
  onSelectNonDecoration: () => void;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
  onOpenLightbox?: (photos: string[], index: number, title: string) => void;
}

export function CatalogChecklistRow({
  item,
  isSelected,
  selectedImageUrl,
  isExpanded,
  quantity,
  onToggleExpand,
  onSelectImage,
  onDeselectImage,
  onSelectNonDecoration,
  onRemove,
  onUpdateQuantity,
  onOpenLightbox,
}: CatalogChecklistRowProps) {
  const isDecoration = item.categoryKey === 'decoration';
  const isStepper = item.quantityMode === 'stepper';
  const photos = isDecoration && isExpanded ? getDecorationPhotosForItem(item) : [];

  const handleRowClick = () => {
    if (!isDecoration) {
      if (isStepper && isSelected) return;
      if (isSelected) {
        onRemove();
      } else {
        onSelectNonDecoration();
      }
      return;
    }

    // Decoration interaction rule:
    // If the service is currently selected (meaning an image was chosen):
    // Clicking the row or checkbox deselects the service and clears the image.
    if (isSelected) {
      onRemove();
    } else {
      // If not selected: clicking the row expands/collapses the dropdown.
      // Checkbox remains UNCHECKED until an image is chosen inside the dropdown.
      onToggleExpand();
    }
  };

  return (
    <div className={`transition-colors border-b border-gold-200/60 last:border-b-0 ${isSelected ? 'bg-gold-50/70' : isExpanded ? 'bg-silk-50/80' : 'hover:bg-gold-50/30'}`}>
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3.5">
        <button
          type="button"
          onClick={handleRowClick}
          className="flex-1 min-w-0 flex items-center gap-3.5 text-left cursor-pointer select-none"
        >
          {/* Checkbox: Checked ONLY if an image/item is actually selected */}
          <span
            className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              isSelected ? 'bg-maroon-800 border-maroon-800 shadow-xs' : 'border-gold-400 bg-white'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-gold-200" />}
          </span>

          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-2">
              <span className="block text-sm font-bold text-maroon-900">{item.name}</span>
              {isDecoration && (
                <span className="text-[10px] uppercase font-bold text-gold-700/80 tracking-wider">
                  {isSelected ? '(1 Design Chosen)' : '(Select 1 Design)'}
                </span>
              )}
            </span>
            <span className="block text-xs text-maroon-700/70 line-clamp-1">{item.description}</span>
          </span>

          {isDecoration && (
            <span className="shrink-0 p-1 text-gold-600 hover:text-maroon-900 transition-transform">
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </span>
          )}
        </button>

        {isStepper && isSelected && (
          <QuantityStepper
            value={quantity}
            onChange={(qty) => (qty <= 0 ? onRemove() : onUpdateQuantity(qty))}
            min={0}
            max={item.maxQuantity ?? undefined}
          />
        )}
      </div>

      {/* Expanded Decoration Images Dropdown */}
      {isDecoration && isExpanded && photos.length > 0 && (
        <div className="px-4 pb-4 pt-2 bg-gold-50/90 border-t border-gold-200/50 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gold-200/60 pb-2">
            <div>
              <p className="text-xs font-bold text-maroon-950 uppercase tracking-wider">
                {item.name} &mdash; Choose Exactly 1 Design ({photos.length} Designs Available)
              </p>
              <p className="text-[11px] text-maroon-700/85 font-medium">
                {isSelected
                  ? 'Active design selected. Click the selected photo again to deselect or choose another.'
                  : 'Click any design to select it for this service. Service checkbox will activate.'}
              </p>
            </div>
            {isSelected && (
              <span className="self-start sm:self-auto text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-flex items-center gap-1 shrink-0">
                <Check className="w-3 h-3" /> 1 Design Selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo, idx) => {
              const photoSrc = getWatermarkedDecorationSrc(photo.src);
              // Matches exact URL or un-watermarked prefix fallback
              const isPhotoSelected =
                isSelected &&
                (selectedImageUrl === photoSrc ||
                  selectedImageUrl === photo.src ||
                  (selectedImageUrl && photoSrc.endsWith(selectedImageUrl.replace('/decotion-watermarked/', '/decotion/'))));
              const isOtherPhotoSelected = isSelected && !isPhotoSelected;

              return (
                <div
                  key={photo.id || idx}
                  className={`group relative rounded-xl overflow-hidden transition-all flex flex-col bg-black/10 border ${
                    isPhotoSelected
                      ? 'border-2 border-gold-500 ring-2 ring-gold-400/80 shadow-md bg-gold-100/30'
                      : isOtherPhotoSelected
                      ? 'opacity-30 grayscale pointer-events-none cursor-not-allowed border-gray-300'
                      : 'border-gold-300 hover:border-gold-500 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <button
                    type="button"
                    disabled={isOtherPhotoSelected}
                    onClick={() => {
                      if (isPhotoSelected) {
                        onDeselectImage();
                      } else {
                        onSelectImage(photoSrc);
                      }
                    }}
                    className={`relative h-28 sm:h-32 w-full text-left cursor-pointer ${
                      isOtherPhotoSelected ? 'cursor-not-allowed' : ''
                    }`}
                    title={
                      isPhotoSelected
                        ? 'Click to deselect this design'
                        : isOtherPhotoSelected
                        ? 'Deselect the active design first to choose another'
                        : `Click to select ${photo.categoryLabel || item.name} (Design #${idx + 1})`
                    }
                  >
                    <Image
                      src={photoSrc}
                      alt={`${item.name} photo ${idx + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className={`object-cover transition-transform duration-300 ${
                        !isOtherPhotoSelected ? 'group-hover:scale-105' : ''
                      }`}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />

                    {/* Selected Badge */}
                    {isPhotoSelected && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-maroon-900/90 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400 shadow-md flex items-center gap-1 backdrop-blur-xs">
                          <Check className="w-3 h-3 text-gold-300" /> Selected
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    {!isOtherPhotoSelected && !isPhotoSelected && (
                      <div className="absolute inset-0 bg-maroon-950/20 group-hover:bg-maroon-950/40 transition-colors flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded-full bg-maroon-950/90 text-gold-300 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-gold-400/50 shadow-md">
                          Click to Select
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dedicated Full Size Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox &&
                        onOpenLightbox(
                          photos.map((p) => getWatermarkedDecorationSrc(p.src)),
                          idx,
                          `${item.name} - Design #${idx + 1}`
                        );
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-maroon-950/80 text-gold-300 hover:bg-maroon-900 hover:text-white transition-opacity shadow-md z-10 cursor-pointer border border-gold-400/40"
                    title="View Full Size Image"
                    aria-label="View Full Size"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CatalogChecklist({
  items,
  selectedIds,
  selectedImageUrls = {},
  quantities,
  activeExpandedItemId,
  setActiveExpandedItemId,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
}: {
  items: CatalogItem[];
  /** Which catalog item ids currently have a cart line. */
  selectedIds: Set<string>;
  /** Map of item ID -> single selected imageUrl in cart */
  selectedImageUrls?: Record<string, string>;
  /** Quantity for stepper-mode items - looked up by item id. */
  quantities: Record<string, number>;
  /** ID of the single active option displaying images */
  activeExpandedItemId?: string | null;
  setActiveExpandedItemId?: (id: string | null) => void;
  onAddToCart: (item: CatalogItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null);
  const activeId = activeExpandedItemId !== undefined ? activeExpandedItemId : internalActiveId;
  const setActiveId = setActiveExpandedItemId || setInternalActiveId;

  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    images: string[];
    index: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    index: 0,
    title: '',
  });

  const handleOpenLightbox = (photos: string[], index: number, title: string) => {
    setLightboxData({
      isOpen: true,
      images: photos,
      index,
      title,
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-gold-300 bg-white overflow-hidden shadow-sm">
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const selectedImageUrl = selectedImageUrls[item.id] || null;
          const isExpanded = activeId === item.id;

          return (
            <CatalogChecklistRow
              key={item.id}
              item={item}
              isSelected={isSelected}
              selectedImageUrl={selectedImageUrl}
              isExpanded={isExpanded}
              quantity={quantities[item.id] ?? 1}
              onToggleExpand={() => setActiveId(isExpanded ? null : item.id)}
              onSelectImage={(imageUrl) => {
                // When an image is selected, add to cart with this exact image and mark active
                onAddToCart({ ...item, imageUrl });
                setActiveId(item.id);
              }}
              onDeselectImage={() => {
                // When the active image is clicked again, deselect it and remove from cart
                onRemoveFromCart(item.id);
              }}
              onSelectNonDecoration={() => {
                onAddToCart(item);
              }}
              onRemove={() => {
                onRemoveFromCart(item.id);
              }}
              onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
              onOpenLightbox={handleOpenLightbox}
            />
          );
        })}
      </div>

      <SharedImageLightbox
        images={lightboxData.images}
        initialIndex={lightboxData.index}
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        title={lightboxData.title}
        subtitle="Decoration Design Preview"
      />
    </>
  );
}
