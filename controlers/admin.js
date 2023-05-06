
const Cohort = require('../models/cohort');
const Activty = require('../models/activity');

module.exports.postCohort = async (req, res, next) => {
    
   const cohort = await Cohort.create({
      cohortName: req.body.cohort,
      language: req.body.language,
      startDate: req.body.startDate,
      Activities: undefined,
      endDate: undefined, 
      students: undefined,
      vocabWords: undefined,
      activities: undefined,
     })

    console.log("A new class has been created!");
    console.log(cohort)
    res.redirect("userP.html");
   };

module.exports.postActivity = async (req, res, next) => {
   const activity = await Activty.create({
        cohort: req.body.cohort,
        date: req.body.date,
        desctiption: req.body.description,
        vocabWords: undefined,

   });
   console.log("A new activity has been created!");
   console.log(activity)
}