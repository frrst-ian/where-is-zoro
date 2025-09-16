const prisma = require("./prisma");

async function createSession(sessionId, photoId) {
    return await prisma.gameSession.create({
        data: {
            id: sessionId,
            photoId,
        },
    });
}

module.exports = { createSession };
