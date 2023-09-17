const passport = require("passport");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const PreReg = require("../models/preReg");
const ObjectId = require('mongodb').ObjectId;
const Category = require('../models/category');


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

module.exports.createReg = async (req, res, next) => {
   console.log(req.body);

   const newPreReg = await PreReg.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
   });
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
   console.log(req.body)
   const activityDescription = req.body.activity;
   const cohort = req.user.cohort 
   const activity = await  Activity.where("cohort").equals(cohort).where("description").equals(activityDescription);
   console.log("first Activity ID")
   console.log(activity[0]._id);
   console.log(activity)
   const vocabList = await VocabWord.where("activity").equals(activity[0]._id);
   console.log(vocabList);
   res.json({vocabList: vocabList});
};
module.exports.getActivity = async (req, res, next) => { //I don't think this is used.
  
const cohort = req.user.cohort 
const activity = req.body.activity 
const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
  
};

module.exports.postActivity = async (req, res, next) => {
   console.log("Post Activity is running")
   const activity = await Activity.create({
        cohort: req.user.cohort,
        date: req.body.date,
        description: req.body.description, //activity names need to be unique with a cohort
        vocabWords: []

   });
   console.log("A new activity has been created!");
   //console.log(activity);
   const cohort = await Cohort.findOne({cohortName:activity.cohort})
   cohort.activities.push(activity._id);
   await cohort.save(); //add try/catch for errors  
   res.redirect("/admin");
};

module.exports.postVocabWord = async (req, res, next) => {
   console.log("Post VocabWord is running")
   console.log(req.body)
   
   console.log(req.files)
   let activity = await Activity.where("description").equals(req.body.activity).where("cohort").equals(req.user.cohort);
   console.log('activity returned');
   console.log(activity)
   console.log("TRIED TO SAVE NEW VOCABWORD TO DATABASE")
   let vocabWord = await VocabWord.create({
     cohort: req.user.cohort,
     description: req.body.description,
     activity: activity[0]._id,
     category: req.body.category,
     imageUrl: '',
     cloudinaryIdImage: '',
     audioiTis: '',
     cloudinaryIdTis: '',
     audioQ: '',
     cloudinaryIdQ: '',
     audioN: '',
     cloudinaryIdN: '',
       
   });

      try {
      if (typeof req.files.image !== 'undifined') {
         const resultI = await cloudinary.uploader.upload(req.files.image[0].path, {recourse_type: "auto"});
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
      console.log("vocabWord before save");
   
   vocabWord = await vocabWord.save();
   
   console.log('vocabWord after')
   console.log(vocabWord)
   
   activity = activity[0];
   console.log("A new vocab word has been created!");
   //console.log(vocabWord._id);
   
      
   } catch (error) {
   console.log('catch')
   console.log(error)   
   }

   //const activities = await Activity.find({cohort: req.user.cohort})    
   console.log('ready to redirect')
   res.redirect("/admin") // req.user.cohort is included in req.user!

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
    res.render("cohortAdmin", {user: req.user, activities: activities}); //cohort is included in req.user! 
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

     const vocabWordId = new ObjectId(req.body.vocabWordId);

      // console.log(vocabWordId);
      let vocabWord = await VocabWord.findById(vocabWordId);
      console.log(vocabWord)
      console.log(vocabWord[0]);
 
 
   
      console.log(typeof req.body.newVWDescription);
      console.log(typeof req.body.newVWCategory);

      if  (typeof req.body.newVWDescription !== 'undefined') {
      vocabWord.description = req.body.newVWDescription;
      console.log('description updated')
      };   
      
      if (typeof req.body.newVWCategory !== 'undefined') {
         vocabWord.category = req.body.newVWCategory;
         console.log(vocabWord.category)
         console.log(req.body.newVWCategory)
         console.log('category updated')
      };
      vocabWord = await vocabWord.save();
      console.log("VocabWord after save");
      console.log(vocabWord);
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
      
   
   const result = await cloudinary.uploader.destroy(req.body.toDelete);
   console.log('Image should be destoyed')
   console.log(result);
 
   const resultNewImage = await cloudinary.uploader.upload(req.file.path, {recourse_type: "auto"});
         imageUrl = resultNewImage.secure_url;
         cloudinaryIdImage = resultNewImage.public_id;

     
   let vocabWord = await VocabWord.where('cloudinaryIdImage').equals(req.body.toDelete);
   vocabWord = vocabWord[0];
   
   console.log("this is vocabWord");
   console.log(vocabWord);
    
   vocabWord.cloudinaryIdImage = cloudinaryIdImage;
   vocabWord.imageUrl = imageUrl;
   
   console.log("this is vocabWord after");
   console.log(vocabWord);
   
   vocabWord = await vocabWord.save();

} catch (error) {
     console.log(error);
   }
       
   res.redirect("/admin"); 
}

