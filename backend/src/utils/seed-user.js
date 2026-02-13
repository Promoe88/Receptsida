// ============================================
// Seed Script — Create or reset a user account
// Run: node src/utils/seed-user.js
// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  {
    email: 'jonas@sprinkls.com',
    password: 'Apollon830921!',
    name: 'Jonas',
  },
];

async function main() {
  for (const { email, password, name } of USERS) {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, emailVerified: true, onboardingDone: true },
      create: {
        email,
        passwordHash,
        name,
        emailVerified: true,
        onboardingDone: true,
        searchQuota: { create: { searchesUsed: 0 } },
      },
    });

    console.log(`✔ ${user.email} (${user.id}) — ready to log in`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
