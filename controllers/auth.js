const passport = require("passport");
const validator = require("validator");
const User = require("../models/user");
const Cohort = require("../models/cohort");
const Activty = require("../models/activity");

let adminCohortExport = {}
module.exports.getLogin = (req, res) => {


   res.render("login.ejs", {
     title: "Login",
   });  
};

module.exports.getRegister = async (req, res) => {
  const cohorts = await Cohort.find()
  res.render("register.ejs", {cohorts: cohorts});
};

module.exports.getAdminLogin = (req, res) => {
   res.render("adminLogin.ejs", {
   title: "AdminLogin",
   });
 };

module.exports.getAdmin = async (req, res) => {
  const cohorts = await Cohort.find()
  console.log (cohorts);
  console.log(cohorts.length)
  adminCohortExport = cohorts
  res.render("admin.ejs", {cohorts: cohorts} );
  console.log(adminCohortExport)
};

module.exports.adminCohortExport = adminCohortExport;

module.exports.getActivities = (req, res) => {
   res.render("activities.ejs", {
   title: "Activities",
    });
};

module.exports.postRegister = async (req, res, next) => {
  console.log(req.body)
  const user = await User.create({

      username: req.body.username,
      password: req.body.password,
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

   });
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      } else
      res.render("student", { user: req.user });
    });
 (req, res, next);
    console.log("You should be logged in...")
    console.log(user);

  console.log("You have been registered!");
  console.log(user)
  const cohort = await Cohort.findOne({cohortName:user.cohort})
  console.log(cohort)  
  const studentObject = {
        name: `${req.body.firstName} ${req.body.lastName}`,
        id: user._id,
        adminLevel: null,};
  console.log(studentObject);
    cohort.students.push(studentObject);
    await cohort.save(); //add try/catch for errors  
};

module.exports.postLogin = async (req, res, next) => {
  const newUser = req.body.username;
  console.log(newUser);
  const user = await User.findOne({ username: newUser });
  console.log(req.body.password)
  console.log(user.password)
  if (user.password === req.body.password) {
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.render("student", { user: req.user });
    });
 (req, res, next);
    console.log("You should be logged in...")
    console.log(user)
 } else{console.log("did't work")};

 // console.log(req.body)
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
   /*
   passport.authenticate("local", (err, user, info) => {
    console.log("passport.authenticate is running")
    if (err) {
      return next(err);
    }
    if (!user) {
      //req.flash("errors", info);
      return res.redirect("/login");
    }
    console.log(user)
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      //req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(/*req.session.returnTo || "student");
    });
  }) //(req, res, next);*/
 };

