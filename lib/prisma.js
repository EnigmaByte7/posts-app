import { PrismaClient } from '../src/generated/prisma'

const globalForPrisma = global || { prisma: { PrismaClient} };

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma