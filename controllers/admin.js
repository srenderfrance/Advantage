const passport = require("passport");
//const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");


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
    res.redirect("/admin/schoolAdmin");
   };

module.exports.postActivity = async (req, res, next) => {
   const activity = await Activity.create({
        cohort: req.user.cohort,
        date: req.body.date,
        description: req.body.description, //activity names need to be unique with a cohort
        vocabWords: []

   });
   console.log("A new activity has been created!");
   console.log(activity);
   const cohort = await Cohort.findOne({cohortName:activity.cohort})
   cohort.activities.push(activity._id);
   await cohort.save(); //add try/catch for errors  
   res.redirect("/admin");
};

module.exports.postVocabWord = async (req, res, next) => {
   //const result = await cloudinary.uploader.upload(req.file.path); //need to figure out how to have 3
   console.log(req.body)
   const activity = await Activity.where("description").equals(req.body.activity).where("cohort").equals(req.user.cohort);
   console.log(activity[0]._id)
   const vocabWord = await VocabWord.create({
       cohort: req.user.cohort,
       description: req.body.description,
       activity: activity[0]._id,
       category: req.body.category,
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
   const activities = await Activity.find({cohort: req.user.cohort})    
   console.log("A new vocab word has been created!");
   console.log(vocabWord);
   res.render("cohortAdmin", {user: req.user, cohort: req.user.cohort, activities: activities})
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
   if (student.adminLevel === 0) {
   student.adminLevel = 1;
   await student.save();
   } else {console.log(`${student.username} already has admin privlieges.`);
};
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === 0){
            studentArray[i].adminLevel = 1;
            console.log(studentArray)
            cohort.students = studentArray;
            cohort.markModified('students');
            console.log(`This is cohort.students`)
            console.log(cohort.students)
            await cohort.save();
            console.log("It should have saved")
        
         }}; 
 res.redirect(308, "/admin/schoolAdmin", { user: req.user });
};

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
   student.adminLevel = 0;
   await student.save();
   } else console.log(`${student.username} cannot remove admin privlieges.`);
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === 1){
            studentArray[i].adminLevel = 0;
            console.log(studentArray)
            cohort.students = studentArray;
            cohort.markModified('students');
            console.log(`This is cohort.students`)
            console.log(cohort.students)
            await cohort.save();
            console.log("It should have saved")
           
         };
       
 }; res.redirect(308, "/admin/schoolAdmin");
};
module.exports.postVocab = async (req, res, next) => {
   console.log(req.body)
}
module.exports.getActivity = async (req, res, next) => {
   const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
   res.json(activitySelection);
}