import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { EnquiryDetails, EnquirySelectionLine, formatDate, formatDateTime } from './enquiry';
import { SITE } from '../site-config';

/** Human labels for catalog groupIds */
const GROUP_LABELS: Record<string, string> = {
  'dec-home': 'House Decoration',
  'dec-venue': 'Venue Decoration',
  'dec-couple-entry': 'Couple Entry Concept',
  'dec-security': 'Bouncers & Security',
  'dec-venue-engagement': 'Venue Decoration',
  'dec-entry-engagement': 'Couple Entry Concept',
  'dec-venue-reception': 'Venue Decoration',
  'dec-entry-reception': 'Couple Entry Concept',
  'dec-venue-birthday': 'Venue Decoration',
  'dec-entry-birthday': 'Entry Concept',
  'dec-venue-anniversary': 'Venue Decoration',
  'photo-deverakarya': 'Deverakarya',
  'photo-wedding-hall': 'Wedding Hall',
  'photo-services': 'Photography & Videography',
};

function decorationPhotoCategory(name: string): string {
  const idx = name.lastIndexOf(' - Design #');
  return idx === -1 ? name : name.slice(0, idx);
}

/** Extracts individual image URLs safely from a string without splitting Base64 data URIs on commas. */
export function extractPhotoUrls(raw: string | undefined | null): string[] {
  if (!raw) return [];
  if (raw.startsWith('data:')) return [raw];
  return raw.split(',').map((u) => u.trim()).filter(Boolean);
}

interface DecorationGroup {
  label: string;
  photos: EnquirySelectionLine[]; // has imageUrl
  textOnly: EnquirySelectionLine[]; // wedding checklist items, no photo
}

/** Splits the Decoration section into per-category groups, keeping photo-
 * backed picks separate from text-only checklist items so the PDF renders
 * all decoration images cleanly. */
function groupDecorationLines(lines: EnquirySelectionLine[]): DecorationGroup[] {
  const groups = new Map<string, DecorationGroup>();
  for (const line of lines) {
    const isPhotoPick = !!line.imageUrl;
    const label = isPhotoPick && line.groupId === 'decoration-inspiration'
      ? decorationPhotoCategory(line.name)
      : GROUP_LABELS[line.groupId || ''] || line.groupId || 'Decoration';
    if (!groups.has(label)) groups.set(label, { label, photos: [], textOnly: [] });
    const group = groups.get(label)!;
    if (isPhotoPick) {
      const urls = extractPhotoUrls(line.imageUrl);
      if (urls.length > 1) {
        urls.forEach((u, uIdx) => {
          group.photos.push({
            ...line,
            name: line.name.includes('(Design #') ? line.name : `${line.name} (Design #${uIdx + 1})`,
            imageUrl: u,
          });
        });
      } else {
        group.photos.push(line);
      }
    } else {
      group.textOnly.push(line);
    }
  }
  return Array.from(groups.values());
}

interface PhotographyGroup {
  label: string;
  duration: string | null;
  items: EnquirySelectionLine[];
}

function groupPhotographyLines(lines: EnquirySelectionLine[]): PhotographyGroup[] {
  const groups = new Map<string, PhotographyGroup>();
  const order: string[] = [];
  for (const line of lines) {
    const isPrewedding = line.groupId === 'photo-prewedding-duration' || line.groupId === 'photo-prewedding-services';
    const key = isPrewedding ? 'Pre-Wedding Shoot' : GROUP_LABELS[line.groupId || ''] || line.groupId || 'Photography';
    if (!groups.has(key)) {
      groups.set(key, { label: key, duration: null, items: [] });
      order.push(key);
    }
    const group = groups.get(key)!;
    if (line.groupId === 'photo-prewedding-duration') {
      group.duration = line.name;
    } else {
      group.items.push(line);
    }
  }
  return order.map((key) => groups.get(key)!);
}

