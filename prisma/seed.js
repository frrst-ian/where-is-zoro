const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  await prisma.charactersOnPhotos.deleteMany();
  await prisma.character.deleteMany();
  await prisma.photo.deleteMany();

  const zoro = await prisma.character.create({ data: { name: "Zoro" } });
  const luffy = await prisma.character.create({ data: { name: "Luffy" } });
  const sanji = await prisma.character.create({ data: { name: "Sanji" } });
  const nami = await prisma.character.create({ data: { name: "Nami" } });

  const photo = await prisma.photo.create({
    data: { name: "one piece", photoUrl: "/images/one_peak.png" },
  });
  await prisma.charactersOnPhotos.createMany({
    data: [
      { photoId: photo.id, characterId: zoro.id, x: 1095, y: 150, radius: 20 },
      { photoId: photo.id, characterId: luffy.id, x: 980, y: 220, radius: 30 },
      { photoId: photo.id, characterId: sanji.id, x: 910, y: 560, radius: 15 },
      { photoId: photo.id, characterId: nami.id, x: 655, y: 1050, radius: 15 },
    ],
  });

  console.log("seeding done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