module.exports.replaceAudioTis = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body);
   let vocabWord = await VocabWord.where('cloudinaryIdTis').equals(req.body.toDelete);
   vocabWord = vocabWord[0];
   console.log('vocabWord');
   console.log(vocabWord);
   console.log("are they =");
   console.log(req.body.toDelete === vocabWord.cloudinaryIdTis);
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {resource_type: 'video'});
   console.log(resultD);
   if (resultD.result === 'not found' && vocabWord.cloudinaryIdTis !== ""){
      console.log(`There is a problem with the cloudinaryIdTis on ${vocabWord}`);
      //res. send error....
   } else {


   console.log(`vW cIdTis is: ${vocabWord.cloudinaryIdTis}`);
   console.log(`vW adioTis is: ${vocabWord.audioTis}`)
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   vocabWord.cloudinaryIdTis = resultU.public_id;
   vocabWord.audioTis = resultU.secure_url;
   console.log(`vW cIdTis is: ${vocabWord.cloudinaryIdTis}`);
   console.log(`vW adioTis is: ${vocabWord.audioTis}`);
      
   vocabWord = await vocabWord.save();
   } 
   res.redirect("/admin"); 
   } catch (error) {
      console.log(error);     
   };

};

module.exports.replaceAudioQ = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body);
   let vocabWord = await VocabWord.where('cloudinaryIdQ').equals(req.body.toDelete);
   vocabWord = vocabWord[0];
   console.log(vocabWord);
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {recourse_type: 'video'});
   console.log("resultD")
   console.log(resultD);
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   vocabWord.cloudinaryIdQ = resultU.public_id;
   vocabWord.audioQ = resultU.secure_url;
   vocabWord = await vocabWord.save();

   res.redirect("/admin"); 
   } catch (error) {
      console.log(error);     
   };


}

module.exports.replaceAudioN = async (req, res) => {
   try {
   console.log(req.file);
   console.log(req.body.toDelete)
   console.log(req.body);
   let vocabWord = await VocabWord.where('cloudinaryIdN').equals(req.body.toDelete);
   vocabWord = vocabWord[0];
   console.log(vocabWord);
   const resultD = await cloudinary.uploader.destroy(req.body.toDelete, {recourse_type: 'video'});
   console.log('resultD');
   console.log(resultD);
   const resultU = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
   vocabWord.cloudinaryIdN = resultU.public_id;
   vocabWord.audioN = resultU.secure_url;
   vocabWord = await vocabWord.save();

   res.redirect("/admin"); 
   } catch (error) {
      console.log(error);     
   };
}
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
*/
};

module.exports.deleteVWord = async (req, res) => {
   console.log('delete word is running')
   console.log(req.body.vocabWordId);
   try {
        let vocabWord = await VocabWord.findById(new ObjectId(req.body.vocabWordId));

      if (vocabWord.cloudinaryIdTis !== "") {
          const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdTis, {resource_type: 'video'});
      };
      if (vocabWord.cloudinaryIdQ !== ""){
         const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdQ, {resource_type: 'video'});
      };
      if (vocabWord.cloudinaryIdN === req.body.toDelete){
         const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdN, {resource_type: 'video'});
      };
      if (vocabWord.cloudinaryIdImage !== ""){
         const result = await cloudinary.uploader.destroy(vocabWord.cloudinaryIdImage);
      };
      const response = await VocabWord.deleteOne({ _id: vocabWord._id });
      console.log(response)
      
   } catch (error) {
      console.log(error)
};
   res.redirect("/admin");

};
