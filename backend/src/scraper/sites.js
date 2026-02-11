// ============================================
// Site Configurations — Swedish recipe sites
// ============================================
// We scrape schema.org/Recipe JSON-LD that sites
// voluntarily publish for search engines.

export const SITES = [
  {
    id: 'ica',
    name: 'ICA',
    domain: 'ica.se',
    sitemapUrls: [
      'https://www.ica.se/sitemap.xml',
    ],
    recipeUrlPattern: /ica\.se\/recept\/.+/,
    rateLimit: { concurrency: 2, intervalMs: 1500 },
  },
  {
    id: 'coop',
    name: 'Coop',
    domain: 'coop.se',
    sitemapUrls: [
      'https://www.coop.se/sitemap.xml',
    ],
    recipeUrlPattern: /coop\.se\/recept\/.+/,
    rateLimit: { concurrency: 2, intervalMs: 1500 },
  },
  {
    id: 'arla',
    name: 'Arla',
    domain: 'arla.se',
    sitemapUrls: [
      'https://www.arla.se/sitemap.xml',
    ],
    recipeUrlPattern: /arla\.se\/recept\/.+/,
    rateLimit: { concurrency: 2, intervalMs: 2000 },
  },
  {
    id: 'koket',
    name: 'Köket',
    domain: 'koket.se',
    sitemapUrls: [
      'https://www.koket.se/sitemap.xml',
    ],
    recipeUrlPattern: /koket\.se\/.+/,
    rateLimit: { concurrency: 2, intervalMs: 1500 },
  },
  {
    id: 'tasteline',
    name: 'Tasteline',
    domain: 'tasteline.com',
    sitemapUrls: [
      'https://www.tasteline.com/sitemap.xml',
    ],
    recipeUrlPattern: /tasteline\.com\/recept\/.+/,
    rateLimit: { concurrency: 2, intervalMs: 1500 },
  },
  {
    id: 'recepten',
    name: 'Recepten.se',
    domain: 'recepten.se',
    sitemapUrls: [
      'https://recepten.se/sitemap.xml',
    ],
    recipeUrlPattern: /recepten\.se\/recept\/.+/,
    rateLimit: { concurrency: 1, intervalMs: 2000 },
  },
];

/**
 * Get site config by domain or id
 */
export function getSiteConfig(domainOrId) {
  return SITES.find(
    (s) => s.id === domainOrId || s.domain === domainOrId
  );
}

/**
 * Extract domain from URL
 */
export function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
