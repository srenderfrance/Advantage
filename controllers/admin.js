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
   res.json(cohort);
 };
 
 module.exports.updateCohortAdmin = async (req, res, next) => {
   console.log(req.body.infoToSend)
   let studentId = req.body.infoToSend[0];
   let cohortSelection = req.body.infoToSend[1];
   console.log(`This is the studentId: ${studentId} and this is their cohort: ${cohortSelection}`)
   /*let studentId = `OjectId(${req.body.studentId})`
   console.log(studentId)*/
   let student = await User.findById(studentId);
   console.log(student);
   if (student.adminLevel === null) {
   student.adminLevel = 1;
   await student.save();
   } else console.log(`${student.username} already has admin privlieges.`);
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === null){
            studentArray[i].adminLevel = 1;
            console.log(studentArray)
            cohort.students = studentArray;
            cohort.markModified('students');
            console.log(`This is cohort.students`)
            console.log(cohort.students)
            await cohort.save();
            console.log("It should have saved")
         };
 }};

 module.exports.removeCohortAdmin = async (req, res, next) => {
   console.log(req.body.infoToSend)
   let studentId = req.body.infoToSend[0];
   let cohortSelection = req.body.infoToSend[1];
   console.log(`This is the studentId: ${studentId} and this is their cohort: ${cohortSelection}`)
   /*let studentId = `OjectId(${req.body.studentId})`
   console.log(studentId)*/
   let student = await User.findById(studentId);
   console.log(student);
   if (student.adminLevel === 1) {
   student.adminLevel = null;
   await student.save();
   } else console.log(`${student.username} already has admin privlieges.`);
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === 1){
            studentArray[i].adminLevel = null;
            console.log(studentArray)
            cohort.students = studentArray;
            cohort.markModified('students');
            console.log(`This is cohort.students`)
            console.log(cohort.students)
            await cohort.save();
            console.log("It should have saved")
         };
 }};