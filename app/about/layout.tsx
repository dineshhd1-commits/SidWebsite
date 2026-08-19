import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About SID Events | Event Management Company in Davanagere',
  description: 'Learn about SID Events, an event management company based in Davanagere, Karnataka - who we are, the events we plan, and how we work with couples and families across weddings, traditional functions and corporate events.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
