import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | SID Events',
  description: 'Terms and conditions for booking event management, decoration, photography and catering services with SID Events in Davanagere, Karnataka.',
  alternates: { canonical: '/terms-and-conditions' },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
