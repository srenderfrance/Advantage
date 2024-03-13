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
    console.log(req.body.email);

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
  //console.log (cohorts);
  //console.log(cohorts.length)
  //adminCohortExport = cohorts
  res.render("schoolAdmin", {cohorts: cohorts} );
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
    console.log("GetActivitWaLAdmin ran")
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
   //console.log(theCohort);
  
  const user = await User.create({

      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      cohort: {cohortName: theCohort.cohortName, _id: theCohort._id},
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nativeLanguage: req.body.nativeLanguage, 
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
  const newUser = req.body.username;
  const user = await User.findOne({ username: newUser });
  //console.log(user.password)
  //console.log(user.username)
    if (user === null){
    console.log('Equals NULL')
    const failureMessage = "Your username or password were invalid.1"
    res.json(failureMessage);
  } else if (user.password === req.body.password) {
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/student");  
    });
 (req, res, next);
    console.log("You should be logged in...")
    console.log(user.username)
 } else {
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
