const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: "userName"
    },
    function (username, password, done) {
        User.findOne({ username: userName}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }    
            if (!user.verifiedPassword(password)) {
                return done(null, user);
            }})}
        ));
}