function dedupeByName(lines: EnquirySelectionLine[]): EnquirySelectionLine[] {
  const seen = new Set<string>();
  const result: EnquirySelectionLine[] = [];
  for (const line of lines) {
    const key = `${line.name.trim().toLowerCase()}-${(line.imageUrl || '').slice(0, 40)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }
  return result;
}

const s = StyleSheet.create({
  page: { paddingTop: 60, paddingBottom: 45, paddingHorizontal: 32, fontSize: 9.5, fontFamily: 'Helvetica', color: '#3a1420' },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    paddingHorizontal: 32,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#d4af37',
  },
  fixedHeaderBrand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logo: { width: 22, height: 22, borderRadius: 11 },
  brandName: { fontSize: 11, fontWeight: 700, color: '#5c0a18' },
  fixedHeaderRight: { fontSize: 8, color: '#7a5540' },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    paddingHorizontal: 32,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e6d5b8',
  },
  footerText: { fontSize: 7.5, color: '#8a6b52' },

  titleBlock: { alignItems: 'center', marginBottom: 14 },
  bigLogo: { width: 48, height: 48, borderRadius: 24, marginBottom: 6 },
  brandNameBig: { fontSize: 16, fontWeight: 700, color: '#5c0a18', letterSpacing: 1 },
  docTitle: { fontSize: 12, fontWeight: 700, color: '#8a6d1f', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  refRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 6 },
  refText: { fontSize: 8.5, color: '#7a5540' },

  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#5c0a18',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
  },
  subheading: { fontSize: 9.5, fontWeight: 700, color: '#8a6d1f', marginTop: 6, marginBottom: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2.5 },
  label: { width: 105, color: '#7a5540', fontSize: 8.5 },
  value: { flex: 1, fontSize: 9, fontWeight: 700, color: '#3a1420' },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 8, fontSize: 9, color: '#8a6d1f' },
  bulletText: { fontSize: 9, flex: 1, color: '#3a1420' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  photoCard: { width: 160, marginBottom: 8, backgroundColor: '#ffffff', borderRadius: 6, padding: 5, borderWidth: 1, borderColor: '#e6d5b8' },
  photoImage: { width: 148, height: 110, objectFit: 'cover', borderRadius: 4, alignSelf: 'center', backgroundColor: '#f5f0e6' },
  photoCaption: { fontSize: 8, fontWeight: 700, marginTop: 4, color: '#5c0a18', textAlign: 'center' },

  totalBox: {
    marginTop: 8,
    backgroundColor: '#5c0a18',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 8.5, color: '#e8c979', textTransform: 'uppercase', letterSpacing: 1 },
  totalAmount: { fontSize: 18, color: '#f7e8b0', fontWeight: 700, marginTop: 3 },
  totalNote: { fontSize: 7.5, color: '#e8c979', marginTop: 3 },

  refBox: { marginTop: 10, borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 10 },
  statusBadge: { fontSize: 7.5, color: '#5c0a18', backgroundColor: '#f7e8b0', alignSelf: 'flex-start', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, marginTop: 3 },
  contactNote: { fontSize: 8.5, marginTop: 6, fontStyle: 'italic', color: '#5c0a18' },
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

function BulletList({ lines }: { lines: EnquirySelectionLine[] }) {
  return (
    <>
      {dedupeByName(lines).map((line, i) => (
        <View key={`${line.name}-${i}`} style={s.bullet} wrap={false}>
          <Text style={s.bulletDot}>{'•'}</Text>
          <Text style={s.bulletText}>
            {line.name}
            {line.quantity > 1 ? ` x${line.quantity}` : ''}
          </Text>
        </View>
      ))}
    </>
  );
}

interface EnquiryPdfDocumentProps {
  details: EnquiryDetails;
  refCode: string;
  submittedAtIso: string;
  logoDataUri?: string;
}

export function EnquiryPdfDocument({ details, refCode, submittedAtIso, logoDataUri }: EnquiryPdfDocumentProps) {
  const decorationSection = details.sections.find((sec) => sec.categoryKey === 'decoration');
  const photographySection = details.sections.find((sec) => sec.categoryKey === 'photography');
  const otherSections = details.sections.filter((sec) => sec.categoryKey !== 'decoration' && sec.categoryKey !== 'photography');

  const decorationGroups = decorationSection ? groupDecorationLines(decorationSection.lines) : [];
  const photographyGroups = photographySection ? groupPhotographyLines(photographySection.lines) : [];

  const logoSrc = logoDataUri || '/logo-circle.png';

  return (
    <Document title={`SID Events Enquiry ${refCode}`} author="SID Events">
      <Page size="A4" style={s.page} wrap>
        {/* Repeats on every physical page */}
        <View style={s.fixedHeader} fixed>
          <View style={s.fixedHeaderBrand}>
            <Image src={logoSrc} style={s.logo} />
            <Text style={s.brandName}>SID Events</Text>
          </View>
          <Text style={s.fixedHeaderRight}>Ref #{refCode}</Text>
        </View>
        <View style={s.fixedFooter} fixed>
          <Text style={s.footerText}>{SITE.name} &bull; {SITE.phoneDisplay}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

        {/* Title block */}
        <View style={s.titleBlock}>
          <Image src={logoSrc} style={s.bigLogo} />
          <Text style={s.brandNameBig}>SID EVENTS</Text>
          <Text style={s.docTitle}>Event Requirement &amp; Quotation Summary</Text>
          <View style={s.refRow}>
            <Text style={s.refText}>Reference: #{refCode}</Text>
            <Text style={s.refText}>{formatDateTime(submittedAtIso)}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={s.section} wrap={false}>
          <Text style={s.sectionTitle}>Customer Details</Text>
          <Field label="Name" value={details.customerName || 'Not provided'} />
          <Field label="Phone" value={details.customerPhone || 'Not provided'} />
          <Field label="Email" value={details.customerEmail || 'Not provided'} />
        </View>

        {/* Event Details */}
        <View style={s.section} wrap={false}>
          <Text style={s.sectionTitle}>Event Details</Text>
          <Field label="Event Type" value={details.eventTypeLabel} />
          {details.anniversaryType ? <Field label="Anniversary Type" value={details.anniversaryType} /> : null}
          <Field label="Event Date" value={formatDate(details.eventDate)} />
          <Field label="Location" value={details.location || 'Not provided'} />
          <Field label="Guests" value={details.guestCount ? String(details.guestCount) : 'Not specified'} />
          {details.specialRequirements && <Field label="Notes" value={details.specialRequirements} />}
        </View>

        {/* Selected Decoration - Displays full photos with captions */}
        {decorationGroups.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Selected Decoration Designs</Text>
            {decorationGroups.map((group) => (
              <View key={group.label} style={{ marginBottom: 8 }}>
                <Text style={s.subheading}>{group.label}</Text>
                {group.textOnly.length > 0 && <BulletList lines={group.textOnly} />}
                {group.photos.length > 0 && (
                  <View style={s.photoGrid}>
                    {dedupeByName(group.photos).map((photo, i) => {
                      const photoUrl = photo.imageUrl || '';
                      if (!photoUrl) return null;
                      return (
                        <View key={`${photo.name}-${i}`} style={s.photoCard} wrap={false}>
                          <Image src={photoUrl} style={s.photoImage} />
                          <Text style={s.photoCaption}>{photo.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Photography & Videography */}
        {photographyGroups.length > 0 && (
          <View style={s.section} wrap>
            <Text style={s.sectionTitle}>Photography &amp; Videography</Text>
            {photographyGroups.map((group) => (
              <View key={group.label} style={{ marginBottom: 6 }} wrap={false}>
                <Text style={s.subheading}>{group.label}</Text>
                {group.duration && (
                  <View style={s.bullet}>
                    <Text style={s.bulletDot}>{'•'}</Text>
                    <Text style={s.bulletText}>Duration: {group.duration}</Text>
                  </View>
                )}
                <BulletList lines={group.items} />
              </View>
            ))}
          </View>
        )}

        {/* Additional Services & Other Sections */}
        {otherSections.map((section) => (
          <View key={section.categoryKey} style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>{section.label}</Text>
            <BulletList lines={section.lines} />
          </View>
        ))}

        {/* Catering Menu */}
        {details.cateringMenus.length > 0 ? (
          <View style={s.section} wrap>
            <Text style={s.sectionTitle}>Catering Menu</Text>
            {details.cateringMenus.map((menu) => (
              <View key={menu.menuType} style={{ marginBottom: 10 }} wrap>
                <Text style={{ fontSize: 9.5, fontWeight: 700, color: '#5c0a18', marginBottom: 3 }}>
                  {menu.menuLabel.toUpperCase()}
                  {menu.guestCount ? `  ·  Guest Count: ${menu.guestCount}` : ''}
                </Text>
                {menu.sections.map((section) => (
                  <View key={`${menu.menuType}-${section.categoryName}`} style={{ marginBottom: 6, marginLeft: 4 }} wrap={false}>
                    <Text style={s.subheading}>{section.categoryName}</Text>
                    <BulletList lines={section.lines} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : details.cateringSkipped ? (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>Catering</Text>
            <Field label="Status" value="Skipped by customer" />
          </View>
        ) : null}

        {details.requestedExtras.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>Pending Approval Requests</Text>
            <BulletList lines={details.requestedExtras} />
          </View>
        )}


        {/* Reference / status footer block */}
        <View style={s.refBox} wrap={false}>
          <Field label="Reference Code" value={`#${refCode}`} />
          <Field label="Submitted" value={formatDateTime(submittedAtIso)} />
          <Text style={s.statusBadge}>NEW ENQUIRY</Text>
          <Text style={s.contactNote}>Thank you for choosing SID Events! Our consultants will contact you shortly.</Text>
        </View>
      </Page>
    </Document>
  );
}

