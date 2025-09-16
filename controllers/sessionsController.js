const sessionModel = require('../models/sessionModel');

async function createSession(req, res, next) {
	try {
		const sessionId = crypto.randomUUID();

		const session = await sessionModel.createSession({
			id: sessionId,
			startTime: new Date(),
		});

		return res.status(201).json(
			{sessionId: session.id, startTime: session.startTime});
	} catch (error) {
		res.status(500).json({error: 'Failed to create session'});
	}
}

async function getSession(req, res, next) {}

async function completeSession(req, res, next) {}

module.exports = {
	createSession,
	getSession,
	completeSession,
};
