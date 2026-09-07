import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const disallowed = [
    '/admin',
    '/admin/',
    '/api/',
    '/request-received',
    '/quotation/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot'],
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot'],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: disallowed,
      },
    ],
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
  };
}
