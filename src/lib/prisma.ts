import { PrismaClient } from '@prisma/client';

export const prisma =
  new PrismaClient().$extends({
    model: {
      omit: {
        user: {
          password: true,
          salt: true
        }
      }
      }
  });
