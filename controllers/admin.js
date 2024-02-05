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

   const newPreReg = await PreReg.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
   });
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
   } else {console.log(`${student.username} already has admin privlieges.`);
   window.alert(`${student.username} already has admin privlieges.`);
};
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
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
   } else console.log(`${student.username} cannot remove admin privlieges.`);
   let cohort = await Cohort.findOne({cohortName: cohortSelection});
   let studentArray = cohort.students;
   
   console.log(`This is the studendArray ${studentArray}`);
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
      const cohortId = req.user.cohort._id; 
      const cohort = await Cohort.findById(cohortId);
      
      let activityVocab
      let vocabList = [];
         for (let i = 0; i < cohort.activities.length; i++) {
            const element = cohort.activities[i];
            if (element.description === activityDescription){
               activityVocab = element.vocabWords;
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

   //console.log(vocabList);
   res.json({vocabList: vocabList});

} catch (error) {
   console.log(error);
}};
module.exports.getActivity = async (req, res, next) => { //I don't think this is used.
  
const cohort = req.user.cohort 
const activity = req.body.activity 
const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
  
};

module.exports.postActivity = async (req, res, next) => {
   try {
      
      console.log("Post Activity is running")
      const theCohort = await Cohort.findById(req.user.cohort._id);
      const activity = {
           date: req.body.date,
           description: req.body.description, //need to have a function double check and make sure the description has not already been used
           vocabWords: [],
           reviewedBy: [],
           type: req.body.activityType,
           additionalInfo: [],

      };
      theCohort.activities.push(activity);
      await theCohort.save(); 
      console.log(theCohort.activities);

      console.log("A new activity has been created!");
      if (req.body.activityType === "DD"){
         res.redirect("/admin/activityDD");
      } else if(req.body.activityType === "WaL"){
      res.redirect("/admin/activityWaL");
      console.log("THIS REDIECT RAN");
      } else if (req.body.activityType === "BS" && "CS"){
         req.res("/admin/activityP")
      }
   } catch (error) {
     console.log(error) 
   }

};
module.exports.postWaL = async (req, res) => {
   console.log("PostWaL is running!");
   console.log(req.body);
   console.log(req.body.activity)
   //console.log(req.files)
   let activities
   let activity
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
            const WalData= {
               videoURL: '',
               videoCloudinaryID: '',
               videoO: '',
               imageDURL: '',
               imageDCloudinaryID: '',
               imageDO: '',
               imageRURL: '',
               imageRCloudinaryID: '',
               imageRO: '',
               audioDURL: '',
               audioDCloudinaryID: '',
               audioRURL: '',
               audioRCloudinaryID: '',
               audioEURL: '',
               audioECloudinaryID: '',
            }; 
            activity.additionalInfo.push(WalData);
         }}}; 
         try {
            if (typeof req.files.video !== 'undefined') {
               if (activity.additionalInfo[0].videoURL !== '') {
                  const resultVD = await cloudinary.uploader.destroy(activity.additionalInfo[0].videoCloudinaryID, {resource_type: 'video'});
                  //console.log("ResultVD deleting video");
                  //console.log(resultVD)
               };
               const resultV = await cloudinary.uploader.upload(req.files.video[0].path, {resource_type: "video"});
               console.log(resultV);
               activity.additionalInfo[0].videoURL = resultV.secure_url;
               activity.additionalInfo[0].videoCloudinaryID = resultV.public_id;
               console.log(resultV.height)
               console.log(resultV.width);
               if(resultV.width < resultV.height){
                  activity.additionalInfo[0].videoO = 'v';
               } else if(resultV.width > resultV.height){
                  activity.additionalInfo[0].videoO = 'h';
               } else {activity.additionalInfo[0].videoO = 's';
            }};
         } catch (error) {
            console.log("Error upploading or updating video file");
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
               console.log(resultID);
               activity.additionalInfo[0].imageDURL = resultID.secure_url;
               activity.additionalInfo[0].imageDCloudinaryID = resultID.public_id0;
               if(resultID.width < resultID.height){
                  activity.additionalInfo[0].imageDO = 'v';
               } else if(resultID.width > resultID.height){
                  activity.additionalInfo[0].imageDO = 'h';
               } else {activity.additionalInfo[0].imageDO = 's';
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
               activity.additionalInfo[0].imageRURL = resultIR.secure_url;
               activity.additionalInfo[0].imageRCloudinaryID = resultIR.public_id;
                if(resultIR.width < resultIR.height){
                  activity.additionalInfo[0].imageRO = 'v';
                } else if (resultIR.width > resultIR.height){
                  activity.additionalInfo[0].imageRO = 'h';
                } else {activity.additionalInfo[0].imageRO = 's'
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
               activity.additionalInfo[0].audioDURL = resultAD.secure_url;
               activity.additionalInfo[0].audioDCloudinaryID = resultAD.public_id;
            };
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
               activity.additionalInfo[0].audioRURL = resultAR.secure_url;
               activity.additionalInfo[0].audioRCloudinaryID = resultAR.public_id;
            };
            } catch (error) {
              // console.log("Error uploading or deleting AudioR");
              // console.log(error);
         };
         try {
            if (typeof req.files.audioE !== 'undefined') {
               if (activity.additionalInfo[0].audioEURL !== '') {
                  const resultAED = await cloudinary.uploader.destroy(activity.additionalInfo[0].audioECloudinaryID);
                 // console.log("ResultAED deleting AudioE");
                  //console.log(ResultAED);
               };
               const resultAE = await cloudinary.uploader.upload(req.files.audioE[0].path, {resource_type: "auto"});
               activity.additionalInfo[0].audioEURL = resultAE.secure_url;
               activity.additionalInfo[0].audioECloudinaryID = resultAE.public_id;
            }
         } catch (error) {
            console.log("Error uploading or deleting AudioE");
            console.log(error);
      };
         console.log("uploads done")
         theCohort.markModified('activities');
      await theCohort.save(); 
      //WHAT IS THIS??
      /*for(let i= activities.length - 1; i > -1; i--){ //loop fixed for splice
         if(activities[i].type !== "WaL"){
         activities.splice(i, 1);
      }};*/
      //console.log(activities)
      res.redirect("/admin/activityWaL");
   } catch (error) {
      console.log(error)
      res.redirect("/admin/activityWaL");
   }
   console.log("WAL Done");
   //res.render("activityWaLAdmin",{ user: req.user, activities: activities});
}
module.exports.postVocabWord = async (req, res) => {
   
   console.log("Post VocabWord is running");
   console.log(req.body)
   //console.log(typeof(req.files.image))
   try {
      let theCohort = await Cohort.findById(req.user.cohort._id);

      console.log('theCohort.vocabWords.length');
      console.log(theCohort.vocabWords.length)
      
      let newIdent
      if(theCohort.vocabWords.length === 0){
         newIdent = 1;
      } else { for (let i = 1; i <= theCohort.vocabWords.length + 1; i++) {
         //console.log(i);
        //console.log(theCohort.vocabWords.some(vw => vw.ident === i))
         if(theCohort.vocabWords.some(vw => vw.ident === i) === false){
            newIdent = i;
            //console.log(`NewIdent: ${newIdent}`);
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
        ident: newIdent,
          
      };

   const activityDescription = req.body.activity;
      for (let i = 0; i < theCohort.activities.length; i++) {
         const element = theCohort.activities[i];
         console.log(element.description);
         console.log(element)
         if (element.description === activityDescription){
            console.log(element.vocabWords);
            element.vocabWords.push(vocabWord.ident);
            console.log(element.vocabWords);
         }};
   //console.log("ident")
   //console.log(vocabWord.ident);
   
      if (typeof req.files.image !== 'undefined') {
         const resultI = await cloudinary.uploader.upload(req.files.image[0].path, {resource_type: "auto"});
         vocabWord.imageUrl = resultI.secure_url;
         vocabWord.cloudinaryIdImage = resultI.public_id
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
      //console.log("vocabWord before save");
      
      theCohort.vocabWords.push(vocabWord);
   
      console.log("vocabWors");
      console.log(theCohort.vocabWords);
      console.log("Activities");
      console.log(theCohort.activities)
      theCohort.markModified('activities');
      theCohort = await theCohort.save();
            
      console.log('vocabWord after')
      console.log(theCohort)
            
      console.log("A new vocab word has been created!");
      //console.log(vocabWord._id);
   
      
   } catch (error) {
      console.log('catch')
      console.log(error)   
   }


   console.log('ready to redirect');
   res.redirect("/admin/activityDD");

};

module.exports.postVocabImage = async (req, res, next) => { //not being used
   try {
      // Upload image to cloudinary
      console.log(req.file)
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result.body)
      //console.log(result)
      console.log(`req.body.vocabWord: ${req.body.vocabWord}`)
      const vocabWordId = new ObjectId(req.body.vocabWord);
      console.log('vocabWordId')
      console.log(vocabWordId);
      let vocabWord = await VocabWord.find({_id: vocabWordId});
      vocabWord = vocabWord[0];
      console.log("next is vocabWord")
      console.log(vocabWord);
      vocabWord.cloudinaryIdImage = result.public_id;
      vocabWord.imageUrl = result.secure_url;
      vocabWord = await vocabWord.save();
      //console.log(res)
     
      console.log("The image was uploaded!");
      
    } catch (err) {
      console.log('image did not upload')
      console.log(err);
    }
    const activities = await Activity.find({cohort: req.user.cohort})    
    res.render("/admin/activityDD", {user: req.user, activities: activities}); //cohort is included in req.user! 
   };

module.exports.postAudios = async (req, res, next) => {//not being used?
   console.log(req.body)
   console.log("req.body.vocabWord is");
   console.log(req.body.vocabWord);
   console.log(req.files);
   
   try {
      let vocabWord = await VocabWord.find({_id:new ObjectId(req.body.vocabWord)});
      vocabWord = vocabWord[0];
  // console.log("next is vocabWord")
  // console.log(vocabWord);
  // console.log("typeof");
  // console.log(typeof req.files.audioT);
  //console.log(typeof req.files.audtioQ);
  //console.log(typeof req.files.audioN);

      if (typeof req.files.audioT !== 'undefined') {
         const result = await cloudinary.uploader.upload(req.files.audioT[0].path, { resource_type: "auto"});
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
      console.log("vocabWord before save")
      console.log(vocabWord)
      vocabWord = await vocabWord.save();
   } catch (err) {
      console.log(err);
   };

   const activities = await Activity.find({cohort: req.user.cohort})    
   res.render("cohortAdmin", {user: req.user, activities: activities}); 
}



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
   try {
      
   if(req.body.toDelete !== ''){
   const result = await cloudinary.uploader.destroy(req.body.toDelete);
   console.log('Image should be destoyed')
   console.log(result);
   };
   const resultNewImage = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
         imageUrl = resultNewImage.secure_url;
         cloudinaryIdImage = resultNewImage.public_id;

     
   let theCohort= await Cohort.findById(req.user.cohort);
   //let toMark  
   for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.cloudinaryIdImage === req.body.toDelete) {
         element.cloudinaryIdImage = cloudinaryIdImage;
         element.imageUrl = imageUrl;
         //toMark = i;
   }};
   theCohort.markModified('vocabWords');
       
   theCohort = theCohort.save();

} catch (error) {
     console.log(error);
   }
       
   res.redirect("/admin/activityDD"); 
}

