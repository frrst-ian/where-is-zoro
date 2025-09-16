const prisma = require("./prisma");

async function createSession(sessionId, photoId) {
    return await prisma.gameSession.create({
        data: {
            id: sessionId,
            photoId,
        },
    });
}

async function getSessionById(sessionId) {
    // Only return if not expired
    return await prisma.gameSession.findFirst({
        where: {
            id: sessionId,
            expiresAt: {
                gt: new Date(), 
            },
        },
    });
}

async function completeSession(sessionId) {
    return await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
            completed: true,
            endTime: new Date(),
        },
    });
}

async function cleanupExpiredSessions() {
    await prisma.gameSession.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(), 
            },
        },
    });
}

module.exports = { createSession,completeSession,getSessionById,cleanupExpiredSessions };
