const passport = require('passport');
const validator = require('validator');
const User = require('../models/user');
const Cohort = require('../models/cohort');
const Activity = require('../models/activity');
const PreReg = require('../models/preReg');
const Category = require('../models/category');
const utils = require('../controllers/utils');
const crypto = require('crypto');

//let adminCohortExport = {}
module.exports.getLogin = (req, res) => {


   res.render("login.ejs", {
     title: "Login",
   });  
};

module.exports.postPreRegister = async (req, res, next) => {//I think this should be renamed?
  try {
    let found = false;
    const foundPreRegs = await PreReg.find({email: req.body.email.toLowerCase()});
    console.log(foundPreRegs);
    console.log(req.body.email);

    for (let i = 0; i < foundPreRegs.length; i++) {
      const credentials = foundPreRegs[i];  
      console.log("CREDENTIALS")
      console.log(credentials); 
      const testHash = await utils.hashPassword(req.body.password, credentials.salt,  (hash) => {
      console.log(`Hashed password with salt is: ${hash}`);
      });
      console.log("TEST HASH")
      console.log(testHash)
      console.log(typeof testHash);
      console.log("CREDENTIALS PASS")
      console.log(credentials.password);
      console.log(typeof credentials.password);
      console.log(credentials.password === testHash);

      if (credentials.password === testHash){
      const cohorts = await Cohort.find();
      found = true;
      res.render("register.ejs", {cohorts: cohorts});  
      break;
      }; 
    };
    if (found === false) {
    console.log("No Match was found")
    res.render("login.ejs", {title: "Login",})
    }     
  } catch (error) {
    console.log(error)
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
  //console.log (cohorts);
  //console.log(cohorts.length)
  //adminCohortExport = cohorts
  res.render("schoolAdmin", {cohorts: cohorts, user: req.user} );
  //console.log(adminCohortExport)
};



module.exports.getCohortAdmin = async (req, res) => {
  console.log('Get Cohort Admin Running')
  const cohort = await Cohort.findById(req.user.cohort._id);
  const activities = cohort.activities;
  const categories = cohort.categories;
  res.render("cohortAdmin",{ user: req.user, activities: activities, categories: categories});
};

module.exports.getActivityWaLAdmin = async (req, res) => {
  console.log("GET Admin Upload Activity WaL running");

  try {
    const cohort = await Cohort.findById(req.user.cohort._id);
    let activities = cohort.activities;
    //const categories = cohort.categories;
    console.log(activities.length)

    for(let i = activities.length - 1; i > -1; i--){ //loop fixed for splice
       if(activities[i].type !== 'WaL'){
       activities.splice(i, 1);
    }};    
    console.log("GetActivityWaLAdmin ran")
    res.render("activityWaLAdmin",{ user: req.user, activities: activities});

  
  
  } catch (error) {
  console.log ('There was an error')
  console.log(error)
  res.redirect('/register')   
  }
}

module.exports.getActivityDDAdmin = async (req, res) => {
  console.log("GET Admin Upload Activity DD running");

  try {
    const cohort = await Cohort.findById(req.user.cohort._id);
    const activities = [];
    for (let i = 0; i < cohort.activities.length; i++) {
      const element = cohort.activities[i];
      if (element.type === "DD"){
        activities.push(element);
    }};
    utils.sortAlpha(activities);
    const categories = cohort.categories;
    res.render("activityDDAdmin",{ user: req.user, activities: activities, categories: categories});

  
  
  } catch (error) {
  console.log ('There was an error')
  console.log(error)
  res.redirect('/register')   
  }
}

module.exports.getActivityPAdmin = async (req, res) => {
  console.log("GET Admin Upload Activity Phrases running");

  try {
    const cohort = await Cohort.findById(req.user.cohort._id);
    const activities = cohort.activities;
    const categories = cohort.categories;
    res.render("activityPAdmin",{ user: req.user, activities: activities, categories: categories});

  
  
  } catch (error) {
  console.log ('There was an error')
  console.log(error)
  res.redirect('/register')   
  }
}


module.exports.postRegister = async (req, res, next) => {
  console.log(req.body)

  try {
    const theCohort = await Cohort.findOne({cohortName: req.body.cohort});
    const salt = utils.salt();
    const hashedPassword = await utils.hashPassword(req.body.password, salt, (hash) => {
    console.log(`Hashed password with salt is: ${hash}`);
    });
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      salt: salt,
      email: req.body.email,
      cohort: {cohortName: theCohort.cohortName, _id: theCohort._id},
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nativeLanguage: req.body.nativeLanguage, 
      individualExercises: undefined,
      problemWords: undefined,
      cohortAdmin: undefined,
      reviewHistory: undefined,

   });
    req.logIn(user, async function (err) {

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

  const studentObject = {
        name: `${req.body.firstName} ${req.body.lastName}`,
        id: user._id,
        adminLevel: 0,};
  console.log(studentObject);
    theCohort.students.push(studentObject);
    await theCohort.save();  
} catch (error) {
  console.log ('There was an error')
  console.log(error)
  res.redirect('/register')   
  }
};

module.exports.postLogin = async (req, res, next) => {

  try {
  console.log('Starting Login');
  console.log(req.body);
  let matchFound = false;
  const newUser = req.body.username;
  const userMatches = await User.find({ username: newUser });
  console.log(userMatches);

  for (let i = 0; i < userMatches.length; i++) {
    const user = userMatches[i];
    const hashedPassword = await utils.hashPassword(req.body.password, user.salt, (hash) => {
    console.log(`Hashed password with salt is: ${hash}`);
    });
    console.log("HASHED PASSWORD");
    console.log(hashedPassword);
    console.log("USER PASSWORD")
    console.log(user.password);

    if (hashedPassword === user.password){
      req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/student"); 
      (req, res, next);
      console.log("You should be logged in...")
      console.log(user.username)
      });
      matchFound = true;
      break;
      }
  };
  if (matchFound === false){
    console.log('No Match Found')
    const failureMessage = "Your username or password were invalid.2"
    res.json(failureMessage);
};

} catch (error) {
    console.log(error);
  }
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


//cSpell:ignore Regs