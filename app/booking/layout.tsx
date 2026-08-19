import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quotation | SID Events Davanagere',
  description: 'Send your event details to SID Events in Davanagere, Karnataka and receive a custom quotation - no payment required, just share your requirements and our team will follow up.',
  alternates: { canonical: '/booking' },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
