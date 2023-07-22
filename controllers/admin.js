const passport = require("passport");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const ObjectId = require('mongodb').ObjectId;

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
module.exports.getActivityVocab = async (req, res, next) => {
   console.log(req.body)
   const activityDescription = req.body.activity;
   const activity = await Activity.where("description").equals(activityDescription);
   console.log(activity[0]._id);
   const vocabList = await VocabWord.where("activity").equals(activity[0]._id);
   console.log(vocabList);
   res.json({vocabList: vocabList});
};
module.exports.getActivity = async (req, res, next) => {
  
const cohort = req.user.cohort 
const activity = req.body.activity 
const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
console.log(activitySelection);
console.log(activity.vocabWords);
  
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
   let activity = await Activity.where("description").equals(req.body.activity).where("cohort").equals(req.user.cohort);
   //console.log(activity[0]._id)
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
       });

   activity = activity[0];
   console.log("A new vocab word has been created!");
   console.log(vocabWord._id);
   
   console.log(activity.vocabWords)
   //activity.vocabwords.push(id); //this isn't working not sure why!
  // await activity.save()
   const activities = await Activity.find({cohort: req.user.cohort})    
   
   res.render("cohortAdmin", {user: req.user, cohort: req.user.cohort, activities: activities})
  };

  module.exports.postVocabImage = async (req, res, next) => {
 
   console.log("req.body.vocabWord is");
   console.log(req.body.vocabWord);
   try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      //console.log(result)
      let vocabWord = await VocabWord.find({_id:new ObjectId(req.body.vocabWord)});
      vocabWord = vocabWord[0];
      console.log("next is vocabWord")
      console.log(vocabWord);
      vocabWord.cloudinaryIdImage = result.public_id;
      vocabWord.imageUrl = result.secure_url;
      vocabWord = await vocabWord.save();
      //console.log(res)
     
      console.log("The image was uploaded!");
      
    } catch (err) {
      console.log(err);
    }
    const activities = await Activity.find({cohort: req.user.cohort})    
    res.render("cohortAdmin", {user: req.user, cohort: req.user.cohort, activities: activities}); 
   };
module.exports.postAudios = async (req, res, next) => {
   console.log(req.body)
   console.log("req.body.vocabWord is");
   console.log(req.body.vocabWord);
   console.log(req.files);
   console.log("audioT0 path");
   console.log(req.files.audioT[0].path)
   try {
   let vocabWord = await VocabWord.find({_id:new ObjectId(req.body.vocabWord)});
   vocabWord = vocabWord[0];
   console.log("next is vocabWord")
   console.log(vocabWord);

   const result = await cloudinary.uploader.upload(req.files.audioT[0].path, { resource_type: "auto"});
   
   vocabWord.cloudinaryIdTis = result.public_id;
   vocabWord.audioTis = result.secure_url;
   

   const result2 = await cloudinary.uploader.upload(req.files.audioQ[0].path, { resource_type: "auto"});
   vocabWord.cloudinaryIdQ = result2.public_id;
   vocabWord.audioQ = result2.secure_url;

   const result3 = await cloudinary.uploader.upload(req.files.audioN[0].path, { resource_type: "auto"});
   vocabWord.cloudinaryIdN = result3.public_id;
   vocabWord.audioN = result3.secure_url;

   vocabWord = await vocabWord.save();
} catch (err) {
   console.log(err);
 }
   const activities = await Activity.find({cohort: req.user.cohort})    
    res.render("cohortAdmin", {user: req.user, cohort: req.user.cohort, activities: activities}); 
}

module.exports.deleteMedia = async (req, res, next) => {
   console.log(req.body.toDelete)
}