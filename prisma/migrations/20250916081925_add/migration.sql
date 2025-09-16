/*
  Warnings:

  - The primary key for the `GameSession` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Click" DROP CONSTRAINT "Click_gameSessionId_fkey";

-- AlterTable
ALTER TABLE "public"."Click" ALTER COLUMN "gameSessionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."GameSession" DROP CONSTRAINT "GameSession_pkey",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '24 HOURS',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GameSession_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