module.exports.replaceAudioTis = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body);

   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log(resultD);
   /*if (resultD.result === 'not found' && vocabWord.cloudinaryIdTis !== ""){
      console.log(`There is a problem with the cloudinaryIdTis on ${vocabWord}`);
      //res. send error....
   } else {
*/
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   let theCohort= await Cohort.findById(req.user.cohort);

  for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.cloudinaryIdTis === req.body.toDelete) {
         element.cloudinaryIdTis = resultU.public_id;
         element.audioTis = resultU.secure_url;
         //toMark = i;
   }};
   theCohort.markModified('vocabWords');
       
   theCohort = theCohort.save();

/*  } */
   res.redirect("/admin/activityDD"); 
   } catch (error) {
      console.log(error);     
   };

};

module.exports.replaceAudioQ = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body);
 
    
   let theCohort= await Cohort.findById(req.user.cohort);
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log("resultD")
   console.log(resultD);
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   
 
  for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.cloudinaryIdQ === req.body.toDelete) {
         element.cloudinaryIdQ = resultU.public_id;
         element.audioQ = resultU.secure_url;
         //toMark = i;
   }};
   theCohort.markModified('vocabWords');
       
   theCohort = theCohort.save();  

   res.redirect("/admin/activityDD"); 
   } catch (error) {
      console.log(error);     
   };


}

