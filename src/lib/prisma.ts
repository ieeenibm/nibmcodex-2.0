import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required.');
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
  schemaMigrated?: boolean
}

const pool = globalForPrisma.pgPool ?? new Pool({
  connectionString,
  max: Number(process.env.PG_MAX_POOL_SIZE || 20),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.pgPool = pool

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Auto-apply missing columns and tables to the active PostgreSQL database.
 * Runs idempotently (IF NOT EXISTS) so that staging and production databases
 * with out-of-sync Prisma schemas automatically gain new columns with zero downtime.
 */
export async function ensureDatabaseSchema() {
  if (globalForPrisma.schemaMigrated) return;
  globalForPrisma.schemaMigrated = true;

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        -- 1. Ensure Session table columns
        ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "gameType" TEXT DEFAULT 'QUIZ';
        
        -- 2. Ensure Question table columns
        ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "images" JSONB;

        -- 3. Ensure QrTicket table exists
        CREATE TABLE IF NOT EXISTS "QrTicket" (
          "id" TEXT PRIMARY KEY,
          "sessionId" TEXT NOT NULL REFERENCES "Session"("id") ON DELETE CASCADE,
          "ticketNumber" INTEGER NOT NULL,
          "code" TEXT NOT NULL UNIQUE,
          "isWinning" BOOLEAN NOT NULL DEFAULT FALSE,
          "basePoints" INTEGER NOT NULL DEFAULT 500,
          "maxScans" INTEGER,
          "scanCount" INTEGER NOT NULL DEFAULT 0,
          "isExpired" BOOLEAN NOT NULL DEFAULT FALSE,
          "question" TEXT,
          "options" JSONB,
          "correctAnswer" TEXT,
          "timeLimit" INTEGER NOT NULL DEFAULT 15,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- 4. Ensure QrScan table exists
        CREATE TABLE IF NOT EXISTS "QrScan" (
          "id" TEXT PRIMARY KEY,
          "ticketId" TEXT NOT NULL REFERENCES "QrTicket"("id") ON DELETE CASCADE,
          "participantId" TEXT NOT NULL REFERENCES "Participant"("id") ON DELETE CASCADE,
          "sessionId" TEXT NOT NULL REFERENCES "Session"("id") ON DELETE CASCADE,
          "pointsEarned" INTEGER NOT NULL,
          "answer" TEXT,
          "isCorrect" BOOLEAN NOT NULL DEFAULT TRUE,
          "timeTaken" DOUBLE PRECISION,
          "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "QrScan_ticketId_participantId_key" UNIQUE ("ticketId", "participantId")
        );

        -- 5. Ensure missing columns if tables already existed
        ALTER TABLE "QrTicket" ADD COLUMN IF NOT EXISTS "question" TEXT;
        ALTER TABLE "QrTicket" ADD COLUMN IF NOT EXISTS "options" JSONB;
        ALTER TABLE "QrTicket" ADD COLUMN IF NOT EXISTS "correctAnswer" TEXT;
        ALTER TABLE "QrTicket" ADD COLUMN IF NOT EXISTS "timeLimit" INTEGER DEFAULT 15;
        ALTER TABLE "QrScan" ADD COLUMN IF NOT EXISTS "answer" TEXT;
        ALTER TABLE "QrScan" ADD COLUMN IF NOT EXISTS "isCorrect" BOOLEAN DEFAULT TRUE;
        ALTER TABLE "QrScan" ADD COLUMN IF NOT EXISTS "timeTaken" DOUBLE PRECISION;
      `);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Schema Sync Warning] Auto-migration check failed:', err);
    globalForPrisma.schemaMigrated = false; // Allow retry on next call
  }
}


