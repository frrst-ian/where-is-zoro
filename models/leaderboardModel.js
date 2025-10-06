const prisma = require("./prisma");

async function saveScore(sessionId, playerName) {
    const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        select: {
            startTime: true,
            endTime: true,
            completed: true,
        },
    });

    if (!session || !session.completed || !session.endTime) {
        throw new Error("Invalid session");
    }

    const timeInSeconds = Math.floor(
        (new Date(session.endTime) - new Date(session.startTime)) / 1000
    );

    return await prisma.leaderboard.create({
        data: {
            playerName,
            timeInSeconds,
            gameSessionId: sessionId,
        },
    });
}

async function getTopScores(limit = 10) {
    return await prisma.leaderboard.findMany({
        orderBy: {
            timeInSeconds: "asc",
        },
        take: limit,
        select: {
            id: true,
            playerName: true,
            timeInSeconds: true,
            createdAt: true,
        },
    });
}

module.exports = { saveScore, getTopScores };