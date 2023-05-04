
const Cohort = require('../models/cohort');


module.exports.postcreateCohort = async (req, res, next) => {
    
   const cohort = await Cohort.create({
        cohortName: req.body.cohortName,
        adminCode: req.body.admonCode,
        language: req.body.language,
        startDate: req.body.className,
        endDate: '',
        students: [],
        vocabWords: [],
        exercises: [],
        });
    console.log("A new class has been created!");
    console.log(Cohort)
    res.redirect("userP.html");
   }