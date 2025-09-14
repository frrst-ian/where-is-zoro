const { body } = require("express-validator");

const signUpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .normalizeEmail()
        .withMessage("Must be a valid email")
        .isLength({ max: 50 })
        .withMessage("Email must be under 50 characters"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be 3-20 characters")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Username can only contain letters, numbers, underscore, hyphen",
        ),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 128 })
        .withMessage("Password must be between 6-128 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Please confirm your password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

const loginValidator = [
    body("identifier")
        .trim()
        .notEmpty()
        .withMessage("Email or username is required")
        .isLength({ max: 50 })
        .withMessage("Identifier must be under 50 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1, max: 128 })
        .withMessage("Password must be under 128 characters")
];

module.exports = { signUpValidator, loginValidator };

