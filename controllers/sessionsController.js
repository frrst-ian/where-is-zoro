const crypto = require("crypto");
const sessionModel = require("../models/sessionModel");

async function createSession(req, res, next) {
    try {
        const sessionId = crypto.randomUUID();
        // Hardcode photoId=1 for now
        const session = await sessionModel.createSession(sessionId, 1);

        return res.status(201).json({
            sessionId: session.id,
            startTime: session.startTime,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create session" });
    }
}

async function getSession(req, res) {
    try {
        const { sessionId } = req.params;
        const session = await sessionModel.getSessionById(sessionId);
        
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json({
            sessionId: session.id,
            startTime: session.startTime,
            completed: session.completed,
            // Add clicks/progress here later
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get session" });
    }
}

async function completeSession(req, res) {
    try {
        const { sessionId } = req.params;
        const session = await sessionModel.completeSession(sessionId);
        
        res.json({
            sessionId: session.id,
            totalTime: session.endTime - session.startTime
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to complete session" });
    }
}

module.exports = {
    createSession,
    getSession,
    completeSession,
};
