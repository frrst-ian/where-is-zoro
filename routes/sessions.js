const { Router } = require("express");
const sessionsRouter = Router();
const sessionsController = require("../controllers/sessionsController");

sessionsRouter.post("/", sessionsController.createSession);
sessionsRouter.get("/:sessionId", sessionsController.getSession);
sessionsRouter.put("/:sessionId", sessionsController.completeSession);

module.exports = sessionsRouter;
