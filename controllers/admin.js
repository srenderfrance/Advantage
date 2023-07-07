const passport = require("passport");
//const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const Activty = require('../models/activity');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");


module.exports.postCohort = async (req, res, next) => {
   console.log(req.body)
    
   const cohort = await Cohort.create({
      cohortName: req.body.cohortName,
      language: req.body.language,
      startDate: req.body.startDate,
      Activities: undefined,
      endDate: undefined, 
      students: undefined,
      vocabWords: undefined,
      activities: undefined,
     });

    console.log("A new class has been created!");
    console.log(cohort)
    res.redirect("/admin");
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
};

module.exports.postVocabWord = async (req, res, next) => {
   const result = await cloudinary.uploader.upload(req.file.path); //need to figure out how to have 3

   const vocabWord = await VocabWord.create({
       cohort: req.body.cohort,
       description: req.body.description,
       activity: req.body.excersise,
       imageUrl: undefined,
       cloudinaryIdImage: undefined,
       audioQ: undefined,
       cloudinaryIdQ: undefined,
       audioW: undefined,
       cloudinaryIdW: undefined,

       /* Need to figure out how to add these!
        image: result.secure_url, 
       cloudinaryIdImage: result.public_id,
       audioQ: result.secure_url,  
       cloudinaryIdQ: result.public_id,
       audioW: result.secure_url,
       cloudinaryIdW: result.public_id,*/

       });
   console.log("A new vocab word has been created!");
   console.log(VocabWord);
  };

  module.exports.getStudentList = async (req, res, next) => {
   console.log(req.body)
   const cohort = await Cohort.find({cohortName: req.body.cohortSelection});
   
   console.log(cohort);
   res.json(cohort);
 };
 
 module.exports.updateCohortAdmin = async (req, res, next) => {
   console.log(req.body.studentId)
   let studentId = `OjectId(${req.body.studentId})`
   console.log(studentId)
   let student = await User.findById(req.body.studentId);
   console.log(student);
   student.corhortAdmin = true;
   await student.save();
    //cohortAdmin: true
   //let student = await User.findById(req.body.studentId);
     // {$set: {corhortAdmin: true}});
   //console.log(student);

 };