const passport = require('passport');
const validator = require('validator');
const User = require('../models/user');
const Cohort = require('../models/cohort');
const Activity = require('../models/activity');
const PreReg = require('../models/preReg');
const Category = require('../models/category');
const utils = require('../controllers/utils');
const crypto = require('crypto');
const { Admin } = require('mongodb');
const Schools = require('../models/school');
const School = require('../models/school');

//let adminCohortExport = {}
module.exports.getLogin = async (req, res) => {
  try {
    demoCohorts = await Cohort.find({school: "Demos"});
    console.log(demoCohorts[0].language);
    let demosArray = [];
    for (let i = 0; i < demoCohorts.length; i++) {
      const element = demoCohorts[i];
      for (let i2 = 0; i2 < element.activities.length; i2++) {
        const ele = element.activities[i2];
        const demo = `${ele.description} (${element.language})`;
        console.log("demo element");
        console.log(demo);
        demosArray.push(demo);    
    }}; 
    res.render("login.ejs", {demos: demosArray}); 

  } catch (error) {
    console.log(error);
  }
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
  const cohorts = await Cohort.find();
  const schools = await Schools.find();
  //console.log (cohorts);
  //console.log(cohorts.length)
  //adminCohortExport = cohorts
  res.render("schoolAdmin", {cohorts: cohorts, schools: schools, user: req.user} );
  //console.log(adminCohortExport)
};

module.exports.getAdminDemo = async (req, res) => {
  let cohorts = [];
  try {
    const demoSchool = await Schools.findOne({schoolName: "Demos"});
    const cohortNames = demoSchool.cohorts;
    for (let i = 0; i < cohortNames.length; i++) {
      const element = cohortNames[i];
      const cohort = await Cohort.findOne({cohortName: element});
      const infoNeeded = {
        cohort: cohort.cohortName,
        activities: cohort.activities
      };
      cohorts.push(infoNeeded);
    };
  } catch (error) {
    console.log(error);
  }
  res.render("activityDemo", {cohorts: cohorts, user: req.user});
};

module.exports.runDemo = async (req, res) => {
  try {
    console.log(req.body);
    const selectionArray = req.body.demo.split(" ");
    console.log(selectionArray);
    const activityDescription = selectionArray[0];
    const cohort = selectionArray[1].slice(1, -1);
    console.log(cohort);
    const theCohort = await Cohort.findOne({language: cohort});
    console.log(theCohort.language);

    let activityVocab = [];
    let vocabList = [];
    let activity
   
      for (let i = 0; i < theCohort.activities.length; i++){
        if(theCohort.activities[i].description === activityDescription){
          activity = theCohort.activities[i];
        }};

    const reviewDD = async function (){
      activityVocab = activity.vocabWords;
      for (let i = 0; i < activityVocab.length; i++) {
        const activityWord = activityVocab[i];
        for (let index = 0; index < theCohort.vocabWords.length; index++) {
          const vocabWord = theCohort.vocabWords[index];
            if(activityWord === vocabWord.ident){
              vocabList.push(vocabWord);
      }}}; 

      res.render('demo', {vocabList: vocabList, activity: activityDescription, language: cohort});
    };

    const reviewWaL = function() {
      console.log(req.body.activity);
      res.render('studyWaL', {student: req.user, activity: activity});
    };

        
         if (activity.hasOwnProperty('type')){
            console.log(activity.type)
            if (activity.type === "WaL"){
               console.log("running WaL");
               reviewWaL();
            } else if (activity.type === "DD"){
               console.log("Running DD");
               reviewDD();
            } else {
               console.log('This Activity type has not ben set up yet.')
            };
            } else {reviewDD()};
    
  } catch (error) {
    console.log(error);
  };
};

module.exports.getSuperAdmin = async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.render("superAdmin", {cohorts: cohorts, user: req.user});
 
  } catch (error) {
    
}};

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
};




//cSpell:ignore Regs