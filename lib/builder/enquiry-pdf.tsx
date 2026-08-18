import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { EnquiryDetails, EnquirySelectionLine, formatDate, formatDateTime } from './enquiry';
import { getWatermarkedDecorationSrc } from '../data/decoration-inspiration';
import { SITE } from '../site-config';

/** Human labels for the catalog groupIds that show up on decoration and
 * photography cart lines - only used to sub-group a section in the PDF
 * (e.g. "Home Decoration" vs "Venue Decoration", "Pre-Wedding Shoot" vs
 * "Wedding Hall"). Anything not listed here just falls back to its raw
 * groupId, so a new catalog group still renders instead of disappearing. */
const GROUP_LABELS: Record<string, string> = {
  'dec-home': 'Home Decoration',
  'dec-venue': 'Venue Decoration',
  'dec-couple-entry': 'Couple Entry',
  'dec-welcome-girls': 'Welcome Girls',
  'photo-deverakarya': 'Deverakarya',
  'photo-wedding-hall': 'Wedding Hall',
  'photo-services': 'Photography & Videography',
};

/** Decoration photo-gallery cart lines are named "{Category} - Design #{N}"
 * (see decorationPhotoToCartItem) - this recovers just the category part so
 * gallery-picked photos group the same way the client's own category
 * structure does (Stage Decoration, Garlands, Bridal Entry Ideas, ...). */
function decorationPhotoCategory(name: string): string {
  const idx = name.lastIndexOf(' - Design #');
  return idx === -1 ? name : name.slice(0, idx);
}

interface DecorationGroup {
  label: string;
  photos: EnquirySelectionLine[]; // has imageUrl
  textOnly: EnquirySelectionLine[]; // wedding checklist items, no photo
}

/** Splits the Decoration section into per-category groups, keeping photo-
 * backed picks (the browsable gallery) separate from Wedding's checklist
 * items (Home/Venue/Couple Entry/Welcome Girls - real services, but no photo
 * behind them) so the PDF never fabricates a placeholder image for those. */
function groupDecorationLines(lines: EnquirySelectionLine[]): DecorationGroup[] {
  const groups = new Map<string, DecorationGroup>();
  for (const line of lines) {
    const isPhotoPick = line.groupId === 'decoration-inspiration' && !!line.imageUrl;
    const label = isPhotoPick ? decorationPhotoCategory(line.name) : GROUP_LABELS[line.groupId || ''] || line.groupId || 'Decoration';
    if (!groups.has(label)) groups.set(label, { label, photos: [], textOnly: [] });
    const group = groups.get(label)!;
    if (isPhotoPick) group.photos.push(line);
    else group.textOnly.push(line);
  }
  return Array.from(groups.values());
}

interface PhotographyGroup {
  label: string;
  duration: string | null;
  items: EnquirySelectionLine[];
}

/** Pre-Wedding Shoot's duration pick and its service checklist are two
 * separate catalog groups in the data model but one logical section to a
 * reader - merged here into a single "Pre-Wedding Shoot" block with
 * "Duration: 1 Day" as its own line, matching how it's actually presented
 * everywhere else on the site. */
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

/** De-duplicates by name (case-insensitive) within a list - a safety net so
 * a stray double-add anywhere upstream never shows the owner the same
 * service twice in the same section. */
function dedupeByName(lines: EnquirySelectionLine[]): EnquirySelectionLine[] {
  const seen = new Set<string>();
  const result: EnquirySelectionLine[] = [];
  for (const line of lines) {
    const key = line.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }
  return result;
}

