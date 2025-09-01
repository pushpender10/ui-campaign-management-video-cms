import { PrismaClient } from "@prisma/client";

// Use a global to prevent re-instantiating prisma in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database operations
export const db = {
  // User operations
  user: {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    findByUsername: (username: string) => prisma.user.findUnique({ where: { username } }),
    findByEmailOrUsername: (email: string, username: string) => 
      prisma.user.findFirst({ where: { OR: [{ email }, { username }] } }),
    create: (data: { name: string; email: string; username: string; passwordHash: string }) =>
      prisma.user.create({ data }),
    update: (id: string, data: any) => prisma.user.update({ where: { id }, data }),
  },
  
  // Video operations
  video: {
    findById: (id: string) => prisma.video.findUnique({ 
      where: { id },
      include: { user: true }
    }),
    findByUserId: (userId: string) => prisma.video.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    create: (data: any) => prisma.video.create({ data }),
    update: (id: string, data: any) => prisma.video.update({ where: { id }, data }),
    delete: (id: string) => prisma.video.delete({ where: { id } }),
    findPublic: () => prisma.video.findMany({
      where: { privacy: 'PUBLIC' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    }),
  },
  
  // Account operations
  account: {
    findByProvider: (provider: string, providerAccountId: string) =>
      prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } }
      }),
    create: (data: any) => prisma.account.create({ data }),
  },
  
  // Session operations
  session: {
    findByToken: (sessionToken: string) =>
      prisma.session.findUnique({ where: { sessionToken } }),
    create: (data: any) => prisma.session.create({ data }),
    update: (sessionToken: string, data: any) =>
      prisma.session.update({ where: { sessionToken }, data }),
    delete: (sessionToken: string) =>
      prisma.session.delete({ where: { sessionToken } }),
  },
};
