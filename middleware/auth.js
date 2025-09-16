const passport = require("../config/passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = user || null;
    next();
  })(req, res, next);
};

module.exports = { authenticateJWT,optionalAuth };