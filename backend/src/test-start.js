console.log("=== SERVER STARTING ===");
console.log("Node version:", process.version);
console.log("ENV keys:", Object.keys(process.env).filter(k => !k.startsWith('RAILWAY')).join(', '));

try {
  console.log("Loading config...");
  const { config } = await import('./config/env.js');
  console.log("Config loaded OK, port:", config.PORT);
} catch(err) {
  console.error("CONFIG ERROR:", err.message);
  console.error(err.stack);
}

try {
  console.log("Loading prisma...");
  const { prisma } = await import('./config/db.js');
  await prisma.$connect();
  console.log("DB connected OK");
} catch(err) {
  console.error("DB ERROR:", err.message);
}

try {
  console.log("Starting express...");
  const express = (await import('express')).default;
  const app = express();
  app.get('/api/health', (req, res) => res.json({ status: 'healthy' }));
  app.listen(4000, '0.0.0.0', () => console.log("=== LISTENING ON 4000 ==="));
} catch(err) {
  console.error("EXPRESS ERROR:", err.message);
  console.error(err.stack);
}