// In-memory cache for fast reuse across multiple calls
const pdfImageCache = new Map<string, string>();
const TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAA';

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
        resolve(reader.result);
      } else {
        resolve(TRANSPARENT_PIXEL);
      }
    };
    reader.onerror = () => resolve(TRANSPARENT_PIXEL);
    reader.readAsDataURL(blob);
  });
}

/**
 * Optimizes an image for @react-pdf/renderer:
 * 1. Fetches the image blob safely via window.fetch (works on all local & remote assets).
 * 2. Creates a local object URL (same-origin blob: URL).
 * 3. Draws to an offscreen canvas downscaled to 360x270 (photos) or 120x120 (logo).
 * 4. Converts to a compact base64 JPEG/PNG data URI.
 * 5. Falls back to FileReader base64 if canvas is unavailable or encounters error.
 * 6. Uses in-memory cache so images are processed only once.
 */
interface ImageBudget {
  maxW: number;
  maxH: number;
  quality: number;
}

/**
 * Calculates adaptive target image dimensions and JPEG quality based on image count
 * to ensure total image weight targets ~400KB - 750KB, keeping final PDF inside 500KB - 1MB.
 */
function calculateImageBudget(imageCount: number, scaleFactor = 1.0): ImageBudget {
  if (imageCount <= 2) {
    return {
      maxW: Math.round(1200 * scaleFactor),
      maxH: Math.round(900 * scaleFactor),
      quality: Math.min(0.90, 0.88 * scaleFactor),
    };
  }
  if (imageCount <= 5) {
    return {
      maxW: Math.round(1024 * scaleFactor),
      maxH: Math.round(768 * scaleFactor),
      quality: Math.min(0.88, 0.85 * scaleFactor),
    };
  }
  if (imageCount <= 10) {
    return {
      maxW: Math.round(850 * scaleFactor),
      maxH: Math.round(640 * scaleFactor),
      quality: Math.min(0.84, 0.80 * scaleFactor),
    };
  }
  return {
    maxW: Math.round(680 * scaleFactor),
    maxH: Math.round(510 * scaleFactor),
    quality: Math.min(0.78, 0.74 * scaleFactor),
  };
}

