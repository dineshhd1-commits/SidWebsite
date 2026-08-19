import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding & Event Decoration Gallery',
  description: 'Browse photos of real wedding decoration, stage setups, couple entry concepts, home functions and event decor by SID Events in Davanagere, Karnataka.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
