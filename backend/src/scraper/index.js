// ============================================
// Scraper Manager — Orchestrates recipe scraping
// ============================================
// Main entry point for the scraper system.
// Discovers URLs via sitemaps, scrapes pages,
// extracts recipe data, and stores in database.

import { prisma } from '../config/db.js';
import { SITES, getSiteConfig } from './sites.js';
import { discoverRecipeUrls } from './sitemap.js';
import { createScrapeQueue } from './queue.js';

// Track active jobs so we don't run duplicates
const activeJobs = new Map();

/**
 * Start a scrape job for a specific site
 *
 * @param {string} siteId - Site ID (e.g. 'ica', 'coop')
 * @returns {object} Job info with ID and initial status
 */
export async function startScrapeJob(siteId) {
  const siteConfig = getSiteConfig(siteId);
  if (!siteConfig) {
    throw new Error(`Okänd sajt: ${siteId}. Tillgängliga: ${SITES.map((s) => s.id).join(', ')}`);
  }

  // Don't start if already running for this site
  if (activeJobs.has(siteId)) {
    const existingJob = activeJobs.get(siteId);
    return {
      jobId: existingJob.id,
      status: 'already_running',
      message: `Scraping av ${siteConfig.name} pågår redan.`,
    };
  }

  // Create job record
  const job = await prisma.scrapeJob.create({
    data: {
      domain: siteConfig.domain,
      status: 'running',
      startedAt: new Date(),
    },
  });

  activeJobs.set(siteId, job);

  // Run scraping in background (don't await)
  runScrapeJob(job.id, siteConfig).catch(async (err) => {
    console.error(`❌ Scrape job ${job.id} failed:`, err.message);
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        error: err.message,
        completedAt: new Date(),
      },
    });
    activeJobs.delete(siteId);
  });

  return {
    jobId: job.id,
    status: 'started',
    site: siteConfig.name,
    domain: siteConfig.domain,
    message: `Scraping av ${siteConfig.name} har startats.`,
  };
}

/**
 * Run the actual scrape job
 */
async function runScrapeJob(jobId, siteConfig) {
  console.log(`\n🕷️ Starting scrape job for ${siteConfig.name} (${siteConfig.domain})`);

  // Step 1: Discover recipe URLs via sitemaps
  console.log('📡 Discovering recipe URLs...');
  const urls = await discoverRecipeUrls(siteConfig);

  if (urls.length === 0) {
    await prisma.scrapeJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        totalUrls: 0,
        completedAt: new Date(),
      },
    });
    activeJobs.delete(siteConfig.id);
    console.log('⚠️ No recipe URLs found.');
    return;
  }

  // Filter out already-scraped URLs
  const existing = await prisma.scrapedRecipe.findMany({
    where: { sourceDomain: siteConfig.domain },
    select: { sourceUrl: true },
  });
  const existingUrls = new Set(existing.map((r) => r.sourceUrl));
  const newUrls = urls.filter((url) => !existingUrls.has(url));

  console.log(`📊 ${urls.length} total URLs, ${newUrls.length} new (${existingUrls.size} already scraped)`);

  await prisma.scrapeJob.update({
    where: { id: jobId },
    data: { totalUrls: newUrls.length },
  });

  if (newUrls.length === 0) {
    await prisma.scrapeJob.update({
      where: { id: jobId },
      data: { status: 'completed', completedAt: new Date() },
    });
    activeJobs.delete(siteConfig.id);
    console.log('✅ All URLs already scraped.');
    return;
  }

  // Step 2: Scrape pages with rate limiting
  let newRecipes = 0;

  const queue = createScrapeQueue(
    siteConfig.rateLimit,
    // onResult
    async (recipe) => {
      try {
        await saveRecipe(recipe);
        newRecipes++;
      } catch (err) {
        if (err.code !== 'P2002') {
          // Not a duplicate — real error
          console.error(`  ❌ DB save error for ${recipe.sourceUrl}:`, err.message);
        }
      }
    },
    // onError
    (url, err) => {
      // Log but don't spam
      if (Math.random() < 0.1) {
        console.warn(`  ⚠️ Failed: ${url} — ${err.message}`);
      }
    },
    // onProgress
    async (scraped, failed, total) => {
      // Update job progress every 50 URLs
      if ((scraped + failed) % 50 === 0 || scraped + failed === total) {
        console.log(`  📈 Progress: ${scraped} scraped, ${failed} failed / ${total} total`);
        await prisma.scrapeJob.update({
          where: { id: jobId },
          data: {
            scrapedUrls: scraped,
            failedUrls: failed,
            newRecipes,
          },
        }).catch(() => {});
      }
    }
  );

  // Add all URLs to queue
  queue.add(newUrls);

  // Wait for completion
  const result = await queue.drain();

  // Mark job as completed
  await prisma.scrapeJob.update({
    where: { id: jobId },
    data: {
      status: 'completed',
      scrapedUrls: result.scraped,
      failedUrls: result.failed,
      newRecipes,
      completedAt: new Date(),
    },
  });

  activeJobs.delete(siteConfig.id);
  console.log(`\n✅ Scrape job completed for ${siteConfig.name}: ${newRecipes} new recipes stored`);
}

/**
 * Save a parsed recipe to the database
 */
async function saveRecipe(recipe) {
  const { ingredients, steps, ...recipeData } = recipe;

  await prisma.scrapedRecipe.create({
    data: {
      ...recipeData,
      ingredients: {
        create: ingredients,
      },
      steps: {
        create: steps,
      },
    },
  });
}

/**
 * Start scraping all configured sites
 */
export async function startScrapeAll() {
  const results = [];
  for (const site of SITES) {
    const result = await startScrapeJob(site.id);
    results.push(result);
  }
  return results;
}

/**
 * Get status of a scrape job
 */
export async function getJobStatus(jobId) {
  const job = await prisma.scrapeJob.findUnique({
    where: { id: jobId },
  });
  if (!job) return null;
  return job;
}

/**
 * Get all scrape jobs with pagination
 */
export async function getJobs(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.scrapeJob.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.scrapeJob.count(),
  ]);

  return { jobs, total, page, limit };
}

/**
 * Get scraper stats — total recipes, by domain, etc.
 */
export async function getScraperStats() {
  const [totalRecipes, byDomain, recentJobs, totalWords] = await Promise.all([
    prisma.scrapedRecipe.count(),
    prisma.scrapedRecipe.groupBy({
      by: ['sourceDomain'],
      _count: true,
      orderBy: { _count: { sourceDomain: 'desc' } },
    }),
    prisma.scrapeJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.recipeWord.count(),
  ]);

  return {
    totalRecipes,
    totalWords,
    byDomain: byDomain.map((d) => ({
      domain: d.sourceDomain,
      count: d._count,
    })),
    recentJobs,
    availableSites: SITES.map((s) => ({
      id: s.id,
      name: s.name,
      domain: s.domain,
    })),
  };
}
