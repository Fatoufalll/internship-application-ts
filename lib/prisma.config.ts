import "dotenv/config"; // Charge les variables d'environnement
import { PrismaClient } from "@prisma/client"; // PrismaClient est bien exporté en Prisma 6

// Singleton pour éviter de multiples instances en dev
declare global {
  
  var prisma: PrismaClient | undefined;
}

// Crée ou réutilise l'instance globale
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : [],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Configuration optionnelle (schema + migrations)
export const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};
