import type { Metadata } from 'next';

// Defense-in-depth alongside the robots.txt disallow for /admin: even if a
// crawler ever fetches this segment (e.g. one that ignores robots.txt), the
// response itself says not to index it. The CRM is also already gated by
// proxy.ts, so an unauthenticated crawler only ever sees the login screen.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
