// ============================================
// Sitemap Parser — Discover recipe URLs
// ============================================
// Parses XML sitemaps (including sitemap indexes)
// to find all recipe page URLs for a given site.

import * as cheerio from 'cheerio';

const USER_AGENT = 'MatKompass/1.0 (recipe indexer; contact@matkompass.se)';
const FETCH_TIMEOUT = 15000;

/**
 * Fetch a URL with proper headers and timeout
 */
async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/xml, application/xml, text/html',
        'Accept-Language': 'sv-SE,sv;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parse a sitemap XML and extract all URLs.
 * Handles both sitemap indexes and regular sitemaps.
 *
 * @param {string} sitemapUrl - URL of the sitemap
 * @param {RegExp} recipePattern - Pattern to filter recipe URLs
 * @param {number} maxDepth - Max recursive depth for sitemap indexes
 * @returns {Promise<string[]>} Array of recipe URLs
 */
export async function parseSitemap(sitemapUrl, recipePattern, maxDepth = 2) {
  if (maxDepth <= 0) return [];

  console.log(`  📡 Fetching sitemap: ${sitemapUrl}`);

  let text;
  try {
    const res = await fetchWithTimeout(sitemapUrl);
    if (!res.ok) {
      console.warn(`  ⚠️ Sitemap returned ${res.status}: ${sitemapUrl}`);
      return [];
    }
    text = await res.text();
  } catch (err) {
    console.warn(`  ⚠️ Failed to fetch sitemap: ${err.message}`);
    return [];
  }

  const $ = cheerio.load(text, { xml: true });

  // Check if this is a sitemap index (contains <sitemap> elements)
  const sitemapRefs = $('sitemapindex > sitemap > loc');
  if (sitemapRefs.length > 0) {
    console.log(`  📋 Sitemap index with ${sitemapRefs.length} sub-sitemaps`);

    const subSitemapUrls = [];
    sitemapRefs.each((_, el) => {
      const loc = $(el).text().trim();
      if (loc) subSitemapUrls.push(loc);
    });

    // Filter for recipe-related sub-sitemaps if possible
    const recipeRelated = subSitemapUrls.filter(
      (url) =>
        url.includes('recept') ||
        url.includes('recipe') ||
        url.includes('post') ||
        url.includes('page')
    );

    // If we found recipe-specific sitemaps, use those; otherwise try all
    const toFetch = recipeRelated.length > 0 ? recipeRelated : subSitemapUrls;
    console.log(`  🔍 Fetching ${toFetch.length} sub-sitemaps...`);

    const allUrls = [];
    for (const subUrl of toFetch) {
      const urls = await parseSitemap(subUrl, recipePattern, maxDepth - 1);
      allUrls.push(...urls);
      // Small delay between sub-sitemap fetches
      await sleep(500);
    }
    return allUrls;
  }

  // Regular sitemap — extract <url><loc> entries
  const urls = [];
  $('urlset > url > loc').each((_, el) => {
    const loc = $(el).text().trim();
    if (loc && recipePattern.test(loc)) {
      urls.push(loc);
    }
  });

  console.log(`  ✅ Found ${urls.length} recipe URLs in sitemap`);
  return urls;
}

/**
 * Discover all recipe URLs for a site config
 */
export async function discoverRecipeUrls(siteConfig) {
  const allUrls = new Set();

  for (const sitemapUrl of siteConfig.sitemapUrls) {
    const urls = await parseSitemap(sitemapUrl, siteConfig.recipeUrlPattern);
    for (const url of urls) {
      allUrls.add(url);
    }
  }

  console.log(`📊 Total unique recipe URLs for ${siteConfig.name}: ${allUrls.size}`);
  return [...allUrls];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { fetchWithTimeout, USER_AGENT };
