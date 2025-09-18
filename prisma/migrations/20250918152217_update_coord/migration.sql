-- AlterTable
ALTER TABLE "public"."GameSession" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '24 HOURS';
