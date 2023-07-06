const passport = require("passport");
//const validator = require("validator");
const Cohort = require('../models/cohort');
const Activty = require('../models/activity');
const VocabWord = require('../models/vocabWord');

const adminController = require('../controllers/auth');

/*
module.exports.getStudentList = async (req, res, next) => {
    console.log(req.body)
    const cohort = await Cohort.find({cohortName: req.body.cohortSelection});
    
    console.log(cohort[0].students[0]);
    res.json(cohort);
};

module.exports.updateCohortAdmin = async (req, res, next) => {
    console.log(req.body)
};*/

    /*const updateduser = await ........({
      corhortAdmin: true
      });
      user.save()??

     console.log("Cohort Admin privliges updated.");

     res.redirect("/admin");*/
    