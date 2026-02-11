// ============================================
// CLI Scraper Runner
// Run: node src/utils/run-scraper.js [site-id]
//
// Examples:
//   node src/utils/run-scraper.js ica        # Scrape ICA
//   node src/utils/run-scraper.js all        # Scrape all sites
//   node src/utils/run-scraper.js --stats    # Show stats
//   node src/utils/run-scraper.js --lexicon  # Build lexicon
// ============================================

import { PrismaClient } from '@prisma/client';
import { SITES } from '../scraper/sites.js';
import { discoverRecipeUrls } from '../scraper/sitemap.js';
import { createScrapeQueue } from '../scraper/queue.js';
import { parseRecipePage } from '../scraper/parser.js';
import { fetchWithTimeout } from '../scraper/sitemap.js';

const prisma = new PrismaClient();
const args = process.argv.slice(2);

async function main() {
  if (args.includes('--stats')) {
    await showStats();
    return;
  }

  if (args.includes('--lexicon')) {
    // Dynamic import to avoid loading AI config when not needed
    const { buildLexicon } = await import('../services/lexicon-builder.js');
    await buildLexicon();
    return;
  }

  const siteId = args[0];
  if (!siteId) {
    console.log('Användning: node src/utils/run-scraper.js [site-id|all|--stats|--lexicon]');
    console.log('\nTillgängliga sajter:');
    SITES.forEach((s) => console.log(`  ${s.id.padEnd(12)} ${s.name.padEnd(15)} ${s.domain}`));
    return;
  }

  if (siteId === 'all') {
    for (const site of SITES) {
      await scrapeSite(site);
    }
  } else {
    const site = SITES.find((s) => s.id === siteId);
    if (!site) {
      console.error(`❌ Okänd sajt: ${siteId}`);
      console.log('Tillgängliga:', SITES.map((s) => s.id).join(', '));
      process.exit(1);
    }
    await scrapeSite(site);
  }

  // After scraping, optionally build lexicon
  if (args.includes('--build-lexicon')) {
    const { buildLexicon } = await import('../services/lexicon-builder.js');
    await buildLexicon();
  }
}

async function scrapeSite(siteConfig) {
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`🕷️  Scraping ${siteConfig.name} (${siteConfig.domain})`);
  console.log(`${'═'.repeat(50)}\n`);

  // Create job
  const job = await prisma.scrapeJob.create({
    data: {
      domain: siteConfig.domain,
      status: 'running',
      startedAt: new Date(),
    },
  });

  try {
    // Discover URLs
    const urls = await discoverRecipeUrls(siteConfig);

    if (urls.length === 0) {
      console.log('⚠️ Inga recept-URL:er hittades.');
      await prisma.scrapeJob.update({
        where: { id: job.id },
        data: { status: 'completed', totalUrls: 0, completedAt: new Date() },
      });
      return;
    }

    // Filter already scraped
    const existing = await prisma.scrapedRecipe.findMany({
      where: { sourceDomain: siteConfig.domain },
      select: { sourceUrl: true },
    });
    const existingUrls = new Set(existing.map((r) => r.sourceUrl));
    const newUrls = urls.filter((url) => !existingUrls.has(url));

    console.log(`📊 ${urls.length} totala URL:er, ${newUrls.length} nya`);

    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: { totalUrls: newUrls.length },
    });

    if (newUrls.length === 0) {
      console.log('✅ Alla URL:er redan skrapade.');
      await prisma.scrapeJob.update({
        where: { id: job.id },
        data: { status: 'completed', completedAt: new Date() },
      });
      return;
    }

    // Scrape
    let newRecipes = 0;

    const queue = createScrapeQueue(
      siteConfig.rateLimit,
      async (recipe) => {
        try {
          const { ingredients, steps, ...data } = recipe;
          await prisma.scrapedRecipe.create({
            data: {
              ...data,
              ingredients: { create: ingredients },
              steps: { create: steps },
            },
          });
          newRecipes++;
        } catch (err) {
          if (err.code !== 'P2002') {
            console.error(`  ❌ DB error: ${err.message}`);
          }
        }
      },
      (url, err) => {
        // Only log 10% of errors to avoid spam
        if (Math.random() < 0.1) {
          console.warn(`  ⚠️ ${url}: ${err.message}`);
        }
      },
      (scraped, failed, total) => {
        if ((scraped + failed) % 25 === 0 || scraped + failed === total) {
          const pct = Math.round(((scraped + failed) / total) * 100);
          console.log(`  📈 ${pct}% — ${scraped} skrapade, ${failed} missade / ${total} totalt`);
        }
      }
    );

    queue.add(newUrls);
    const result = await queue.drain();

    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        scrapedUrls: result.scraped,
        failedUrls: result.failed,
        newRecipes,
        completedAt: new Date(),
      },
    });

    console.log(`\n✅ Klart! ${newRecipes} nya recept sparade.\n`);
  } catch (err) {
    console.error(`\n❌ Fel: ${err.message}`);
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: err.message, completedAt: new Date() },
    });
  }
}

async function showStats() {
  const totalRecipes = await prisma.scrapedRecipe.count();
  const byDomain = await prisma.scrapedRecipe.groupBy({
    by: ['sourceDomain'],
    _count: true,
    orderBy: { _count: { sourceDomain: 'desc' } },
  });
  const totalWords = await prisma.recipeWord.count();
  const totalIngredients = await prisma.scrapedIngredient.count();

  console.log('\n📊 Scraper Statistik');
  console.log('─'.repeat(40));
  console.log(`Recept totalt:       ${totalRecipes}`);
  console.log(`Ingredienser totalt: ${totalIngredients}`);
  console.log(`Lexikon-ord:         ${totalWords}`);
  console.log('\nPer sajt:');
  byDomain.forEach((d) => {
    console.log(`  ${d.sourceDomain.padEnd(20)} ${d._count} recept`);
  });
  console.log();
}

main()
  .catch((err) => {
    console.error('❌', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
