const passport = require("passport");
const validator = require("validator");
const User = require("../models/user");
const Cohort = require("../models/cohort");
const Activity = require("../models/activity");

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

module.exports.logout = (req, res, next) => {
  console.log("Starting to logout")
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect("/")
  });
 };

module.exports.getSchoolAdmin = async (req, res) => {
  const cohorts = await Cohort.find()
  console.log (cohorts);
  console.log(cohorts.length)
  adminCohortExport = cohorts
  res.render("schoolAdmin", {cohorts: cohorts} );
  console.log(adminCohortExport)
};

module.exports.adminCohortExport = adminCohortExport;

module.exports.getCohortAdmin = async (req, res) => {
  const cohorts = await Cohort.find()
  const activities = await Activity.find({cohort: req.user.cohort})
  console.log(activities);
  console.log (cohorts);
  console.log(cohorts.length)
  console.log(req.user)
  res.render("cohortAdmin",{cohorts: cohorts, user: req.user, activities: activities });
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
        adminLevel: 0,};
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
 };

