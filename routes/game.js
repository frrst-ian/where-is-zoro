const { Router } = require("express");
const gameRouter = Router();
const gameController = require("../controllers/gameController");

gameRouter.post("/validate-click", gameController.validateClick);

module.exports = gameRouter;