const s = StyleSheet.create({
  page: { paddingTop: 70, paddingBottom: 50, paddingHorizontal: 36, fontSize: 10, fontFamily: 'Helvetica', color: '#3a1420' },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    paddingHorizontal: 36,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  fixedHeaderBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 24, height: 24, borderRadius: 12 },
  brandName: { fontSize: 12, fontWeight: 700, color: '#5c0a18' },
  fixedHeaderRight: { fontSize: 8, color: '#7a5540' },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    paddingHorizontal: 36,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e6d5b8',
  },
  footerText: { fontSize: 8, color: '#8a6b52' },

  titleBlock: { alignItems: 'center', marginBottom: 18 },
  bigLogo: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  brandNameBig: { fontSize: 18, fontWeight: 700, color: '#5c0a18', letterSpacing: 1 },
  docTitle: { fontSize: 13, fontWeight: 700, color: '#8a6d1f', marginTop: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  refRow: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 8 },
  refText: { fontSize: 9, color: '#7a5540' },

  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#5c0a18',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
  },
  subheading: { fontSize: 10, fontWeight: 700, color: '#8a6d1f', marginTop: 8, marginBottom: 5 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3 },
  label: { width: 110, color: '#7a5540', fontSize: 9 },
  value: { flex: 1, fontSize: 9.5, fontWeight: 700, color: '#3a1420' },
  bullet: { flexDirection: 'row', marginBottom: 2.5 },
  bulletDot: { width: 10, fontSize: 9.5, color: '#8a6d1f' },
  bulletText: { fontSize: 9.5, flex: 1, color: '#3a1420' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoCard: { width: 150, marginBottom: 10 },
  photoImage: { width: 150, height: 150, objectFit: 'contain', backgroundColor: '#faf2df', borderRadius: 6, borderWidth: 1, borderColor: '#e6d5b8' },
  photoCaption: { fontSize: 8.5, fontWeight: 700, marginTop: 3, color: '#3a1420', textAlign: 'center' },

  totalBox: {
    marginTop: 10,
    backgroundColor: '#5c0a18',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 9, color: '#e8c979', textTransform: 'uppercase', letterSpacing: 1 },
  totalAmount: { fontSize: 20, color: '#f7e8b0', fontWeight: 700, marginTop: 4 },
  totalNote: { fontSize: 8, color: '#e8c979', marginTop: 4 },

  refBox: { marginTop: 14, borderWidth: 1, borderColor: '#d4af37', borderRadius: 8, padding: 12 },
  statusBadge: { fontSize: 8, color: '#5c0a18', backgroundColor: '#f7e8b0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  contactNote: { fontSize: 9, marginTop: 10, fontStyle: 'italic', color: '#5c0a18' },
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
}

/** The full, structured Event Enquiry PDF - a single <Page> whose content
 * react-pdf automatically flows across as many physical pages as needed
 * (fixed header/footer repeat on every one via the `fixed` prop), built
 * entirely from the same EnquiryDetails already used for the WhatsApp
 * message and the admin CRM record, so nothing here can drift out of sync
 * with what the customer actually selected. */
export function EnquiryPdfDocument({ details, refCode, submittedAtIso }: EnquiryPdfDocumentProps) {
  const decorationSection = details.sections.find((sec) => sec.categoryKey === 'decoration');
  const photographySection = details.sections.find((sec) => sec.categoryKey === 'photography');
  const otherSections = details.sections.filter((sec) => sec.categoryKey !== 'decoration' && sec.categoryKey !== 'photography');

  const decorationGroups = decorationSection ? groupDecorationLines(decorationSection.lines) : [];
  const photographyGroups = photographySection ? groupPhotographyLines(photographySection.lines) : [];

  const cateringTimingLabel: Record<string, string> = {
    morning: 'Morning (Breakfast menu)',
    afternoon: 'Afternoon (Lunch menu)',
    evening: 'Evening (Dinner menu)',
  };

  return (
    <Document title={`SID Events Enquiry ${refCode}`} author="SID Events">
      <Page size="A4" style={s.page} wrap>
        {/* Repeats on every physical page */}
        <View style={s.fixedHeader} fixed>
          <View style={s.fixedHeaderBrand}>
            <Image src="/logo-circle.png" style={s.logo} />
            <Text style={s.brandName}>SID Events</Text>
          </View>
          <Text style={s.fixedHeaderRight}>Ref #{refCode}</Text>
        </View>
        <Text
          style={s.footerText}
          fixed
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
        <View style={s.fixedFooter} fixed>
          <Text style={s.footerText}>{SITE.name} - {SITE.phoneDisplay}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

        {/* Title block - once, at the top of the document */}
        <View style={s.titleBlock}>
          <Image src="/logo-circle.png" style={s.bigLogo} />
          <Text style={s.brandNameBig}>SID EVENTS</Text>
          <Text style={s.docTitle}>Event Enquiry / Event Requirement Summary</Text>
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
          <Field label="Event Date" value={formatDate(details.eventDate)} />
          <Field label="Location" value={details.location || 'Not provided'} />
          <Field label="Guests" value={details.guestCount ? String(details.guestCount) : 'Not specified'} />
          {details.specialRequirements && <Field label="Notes" value={details.specialRequirements} />}
        </View>

        {/* Selected Decoration */}
        {decorationGroups.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Selected Decoration</Text>
            {decorationGroups.map((group) => (
              <View key={group.label} style={{ marginBottom: 10 }}>
                <Text style={s.subheading}>{group.label}</Text>
                {group.textOnly.length > 0 && <BulletList lines={group.textOnly} />}
                {group.photos.length > 0 && (
                  <View style={s.photoGrid}>
                    {dedupeByName(group.photos).map((photo, i) => (
                      <View key={`${photo.name}-${i}`} style={s.photoCard} wrap={false}>
                        <Image src={getWatermarkedDecorationSrc(photo.imageUrl || '')} style={s.photoImage} />
                        <Text style={s.photoCaption}>{photo.name}</Text>
                      </View>
                    ))}
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
              <View key={group.label} style={{ marginBottom: 8 }} wrap={false}>
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

        {/* Additional Services / Venue / anything else generic */}
        {otherSections.map((section) => (
          <View key={section.categoryKey} style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>{section.label}</Text>
            <BulletList lines={section.lines} />
          </View>
        ))}

        {/* Catering Menu - already grouped/ordered exactly as the site's
            catering data structure defines, nothing re-derived here. */}
        {details.cateringSections.length > 0 && (
          <View style={s.section} wrap>
            <Text style={s.sectionTitle}>Catering Menu</Text>
            {details.cateringTiming && (
              <Text style={{ fontSize: 9, color: '#7a5540', marginBottom: 6 }}>
                {cateringTimingLabel[details.cateringTiming] || details.cateringTiming}
                {details.cateringGuestCount ? `  ·  Guest Count: ${details.cateringGuestCount}` : ''}
              </Text>
            )}
            {details.cateringSections.map((section) => (
              <View key={section.categoryName} style={{ marginBottom: 8 }} wrap={false}>
                <Text style={s.subheading}>{section.categoryName}</Text>
                <BulletList lines={section.lines} />
              </View>
            ))}
          </View>
        )}

        {details.requestedExtras.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>Pending Approval Requests</Text>
            <BulletList lines={details.requestedExtras} />
          </View>
        )}

        {/* Estimated Total */}
        <View style={s.totalBox} wrap={false}>
          <Text style={s.totalLabel}>Estimated Total</Text>
          <Text style={s.totalAmount}>{'₹'}{details.estimatedTotal.toLocaleString('en-IN')}</Text>
          <Text style={s.totalNote}>Final amount to be confirmed after enquiry.</Text>
        </View>

        {/* Reference / status footer block */}
        <View style={s.refBox} wrap={false}>
          <Field label="Reference Code" value={`#${refCode}`} />
          <Field label="Submitted" value={formatDateTime(submittedAtIso)} />
          <Text style={s.statusBadge}>NEW ENQUIRY</Text>
          <Text style={s.contactNote}>Please contact the customer to confirm availability and finalize the booking.</Text>
        </View>
      </Page>
    </Document>
  );
}

/** Renders the PDF to a Blob, entirely client-side (react-pdf's renderer is
 * isomorphic) - the customer's own browser already has the watermarked
 * decoration images it just rendered in the gallery, so this doesn't need a
 * server round trip or a serverless function fetching images itself. */
export async function generateEnquiryPdfBlob(details: EnquiryDetails, refCode: string, submittedAtIso: string): Promise<Blob> {
  const instance = pdf(<EnquiryPdfDocument details={details} refCode={refCode} submittedAtIso={submittedAtIso} />);
  return instance.toBlob();
}
