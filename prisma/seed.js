const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

async function main() {
  // Create photo
  const photo = await prisma.photo.create({
    data: {
      name: "Anime Shelf",
      photoUrl: "https://unsplash.com/photos/anime-character-collage-photo-on-black-wooden-shelf-IxDPZ-AHfoI"
    }
  })

  // Create characters
  const char1 = await prisma.character.create({ data: { name: "Zoro" } })
  const char2 = await prisma.character.create({ data: { name: "Luffy" } })

  // Add characters to photo with coordinates (you'll need to guess these)
await prisma.charactersOnPhotos.createMany({
  data: [
    { photoId: photo.id, characterId: char1.id, x: 1521, y: 289, radius: 50 },
    { photoId: photo.id, characterId: char2.id, x: 1559, y: 205, radius: 50 }
  ]
})
}

main().catch(console.error).finally(() => prisma.$disconnect())