/**
 * Loads and optimizes an image for embedding in the PDF.
 * - In Node.js: Uses `sharp` to resize and compress using mozjpeg / progressive JPEG.
 * - In Browser: Uses Canvas downscaling with budgeted dimensions and JPEG quality.
 */
async function getOptimizedPdfImage(
  src: string,
  isLogo = false,
  budget: ImageBudget = { maxW: 640, maxH: 480, quality: 0.75 }
): Promise<string> {
  if (!src) return TRANSPARENT_PIXEL;
  const cacheKey = `${src}::${isLogo ? 'logo' : `${budget.maxW}x${budget.maxH}@${budget.quality}`}`;
  if (pdfImageCache.has(cacheKey)) return pdfImageCache.get(cacheKey)!;

  if (src.startsWith('data:image/')) {
    pdfImageCache.set(cacheKey, src);
    return src;
  }

  const maxW = isLogo ? 180 : budget.maxW;
  const maxH = isLogo ? 180 : budget.maxH;
  const quality = isLogo ? 0.85 : budget.quality;

  // Server-side (Node.js) execution with sharp compression
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const sharpModule = await import('sharp');
      const sharp = sharpModule.default || sharpModule;

      const cleanPath = src.startsWith('/') ? src.slice(1) : src;
      const candidates = [
        path.join(process.cwd(), 'public', cleanPath),
        path.join(process.cwd(), '../web/public', cleanPath),
        path.join(process.cwd(), '../CRM/public', cleanPath),
      ];

      let rawBuffer: Buffer | null = null;
      for (const candidate of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
          rawBuffer = fs.readFileSync(/*turbopackIgnore: true*/ candidate);
          break;
        }
      }

      if (!rawBuffer && (src.startsWith('http://') || src.startsWith('https://'))) {
        const res = await fetch(src);
        if (res.ok) {
          rawBuffer = Buffer.from(await res.arrayBuffer());
        }
      }

      if (rawBuffer) {
        const compressed = await sharp(rawBuffer)
          .resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: Math.round(quality * 100), mozjpeg: true, progressive: true })
          .toBuffer();
        const dataUri = `data:image/jpeg;base64,${compressed.toString('base64')}`;
        pdfImageCache.set(cacheKey, dataUri);
        return dataUri;
      }
    } catch (err) {
      console.warn('[PDF Node Image] Error compressing image with sharp:', err);
    }
    return TRANSPARENT_PIXEL;
  }

  // Browser execution with Canvas downsampling
  try {
    const pathname = src.startsWith('/') ? src : `/${src}`;
    const fullUrl = src.startsWith('http://') || src.startsWith('https://')
      ? src
      : `${window.location.origin}${encodeURI(pathname)}`;

    const res = await fetch(fullUrl);
    if (!res.ok) {
      console.warn(`[PDF Image] Failed to fetch ${fullUrl} (status: ${res.status})`);
      return TRANSPARENT_PIXEL;
    }

    const blob = await res.blob();
    if (!blob || blob.size === 0) return TRANSPARENT_PIXEL;

    const optimizedUri = await new Promise<string>((resolve) => {
      const blobUrl = URL.createObjectURL(blob);
      const img = new window.Image();

      const cleanup = () => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {}
      };

      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width || maxW;
          let h = img.naturalHeight || img.height || maxH;

          if (w > maxW || h > maxH) {
            const ratio = Math.min(maxW / w, maxH / h);
            w = Math.max(1, Math.round(w * ratio));
            h = Math.max(1, Math.round(h * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            cleanup();
            blobToDataUri(blob).then(resolve);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          const mimeType = isLogo ? 'image/png' : 'image/jpeg';
          const result = canvas.toDataURL(mimeType, quality);
          cleanup();
          resolve(result);
        } catch (canvasErr) {
          console.warn('[PDF Image] Canvas resize fallback to blob:', canvasErr);
          cleanup();
          blobToDataUri(blob).then(resolve);
        }
      };

      img.onerror = () => {
        cleanup();
        blobToDataUri(blob).then(resolve);
      };

      img.src = blobUrl;
    });

    pdfImageCache.set(cacheKey, optimizedUri);
    return optimizedUri;
  } catch (err) {
    console.warn(`[PDF Image] Error processing image ${src}:`, err);
    return TRANSPARENT_PIXEL;
  }
}

