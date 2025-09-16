const { Router } = require("express");
const sessionsRouter = Router();
const sessionsController = require("../controllers/sessionsController");
const { optionalAuth } = require("../middleware/auth");

sessionsRouter.use(optionalAuth);
sessionsRouter.post("/", sessionsController.createSession);
sessionsRouter.get("/:sessionId", sessionsController.getSession);
sessionsRouter.put("/:sessionId/complete", sessionsController.completeSession);

module.exports = sessionsRouter;
