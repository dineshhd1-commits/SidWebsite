import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Reviews & Testimonials | SID Events Davanagere',
  description: 'Read what couples and families in Davanagere, Karnataka say about planning their wedding, function or corporate event with SID Events.',
  alternates: { canonical: '/testimonials' },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
