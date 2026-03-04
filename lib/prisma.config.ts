import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = 
  global.prisma ?? 
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl as string, // Assertion de type pour garantir que c'est une string
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
