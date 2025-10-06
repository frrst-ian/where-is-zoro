const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.charactersOnPhotos.deleteMany();
  await prisma.character.deleteMany();
  await prisma.photo.deleteMany();

  // Create characters
  const zoro = await prisma.character.create({ data: { name: "Zoro" } });
  const luffy = await prisma.character.create({ data: { name: "Luffy" } });
  const sanji = await prisma.character.create({ data: { name: "Sanji" } });
  const nami = await prisma.character.create({ data: { name: "Nami" } });

  // Photo 1: Anime Shelf
  const photo1 = await prisma.photo.create({
    data: { name: "Anime Shelf", photoUrl: "/images/op.png" },
  });
  await prisma.charactersOnPhotos.createMany({
    data: [
      { photoId: photo1.id, characterId: zoro.id, x: 300, y: 450, radius: 50 },
      { photoId: photo1.id, characterId: luffy.id, x: 820, y: 200, radius: 50 },
      { photoId: photo1.id, characterId: sanji.id, x: 970, y: 250, radius: 50 },
      { photoId: photo1.id, characterId: nami.id, x: 900, y: 300, radius: 50 },
    ],
  });

  // Photo 2: Beach Scene
  const photo2 = await prisma.photo.create({
    data: { name: "Beach Scene", photoUrl: "/images/op.png" },
  });
  await prisma.charactersOnPhotos.createMany({
    data: [
      { photoId: photo2.id, characterId: zoro.id, x: 300, y: 450, radius: 50 },
      { photoId: photo2.id, characterId: luffy.id, x: 820, y: 200, radius: 50 },
      { photoId: photo2.id, characterId: sanji.id, x: 970, y: 250, radius: 50 },
      { photoId: photo2.id, characterId: nami.id, x: 900, y: 200, radius: 50 },
    ],
  });

  // Photo 3: City Crowd
  const photo3 = await prisma.photo.create({
    data: { name: "City Crowd", photoUrl: "/images/op.png" },
  });
  await prisma.charactersOnPhotos.createMany({
    data: [
      { photoId: photo3.id, characterId: zoro.id, x: 300, y: 450, radius: 50 },
      { photoId: photo3.id, characterId: luffy.id, x: 820, y: 300, radius: 50 },
      { photoId: photo3.id, characterId: sanji.id, x: 970, y: 250, radius: 50 },
      { photoId: photo3.id, characterId: nami.id, x: 900, y: 200, radius: 50 },
    ],
  });

  console.log("Seeded 3 photos with characters");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
