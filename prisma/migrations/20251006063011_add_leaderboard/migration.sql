-- AlterTable
ALTER TABLE "public"."GameSession" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '24 HOURS';

-- CreateTable
CREATE TABLE "public"."Leaderboard" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "timeInSeconds" INTEGER NOT NULL,
    "gameSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_gameSessionId_key" ON "public"."Leaderboard"("gameSessionId");

-- CreateIndex
CREATE INDEX "Leaderboard_timeInSeconds_idx" ON "public"."Leaderboard"("timeInSeconds");

-- AddForeignKey
ALTER TABLE "public"."Leaderboard" ADD CONSTRAINT "Leaderboard_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
