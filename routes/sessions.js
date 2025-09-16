const {Router} = require('express');
const sessionsRouter = Router();
const sessionsController = require('../controllers/sessionsController');

sessionsRouter.post('/', sessionsController.createSession);
sessionsRouter.get('/', sessionsController.getSession);
sessionsRouter.put('/', sessionsController.completeSession);

module.exports = sessionsRouter;
