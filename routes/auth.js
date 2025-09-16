const {Router} = require('express');
const authRouter = Router();
const authController = require('../controllers/authController');
const {loginValidator} = require('../validators/userValidator');

authRouter.post('/login', loginValidator, authController.postLogin);

module.exports = authRouter;
