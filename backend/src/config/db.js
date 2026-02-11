// ============================================
// Prisma Client — Database connection
// ============================================

import { PrismaClient } from '@prisma/client';
import { isDev } from './env.js';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'warn', 'error'] : ['error'],
  });

if (isDev) globalForPrisma.prisma = prisma;
