const { Router } = require("express");
const signUpRouter = Router();
const signUpController = require("../controllers/signUpController");

signUpRouter.get("/", signUpController.getSignUp);
signUpRouter.post("/", signUpController.postSignUp);

module.exports = signUpRouter;
