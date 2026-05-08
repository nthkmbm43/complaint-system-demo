import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * ป้องกัน Connection หลุดระหว่าง Hot Reload ใน Next.js Dev Mode
 */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