module.exports.replaceAudioN = async (req, res) => {
   try {
   console.log("ReplaceAudioN is Running");
   console.log(req.body.toDelete);
    
   
   let theCohort= await Cohort.findById(req.user.cohort);
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log('resultD');
   console.log(resultD);
   console.log(req.file.path);
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   console.log(resultU);
    for (let i = 0; i < theCohort.vocabWords.length; i++) {
      const element = theCohort.vocabWords[i];
      if(element.cloudinaryIdN === req.body.toDelete) {
         element.cloudinaryIdN = resultU.public_id;
         element.audioN = resultU.secure_url;
         console.log(resultU.secure_url);
   }};
   theCohort.markModified('vocabWords');
       
   theCohort = theCohort.save();  
   
   res.redirect("/admin/activityDD"); 
   } catch (error) {
      console.log(error);     
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
            for (let i = 0; i < vwToDelete.length; i++) {
               const element = vwToDelete[i];
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
                     }};
                     theCohort.vocabWords.splice(index, 1);
         }}};
           

            //console.log("VW Array after");
            //console.log(theCohort.vocabWords);

         theCohort.activities.splice(i, 1);

      }};
     //console.log("Activities after");
     //console.log(theCohort.activities);
   
   //theCohort.markModified('activities'); //is this needed?
  
   theCohort = theCohort.save();  

   res.redirect("/admin"); 
   } catch (error) {
      console.log(error)
   }
}
/*
module.exports.replaceAudio = async (req, res, next) => {
   console.log('Delete Audio is running');
   console.log(req.body)
   console.log(req.body.toDelete);
   console.log('Id is');
   console.log(req.body.id);
   console.log('url is');
   console.log(req.body.url);
   
   const result = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log('Audio should be destoyed')
   console.log(result);
   
   let vocabWord = await VocabWord.find({ $or: [
      {cloudinaryIdTis: req.body.toDelete}, 
      {cloudinaryIdQ: req.body.toDelete}, 
      {cloudinaryIdN: req.body.toDelete}
   ]});
   if (typeof req.files.audioT !== 'undefined') {
         const result = await cloudinary.uploader.upload(req.files.audioT[0].path, { resource_type: "auto"});
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

      console.log("vocabWord before save")
      console.log(vocabWord)
      vocabWord = await vocabWord.save();
   
   
   console.log(vocabWord)
   vocabWord = vocabWord[0]; 
   
   console.log("this is vocabWord")
   console.log(vocabWord)
/*
   if (vocabWord.cloudinaryIdTis === req.body.toDelete) {
      vocabWord.cloudinaryIdTis = "";
      vocabWord.audioTis = ""; 
   }
   
   if (vocabWord.cloudinaryIdQ === req.body.toDelete){
      vocabWord.cloudinaryIdQ = "";
      vocabWord.audioQ = ""; 
   }
   if (vocabWord.cloudinaryIdN === req.body.toDelete){
      vocabWord.cloudinaryIdN = "";
      vocabWord.audioN = ""; 
   }
   console.log("this is vocabWord after");
   console.log(vocabWord);
   vocabWord = await vocabWord.save();

   const activities = await Activity.find({cohort: req.user.cohort})    
   res.render("cohortAdmin", {user: req.user, cohort: req.user.cohort, activities: activities}); 

};
*/
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
   theCohort = theCohort.save();
      
   } catch (error) {
      console.log(error)
};
   res.redirect("/adminDD");

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

