-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Photo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CharactersOnPhotos" (
    "photoId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CharactersOnPhotos_pkey" PRIMARY KEY ("photoId","characterId")
);

-- CreateTable
CREATE TABLE "public"."GameSession" (
    "id" SERIAL NOT NULL,
    "photoId" INTEGER NOT NULL,
    "userId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Click" (
    "id" SERIAL NOT NULL,
    "gameSessionId" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "characterId" INTEGER,
    "correct" BOOLEAN NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_name_key" ON "public"."Photo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "public"."Character"("name");

-- AddForeignKey
ALTER TABLE "public"."CharactersOnPhotos" ADD CONSTRAINT "CharactersOnPhotos_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "public"."Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CharactersOnPhotos" ADD CONSTRAINT "CharactersOnPhotos_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "public"."Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
