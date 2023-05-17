const passport = require("passport")
const validator = require("validator")
const User = require("../models/user")
const Cohort = require("../models/cohort");
const Activty = require("../models/activity");

module.exports.getLogin = (req, res) => {


   res.render("login.ejs", {
     title: "Login",
   });  
};

module.exports.getRegister = (req, res) => {
   res.render("register.ejs", {
   title: "Register",
   });
};

module.exports.getAdminLogin = (req, res) => {
   res.render("adminLogin.ejs", {
   title: "AdminLogin",
   });
 };

module.exports.getAdmin = (req, res) => {
      res.render("admin.ejs", {
      title: "Admin",
       });
};

module.exports.getActivities = (req, res) => {
   res.render("activities.ejs", {
   title: "Activities",
    });
};

module.exports.postRegister = async (req, res, next) => {
    
   const user = await User.create({

      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      cohort: req.body.cohort,
      nativeLanguage: req.body.nativeLanguage,
      hasReviewed: undefined,
      individualExercises: undefined,
      problemWords: undefined,
      corhortAdmin: undefined,

   });

    console.log("You have been registered!");
    console.log(user)
    res.redirect("/");
   }

module.exports.postLogin = async (req, res, next) => {
   const validationErrors = [];
   if (!validator.isEmty(req.body.userName))
     validationErrors.push({ msg: "User Name cannot be black." });
   if (validator.isEmpty(req.body.password))
     validationErrors.push({ msg: "Password cannot be blank." });
 
   if (validationErrors.length) {
     req.flash("errors", validationErrors);
     return res.redirect("/");
   }
   req.body.email = validator.normalizeEmail(req.body.email, {
     gmail_remove_dots: false,
   });
 
   passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/student");
    });
  })//(req, res, next);
 };
  