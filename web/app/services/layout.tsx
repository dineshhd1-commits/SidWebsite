import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Management Services in Davanagere, Karnataka',
  description: 'Explore SID Events’ services: wedding event management, engagement and reception decoration, traditional home functions, corporate events, photography, videography and catering across Davanagere and Karnataka.',
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
