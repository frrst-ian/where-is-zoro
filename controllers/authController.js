const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

async function postLogin(req, res, next) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				error: 'Validation failed',
				details: errors.array(),
			});
		}

		passport.authenticate(
			'local',
			{session: false},
			(err, user, info) => {
				if (err) {
					return res.status(500).json(
						{error: 'Authentication error'});
				}
				if (!user) {
					return res.status(401).json({
						error: info?.message || 'Invalid credentials',
					});
				}

				const token = jwt.sign(
					{userId: user.id, email: user.email},
					process.env.JWT_SECRET,
					{expiresIn: '7d'},
				);

				res.json({
					token,
					user: {
						id: user.id,
						email: user.email,
						username: user.username,
					},
				});
			},
			)(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: 'Internal Server Error'});
	}
}

module.exports = {postLogin};