/** Pre-optimizes all image URLs in the enquiry into fast, lightweight Data URIs */
async function prepareDetailsForPdf(
  details: EnquiryDetails,
  scaleFactor = 1.0
): Promise<{ details: EnquiryDetails; logoDataUri: string }> {
  const urlMap = new Map<string, string>();
  const allUrls = new Set<string>();

  for (const section of details.sections) {
    for (const line of section.lines) {
      if (line.imageUrl) {
        extractPhotoUrls(line.imageUrl).forEach((u) => allUrls.add(u));
      }
    }
  }

  const budget = calculateImageBudget(allUrls.size, scaleFactor);

  // Optimize all unique images concurrently via fast budgeted compression
  await Promise.all(
    Array.from(allUrls).map(async (url) => {
      const optimized = await getOptimizedPdfImage(url, false, budget);
      urlMap.set(url, optimized);
    })
  );

  const logoDataUri = await getOptimizedPdfImage('/logo-circle.png', true);

  // Return cloned details with expanded, single-image lines
  const clonedSections = details.sections.map((section) => ({
    ...section,
    lines: section.lines.flatMap((line) => {
      if (!line.imageUrl) return [line];
      const urls = extractPhotoUrls(line.imageUrl);
      if (urls.length <= 1) {
        const singleUrl = urls[0] || line.imageUrl;
        return [{
          ...line,
          imageUrl: urlMap.get(singleUrl) || singleUrl,
        }];
      }
      return urls.map((u, uIdx) => ({
        ...line,
        name: line.name.includes('(Design #') ? line.name : `${line.name} (Design #${uIdx + 1})`,
        imageUrl: urlMap.get(u) || u,
      }));
    }),
  }));

  return {
    details: { ...details, sections: clonedSections },
    logoDataUri,
  };
}

