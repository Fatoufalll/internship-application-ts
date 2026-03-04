import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Vérifie que la variable d'environnement existe
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL n'est pas définie !");
}

// Singleton pour éviter de multiples instances en dev
declare global {
  
  var prisma: PrismaClient | undefined;
}

// Crée ou réutilise l'instance globale
export const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL!, // TypeScript sait que c'est bien string
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : [],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Config Prisma optionnelle
export const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};