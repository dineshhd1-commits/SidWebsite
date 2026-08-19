'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { WhatsAppFloatingButton } from './whatsapp-floating-button';
import { IntroSplash } from '@/components/ui/intro-splash';

/** The public site's chrome (nav bar, footer, WhatsApp bubble, intro splash)
 * has no place on the Admin/CRM dashboard - it's a separate, internal tool
 * with its own header, not a page of the marketing site. Gated by pathname
 * here (rather than a second root layout) so every other route keeps
 * exactly the structure it already had. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <IntroSplash />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  );
}
