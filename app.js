require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const passport = require("./config/passport");

const authRouter = require("./routes/auth");
const signUpRouter = require("./routes/signUp");
const sessionsRouter = require("./routes/sessions");
const gameRouter = require("./routes/game");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true);

			const allowedOrigins = [
				"http://localhost:3000",
				"http://localhost:3001",
				"http://localhost:5173",
				"http://localhost:5174",
			];

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Accept",
			"Authorization",
		],
		optionsSuccessStatus: 200,
	}),
);

app.use("/auth", authRouter);
app.use("/auth/signup", signUpRouter);
app.use("/sessions", sessionsRouter);
app.use("/game", gameRouter);
app.use("/leaderboard", leaderboardRouter);

app.use("/{*any}", (req, res) => {
	res.status(404).json({
		error: "Page not found",
		message: `Cannot ${req.method} ${req.originalUrl}`,
	});
});

app.use((err, req, res, next) => {
	console.error("Global error:", err.stack);

	// JWT errors
	if (err.name === "UnauthorizedError") {
		return res.status(401).json({ error: "Invalid token" });
	}

	// Validation errors
	if (err.name === "ValidationError") {
		return res
			.status(400)
			.json({ error: "Validation failed", details: err.message });
	}

	// Prisma errors
	if (err.code && err.code.startsWith("P")) {
		return res
			.status(400)
			.json({ error: "Database error", code: err.code });
	}

	// Default server error
	res.status(500).json({
		error: "Internal server error",
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong",
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
