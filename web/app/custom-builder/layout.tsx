import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan Your Event | Custom Package Builder',
  description: 'Build a custom event package with SID Events: choose your event type, decoration, photography, catering and additional services in Davanagere, Karnataka, and request a quotation.',
  alternates: { canonical: '/custom-builder' },
};

export default function CustomBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
