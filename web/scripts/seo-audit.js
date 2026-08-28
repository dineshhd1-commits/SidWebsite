/**
 * Automated SEO & Technical Search Audit Script
 * Inspects all routes, canonicals, sitemap, robots, JSON-LD, domain consistency, and metadata.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');

const EXPECTED_DOMAIN = 'https://sideventsmanagement.com';

const EXPECTED_PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/packages',
  '/gallery',
  '/testimonials',
  '/contact',
  '/custom-builder',
  '/booking',
  '/terms-and-conditions',
];

const EXPECTED_PRIVATE_ROUTES = [
  '/admin',
  '/admin/login',
  '/request-received',
  '/quotation/[id]',
];

console.log('='.repeat(70));
console.log('🔍 SID EVENTS TECHNICAL SEO & DISCOVERABILITY AUDIT');
console.log('='.repeat(70));

let passCount = 0;
let failCount = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    if (details) console.error(`   Details: ${details}`);
    failCount++;
  }
}

// 1. Audit site-config.ts for canonical domain
const siteConfigPath = path.join(ROOT_DIR, 'lib', 'site-config.ts');
const siteConfigContent = fs.readFileSync(siteConfigPath, 'utf-8');
assert(
  siteConfigContent.includes(EXPECTED_DOMAIN) && !siteConfigContent.includes('www.sideventsmanagement.com'),
  'Canonical production domain in site-config.ts is https://sideventsmanagement.com (non-www)'
);

// 2. Audit sitemap.ts
const sitemapPath = path.join(APP_DIR, 'sitemap.ts');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
assert(
  !sitemapContent.includes('new Date()'),
  'sitemap.ts does not use fake new Date() lastModified'
);
assert(
  !sitemapContent.includes('/admin') && !sitemapContent.includes('/request-received') && !sitemapContent.includes('/quotation'),
  'sitemap.ts excludes private/admin routes'
);

for (const route of EXPECTED_PUBLIC_ROUTES) {
  const checkPath = route === '/' ? "path: ''" : `path: '${route}'`;
  assert(
    sitemapContent.includes(checkPath),
    `sitemap.ts contains public route: ${route}`
  );
}

// 3. Audit robots.ts
const robotsPath = path.join(APP_DIR, 'robots.ts');
const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
assert(
  robotsContent.includes("allow: '/'"),
  'robots.ts allows public indexing'
);
assert(
  robotsContent.includes("'/admin'") && robotsContent.includes("'/api/'") && robotsContent.includes("'/request-received'") && robotsContent.includes("'/quotation/'"),
  'robots.ts disallows /admin, /api/, /request-received, and /quotation/'
);
assert(
  robotsContent.includes('sitemap.xml'),
  'robots.ts points to sitemap.xml'
);

// 4. Audit layout metadata & JSON-LD
const layoutPath = path.join(APP_DIR, 'layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
assert(
  layoutContent.includes('metadataBase: new URL(SITE.siteUrl)'),
  'Root layout configures metadataBase with authoritative domain'
);
assert(
  layoutContent.includes('@type\': \'EventPlanningBusiness') || layoutContent.includes('@type\': "EventPlanningBusiness'),
  'Root layout embeds EventPlanningBusiness structured data'
);
assert(
  layoutContent.includes('@type\': \'WebSite') || layoutContent.includes('@type\': "WebSite'),
  'Root layout embeds WebSite structured data'
);

// 5. Audit 404 handler
const notFoundPath = path.join(APP_DIR, 'not-found.tsx');
assert(
  fs.existsSync(notFoundPath),
  'app/not-found.tsx exists for dedicated semantic 404 responses'
);

// 6. Audit all Layouts for canonicals and robots
const layoutFiles = [
  { file: 'about/layout.tsx', canonical: '/about' },
  { file: 'services/layout.tsx', canonical: '/services' },
  { file: 'packages/layout.tsx', canonical: '/packages' },
  { file: 'gallery/layout.tsx', canonical: '/gallery' },
  { file: 'testimonials/layout.tsx', canonical: '/testimonials' },
  { file: 'contact/layout.tsx', canonical: '/contact' },
  { file: 'booking/layout.tsx', canonical: '/booking' },
  { file: 'custom-builder/layout.tsx', canonical: '/custom-builder' },
  { file: 'terms-and-conditions/layout.tsx', canonical: '/terms-and-conditions' },
  { file: 'request-received/layout.tsx', noindex: true },
  { file: 'quotation/layout.tsx', noindex: true },
  { file: 'admin/layout.tsx', noindex: true },
];

for (const item of layoutFiles) {
  const filePath = path.join(APP_DIR, item.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (item.canonical) {
      assert(
        content.includes(`canonical: '${item.canonical}'`) || content.includes(`canonical: "${item.canonical}"`),
        `${item.file} specifies canonical: ${item.canonical}`
      );
    }
    if (item.noindex) {
      assert(
        content.includes('index: false'),
        `${item.file} specifies noindex for private route`
      );
    }
  } else {
    failCount++;
    console.error(`❌ FAIL: Missing layout file ${item.file}`);
  }
}

// 7. Scan codebase for forbidden references in source code
const forbiddenTerms = [
  { term: 'www.sideventsmanagement.com', label: 'Legacy www subdomain' },
  { term: 'http://localhost:3000/sitemap', label: 'Localhost in sitemap links' },
];

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === '.next' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.mjs'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const { term, label } of forbiddenTerms) {
        if (content.includes(term)) {
          console.warn(`⚠️ WARNING: Found ${label} in ${path.relative(ROOT_DIR, fullPath)}`);
        }
      }
    }
  }
}
checkDir(path.join(ROOT_DIR, 'app'));
checkDir(path.join(ROOT_DIR, 'lib'));
checkDir(path.join(ROOT_DIR, 'components'));

console.log('='.repeat(70));
console.log(`AUDIT COMPLETE: ${passCount} Passed, ${failCount} Failed.`);
console.log('='.repeat(70));

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
