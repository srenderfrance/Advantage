const User = require('../models/user')
const Cohort = require('../models/cohort');
const Activty = require('../models/activity');

module.exports.getLogin = (req, res) => {
   /*if (req.user) {
     return res.redirect("/profile");
   }*/
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
    
    
   console.log("You have been logged in!");
   //console.log(user);
   res.redirect("userP.html");
}

