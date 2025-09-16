const prisma = require("./prisma");

async function findCharacter(charId) {
  return await prisma.charactersOnPhotos.findFirst({
    where: { characterId: charId },
    include: {
      character: true, 
    },
  });
}

module.exports = { findCharacter };
