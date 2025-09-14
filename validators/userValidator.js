const { body } = require("express-validator");

const signUpValidator = [
    body("identifier")
        .trim()
        .notEmpty()
        .withMessage("Email or username is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Email or username must be between 3-50 characters")
        .custom((value) => {
            // Check if it's an email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Check if it's a valid username (letters, numbers, underscores, hyphens)
            const usernameRegex = /^[a-zA-Z0-9_-]+$/;
            
            if (emailRegex.test(value)) {
                // It's an email - additional email validation
                if (value.length > 254) {
                    throw new Error('Email is too long');
                }
                return true;
            } else if (usernameRegex.test(value)) {
                // It's a username - additional username validation
                if (value.length < 3) {
                    throw new Error('Username must be at least 3 characters');
                }
                return true;
            } else {
                throw new Error('Must be a valid email or username (letters, numbers, underscore, hyphen only)');
            }
        }),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 128 })
        .withMessage("Password must be between 6-128 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    
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

module.exports = signUpValidator;