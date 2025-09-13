const passport = require("../config/passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

module.exports = { authenticateJWT };