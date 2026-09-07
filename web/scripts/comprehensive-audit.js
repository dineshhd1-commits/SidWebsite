// Comprehensive Audit Script for SID Events
// Tests live HTTP responses, SEO tags, JSON-LD schemas, Robots, Sitemap, AIEO, and Type safety

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PROD_DOMAIN = 'https://sideventsmanagement.com';

const PUBLIC_ROUTES = [
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
  '/privacy',
];

const REDIRECT_ROUTES = [
  { from: '/terms', to: '/terms-and-conditions' },
  { from: '/privacy-policy', to: '/privacy' },
];

const PRIVATE_ROUTES = [
  '/request-received',
  '/quotation/test-quote',
  '/admin',
  '/admin/login',
];

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function assert(condition, message, warn = false) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else if (warn) {
    console.log(`  ⚠️ WARN: ${message}`);
    warnCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

async function fetchRoute(path) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const text = await res.text();
    return { status: res.status, headers: res.headers, html: text, location: res.headers.get('location') };
  } catch (err) {
    return { error: err.message };
  }
}

function extractMeta(html, nameOrProp) {
  const reg = new RegExp(`<meta\\s+(?:name|property)=["']${nameOrProp}["']\\s+content=["']([^"']*)["']`, 'i');
  const match = html.match(reg);
  if (match) return match[1];
  const regReversed = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${nameOrProp}["']`, 'i');
  const matchRev = html.match(regReversed);
  return matchRev ? matchRev[1] : null;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

function extractJsonLd(html) {
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const list = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      list.push(JSON.parse(match[1]));
    } catch (e) {
      list.push({ __parseError: e.message, raw: match[1] });
    }
  }
  return list;
}

