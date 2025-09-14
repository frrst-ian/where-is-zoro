// Load environment variables
require("dotenv").config();

// Core dependencies
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Authentication
const passport = require("./config/passport");

// Route imports
const indexRouter = require("./routes/index");
const signUpRouter = require("./routes/signUp");


// App initialization
const app = express();
const PORT = process.env.PORT || 3000;

// JSON parser middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "http://localhost:5174",
        // Add your production URLs here
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

// Route handlers
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);


// Authentication route
app.post("/auth/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Authentication error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  })(req, res);
});

// 404 handler for undefined routes
app.use("/{*any}", (req, res) => {
  res.status(404).json({
    error: "Page not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
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
    return res.status(400).json({ error: "Database error", code: err.code });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});