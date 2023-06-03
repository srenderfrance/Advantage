const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: userName }, async (userName, password, done) => {
      try {
        const user = await User.findOne({ userName: userName });
        if (!user) {
          return done(null, false, { msg: `${userName} not found.` });
        }
        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid email or password." });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

/*const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: "userName"
    },
    function (userName, password, done) {

        

        User.findOne({ userName: userName}, function (err, user) {
            console.log(user)
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
}*/