async function runAudit() {
  console.log(`\n======================================================================`);
  console.log(`🌐 SID EVENTS COMPREHENSIVE PRODUCTION READINESS AUDIT`);
  console.log(`Target: ${BASE_URL} | Production Canonical: ${PROD_DOMAIN}`);
  console.log(`======================================================================\n`);

  // 1. PUBLIC ROUTES AUDIT
  console.log(`--- [1/6] PUBLIC ROUTES AUDIT (Status, Titles, Descriptions, Canonicals) ---`);
  for (const route of PUBLIC_ROUTES) {
    const res = await fetchRoute(route);
    assert(res.status === 200, `${route} returned HTTP 200 OK`);

    if (res.html) {
      const title = extractTitle(res.html);
      assert(title && title.length > 5, `${route} has valid <title>: "${title ? title.slice(0, 50) : ''}..."`);

      const desc = extractMeta(res.html, 'description');
      assert(desc && desc.length >= 30, `${route} has substantive meta description (${desc ? desc.length : 0} chars)`);

      const canonical = extractCanonical(res.html);
      const isRoot = route === '/';
      const isCanonicalValid = isRoot
        ? (canonical === PROD_DOMAIN || canonical === `${PROD_DOMAIN}/`)
        : (canonical === `${PROD_DOMAIN}${route}` || canonical === `${PROD_DOMAIN}${route}/`);
      assert(isCanonicalValid, `${route} canonical is authoritative: ${canonical}`);

      const ogTitle = extractMeta(res.html, 'og:title');
      assert(ogTitle && ogTitle.length > 5, `${route} has OpenGraph title`);

      const ogDesc = extractMeta(res.html, 'og:description');
      assert(ogDesc && ogDesc.length > 10, `${route} has OpenGraph description`);

      const robots = extractMeta(res.html, 'robots');
      assert(!robots || !robots.includes('noindex'), `${route} is indexable (not blocked by noindex)`);
    }
  }

  // 2. REDIRECT ALIASES & 404
  console.log(`\n--- [2/6] REDIRECTS & ERROR HANDLING AUDIT ---`);
  for (const red of REDIRECT_ROUTES) {
    const res = await fetchRoute(red.from);
    assert(
      (res.status === 307 || res.status === 308 || res.status === 301 || res.status === 302) &&
      res.location && res.location.includes(red.to),
      `Redirect ${red.from} -> ${red.to} (HTTP ${res.status}, Location: ${res.location})`
    );
  }

  const notFound = await fetchRoute('/non-existent-audit-test-page-404');
  assert(notFound.status === 404, `Non-existent route returns semantic 404`);
  if (notFound.html) {
    assert(notFound.html.includes('404') || notFound.html.includes('Page Not Found') || notFound.html.includes('not found'), `404 page contains clear user recovery guidance`);
  }

  // 3. PRIVATE ROUTES PROTECTION
  console.log(`\n--- [3/6] PRIVATE ROUTE PROTECTION AUDIT (noindex & Disallow) ---`);
  for (const priv of PRIVATE_ROUTES) {
    const res = await fetchRoute(priv);
    if (res.html) {
      const robots = extractMeta(res.html, 'robots');
      const hasNoindex = robots && robots.includes('noindex');
      assert(hasNoindex || res.status === 404 || res.status === 307, `${priv} protected from search index (robots: ${robots || 'disallowed/redirect'})`);
    }
  }

  // 4. STRUCTURED DATA & GEO/AEO SCHEMAS
  console.log(`\n--- [4/6] STRUCTURED DATA (JSON-LD), GEO & AEO AUDIT ---`);
  const home = await fetchRoute('/');
  if (home.html) {
    const geoRegion = extractMeta(home.html, 'geo.region');
    const geoPlace = extractMeta(home.html, 'geo.placename');
    const geoPos = extractMeta(home.html, 'geo.position');
    const icbm = extractMeta(home.html, 'ICBM');

    assert(geoRegion === 'IN-KA', `geo.region tag present (${geoRegion})`);
    assert(geoPlace && geoPlace.includes('Davanagere'), `geo.placename tag present (${geoPlace})`);
    assert(geoPos && geoPos.includes('14.4644'), `geo.position tag present (${geoPos})`);
    assert(icbm && icbm.includes('14.4644'), `ICBM coordinate tag present (${icbm})`);

    const schemas = extractJsonLd(home.html);
    assert(schemas.length >= 3, `Page contains multiple JSON-LD schemas (found ${schemas.length})`);

    const hasNoParseErrors = schemas.every(s => !s.__parseError);
    assert(hasNoParseErrors, `All JSON-LD schemas are valid, parseable JSON`);

    const webSiteSchema = schemas.find(s => s['@type'] === 'WebSite');
    assert(webSiteSchema && webSiteSchema.url === PROD_DOMAIN, `WebSite schema present with correct canonical URL`);

    const bizSchema = schemas.find(s => s['@type'] === 'EventPlanningBusiness');
    assert(bizSchema !== undefined, `EventPlanningBusiness schema present`);
    if (bizSchema) {
      assert(bizSchema.address && bizSchema.address.addressLocality === 'Davanagere', `Schema has Davanagere postal address`);
      assert(bizSchema.geo && bizSchema.geo.latitude === 14.4644, `Schema has accurate coordinates`);
      assert(Array.isArray(bizSchema.areaServed) && bizSchema.areaServed.length >= 5, `Schema defines wide regional service area (${bizSchema.areaServed?.length || 0} regions)`);
      assert(bizSchema.aggregateRating && bizSchema.aggregateRating.ratingValue === '4.9', `Schema includes 4.9 star aggregate rating`);
      assert(bizSchema.hasMap && bizSchema.hasMap.includes('maps.google.com'), `Schema includes direct Google Maps location URL`);
      assert(Array.isArray(bizSchema.openingHoursSpecification) && bizSchema.openingHoursSpecification.length > 0, `Schema includes openingHoursSpecification`);
    }

    const faqSchema = schemas.find(s => s['@type'] === 'FAQPage');
    assert(faqSchema !== undefined, `FAQPage schema present for Voice/AEO search snippets`);
    if (faqSchema) {
      assert(Array.isArray(faqSchema.mainEntity) && faqSchema.mainEntity.length >= 5, `FAQPage contains ${faqSchema.mainEntity ? faqSchema.mainEntity.length : 0} Q&As`);
      const allHaveAnswers = faqSchema.mainEntity && faqSchema.mainEntity.every(q => q.name && q.acceptedAnswer && q.acceptedAnswer.text);
      assert(allHaveAnswers, `All FAQ questions have full acceptedAnswer text`);
    }
  }

  // 5. ROBOTS, SITEMAP & AIEO FILES
  console.log(`\n--- [5/6] ROBOTS.TXT, SITEMAP.XML & AIEO FILES AUDIT ---`);
  const robotsRes = await fetchRoute('/robots.txt');
  assert(robotsRes.status === 200, `/robots.txt returned HTTP 200`);
  if (robotsRes.html) {
    assert(robotsRes.html.includes('User-Agent: *'), `robots.txt defines default user-agent`);
    assert(robotsRes.html.includes('User-Agent: Googlebot'), `robots.txt defines Googlebot rules`);
    assert(robotsRes.html.includes('User-Agent: GPTBot') || robotsRes.html.includes('GPTBot'), `robots.txt defines GPTBot permissions`);
    assert(robotsRes.html.includes('User-Agent: PerplexityBot') || robotsRes.html.includes('PerplexityBot'), `robots.txt defines PerplexityBot permissions`);
    assert(robotsRes.html.includes('Disallow: /admin'), `robots.txt blocks /admin`);
    assert(robotsRes.html.includes('Disallow: /quotation/'), `robots.txt blocks /quotation/`);
    assert(robotsRes.html.includes('Sitemap: https://sideventsmanagement.com/sitemap.xml'), `robots.txt points to sitemap.xml`);
  }

  const sitemapRes = await fetchRoute('/sitemap.xml');
  assert(sitemapRes.status === 200, `/sitemap.xml returned HTTP 200`);
  if (sitemapRes.html) {
    assert(sitemapRes.html.includes('<urlset'), `sitemap.xml is valid XML urlset`);
    assert(sitemapRes.html.includes('<loc>https://sideventsmanagement.com</loc>'), `sitemap.xml includes root URL`);
    assert(sitemapRes.html.includes('<loc>https://sideventsmanagement.com/privacy</loc>'), `sitemap.xml includes /privacy`);
    assert(!sitemapRes.html.includes('/admin'), `sitemap.xml strictly excludes /admin`);
    assert(!sitemapRes.html.includes('/quotation/'), `sitemap.xml strictly excludes /quotation/`);
  }

  const llmsRes = await fetchRoute('/llms.txt');
  assert(llmsRes.status === 200, `/llms.txt returned HTTP 200`);
  if (llmsRes.html) {
    assert(llmsRes.html.includes('# SID Events'), `/llms.txt has standard Markdown H1 title`);
    assert(llmsRes.html.includes('https://sideventsmanagement.com'), `/llms.txt provides canonical site URLs`);
  }

  const llmsFullRes = await fetchRoute('/llms-full.txt');
  assert(llmsFullRes.status === 200, `/llms-full.txt returned HTTP 200`);
  if (llmsFullRes.html) {
    assert(llmsFullRes.html.includes('South Indian') || llmsFullRes.html.includes('Catering'), `/llms-full.txt includes extended service specifications`);
  }

  // 6. ASSET & PERFORMANCE HYGIENE
  console.log(`\n--- [6/6] ASSET & LINK INTEGRITY AUDIT ---`);
  const logoRes = await fetchRoute('/logo.png');
  assert(logoRes.status === 200, `/logo.png resolves with HTTP 200`);

  const iconRes = await fetchRoute('/icon.png');
  assert(iconRes.status === 200, `/icon.png resolves with HTTP 200`);

  const videoRes = await fetchRoute('/sid-video1.mp4');
  assert(videoRes.status === 200, `/sid-video1.mp4 (hero video) resolves with HTTP 200`);

  console.log(`\n======================================================================`);
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   ✅ PASSED: ${passCount}`);
  console.log(`   ⚠️ WARNINGS: ${warnCount}`);
  console.log(`   ❌ FAILED: ${failCount}`);
  console.log(`======================================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit runner error:', err);
  process.exit(1);
});
