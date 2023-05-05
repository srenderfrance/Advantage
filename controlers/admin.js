
const Cohort = require('../models/cohort');
const Activty = require('../models/activity');

module.exports.postcreateCohort = async (req, res, next) => { //change to postCohort
    
   const cohort = await Cohort.create({
        cohort: req.body.cohort,
        adminCode: req.body.admonCode,
        language: req.body.language,
        startDate: req.body.startDate,
        endDate: '',
        students: [],
        vocabWords: [],
        exercises: [],
        });
    console.log("A new class has been created!");
    console.log(cohort)
    res.redirect("userP.html");
   };

module.exports.postActivity = async (req, res, next) => {
   const activity = await Activty.create({
        cohort: req.body.cohort,
        date: req.body.date,
        desctiption: req.body.description,
        vocabWords: [],
   });
   console.log("A new activity has been created!");
   console.log(activity)
}