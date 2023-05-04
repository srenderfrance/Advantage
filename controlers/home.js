const User = require('../models/user')
module.exports.postRegister = async (req, res, next) => {
    
   const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        className: req.body.className,
        nativeLanguage: req.body.nativeLanguage,
        hasReviewed: [],
        individualExercises: [],
        problemWords: [],
        });
    console.log("You have been registered!");
    console.log(user)
    res.redirect("login.html");
   }

module.exports.postLogin = async (req, res, next) => {
    
    
     console.log("You have been logged in!");
     //console.log(user)
     res.redirect("userP.html");
    }