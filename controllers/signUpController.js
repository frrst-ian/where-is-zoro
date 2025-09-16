const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

async function postSignUp(req, res, next) {
	try {
		const errors = validationResult(req);
		const { email, username, password } = req.body;

		if (!errors.isEmpty()) {
			return res.status(400).json({
				error: "Validation failed",
				details: errors.array(),
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await userModel.createUser(
			email,
			username,
			hashedPassword,
		);

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		res.status(201).json({
			token,
			user: { id: user.id, email: user.email, username: user.username },
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

module.exports = { postSignUp };
