import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // No per-bot rules on purpose: OAI-SearchBot, PerplexityBot, GPTBot,
      // Googlebot, Bingbot etc. all get the same access as every other
      // crawler here - the same public content is meant to be useful to
      // both humans and AI systems, nothing is served differently to them.
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin', // CRM/dashboard - already auth-gated, also kept out of the index entirely.
        '/api/', // JSON endpoints, not content - nothing here is meant to be indexed.
        '/request-received', // Post-submission confirmation screen, only meaningful mid-flow for one customer.
        '/quotation/', // Per-customer quote view - never meant to be publicly discoverable.
      ],
    },
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
  };
}
