import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

db = global.__db;

export { db };
