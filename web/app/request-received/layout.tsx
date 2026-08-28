import type { Metadata } from 'next';

// Post-submission confirmation screen for one specific customer's enquiry
// (reads a ?ref= query param) - not content anyone should land on from
// search, so it's excluded from the sitemap, disallowed in robots.txt, and
// marked noindex here as well.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RequestReceivedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
