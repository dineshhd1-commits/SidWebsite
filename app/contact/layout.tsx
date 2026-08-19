import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact SID Events | Davanagere, Karnataka',
  description: 'Get in touch with SID Events in Davanagere, Karnataka to plan your wedding, traditional function or corporate event - call, WhatsApp, or send an enquiry.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
