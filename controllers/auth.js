const passport = require('passport');
const validator = require('validator');
const User = require('../models/user');
const Cohort = require('../models/cohort');
const Activity = require('../models/activity');
const PreReg = require('../models/preReg');
const Category = require('../models/category')

//let adminCohortExport = {}
module.exports.getLogin = (req, res) => {


   res.render("login.ejs", {
     title: "Login",
   });  
};

module.exports.postPreRegister = async (req, res, next) => {
  try {
    const credentials = await PreReg.find({password: req.body.password});
    console.log(credentials);

    if(req.body.email.toLowerCase() === credentials[0].email){

    const cohorts = await Cohort.find()
    res.render("register.ejs", {cohorts: cohorts});  

     } else  {
      console.log('The else ran')
      res.render("login.ejs", {title: "Login",})
    }
  } catch (error) {
    console.log("It didn't work")
     res.render("login.ejs", {
     title: "Login",
   });
  
}};

module.exports.getRegister = async (req, res) => {
  const cohorts = await Cohort.find()
  res.render("register.ejs", {cohorts: cohorts});
};

module.exports.logout = (req, res, next) => {
  console.log("Starting to logout")
    req.logout(function(err) {
      if (err) { return next(err); }
      console.log('redirecting after Logout')
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

//module.exports.adminCohortExport = adminCohortExport;

module.exports.getCohortAdmin = async (req, res) => {
  console.log('Get Cohort Admin Running')
  const activities = await Activity.find({cohort: req.user.cohort})
  //console.log(activities);
  //console.log(req.user);
  const categories = await Category.find({});
  res.render("cohortAdmin",{ user: req.user, activities: activities, categories: categories});
};

module.exports.postRegister = async (req, res, next) => {
  console.log(req.body)

  try {
  
  
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
    req.logIn(user, async function (err) {
       let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
      console.log(activities);


      if (err) {
        return next(err);
      } else
      
      res.redirect("/student");

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
} catch (error) {
  console.log ('There was an error')
  console.log(error)
  res.redirect('/register')   
  }
};

module.exports.postLogin = async (req, res, next) => {
  const newUser = req.body.username;
  console.log(newUser);
  const user = await User.findOne({ username: newUser });
  console.log(req.body.password)
  console.log(user.password)
  if (user.password === req.body.password) {
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      //let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
      res.redirect("/student") /*, { student: req.user, activities: activities});//need to make this a redirect it may cause resubmission of form
    */ });
 (req, res, next);
    console.log("You should be logged in...")
    console.log(user)
 } else{console.log("did't work")};
 };

module.exports.checkUsername = async (req, res) => {
  try {
    let isUsed;
    const username = req.body.username;
    const result = await User.exists({username: username});
    if (result !== null){
      isUsed = true;
    } else {isUsed = false};
    console.log(isUsed);
    res.json({isUsed: isUsed});
  } catch (error) {
    console.log(error);
  };
}
