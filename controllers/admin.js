const passport = require("passport");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWordSubdoc = require('../models/vocabWord');
const User = require("../models/user");
const ActivitySubdoc = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const PreReg = require("../models/preReg");
const e = require("express");
const { ConnectionPoolReadyEvent } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const multer = require("multer");
const crypto = require('crypto');
const utils = require('../controllers/utils');
//const Category = require('../models/category');


module.exports.postCohort = async (req, res, next) => {
   console.log(req.body)
    
   const cohort = await Cohort.create({
      cohortName: req.body.cohortName,
      language: req.body.language,
      startDate: req.body.startDate,
      Activities: [], 
      students: [],
      
     });

    console.log("A new class has been created!");
    console.log(cohort)
    res.redirect("/admin/schoolAdmin");
   };

module.exports.createReg = async (req, res, next) => {
const salt = utils.salt();
console.log("SALT")
console.log(salt)
const password = req.body.password;
const hashedPassword = await utils.hashPassword(password, salt, (hash) => {
   console.log(`Hashed password with salt is: ${hash}`);

});
console.log("Hashed Pass")
console.log(hashedPassword);  
const newPreReg = await PreReg.create({
      email: req.body.email.toLowerCase(),
      salt: salt,
      password: hashedPassword,
   });
/*
  
*/



res.redirect("/admin/schoolAdmin");
};

