const { Router } = require("express");
const signUpRouter = Router();
const signUpController = require("../controllers/signUpController");
const { signUpValidator } = require("../validators/userValidator.js");

signUpRouter.post("/", signUpValidator, signUpController.postSignUp);

module.exports = signUpRouter;
