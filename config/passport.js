const LocalStrategy = require("passport-local").Strategy;
//const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user");
//const passport = require("passport");

module.exports = function (passport) {
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
};