module.exports.getStudentList = async (req, res, next) => {
   const cohort = await User.find({"cohort.cohortName": req.body.cohortSelection});
   console.log(cohort)
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
   if (student.adminLevel === 0) {
   student.adminLevel = 1;
   await student.save();
   } else {console.log(`${student.username} already has admin privileges.`);
   window.alert(`${student.username} already has admin privileges.`);
};
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studentArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === 0){
            studentArray[i].adminLevel = 1;
            cohort.students = studentArray;
            cohort.markModified('students');
            console.log(`This is cohort.students`)
            //console.log(cohort.students)
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
   if (student.adminLevel === 1) {
   student.adminLevel = 0;
   await student.save();
   } else console.log(`${student.username} cannot remove admin privileges.`);
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studentArray ${studentArray}`);
   console.log(studentArray);
    for (let i = 0; i < studentArray.length; i++) {    
         if (studentId === studentArray[i].id.toString() && studentArray[i].adminLevel === 1){
            studentArray[i].adminLevel = 0;
            cohort.students = studentArray;
            cohort.markModified('students');
            await cohort.save();
            console.log("It should have saved")
           
         };
       
 }; res.redirect(308, "/admin/schoolAdmin");
};

module.exports.getActivityVocab = async (req, res, next) => {
   console.log('getActivityVocab is running')
   try {
      const activityDescription = req.body.activity;
      const cohort = await Cohort.findById(req.user.cohort._id);
      let activityInfo = {
         date: Date,
         subType: "",
         number: Number,
      };
      let activityVocab
      let vocabList = [];
         for (let i = 0; i < cohort.activities.length; i++) {
            const element = cohort.activities[i];
            if (element.description === activityDescription){
               console.log(element)
               activityVocab = element.vocabWords;
               activityInfo.date = element.date;
               activityInfo.subType = element.subType;
               activityInfo.number = element.activityNumber;
            }};
      //console.log("activityVocab")
      //console.log(activityVocab);
      if (activityVocab !== undefined){
      for (let i = 0; i < activityVocab.length; i++) {
         const element1 = activityVocab[i];

         //console.log("element 1");
        // console.log(element1);

         for (let i = 0; i < cohort.vocabWords.length; i++) {
            const element2 = cohort.vocabWords[i];

           // console.log("element2");
           // console.log(element2);

            if(element1 === element2.ident) {
               vocabList.push(element2);
      }}}}; 

   console.log(activityInfo);
   res.json({vocabList: vocabList, activityInfo: activityInfo});

} catch (error) {
   console.log(error);
}};

module.exports.postActivity = async (req, res) => {
   try {
      let activityNameIsUsed = false;
      let bodyObjectEmpty = false;

      console.log("Post Activity is running");
      //console.log("REQ") 
      console.log(req.get('Content-Type'));
      console.log(req.body)
      if (Object.keys(req.body).length === 0){
         bodyObjectEmpty = true;
         res.json({bodyObjectEmpty, activityNameIsUsed})
      } else {
      const theCohort = await Cohort.findById(req.user.cohort._id);
      for (let i = 0; i < theCohort.activities.length; i++) {
         const element = theCohort.activities[i];
         if(element.description === req.body.description){
            activityNameIsUsed = true;
            console.log("There was a match")
      }};
      if (activityNameIsUsed === true){
         res.json({bodyObjectEmpty, activityNameIsUsed});
      } else {
      
      const activity = {
           date: req.body.date,
           description: req.body.description,
           vocabWords: [],
           reviewedBy: [],
           type: req.body.type,
           ready: false,
           subType: "",
           activityNumber: req.body.activityNumber,
           additionalInfo: [],

      };
      theCohort.activities.push(activity);
      await theCohort.save(); 
      //console.log(theCohort.activities);

      console.log("A new activity has been created!");

      res.json({bodyObjectEmpty, activityNameIsUsed});

   }}
   } catch (error) {
     console.log(error) 
   }

};

module.exports.updateActivity = async (req, res) => {
   console.log("UPDATE Activity Is Running")
   console.log(req.body);
   const info = req.body.newActivityInfo;
   console.log(info.originalDescription)
   console.log(info.date)

   try {
      const cohort = await Cohort.findById(req.user.cohort);
      for (let i = 0; i < cohort.activities.length; i++) {
         const activity = cohort.activities[i];
         if (activity.description === info.originalDescription) {
            console.log('Activity');
            console.log(activity);
            if (info.fieldToModify === 'description') {
               console.log('description')
               activity.description = info.description;
            } else if (info.fieldToModify === 'date') {
               console.log('DATE')
               activity.date = info.date;
            } else if (info.fieldToModify === 'number') {
               console.log("NUMBER")
               activity.activityNumber = info.activityNumber
            } else if (info.fieldToModify === 'subType') {
               console.log("SUBTYPE")
               activity.subType = info.subType; 
      };
      console.log(activity)
   }};
      cohort.markModified('activities');
      await cohort.save();


      res.json("Good");
   } catch (error) {
     console.log(error);
     res.json("Not Good");
   };
};

module.exports.postWaL = async (req, res) => {
   console.log("PostWaL is running!");
   let activities
   let activity
   let videoIsToBig
   try {
 
      const theCohort = await Cohort.findById(req.user.cohort._id);
      activities = theCohort.activities;
      console.log(activities.length)
      for (let i = 0; i < activities.length; i++) {
         if(activities[i].description === req.body.activity){
         activity = activities[i];
         console.log("activity is");
         console.log(activity);
         console.log("additionalInfo is");
         console.log(activity.additionalInfo);
         if(activity.additionalInfo.length === 0){
            const WalData = {
               videoURL: '',
               videoCloudinaryID: '',
               videoO: '',
               imageDURL: '',
               imageDCloudinaryID: '',
               imageDO: '',
               imageRURL: '',
               imageRCloudinaryID: '',
               mediaEO: '',
               imageRO: '',
               audioDURL: '',
               audioDCloudinaryID: '',
               mediaEO: '',
               audioRURL: '',
               audioRCloudinaryID: '',
               mediaEURL: '',
               mediaEO: '',
               mediaECloudinaryID: '',
               mediaEO: '',
            }; 
            activity.additionalInfo.push(WalData);
         }}}; 
         console.log("REQ.FILES")
         console.log(req.files);
         try {
           
            if (typeof req.files.video !== 'undefined') {
               if(req.files.video[0].size > 100000000){
               videoIsToBig = true;
               } else {
                  if (activity.additionalInfo[0].videoURL !== '') {
                     const resultVD = await cloudinary.uploader.destroy(activity.additionalInfo[0].videoCloudinaryID, {resource_type: 'video'});
                  };
                  const resultV = await cloudinary.uploader.upload(req.files.video[0].path, {resource_type: "video"});
                  console.log("ResultV");
                  console.log(resultV);
                  console.log("END RESULT V");
                  if (resultV.secure_url){
                  activity.additionalInfo[0].videoURL = resultV.secure_url;
                  activity.additionalInfo[0].videoCloudinaryID = resultV.public_id;
                  console.log(resultV.height)
                  console.log(resultV.width);
                  if(resultV.width < resultV.height){
                     activity.additionalInfo[0].videoO = 'v';
                  } else if(resultV.width > resultV.height){
                     activity.additionalInfo[0].videoO = 'h';
                  } else {activity.additionalInfo[0].videoO = 's';
            }}}};
         } catch (error) {
            console.log("Error uploading or updating video file");
            console.log(error);
            
         };
         try {
            if (typeof req.files.imageD !== 'undefined') {
               if (activity.additionalInfo[0].imageDURL !== '') {
                  const resultIDD = await cloudinary.uploader.destroy(activity.additionalInfo[0].imageDCloudinaryID);
                  //console.log("ResultIDD deleting ImageD");
                  //console.log(resultIDD);
               };
               const resultID = await cloudinary.uploader.upload(req.files.imageD[0].path, {resource_type: "auto"});
               console.log('ResultID');
               console.log(resultID)
               if (resultID.secure_url){
               activity.additionalInfo[0].imageDURL = resultID.secure_url;
               activity.additionalInfo[0].imageDCloudinaryID = resultID.public_id;
               if(resultID.width < resultID.height){
                  activity.additionalInfo[0].imageDO = 'v';
               } else if(resultID.width > resultID.height){
                  activity.additionalInfo[0].imageDO = 'h';
               } else {activity.additionalInfo[0].imageDO = 's';
            }} else {
               console.log("There was a problem uploading the Image D.")
            }};
         } catch (error) {
            console.log("Error uploading or deleting ImageD");
            console.log(error);   
         };
         try {
            if (typeof req.files.imageR !== 'undefined') {
               if (activity.additionalInfo[0].imageRURL !== '') {
                  const resultIRD = await cloudinary.uploader.destroy(activity.additionalInfo[0].imageRCloudinaryID);
                  //console.log("ResultIRD deleting ImageR");
                  //console.log(resultIRD);
               };
               const resultIR = await cloudinary.uploader.upload(req.files.imageR[0].path, {resource_type: "auto"});
               if (resultIR.secure_url){
               activity.additionalInfo[0].imageRURL = resultIR.secure_url;
               activity.additionalInfo[0].imageRCloudinaryID = resultIR.public_id;
                if(resultIR.width < resultIR.height){
                  activity.additionalInfo[0].imageRO = 'v';
                } else if (resultIR.width > resultIR.height){
                  activity.additionalInfo[0].imageRO = 'h';
                } else {activity.additionalInfo[0].imageRO = 's'
            }} else {
               console.log("There was problem uploading the Image R.")
            }};
         } catch (error) {
            console.log("Error uploading or deleting ImageR");
            console.log(error);
         };
         try { 
            if (typeof req.files.audioD !== 'undefined') {
               if (activity.additionalInfo[0].audioDURL !== '') {
                  const resultADD = await cloudinary.uploader.destroy(activity.additionalInfo[0].audioDCloudinaryID);
                  console.log("ResultIDD deleting audioD");
                  console.log(resultADD);
               };
               const resultAD = await cloudinary.uploader.upload(req.files.audioD[0].path, {resource_type: "auto"});
               if (resultAD.secure_url){
               activity.additionalInfo[0].audioDURL = resultAD.secure_url;
               activity.additionalInfo[0].audioDCloudinaryID = resultAD.public_id;
            } else {
               console.log("There was a problem uploading the Audio D.")
            }};
         } catch (error) {
            console.log("Error uploading or deleting AudioD");
            console.log(error);   
         };
         try { 
            if (typeof req.files.audioR !== 'undefined') {
               if (activity.additionalInfo[0].audioRURL !== '') {
                  const resultARD = await cloudinary.uploader.destroy(activity.additionalInfo[0].audioRCloudinaryID);
                 // console.log("ResultADD deleting AudioRD");
                 // console.log(ResultARD);
               };
               const resultAR = await cloudinary.uploader.upload(req.files.audioR[0].path, {resource_type: "auto"});
               if (resultAR.secure_url){
               activity.additionalInfo[0].audioRURL = resultAR.secure_url;
               activity.additionalInfo[0].audioRCloudinaryID = resultAR.public_id;
            } else {
               console.log("There was a problem uploading the Audio R.")
            }};
            } catch (error) {
              // console.log("Error uploading or deleting AudioR");
              // console.log(error);
         };
         try {
            if (typeof req.files.mediaE !== 'undefined') {
               if (activity.additionalInfo[0].mediaEURL !== '') {
                  const resultMED = await cloudinary.uploader.destroy(activity.additionalInfo[0].mediaECloudinaryID);
               };
               const resultME = await cloudinary.uploader.upload(req.files.mediaE[0].path, {resource_type: "auto"});
               if (resultME.secure_url){
                  console.log("RESULT ME")
                  console.log(resultME);
               activity.additionalInfo[0].mediaEURL = resultME.secure_url;
               activity.additionalInfo[0].mediaECloudinaryID = resultME.public_id;
               } else {
                  console.log("There was problem uploading the Media E");
               }}
         } catch (error) {
            console.log(error);
      };
         console.log("uploads done")
         theCohort.markModified('activities');
      await theCohort.save(); 
      res.redirect("/admin/activityWaL");
   } catch (error) {
      console.log(error)
      res.redirect("/admin/activityWaL");
   }
   console.log("WAL Done");
   //res.render("activityWaLAdmin",{ user: req.user, activities: activities});
}
module.exports.postVocabWord = async (req, res) => {
   const activityDescription = req.body.activity;
   console.log("Post VocabWord is running");
   console.log(req.body);
  // console.log(req.files)
   //console.log(typeof(req.files.image))
   try {
      let theCohort = await Cohort.findById(req.user.cohort._id);

      let existingLinks = [];
      const vwToLink = parseInt(req.body.vwToLink);
     
      console.log('theCohort.vocabWords.length');
      console.log(theCohort.vocabWords.length);
      
      let newIdent
      if(theCohort.vocabWords.length === 0){
         newIdent = 1;
      } else { for (let i = 1; i <= theCohort.vocabWords.length + 1; i++) {
         if(theCohort.vocabWords.some(vw => vw.ident === i) === false){
            newIdent = i;
            break;
         }}};
      let vocabWord = {
        description: req.body.description,
        category: req.body.category,
        imageUrl: '',
        cloudinaryIdImage: '',
        audioTis: '',
        cloudinaryIdTis: '',
        audioQ: '',
        cloudinaryIdQ: '',
        audioN: '',
        cloudinaryIdN: '',
        reviewedBy: [],
        vocabType: 'new',
        linkedVocab: [],
        ident: newIdent,
        specialInfo: {}  
      };
      if (req.body.vocabType === 'other'){
         vocabWord.vocabType = 'other';
      } else if (req.body.vocabType === 'individual'){
         if (typeof(req.body.newVocabCB === 'undefined')){
            vocabWord.vocabType = 'other';
      }};
      // linking audio files with previous VW
      if (req.body.vwToLink !== ''){
         for (let i = 0; i < theCohort.vocabWords.length; i++) {
            const element = theCohort.vocabWords[i];
            if (element.ident === vwToLink){
               //vocabWord.imageUrl = element.imageUrl;
               vocabWord.cloudinaryIdImage = element.cloudinaryIdImage;
               vocabWord.audioTis = element.audioTis;
               vocabWord.cloudinaryIdTis = element.cloudinaryIdTis;
               vocabWord.audioQ = element.audioQ;
               vocabWord.cloudinaryIdQ = element.cloudinaryIdQ;
               vocabWord.audioN = element.audioN;
               vocabWord.cloudinaryIdN = element.cloudinaryIdN;
               existingLinks = element.linkedVocab;
               vocabWord.linkedVocab = existingLinks;
               vocabWord.linkedVocab.push(vwToLink);
               console.log("exiting Links");
               console.log(existingLinks);
      }}};

         let activityLocation   
         for (let i = 0; i < theCohort.activities.length; i++) {
         const element = theCohort.activities[i];
         
         if (element.description === activityDescription){
            element.vocabWords.push(vocabWord.ident);
            activityLocation = i;
            console.log(activityLocation)
         }};

   
      if (typeof req.files.image !== 'undefined') {
         const resultI = await cloudinary.uploader.upload(req.files.image[0].path, {resource_type: "auto"});
         vocabWord.imageUrl = resultI.secure_url;
         vocabWord.cloudinaryIdImage = resultI.public_id;
         
      };

      if (typeof req.files.audioTis !== 'undefined') {
         const result = await cloudinary.uploader.upload(req.files.audioTis[0].path, { resource_type: "auto"});
         vocabWord.cloudinaryIdTis = result.public_id;
         vocabWord.audioTis = result.secure_url;
      };

      if (typeof req.files.audioQ !== 'undefined'){
         const result2 = await cloudinary.uploader.upload(req.files.audioQ[0].path, { resource_type: "auto"});
         vocabWord.cloudinaryIdQ = result2.public_id;
         vocabWord.audioQ = result2.secure_url;
      };

      if ( typeof req.files.audioN !== 'undefined') {
         const result3 = await cloudinary.uploader.upload(req.files.audioN[0].path, { resource_type: "auto"});
         vocabWord.cloudinaryIdN = result3.public_id;
         vocabWord.audioN = result3.secure_url;
      };
      
      theCohort.vocabWords.push(vocabWord);
      theCohort.markModified('vocabWords');
      theCohort.markModified('activities');
      await theCohort.save();

//There were issues getting all changes to save in the DB the second call and save seemed to help. NOT ideal, but it works for now.
      const cohort = await Cohort.findById(req.user.cohort._id);

     /* for (let i = 0; i < cohort.vocabWords.length; i++) {
         const element = cohort.vocabWords[i];
        if (element.ident === vwToLink){
             element.linkedVocab.push(vocabWord.ident);
             //cohort.markModified(`vocabWords[${i}]`);
             console.log("element.linkedVocab");
             console.log(element.linkedVocab);
      }};*/
      console.log("newIdent");
      console.log(newIdent);
      console.log("vocabWord.Ident")
      console.log(vocabWord.ident);
      console.log('activity Description');
      console.log(activityDescription)
    
      for (let i2 = 0; i2 < existingLinks.length; i2++){
         const existingLINK = existingLinks[i2];            
         for (let index = 0; index < cohort.vocabWords.length; index++) {
            const element2 = cohort.vocabWords[index];
            if (element2.ident === existingLINK){
               element2.linkedVocab.push(vocabWord.ident);
               //cohort.markModified(`vocabWords[${index}].linkedVocab`);
               console.log("element2.linkedVocab");
               console.log(element2.linkedVocab);
               break;
      }}}
      console.log('activity location')
      console.log(activityLocation);
      console.log(theCohort.activities[activityLocation]);
      cohort.markModified('vocabWords')

      await cohort.save();

   } catch (error) {
      console.log('catch')
      console.log(error)   
   }


   console.log('ready to redirect');
   res.json({activityDescription});

};

module.exports.updateVocabWord = async (req, res) => {
   console.log('UpdateVocabWord is running')
   console.log(req.body);
   console.log('that was the body')
   console.log(req.body.vocabWordId)
   
   try {

      //const vocabWordId = new ObjectId(req.body.vocabWordId);
      
      let theCohort = await Cohort.findById(req.user.cohort._id);
      // console.log(vocabWordId);
 
 
   
      console.log(typeof req.body.newVWDescription);
      console.log(typeof req.body.newVWCategory);

      for (let i = 0; i < theCohort.vocabWords.length; i++) {
         const element = theCohort.vocabWords[i];
         if(element.ident === req.body.vocabWordId){
            if  (typeof req.body.newVWDescription !== 'undefined') {
            element.description = req.body.newVWDescription;

            console.log('description updated')
            };   

            if (typeof req.body.newVWCategory !== 'undefined') {
               element.category = req.body.newVWCategory;
               console.log('the Category was updated')
      }}};

         console.log(theCohort.categories)
         console.log(req.body.newVWCategory)
      theCohort.markModified('vocabWords');
      theCohort = await theCohort.save();
      console.log("theCohort after save");
      console.log(theCohort.vocabWords);

   res.redirect("/admin/activityDD"); 

  } catch (error) {
     console.log('nope') 
     console.log(error)
   }

};

module.exports.replaceImage = async (req, res, next) => {
   
   console.log('Delete Image is running');
   console.log('req.file is');
   console.log(req.file);
   console.log('req.body is')
   console.log (req.body);

    
   const vwIdent = Number(req.body.vwIdent)
   try {
      
   if(req.body.toDelete !== ''){
   const result = await cloudinary.uploader.destroy(req.body.toDelete);
   console.log('Image should be destroyed')
   console.log(result);
   };
   const resultNewImage = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
         imageUrl = resultNewImage.secure_url;
         cloudinaryIdImage = resultNewImage.public_id;

     
   let theCohort= await Cohort.findById(req.user.cohort);
   
   for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.ident === vwIdent) {
         element.cloudinaryIdImage = cloudinaryIdImage;
         element.imageUrl = imageUrl;
         break;
   }};
   theCohort.markModified('vocabWords');
       
   await theCohort.save();
   res.json("Update Done");
} catch (error) {
     console.log(error);
     res.json("error")
}
       
   
};

module.exports.replaceAudioTis = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body.vwIdent);

    
   const vwIdent = Number(req.body.vwIdent)
   if (req.body.toDelete !== ""){
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log(resultD);
   };

   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   let theCohort= await Cohort.findById(req.user.cohort);

   for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.ident === vwIdent) {
         element.cloudinaryIdTis = resultU.public_id;
         element.audioTis = resultU.secure_url;
          if (element.linkedVocab.length > 0) {
            console.log("UPDATING Linked Vocab");
            console.log(element.linkedVocab);
            for (let j = 0; j < element.linkedVocab.length; j++) {
               const  linkedVW = element.linkedVocab[j];
               for (let k = 0; k < theCohort.vocabWords.length; k++) {
                  const vw = theCohort.vocabWords[k];
                  if (vw.ident === linkedVW) {
                     vw.cloudinaryIdTis = resultU.public_id;
                     vw.audioTis = resultU.secure_url;
   }}}}}};
   theCohort.markModified('vocabWords');
       
   await theCohort.save();


   res.json("Update Done");
   } catch (error) {
      console.log(error);  
      res.json("error");   
}};

module.exports.replaceAudioQ = async (req, res) => {
try {

   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body.vwIdent);
 
    
   const vwIdent = Number(req.body.vwIdent)
   let theCohort= await Cohort.findById(req.user.cohort);
   if (req.body.toDelete !== ""){
      const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
      console.log("resultD")
      console.log(resultD);
   }
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   
 
   for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.ident === vwIdent) {
         element.cloudinaryIdQ = resultU.public_id;
         element.audioQ = resultU.secure_url;
         if (element.linkedVocab.length > 0) {
            console.log("UPDATING Linked Vocab");
            console.log(element.linkedVocab);
            for (let j = 0; j < element.linkedVocab.length; j++) {
               const  linkedVW = element.linkedVocab[j];
               for (let k = 0; k < theCohort.vocabWords.length; k++) {
                  const vw = theCohort.vocabWords[k];
                  if (vw.ident === linkedVW) {
                     vw.cloudinaryIdQ = resultU.public_id;
                     vw.audioQ = resultU.secure_url;
   }}}}}};

   theCohort.markModified('vocabWords');
   await theCohort.save();  

   res.json("Update Done");
   } catch (error) {
      console.log(error);     
      res.json('error');
}};

module.exports.replaceAudioN = async (req, res) => {
try {


   console.log("ReplaceAudioN is Running");
   console.log(req.body.toDelete);
   console.log("THE IDENT")
   console.log(req.body.vwIdent);
   const vwIdent = Number(req.body.vwIdent)
   console.log(typeof vwIdent);
   console.log(vwIdent);
    
   
   let theCohort= await Cohort.findById(req.user.cohort);
   if (req.body.toDelete !== ""){
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log('resultD');
   console.log(resultD);
   }
   console.log(req.file.path);
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   console.log(resultU);
   for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.ident === vwIdent) {
         element.cloudinaryIdN = resultU.public_id;
         element.audioN = resultU.secure_url;
         console.log(resultU.secure_url);
         if (element.linkedVocab.length > 0) {
            console.log("UPDATING Linked Vocab");
            console.log(element.linkedVocab);
            for (let j = 0; j < element.linkedVocab.length; j++) {
               const  linkedVW = element.linkedVocab[j];
               for (let k = 0; k < theCohort.vocabWords.length; k++) {
                  const vw = theCohort.vocabWords[k];
                  if (vw.ident === linkedVW) {
                     vw.cloudinaryIdN = resultU.public_id;
                     vw.audioN = resultU.secure_url;
   }}}}}};

   theCohort.markModified('vocabWords');
       
   await theCohort.save();  
   
   res.json("Update Done");
   } catch (error) {
      console.log(error);     
      res.json('error');
   };
};

module.exports.deleteActivity = async (req, res) => {
   console.log("Delete Activity is running")
   console.log(req.body.activity);
   try {
      let theCohort = await Cohort.findById(req.user.cohort);
      for (let i = 0; i < theCohort.activities.length; i++) {
         if(theCohort.activities[i].description === req.body.activity){
         const activityToDelete = theCohort.activities[i];
         const vwToDelete = activityToDelete.vocabWords;
   
         console.log("toDelete");
         console.log(vwToDelete);
         if(vwToDelete !== undefined){
            for (let i2 = 0; i2 < vwToDelete.length; i2++) {
               const element = vwToDelete[i2];
               for (let index = theCohort.vocabWords.length - 1; index > -1; index--) {//loop has been fixed for "splice" use.
                  const element2 = theCohort.vocabWords[index];
                  if(element === element2.ident){
                     console.log(`elements ${index}`);
                     console.log(element);
                     console.log(element2.ident);
                     console.log(element2);

                     const result2 = await User.updateMany({"cohort": element2.cohort},
                        { $pull: { problemWords: element2.ident, wordsSelected: element2.ident} } );

                        console.log("Result2");
                        console.log(result2);

                        const result3 = await User.updateMany({"cohort": element2.cohort},
                        { $pull: {individualExercises: { vocabWords: element2.ident }}});

                        console.log("Result3")
                        console.log(result3);

                        if (element2.cloudinaryIdTis !== "") {
                           const result1 = await cloudinary.uploader.destroy(element2.cloudinaryIdTis, {resource_type: 'video'});
                           console.log("result1");
                           console.log(result1);
                           };
                        if (element2.cloudinaryIdQ !== ""){
                           console.log("vocabWord.cloudinaryIdQ");
                           const result2 = await cloudinary.uploader.destroy(element2.cloudinaryIdQ, {resource_type: 'video'});
                           console.log("result2");
                           console.log(result2);
                        };
                        if (element2.cloudinaryIdN !== ""){
                           const result5 = await cloudinary.uploader.destroy(element2.cloudinaryIdN, {resource_type: 'video'});
                           console.log("result5");
                           console.log(result5);
                        };
                        if (element2.cloudinaryIdImage !== ""){
                           const result = await cloudinary.uploader.destroy(element2.cloudinaryIdImage);
                     }
                     console.log(`This is the Index to splice: ${index}`)
                     theCohort.vocabWords.splice(index, 1);
                  };
         }}};
           

            //console.log("VW Array after");
            //console.log(theCohort.vocabWords);

         theCohort.activities.splice(i, 1);
         

      }};
     //console.log("Activities after");
     //console.log(theCohort.activities);
   
   //theCohort.markModified('activities'); //is this needed?
   theCohort.markModified('vocabWords');
   await theCohort.save();  

   res.redirect("/admin"); 
   } catch (error) {
      console.log(error)
   }
}

module.exports.deleteVWord = async (req, res) => { 

   console.log('delete word is running')
   console.log(req.body.vocabWordId);
   console.log('req.body.activity')
   console.log(req.body.activity);


   try {
      
      let vocabWord;
      let theCohort = await Cohort.findById(req.user.cohort._id);
      

      for (let i = 0; i < theCohort.activities.length; i++) {
         activity = theCohort.activities[i];
         console.log('activity');
         console.log(activity);
         if(activity.description === req.body.activity){
            for (let index = 0; index < activity.vocabWords.length; index++) {
               const element = activity.vocabWords[index];
               if(element === req.body.vocabWordId){
                  console.log("Ident = req.body.vId");
                  theCohort.activities[i].vocabWords.splice(index, 1);
                  console.log('activity after splice');
                  console.log(activity)               
            }}
      }};
      console.log('about to create vocabWord');
      for (let i = theCohort.vocabWords.length -1; i > -1; i--) {//this loop has been fixed for "splice" use. Although it should only delete 1 so it shouldn't be necessary.
         const element = theCohort.vocabWords[i];
         if(element.ident === req.body.vocabWordId){
            vocabWord = element;
         console.log("vocabWord")
         console.log(vocabWord);
      
      //removes the VW from all users.problemWords and wordsSelected
      
      const result2 = await User.updateMany({"cohort._id": req.user.cohort._id},
      { $pull: { problemWords: vocabWord.ident, wordsSelected: vocabWord.ident} } );

      console.log("Result2");
      console.log(result2);
      
      const result3 = await User.updateMany({"cohort": vocabWord.cohort},
      { $pull: {individualExercises: { vocabWords: vocabWord.ident }}});
      
      console.log("Result3")
      console.log(result3);

      if (vocabWord.cloudinaryIdTis !== "") {
         const result1 = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdTis, {resource_type: 'video'});
         console.log("result1");
         console.log(result1);
         };
      if (vocabWord.cloudinaryIdQ !== ""){
         console.log("vocabWord.cloudinaryIdQ");
         const result2 = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdQ, {resource_type: 'video'});
         console.log("result2");
         console.log(result2);
      };
      if (vocabWord.cloudinaryIdN !== ""){
         const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdN, {resource_type: 'video'});
      };
      if (vocabWord.cloudinaryIdImage !== ""){
         const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdImage);
      };
      theCohort.vocabWords.splice(i, 1);

   }};
   console.log('cohort vocabWords');
   console.log(theCohort.vocabWords);
   theCohort.markModified('activities');
   await theCohort.save();
      
   } catch (error) {
      console.log(error)
};
   res.redirect("/admin/adminDD");

};

module.exports.getAdditionalInfo = async (req, res) => {
   console.log('getAdditionalInfo is running')
   try {
      const activityDescription = req.body.activity;
      const cohortId = req.user.cohort._id; 
      const cohort = await Cohort.findById(cohortId);
      let additionalInfo
      
         for (let i = 0; i < cohort.activities.length; i++) {
            const element = cohort.activities[i];
            if (element.description === activityDescription){
               additionalInfo = element.additionalInfo;
            }};
      console.log("additionalInfo")
      console.log(additionalInfo);
      
   res.json({additionalInfo: additionalInfo});

} catch (error) {
   console.log("getAdditionalInfo Error")
   console.log(error);
}};

module.exports.deleteWaLActivity = async (req, res) => {
   console.log("Delete WaL Activity is Running")
   try {
      const activityDescription = req.body.activity;
      const cohortId = req.user.cohort._id; 
      const cohort = await Cohort.findById(cohortId);
      let additionalInfoArray
      let wasError
         for (let i = 0; i < cohort.activities.length; i++) {
            const element = cohort.activities[i];
            if (element.description === activityDescription){
               additionalInfoArray = element.additionalInfo;
               activityKey = i
               console.log('ActivityKey');
               console.log(activityKey);
            }};
      if (additionalInfoArray.length > 0){
         additionalInfo = additionalInfoArray[0];
         console.log("additionalInfo")
         console.log(additionalInfo);
         
         if (additionalInfo.videoURL !== "") {
            const result1 = await cloudinary.uploader.destroy(additionalInfo.videoCloudinaryID, {resource_type: 'video'});
            console.log("result1");
            console.log(result1);
            };

         if (additionalInfo.imageDURL !== "") {
            const result2 = await cloudinary.uploader.destroy(additionalInfo.imageDCloudinaryID, {resource_type: 'video'});
            console.log("result2");
            console.log(result2);
            };

         if (additionalInfo.imageRURL !== "") {
            const result3 = await cloudinary.uploader.destroy(additionalInfo.imageRCloudinaryID, {resource_type: 'video'});
            console.log("result3");
            console.log(result3);
            };
         if (additionalInfo.audioDURL !== "") {
            const result4 = await cloudinary.uploader.destroy(additionalInfo.audioDCloudinaryID, {resource_type: 'video'});
            console.log("result4");
            console.log(result4);
            };
         if (additionalInfo.audioRURL !== "") {
            const result5 = await cloudinary.uploader.destroy(additionalInfo.audioRCloudinaryID, {resource_type: 'video'});
            console.log("result5");
            console.log(result5);
            };
         if (additionalInfo.mediaEURL !== "") {
            const result6 = await cloudinary.uploader.destroy(additionalInfo.mediaECloudinaryID, {resource_type: 'video'});
            console.log("result6");
            console.log(result6);
            };
      };
      cohort.activities.splice(activityKey, 1);
      console.log(cohort.activities[activityKey]);
      

      cohort.markModified('activities');

      await cohort.save();
      wasError = false;
      
      res.json({wasError});
 } catch (error) {
   console.log("Delete WaL Error")
   console.log(error);
   wasError = true;
   res.json({wasError});
}};

module.exports.deleteWaLMedia = async (req, res) => {

 try {
      const activityDescription = req.body.activity;
      const mediaToDelete = req.body.mediaToDelete;
      console.log('mediaToDelete')
      console.log(mediaToDelete)
      const cohortId = req.user.cohort._id; 
      const cohort = await Cohort.findById(cohortId);
      let additionalInfoArray
         for (let i = 0; i < cohort.activities.length; i++) {
            const element = cohort.activities[i];
            if (element.description === activityDescription){
               additionalInfoArray = element.additionalInfo;
               additionalInfo = additionalInfoArray[0];
               activityKey = i;
               console.log("additionalInfo")
               console.log(additionalInfo);

               if (mediaToDelete === 'video'){
                  const result1 = await cloudinary.uploader.destroy(additionalInfo.videoCloudinaryID, {resource_type: 'video'});
                  console.log("result1");
                  console.log(result1);
                  console.log(result1.result)
                  if (result1.result !== 'ok'){
                     console.log("Admin attempted to Delete the following media Assets but they were not found in the DB");
                     console.log(`${req.body.activity} Video`);
                     console.log(additionalInfo.videoCloudinaryID);
                     console.log(additionalInfo.videoURL);
                  }
                  additionalInfo.videoCloudinaryID = "";
                  additionalInfo.videoURL = "";
                  additionalInfo.videoO = "";
               } else if (mediaToDelete === "dictionaryImage"){
                  const result2 = await cloudinary.uploader.destroy(additionalInfo.imageDCloudinaryID, {resource_type: 'image'});
                  console.log("result2");
                  console.log(result2.result);
                  if (result2.result !== 'ok') {
                     console.log("Admin attempted to Delete the following media Assets but they were not found in the DB");
                     console.log(`${req.body.activity} Dictionary Image`);
                     console.log(additionalInfo.imageDCloudinaryID);
                     console.log(additionalInfo.imageDURL);
                     }
                  additionalInfo.imageDCloudinaryID = "";
                  additionalInfo.imageDURL = "";
                  additionalInfo.imageDO = "";
               } else if (mediaToDelete === "dictionaryAudio"){
                  const result3 = await cloudinary.uploader.destroy(additionalInfo.audioDCloudinaryID, {resource_type: 'video'});
                  console.log("result3");
                  console.log(result3);
                  if (result3.result !== 'ok'){
                     console.log("Admin attempted to Delete the following media Assets but they were not found in the DB");
                     console.log(`${req.body.activity} Dictionary Audio`);
                     console.log(additionalInfo.audioDCloudinaryID);
                     console.log(additionalInfo.audioDURL);    
                  };
                  additionalInfo.audioDCloudinaryID = "";
                  additionalInfo.audioDURL = "";
               } else if (mediaToDelete === "reviewImage"){
                  const result4 = await cloudinary.uploader.destroy(additionalInfo.imageRCloudinaryID, {resource_type: 'image'});
                  console.log("result4");
                  console.log(result4);
                  if (result4.result !== 'ok'){
                     console.log("admin attempted to delete the following media assets but they were not found in the db");
                     console.log(`${req.body.activity} Review Image`);
                     console.log(additionalInfo.imageRCloudinaryID);
                     console.log(additionalInfo.imageRURL);
                  };
                  additionalInfo.imageRCloudinaryID = "";
                  additionalInfo.imageRURL = "";
                  additionalInfo.imageRO= "";
               } else if (mediaToDelete === "reviewAudio"){
                  console.log("Else if ReviewMedia is Running")
                  const result5 = await cloudinary.uploader.destroy(additionalInfo.audioRCloudinaryID, {resource_type: 'video'});
                  console.log("result5")
                  console.log(result5);
                  if (result5.result !== 'ok'){
                  console.log("admin attempted to delete the following media assets but they were not found in the db");
                  console.log(`${req.body.activity} Review Audio`);
                     console.log(additionalInfo.imageRCloudinaryID);
                     console.log(additionalInfo.imageRURL);
               };
               additionalInfo.audioRCloudinaryID = "";
               additionalInfo.audioRURL = "";
               } else if (mediaToDelete === "exampleMedia"){
                  const result6 = await cloudinary.uploader.destroy(additionalInfo.mediaECloudinaryID, {resource_type: 'video'});
                  console.log("result6");
                  console.log(result6);
                  if (result6.result !== 'ok'){
                  console.log("admin attempted to delete the following media assets but they were not found in the db");
                  console.log(`${req.body.activity} Example Media`);
                     console.log(additionalInfo.mediaECloudinaryID);
                     console.log(additionalInfo.mediaEURL);
               };
                     additionalInfo.mediaECloudinaryID = "";
                     additionalInfo.mediaEURL = "";
                     additionalInfo.mediaEO = "";
         }}};

      
      cohort.markModified('activities');

      await cohort.save();
      let wasError = false;
      
      res.json(wasError);
      } catch (error) {
         
      }
   };

   module.exports.finalizeActivity = async (req, res) => {
   try {
      console.log(req.body.activity); 
      const activity = req.body.activity;
      const vocabType = req.body.vocabType;
      const subType = req.body.subType;
      console.log(vocabType);
      console.log(subType)

      const cohort = await Cohort.findById(req.user.cohort._id);
      for (let i = 0; i < cohort.activities.length; i++) {
         const element = cohort.activities[i];
        if (element.description === activity) {
         element.ready = true;
         element.subType = subType;
         if(vocabType === "new" || 'other'){
            console.log("finalizing vocabType");
               for (let i = 0; i < element.vocabWords.length; i++) {
                  const vwIdent = element.vocabWords[i];
                  for (let index = 0; index < cohort.vocabWords.length; index++) {
                     const vocabWord = cohort.vocabWords[index];
                     if (vwIdent === vocabWord.ident){
                        vocabWord.vocabType = vocabType;
   }}}}}};
   cohort.markModified('vocabWords');
   cohort.markModified("activities");
   await cohort.save();
   res.redirect("/admin/activityDD");
   } catch (error) {
     console.log(error);
     res.json('There was an error')
}};


module.exports.uploadVWFromFolder = async (req, res) => { 
let test = 0;
const newVWsArray = [];
let vocabSet = new Set();
const activity = req.body.activity;
let identSet = new Set();
try {
   
   console.log("UPLOADING FROM FOLDER!!");
   //console.log(req.body);
   //console.log(req.files);

   const cohort = await Cohort.findById(req.user.cohort._id);
   for (let i = 0; i < cohort.vocabWords.length; i++) {
      const vw = cohort.vocabWords[i];
      identSet.add(vw.ident);
   };
   const vocabType = req.body.vocabType;
   let category = ""
   if (req.body.category !== undefined){
      category = req.body.category;
   };
   const uploads = req.files.folderUpload;
   const totalUploads = uploads.length;
   console.log(`Total Uploads: ${totalUploads}`);
  // console.log(uploads);
   //console.log('THAT ALL OF THEM')
   
   
   

   if (typeof totalUploads === 'number' && totalUploads < 11){
      console.log ("LESS THAN 11")
      await processUploadBatch (uploads);
      console.log("UPLOAD BATCH PROCESSED");
      //await saveNewVocab();
      res.json({activity})
   } else if (typeof totalUploads === 'number' && totalUploads > 10){
         console.log(`UPloads Length 1: ${uploads.length}`)
      while (uploads.length > 10) {
         let uploadBatch = uploads.splice(0, 10);
         console.log(`UPLOAD BATCH Length: ${uploadBatch.length}`);
         console.log(`UPloads Length 3: ${uploads.length}`)
         await processUploadBatch (uploadBatch);
      };
      console.log("The Last UPLOADS")
      console.log(uploads);

      await processUploadBatch (uploads);
      console.log("NEW VWs ARRAY BEFORE LAST SAVE")
      console.log(newVWsArray);
      await saveNewVocab();
      res.json({activity});
   };

   async function processUploadBatch (uploadArray) { // Limit is 10 uploads at a time on Cloudinary Free tier.
   console.log(`Process Upload Batch is running. Uploads to process: ${uploadArray.length}`)
  
   const resultArray = [];
   const theKeysArray = [];
      for (let  i = 0;  i < uploadArray.length;  i++) {
         const fileObject = uploadArray[i];
         let descriptionObj = describeAndDesignate(fileObject);
         console.log("DESCRIPTION OBJECT AFTER MAKE DESCRIPTION");
         console.log(descriptionObj);

         const description = descriptionObj.description;
         const designation = descriptionObj.designation;
    
            if (vocabSet.has(description) === false) {
               vocabSet.add(description);
               let ident = 1
               while (identSet.has(ident) === true) {
                  ident++;
               };
               let vocabWord = { 
                  description: description,
                  category: category,
                  imageUrl: '',
                  cloudinaryIdImage: '',
                  audioTis: '',
                  cloudinaryIdTis: '',
                  audioQ: '',
                  cloudinaryIdQ: '',
                  audioN: '',
                  cloudinaryIdN: '',
                  reviewedBy: [],
                  vocabType: vocabType,
                  linkedVocab: [],
                  ident: ident,
                  specialInfo: {}  
               };
               identSet.add(ident);
               newVWsArray.push(vocabWord);
               let newKey = {
                  description: description,
                  results: []
               };
              // console.log("Designation 1205");
              // console.log(designation);

               const theKey = {
                  filename: fileObject.filename,
                  designation: designation,
               };
               newKey.results.push(theKey);
               theKeysArray.push(newKey);

            } else {
               console.log("BATCH PROCESS ELSE IS RUNNING");
               let newKey = {
                  description: description,
                  results: []
               };
               const theKey = {
                  filename: fileObject.filename,
                  designation: designation,
               };
               newKey.results.push(theKey);
               theKeysArray.push(newKey);
         };
         if (designation === "Do Not Upload") {
            console.log("This File Was not uploaded");
            console.log(fileObject);
         };
         if (designation !== "Do Not Upload") {
         resultArray[i] = cloudinary.uploader.upload(fileObject.path, {resource_type: "auto"});
         if (designation === "Zero") { //Also for debugging purposes
            console.log("UPLOADED ZERO");
            console.log(resultArray[i]);
         }
         }
      };
      const promisesToAwait = resultArray.filter(function (el) { //This removes any empty slots from the Array that are created when uploads are designated "Do Not Upload"
         return el != null;
      });
      const uploadData = await Promise.allSettled(promisesToAwait);
      console.log("After All Settled");
      /*console.log(resultArray[0].promiseDispatch);
      console.log(resultArray[0].valueOf);
      console.log(resultArray[0].inspect); */ 
      //console.log("UPLOAD DATA")
      //console.log(uploadData);
      for (let i = 0; i < uploadData.length; i++) {// These loops add the URLs and ID from the upload results to the correct KEY object, associating them with the correct VW description.
         const upload = uploadData[i];
         //console.log ("UPLOAD")
         //console.log(upload)
         for (j = 0; j < theKeysArray.length; j++) {
            const key = theKeysArray[j];
            for (let k = 0; k < key.results.length; k++) {
               const result = key.results[k];
               if (result.filename === upload.value.original_filename) {
                  if (key.description === "Two") {
                     console.log ("UPDATING KEY TWO");
                     console.log (key);
                  }
                  result.secure_url = upload.value.secure_url;
                  result.public_id = upload.value.public_id;
                  //console.log("Updated Key");
                  //console.log(key);
      }};
        
      }};
     
      for (let i = 0; i < theKeysArray.length; i++) {
         const key = theKeysArray[i];
         for (let j = 0; j < newVWsArray.length; j++) {
            const newVocabWord = newVWsArray[j];

          /*console.log("KEY DESCRIPTION");
            console.log(key);
            console.log("NEW VOCAB DESCRIPTION");
            console.log(newVocabWord.description); */

            if (key.description === newVocabWord.description) {
              // console.log("THEY MATCHED");
               
               for (let k = 0; k < key.results.length; k++) {//This adds the information from the KEYS to the New Vocab Word Objects
                  const result = key.results[k];
                  //console.log("RESULT!!")
                  //console.log (result);
               
                  if(result.designation === 'None') {
                     newVocabWord.cloudinaryIdTis = result.public_id;
                     newVocabWord.audioTis = result.secure_url;
                  } else if (result.designation === 'i') {
                     newVocabWord.cloudinaryIdImage = result.public_id;
                     newVocabWord.imageUrl = result.secure_url;
                  } else if (result.designation === 'w' ) {
                     newVocabWord.cloudinaryIdQ = result.public_id;
                     newVocabWord.audioQ = result.secure_url;
                  } else if(result.designation === 'n') {
                     newVocabWord.cloudinaryIdN = result.public_id;
                     newVocabWord.audioN = result.secure_url;
                  };
               };
               
   }}}};

   function describeAndDesignate (fileObject) {
     if (test > 9) {
      console.log(fileObject)
     }
      if (/[A-Z]/.test(fileObject.originalname.charAt(0)) === true){ //If file name starts with a capital letter.
         let newStr = "";
                  
         for (let i = 0; i < fileObject.originalname.length; i++) {
            const char = fileObject.originalname[i]; 
            if (char !== "."){
               newStr = newStr + char;
            } else {
               return {description: newStr, designation: 'None'}
               break
            };
         };
         } else { //If file name starts with s lower case letter.
            let newStr = "";
            let designation = "";
            if (fileObject.originalname[0] === 'i' || fileObject.originalname[0] === 'w' || fileObject.originalname[0] ===  'n') {
               designation = fileObject.originalname[0];
            } else { 
               designation = "Do Not Upload";
            };

            let newString = fileObject.originalname.slice(1);
            for (let i = 0; i < newString.length; i++) {
               const char = newString[i]; 
               if (char !== "."){
                  newStr = newStr + char;
               } else {
                  newStr = newStr[0].toUpperCase() + newStr.slice(1);
                  return {description: newStr, designation: designation}
                  break
            }};
   }};
   test++;
   } catch (error) {
   console.log(error);  
   };

   async function saveNewVocab () {
   try {
   
   const cohort = await Cohort.findById(req.user.cohort._id);
   console.log("SAVE Running");
   
      for (let i = newVWsArray.length - 1; i > -1; i--) {
      const newVW = newVWsArray[i];
      for (let j = 0; j < cohort.vocabWords.length; j++) {
         const existingVW = cohort.vocabWords[j];
         if (existingVW.description === newVW.description) {//Finds existing VWs with the same description.
            console.log("FIRST IF");
            console.log(existingVW.description)
            for (let k = 0; k < cohort.activities.length; k++) {
               const existingActivity = cohort.activities[k];
               if (existingActivity.description === activity) {
                  console.log("SECOND IF");
                  for (let l = 0; l < existingActivity.vocabWords.length; l++) {//checks to see if the existing VW with the same description is in the same Activity.
                     const element = existingActivity.vocabWords[l];
                     if (element === existingVW.ident){
                        console.log("THIRD IF");
                        if (newVW.cloudinaryIdTis !== "") {
                           console.log("FORTH IF")
                           existingVW.cloudinaryIdTis = newVW.cloudinaryIdTis;
                           existingVW.audioTis = newVW.audioTis;
                        } else if (newVW.cloudinaryIdImage !== "") {
                           console.log("FIFth IF");
                           existingVW.cloudinaryIdImage = newVW.cloudinaryIdImage;
                           existingVW.imageUrl = newVW.imageUrl;
                        } else if (newVW.cloudinaryIdN !== "") {
                           console.log("SIXTH IF");
                           existingVW.cloudinaryIdN = newVW.cloudinaryIdN;
                           existingVW.audioN = newVW.audioN;
                        } else if (newVW.cloudinaryIdQ !== "") {
                           console.log("SEVENTH IF");
                           existingVW.cloudinaryIdQ = newVW.cloudinaryIdQ;
                           existingVW.audioQ = newVW.audioQ;
                        };
                        console.log("SPLICING newVWsARRAY");
                        newVWsArray.splice(i, 1);
      }}}}}}};

      for (let i = 0; i < newVWsArray.length; i++) {
         const newVW = newVWsArray[i];
         cohort.vocabWords.push(newVW);
      for (let i = 0; i < cohort.activities.length; i++) {
         const element = cohort.activities[i];
         if (element.description === activity) {
            element.vocabWords.push(newVW.ident);
      }}};

      cohort.markModified('activities');
      cohort.markModified('vocabWords')
      await cohort.save();
   
   } catch (error) {
   console.log(error);
   }};
};

module.exports.getActivities = async (req, res) => {
   console.log(req.body.currentCohort);
   const cohortSelection = req.body.currentCohort;
   const activityTypes = req.body.activityTypes;
   try {
      
      let response = await Cohort.findOne({cohortName: cohortSelection});
      console.log("RESPONSE")
      console.log(response.cohortName);
      const cohort = response;
      const activitiesAlpha = [];
      const activitiesWaL = [];

      if (activityTypes.DD === true) {
      for (let i = 0; i < cohort.activities.length; i++) { 
         const element = cohort.activities[i];
         if (element.type === "DD") {
            delete element.additionalInfo;
            delete element.vocabWords;
            delete element.reviewedBy; 
            activitiesAlpha.push(element);
      }}};
   

utils.sortAlpha(activitiesAlpha);
   
   if (activityTypes.WaL === true) {
      for (let i = 0; i < cohort.activities.length; i++) { 
      const element = cohort.activities[i];
      if (element.type === "WaL") {
         //delete element.additionalInfo;
         delete element.vocabWords;
         delete element.reviewedBy; 
         activitiesAlpha.push(element);
   }};
   }
   const activities = {
      activitiesAlpha: activitiesAlpha,
      activitiesWaLA: activitiesWaL,
   }
   res.json({activitiesAlpha})
} catch (error) {
   console.log(error)
}};

//cSpell:ignore cloudinary cloudinaryid durl eurl rurl subdoc