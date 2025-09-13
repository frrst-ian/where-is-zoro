const db = require("../models/queries")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require('bcryptjs');

passport.use(
    new LocalStrategy({ usernameField: 'identifier' }, async (identifier, password, done) => {
        try {
            const user = await db.getUserByEmailOrUsername(identifier);

            if (!user) {
                return done(null, false, { message: "Invalid credentials" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Invalid credentials" });
            }

            return done(null, user);
        } catch (err) {
            console.error('Authentication error:', err);
            return done(err);
        }
    })
);

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await db.getUserById(payload.userId);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;