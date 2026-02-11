// ============================================
// Scrape Queue — Rate-limited URL processing
// ============================================
// Uses p-queue for concurrency control and
// rate limiting to be respectful to target sites.

import PQueue from 'p-queue';
import { fetchWithTimeout } from './sitemap.js';
import { parseRecipePage } from './parser.js';

/**
 * Create a rate-limited scraping queue
 *
 * @param {object} rateLimit - { concurrency, intervalMs }
 * @param {Function} onResult - Callback for each successfully parsed recipe
 * @param {Function} onError - Callback for each failed URL
 * @param {Function} onProgress - Progress callback (scraped, total)
 * @returns {object} Queue controller with add() and drain()
 */
export function createScrapeQueue(rateLimit, onResult, onError, onProgress) {
  const queue = new PQueue({
    concurrency: rateLimit.concurrency || 2,
    interval: rateLimit.intervalMs || 1500,
    intervalCap: rateLimit.concurrency || 2,
  });

  let scraped = 0;
  let failed = 0;
  let total = 0;

  return {
    /**
     * Add URLs to the queue for scraping
     */
    add(urls) {
      total += urls.length;
      for (const url of urls) {
        queue.add(async () => {
          try {
            const res = await fetchWithTimeout(url, 20000);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            const html = await res.text();
            const recipe = parseRecipePage(html, url);

            if (recipe) {
              await onResult(recipe);
              scraped++;
            } else {
              // Page loaded but no recipe data found
              failed++;
            }
          } catch (err) {
            failed++;
            onError(url, err);
          }

          onProgress(scraped, failed, total);
        });
      }
    },

    /**
     * Wait for all queued tasks to complete
     */
    async drain() {
      await queue.onIdle();
      return { scraped, failed, total };
    },

    /**
     * Get current stats
     */
    stats() {
      return {
        scraped,
        failed,
        total,
        pending: queue.pending,
        size: queue.size,
      };
    },

    /**
     * Clear remaining queue
     */
    clear() {
      queue.clear();
    },
  };
}
