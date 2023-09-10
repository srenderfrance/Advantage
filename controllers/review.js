const passport = require('passport');
const { default: mongoose } = require('mongoose');
const validator = require('validator');
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require('../models/user');
const Activity = require('../models/activity');
const Category = require('../models/category');
const cloudinary = require('../middleware/cloudinary');
const ObjectId = require('mongodb').ObjectId;


module.exports.getStudent = async (req, res) => {
   try {
      console.log('get Student is running')
      let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
      //console.log(activities);
      const selectedVocab = await VocabWord.find({'_id': {$in: req.user.wordsSelected}});
      console.log("selectedvocab");
      console.log(selectedVocab)
      const categories = await Category.find({});
      res.render("student",  {student: req.user, activities: activities, selectedVocab: selectedVocab, categories: categories}); //selectedVocab is included in "student" ie req.user.wordsSelected. I need to rewrite the ejs to user that instead.
   } catch (error) {
      console.log(error);

   }
};

module.exports.getSelectedVocab = async (req, res) => {
   try {  
      console.log("Get Selected Vocab is running") 
      const selectedVocab = await VocabWord.find({'_id': {$in: req.user.wordsSelected}});
      res.json({selectedVocab: selectedVocab});
      //console.log("")
      //console.log(selectedVocab);

   } catch (error) {
     console.log(error); 
   };
};

 module.exports.reviewActivity = async (req, res, next) => {
   try {
      //console.log(req.body);
      console.log(req.body.activity);
      const activity = await Activity.where('description').equals(req.body.activity).where('cohort').equals(req.user.cohort);
      console.log(activity[0]._id)
      const vocabList = await VocabWord.find({activity: activity[0]._id});
      console.log(vocabList)
      console.log(vocabList.length)
      //console.log(vocabList[0].audioN);
      const student = await User.findById(req.user._id);
      console.log(student.currentVocabList)
      student.currentVocabList = vocabList;
      await student.save();
      res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.activity});
   } catch (error) {
      console.log(error);
   };
};

 module.exports.getVocabList = async (req, res) => {
   try {
      console.log('this is getVocab');
      console.log(req.user.currentVocabList);
      const vocabList = req.user.currentVocabList;
      console.log(vocabList);
      res.json({vocabList: vocabList});
 
      /*console.log(req.body)
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
      } else if (req.body.activity === "Challenging Words"){
          if (req.user.problemWords.length < 13) { 
            vocabArray = req.user.problemWords;
         } else {
            console.log("about to slice")
            let toRemove = req.user.problemWords.length - 12;
            //toRemove = `-${toRemove}`;
            console.log(toRemove)
            vocabArray = req.user.problemWords;
            vocabArray.splice(11, toRemove);
            console.log(vocabArray);
         }
      const vocabList = await VocabWord.find({'_id': {$in: vocabArray}});
      res.json({vocabList: vocabList});
      } else {
         console.log("this the else")
         const activity = await Activity.where('description').equals(req.body.activity).where('cohort').equals(req.user.cohort);   
         console.log("Activity")
         console.log(activity)
         vocabList = await VocabWord.find({activity: activity[0]._id});
         res.json({vocabList: vocabList});
      }*/
   } catch (error) {
      console.log(error);
   };
};

