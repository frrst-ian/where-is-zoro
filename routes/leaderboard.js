const { Router } = require("express");
const leaderboardRouter = Router();
const leaderboardController = require("../controllers/leaderboardController");

leaderboardRouter.post("/", leaderboardController.submitScore);
leaderboardRouter.get("/", leaderboardController.getLeaderboard);

module.exports = leaderboardRouter;