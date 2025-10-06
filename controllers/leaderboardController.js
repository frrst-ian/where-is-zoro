const leaderboardModel = require("../models/leaderboardModel");

async function submitScore(req, res) {
    try {
        const { sessionId, playerName } = req.body;

        if (!sessionId || !playerName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const score = await leaderboardModel.saveScore(sessionId, playerName);

        res.status(201).json({
            id: score.id,
            playerName: score.playerName,
            timeInSeconds: score.timeInSeconds,
        });
    } catch (error) {
        console.error("Submit score error:", error);
        res.status(500).json({ error: error.message || "Failed to submit score" });
    }
}

async function getLeaderboard(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const scores = await leaderboardModel.getTopScores(limit);

        res.json(scores);
    } catch (error) {
        console.error("Get leaderboard error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
}

module.exports = { submitScore, getLeaderboard };