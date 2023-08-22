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
    console.log(activities);

    res.render("student",  {student: req.user, activities: activities});
 };

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
   console.log('this is getVocab')
   console.log(req.body)
   const activity = await Activity.where('description').equals(req.body.activity);   
   const vocabList = await VocabWord.find({activity: activity[0]._id});
   res.json({vocabList: vocabList});

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
   if (student.hasReviewed.includes(reviewResults.activity) === false) {
      student.hasReviewed.push(reviewResults.activity);
   };
   
   console.log(student);
   //need an if else for when there is nothing to save

   await student.save();
   } catch (err) {
      console.log(err);
   }
    //  let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
   
   // res.render("study", {student: req.user, activities: activities});

};
