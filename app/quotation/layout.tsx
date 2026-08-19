import type { Metadata } from 'next';

// Per-customer quote view (/quotation/[id]) - already disallowed in
// robots.txt; noindex here too as defense-in-depth against a stray link
// getting a page indexed without ever being crawled.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function QuotationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