module.exports.userReviewResults = async (req, res, next) => {
   try {   
      console.log("Processing userReviewResults!!!")
      let student = await User.findById(req.user._id);
      //console.log(student);

      let activity;
      let reviewResults = req.body.infoToSend;
      let isCustomActivity = false
      for (let i = 0; i < req.user.individualExercises.length; i++) {
         if(reviewResults.activity === req.user.individualExercises[i].description) {
            isCustomActivity = true;
      }};
      let categories = await Category.find({});
      let isReviewByCategory = false;
      console.log("NEW Categories!!");
      console.log(categories);
      console.log("Review Results Activity")
      console.log(reviewResults.activity)
      for (let i = 0; i < categories.length; i++) {
         if(reviewResults.activity === categories[i].category){
            console.log(categories[i].category)
            isReviewByCategory = true;
         }}
         if (reviewResults.activity === 'All'){
            isReviewByCategory = true;
         };

         console.log("Review By Category")
         console.log(isReviewByCategory)
      //console.log(`total words: ${student.totalWords}`);
      //console.log(`total reviews: ${student.totalReviews}`);
      console.log("reviewResults.Activity");
      console.log(reviewResults.activity)
      console.log("Not Challenging Words?");
      console.log(reviewResults.activity !== "Challenging Words");
     
      if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false){   
         console.log('Has Reviewed included?');

         activity = await Activity.where('description').equals(reviewResults.activity).where('cohort').equals(req.user.cohort);
         console.log("Returned activity is:");
         console.log(activity);
      //adds stats to reviewStats
     
      if (student.hasReviewed.includes(activity[0]._id) === false) {
         student.totalWords = student.totalWords + reviewResults.numberOfWords;
      }};
      student.totalReviews = student.totalReviews + reviewResults.numberOfReviews;
      
      console.log(`total words: ${student.totalWords}`);
      console.log(`total reviews: ${student.totalReviews}`);
      //console.log('reviewResults');
      //console.log(reviewResults);
      //console.log('vocabList from excercise');
      //console.log(reviewResults.vocabList);
         
      
     

//updates wordsReviewed
      //console.log('wordsReviewed');
      //console.log(student.wordsReviewed);
      
      for (let i = 0; i < student.wordsReviewed.length; i++) {
         for (let i2 = 0; i2 < reviewResults.vocabList.length; i2++){
         if (student.wordsReviewed[i]._id === reviewResults.vocabList[i2]._id){ //this is not working
            console.log("wordsRevies[i].total reviews")
            console.log(student.wordsReviewed[i].totalReviews);
            console.log(reviewResults.numberOfReviews);
            let newTotal = student.wordsReviewed[i].totalReviews + reviewResults.numberOfReviews;
            student.wordsReviewed[i].totalReviews = newTotal;
            console.log("total after")
            console.log(student.wordsReviewed[i])
            
         }}
      };
      student.markModified('wordsReviewed');

      if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false) {
         if (student.hasReviewed.includes(activity[0]._id) === false ){
         for (let i = 0; i < reviewResults.vocabList.length; i++){
            let wordObject = {
               "_id": reviewResults.vocabList[i]._id,
               "category": reviewResults.vocabList[i].category,
               "totalReviews": reviewResults.numberOfReviews,
            };
            student.wordsReviewed.push(wordObject)
         }  
      }};

      //console.log('wordsReviewed');
      //console.log(student.wordsReviewed);
      
//adds selectedWords to user
      //console.log(student)
      console.log(student.wordsSelected.includes(reviewResults.wordsSelected[0]))
      reviewResults.wordsSelected.forEach(element => {  
         if (!student.wordsSelected.includes(element)){
            student.wordsSelected.push(element);
         };
      console.log("updated words selected")
      console.log(student.wordsSelected);
      });
//add problemwords to user
      console.log("dealing with problemWords");
      console.log(student.problemWords);
      if (reviewResults.activity === "Challenging Words") {
         if (req.user.problemWords.length < 13) { 
               vocabArray = req.user.problemWords;
            } else {
               console.log("about to slice")
               let toRemove = req.user.problemWords.length - 12;
               toRemove = `-${toRemove}`;
               console.log(toRemove)
               vocabArray = req.user.problemWords.slice(0, toRemove);
               console.log(vocabArray);
            } 
         vocabArray.forEach(element => {
         student.problemWords.shift();  
      })};
      console.log("after first if");
      console.log(student.problemWords);
      for (let i = 0; i < reviewResults.mistakes.length; i++) {
         for (let i2 = 0; i2 < student.problemWords.length; i2++) {
            if (reviewResults.mistakes[i] === student.problemWords[i2]) {
               student.problemWords.splice(i2, 1);
            }
         }
      }
      console.log("after splice");
      console.log(student.problemWords);
      reviewResults.mistakes.forEach(element => {
      student.problemWords.push(element);
      console.log('before shift');
      console.log(`Number of Problem Words is: ${student.problemWords.length}`);
  
   if (student.problemWords.length > 36) {
      for (let i = 0; i < student.problemWords.length - 36; i++) {
         student.problemWords.shift();
      }
        }
      console.log("afterShift");
      console.log(`Number of Problem Words is: ${student.problemWords.length}`);
      let vocabArray = [...new Set(student.problemWords)]; 
      student.problemWords = Array.from(vocabArray);
      });
   console.log(student)
       //adds activity to has reviewed
  
   if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false){   
      console.log("ActivityToAdd")
      console.log(activity)
      console.log(student.hasReviewed.includes(activity[0]._id))
      if (student.hasReviewed.includes(activity[0]._id) === false) {
         student.hasReviewed.push(activity[0]._id);
      } else {
         
         console.log("Activity has previously been reviewed")};
   } else if (reviewResults.activity === "Challenging Words") {
      console.log("Else if Challenging Words");
   } else {console.log(`Custom Activity Name is ${reviewResults.activity}`)};

   console.log(student);
   //need an if else for when there is nothing to save

   await student.save();

   res.redirect("/student");
   } catch (error) {
      console.log(error);
   };
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
      console.log(error);
   };
   res.redirect("/student");
};

