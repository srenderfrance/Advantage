const passport = require("passport");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const ObjectId = require('mongodb').ObjectId;


module.exports.getStudent = async (req, res) => {
   console.log('get Student is running')
   let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
   //console.log(activities);
   const selectedVocab = await VocabWord.find({'_id': {$in: req.user.wordsSelected}});
   console.log("selectedvocab");
   console.log(selectedVocab)
   res.render("student",  {student: req.user, activities: activities, selectedVocab: selectedVocab}); //selectedVocab is included in "student" ie req.user.wordsSelected. I need to rewrite the ejs to user that instead.
 };

 module.exports.getSelectedVocab = async (req, res) => {
   try {  
      console.log("Get Selected Vocab is running") 
      const selectedVocab = await VocabWord.find({'_id': {$in: req.user.wordsSelected}});
      res.json({selectedVocab: selectedVocab});
      //console.log("")
      //console.log(selectedVocab);

   } catch (error) {
     console.log(error) 
   }

 }
 module.exports.reviewActivity = async (req, res, next) => {

    console.log(req.body);
    console.log(req.body.activity);

    const activity = await Activity.where('description').equals(req.body.activity);

    console.log(activity[0]._id)
    const vocabList = await VocabWord.find({activity: activity[0]._id});

    console.log(vocabList)
    console.log(vocabList.length)
    console.log(vocabList[0].audioN);

    res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.activity});
};

 module.exports.getVocabList = async (req, res) => {
   try {
      
      console.log('this is getVocab')
      console.log(req.body)
     let vocabList; 
     console.log(vocabList)
      for (let i = 0; i < req.user.individualExercises.length; i++) {
            if(req.body.activity === req.user.individualExercises[i].description) {
               const vocabWords = req.user.individualExercises[i].vocabWords;
               vocabList = await VocabWord.find({'_id': {$in: vocabWords}});
            }   
      }
      console.log(vocabList);
      console.log(typeof(vocabList))
      if (typeof(vocabList) == 'object'){
         console.log('this is vocabList')
         console.log(vocabList);
         res.json({vocabList: vocabList});
      } else {
         console.log("this the else")
         const activity = await Activity.where('description').equals(req.body.activity);//need to add  .equals(req.user.cohort)   
         vocabList = await VocabWord.find({activity: activity[0]._id});
         res.json({vocabList: vocabList});
      }
   } catch (error) {
      console.log(error)
   }
};

module.exports.userReviewResults = async (req, res, next) => {
   try {   
      let reviewResults = req.body.infoToSend;
   console.log('reviewResults');
   console.log(reviewResults);
   
   let student = await User.findById(req.user._id);
   console.log(student);

//adds statst to reviewStats
   console.log(`total words: ${student.totalWords}`);
   console.log(`total reviews: ${student.totalReviews}`);
 
   if (student.hasReviewed.includes(reviewResults.activity) === false) {
      student.totalWords = student.totalWords + reviewResults.numberOfWords;
      };
   student.totalReviews = student.totalReviews + reviewResults.numberOfReviews;
   
   console.log(`total words: ${student.totalWords}`);
   console.log(`total reviews: ${student.totalReviews}`);     
 
   //adds selectedWords to user
   console.log(student)
   console.log(student.wordsSelected.includes(reviewResults.wordsSelected[0]))
   reviewResults.wordsSelected.forEach(element => {
      
      if (!student.wordsSelected.includes(element)){
         student.wordsSelected.push(element);
      }
      console.log("updated words selected")
      console.log(student.wordsSelected);
   });
//add problemwords to user
   reviewResults.mistakes.forEach(element => {
      student.problemWords.push(element);
   })
   console.log(student)
       //adds activity to has reviewed
      let isCustomActivity = false
      for (let i = 0; i < req.user.individualExercises.length; i++) {
            if(reviewResults.activity === req.user.individualExercises[i].description) {
               isCustomActivity = true
      }}
   if (isCustomActivity === false){   
      await Activity.where()
      if (student.hasReviewed.includes(reviewResults.activity) === false) {
         student.hasReviewed.push(reviewResults.activity);
      } else {console.log("I don't know what happened")}
   } else {console.log(`Custom Activity Name is ${reviewResults.activity}`)};

   console.log(student);
   //need an if else for when there is nothing to save

   await student.save();

   res.redirect("/student");
   } catch (err) {
      console.log(err);
   }
    //  let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
   

};

module.exports.createCustomActivity = async (req, res) => {
   try {
      console.log('CreateCustom Activity is running')
      console.log(req.body.activityName);
      console.log(req.body.activityVocab)
      console.log('user wordsSelected');
      console.log(req.user.wordsSelected)

      let student = await User.findById(req.user._id);

      for (let i = 0; i < req.body.activityVocab.length; i++) {
         if (student.wordsSelected.includes(req.body.activityVocab[i])) {
            index = student.wordsSelected.indexOf(req.body.activityVocab[i])
            student.wordsSelected.splice(index, 1);
            console.log("there was match")
      }};

      const newActivity = {description: req.body.activityName, vocabWords: req.body.activityVocab};

      student.individualExercises.push(newActivity);
      console.log(student.individualExercises)

      await student.save();
      //const vocabWordId = new ObjectId(req.body.vocabWord);


      /*let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
      console.log(activities);
      const selectedVocab = await VocabWord.find({'_id': {$in: req.user.wordsSelected}});
      console.log("selectedvocab");
      console.log(selectedVocab)*/
 
   } catch (error) {
      console.log(error)
   }

   res.redirect("/student");
}

module.exports.reviewCustomActivity = async (req, res) => {
   console.log("revewCustomActivity is running");
   console.log(req.body);
   console.log(req.body.activity);
   const customActivity = req.body.activity;
   let vocabArray
   for (let i = 0; i < req.user.individualExercises.length; i++) {
      if (customActivity === req.user.individualExercises[i].description)
      vocabArray = req.user.individualExercises[i].vocabWords;   
   }
   console.log("this is vocabArray");
   console.log(vocabArray);
   const vocabList = await VocabWord.find({'_id': {$in: vocabArray}});
   console.log(vocabList);

    res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.activity});


};

module.exports.reviewreviewByTopic = async (req, res) => {
   console.log("reviewByTopic is running")
};