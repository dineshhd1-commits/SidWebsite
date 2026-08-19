import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding & Event Packages | SID Events Davanagere',
  description: 'Browse ready-made wedding and event packages from SID Events, or start from any package and customize decoration, photography, catering and more for your event in Davanagere, Karnataka.',
  alternates: { canonical: '/packages' },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
