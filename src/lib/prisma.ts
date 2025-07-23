import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    omit: {
      user: {
        password: true,
        salt: true
      }
    }
  });

if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;
