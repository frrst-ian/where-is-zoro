const { Router } = require("express");
const signUpRouter = Router();
const signUpController = require("../controllers/signUpController");
const { userValidator } = require("../validators/userValidator.js");

signUpRouter.post("/",userValidator, signUpController.postSignUp);

module.exports = signUpRouter;