module.exports.reviewCustomActivity = async (req, res) => {
   try {
      console.log("reviewCustomActivity is running");
      //console.log(req.body);
      console.log(req.body.activity);
      const customActivity = req.body.activity;
      let vocabArray
      if (customActivity === 'Challenging Words') {
         console.log("Challenging Words!!");
         console.log(req.user.problemWords.length);
         if (req.user.problemWords.length < 13) { 
            console.log('less than 13');
            vocabArray = req.user.problemWords;
            console.log("if < 13");
            console.log(vocabArray);
         } else {
            console.log("more than 13");
            console.log("about to splice");
            let toRemove = req.user.problemWords.length - 12;
            //toRemove = `-${toRemove}`;
            console.log(toRemove)
            vocabArray = req.user.problemWords
            vocabArray.splice(11, toRemove);
            console.log(vocabArray);
            }
      } else {
         for (let i = 0; i < req.user.individualExercises.length; i++) {
            if (customActivity === req.user.individualExercises[i].description)
            vocabArray = req.user.individualExercises[i].vocabWords;   
      }};
   console.log("this is vocabArray");
   console.log(vocabArray);
   const vocabList = await VocabWord.find({'_id': {$in: vocabArray}});
   console.log(vocabList);
   const student = await User.findById(req.user._id);
   student.currentVocabList = vocabList;
   await student.save();
   res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.activity});
   } catch (error) {
      console.log(error);
   };
};

module.exports.reviewByCategory = async (req, res) => {
   try {
      console.log("reviewByTopic is running")
      console.log(req.body);
      console.log(req.body.categoryToReview);
      const category = req.body.categoryToReview;
      
      let vocab = req.user.wordsReviewed;
      let vocabArray = [];
      makeRandomIndex = function(arr) {
         return Math.floor(Math.random() * arr.length)
      };

      makeRandomElement = function(arr) { //randomly removes an element from an array then returns that element
         let newArray = arr.splice(makeRandomIndex(arr), 1);
         return newArray[0]
      };
      shuffleArray = function(arr, length) { //l = will be the length of new array.
         let newArray = [];
         for (let i = 0; i < length; i++){
             let randomElement = makeRandomElement(arr);
             newArray.push(randomElement)
         };
         return newArray;
      };

      if (category !== 'All') {
         for (let i = 0; i < vocab.length; i++) {
            if (vocab[i].category === category){
               vocabArray.push(vocab[i])
         }};
      } else if (category === 'All') {
         vocabArray = vocab;
      } else {
         console.log('Selected Category was not found. Something is wrong!') //This should turn into an alert or something....
      };
      console.log("Array before sort");
      console.log(vocabArray);
      if (vocabArray === undefined ||vocabArray.length < 5){
         console.log("Less than 5 vocab words were found.");
         res.redirect("/student");
      } else {
         vocabArray.sort((a, b) => {
            return a.totalReviews - b.totalReviews;
         });

         console.log("Array after sort");
         console.log(vocabArray);
//sellect the lest reviewed group of vwords that includes at least 12 words
         let workingArray = [];
         console.log(workingArray.length);
         console.log(workingArray.length < 12);
         let x = 1;
         if (vocabArray.length > 12) {
            console.log('step 1')
            while (workingArray.length < 12) {
               console.log("Your WHILE loop is running!")
               vocabArray.forEach(e => {
                  if (e.totalReviews === x){
                     console.log(e.totalReviews);
                     workingArray.push(e);
               }});
            x++;
            console.log(`x is ${x}`)
            };

         
         vocabArray = shuffleArray(workingArray, 12);
         console.log('vocabArray after shuffle')
         console.log(vocabArray.length);
         console.log(vocabArray);
         };

         let vocabArray2 = vocabArray.map((x) => x = x._id);
         console.log("maped array");
         console.log(vocabArray2);

         vocabArray = await VocabWord.find({'_id': {$in: vocabArray2}});

         const vocabList = shuffleArray(vocabArray, 12);
         const student = await User.findById(req.user._id);
         student.currentVocabList = vocabList; 
         await student.save();
         
      res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.categoryToReview});
      };

   } catch (error) {
     console.log(error); 
   };
};

module.exports.deleteCustomActivity = async (req, res) => {
   try {
      console.log("Delete Custom Activity is running");
      console.log(req.body);
      let student = await User.findById(req.user._id);
      console.log(student);
      for (let i = 0; i < student.individualExercises.length; i++) {
         if (req.body.activityToDelete === student.individualExercises[i].description){
            student.individualExercises.splice(i, 1);
      }}
      console.log('after');
      console.log(student.individualExercises);
      await student.save();

   } catch (error) {
   console.log(error);      
   }
res.redirect("/student");
};