const passport = require("passport");
const validator = require("validator");
//const passportLocalMongoose = require('passport-local-mongoose')
const User = require("../models/user");
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

module.exports.postRegister = function (req, res) {
 // console.log(req.body)
  User.register( new User ({

      username: req.body.username,
      email: req.body.email,
      cohort: req.body.cohort,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nativeLanguage: req.body.nativeLanguage,
      hasReviewed: undefined,
      individualExercises: undefined,
      problemWords: undefined,
      corhortAdmin: undefined,
      reviewHistory: undefined,

   }), req.body.password, function async (err, user) {
    if (err) {
        res.json({ success: false, message: "Your account could not be saved. Error: " + err });
    }
    else  { res.redirect("/")}
  })},  
    
   
   

module.exports.postLogin = (req, res, next) => {
  console.log(req.body)
  /* const validationErrors = [];
   if (validator.isEmpty(req.body.userName))
     validationErrors.push({ msg: "User Name cannot be blank." });
   if (validator.isEmpty(req.body.password))
     validationErrors.push({ msg: "Password cannot be blank." });
 
   if (validationErrors.length) {
     //req.flash("errors", validationErrors);
     return res.redirect("/");
   }
   console.log("validated")
   //console.log (user) */
   //next()
   
   passport.authenticate("local", {
    successRedirect: '/student',
    failureRedirect: '/l',
    failureFlash: true // allow flash messages
    })(req, res, next);


    console.log("passport.authenticate finished");
    console.log(passport.session.user)
    res.redirect(/*req.session.returnTo ||*/ "/student");
   
  };

  module.exports.getLogout = function (req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  };
  