/**
 * Compresses a raw PDF using pdf-lib stream and object stream optimization.
 */
export async function compressPdfDocument(rawPdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(rawPdfBytes, { ignoreEncryption: true });
    doc.setTitle('SID Events Event Quotation');
    doc.setProducer('SID Events Planner & CRM');
    doc.setCreator('SID Events');

    const compressed = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    return compressed;
  } catch (err) {
    console.warn('[PDF Compression] pdf-lib compression fallback:', err);
    return new Uint8Array(rawPdfBytes);
  }
}

/**
 * Renders the PDF to a Blob with guaranteed compression targeting the 500KB - 1MB range.
 */
export async function generateEnquiryPdfBlob(
  details: EnquiryDetails,
  refCode: string,
  submittedAtIso: string
): Promise<Blob> {
  // Pass 1: Standard budgeted compression
  const { details: optimizedDetails, logoDataUri } = await prepareDetailsForPdf(details, 1.0);
  const instance = pdf(
    <EnquiryPdfDocument
      details={optimizedDetails}
      refCode={refCode}
      submittedAtIso={submittedAtIso}
      logoDataUri={logoDataUri}
    />
  );
  const rawBlob = await instance.toBlob();
  const rawArrayBuffer = await rawBlob.arrayBuffer();

  // Compress streams and indirect objects
  let compressedBytes = await compressPdfDocument(rawArrayBuffer);

  // If the PDF exceeds 1MB (1024KB), run adaptive second pass with tighter image budget
  if (compressedBytes.length > 1024 * 1024) {
    try {
      const { details: adaptiveDetails, logoDataUri: adaptiveLogo } = await prepareDetailsForPdf(details, 0.75);
      const adaptiveInstance = pdf(
        <EnquiryPdfDocument
          details={adaptiveDetails}
          refCode={refCode}
          submittedAtIso={submittedAtIso}
          logoDataUri={adaptiveLogo}
        />
      );
      const adaptiveBlob = await adaptiveInstance.toBlob();
      const adaptiveBytes = await compressPdfDocument(await adaptiveBlob.arrayBuffer());
      if (adaptiveBytes.length < compressedBytes.length) {
        compressedBytes = adaptiveBytes;
      }
    } catch (adaptiveErr) {
      console.warn('[PDF Compression] Adaptive pass fallback:', adaptiveErr);
    }
  }

  return new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Renders the PDF to a Node Buffer for server-side storage and background sync.
 */
export async function generateEnquiryPdfBuffer(
  details: EnquiryDetails,
  refCode: string,
  submittedAtIso: string
): Promise<Buffer> {
  const blob = await generateEnquiryPdfBlob(details, refCode, submittedAtIso);
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
