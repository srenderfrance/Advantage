const passport = require('passport');
const { default: mongoose } = require('mongoose');
const validator = require('validator');
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require('../models/user');
const Activity = require('../models/activity');
const Category = require('../models/category');
const cloudinary = require('../middleware/cloudinary');
const { format } = require('morgan');
const ObjectId = require('mongodb').ObjectId;


module.exports.getStudent = async (req, res) => {
   try {
      console.log('get Student is running CONTROLLER')
      let cohort = await Cohort.findById(req.user.cohort);
      let activities = cohort.activities;
      const categories = cohort.categories;
      let wordsSelected = [];
      for (let i = 0; i < req.user.wordsSelected.length; i++) {
         const selectedIdenx = req.user.wordsSelected[i];
         for (let index = 0; index < cohort.vocabWords.length; index++) {
            const vocabWord = cohort.vocabWords[index];
            if (selectedIdenx === vocabWord.ident){
               wordsSelected.push(vocabWord);
      }}};
   const vocabArray = cohort.vocabWords
   const totalVocab = function () {
      let total = 0
      const userId = req.user._id.toString();
      for (let i = 0; i < vocabArray.length; i++) {
         const usedByArray = vocabArray[i].reviewedBy;
         for (let index = 0; index < usedByArray.length; index++) {
            const element = usedByArray[index];
            if (element._id.toString().includes(userId) && !vocabArray[i].category.includes("Phrases")) {
            total++;
            }  //else {console.log(vocabArray[i].description)}
      }};  
   return total;
   };
   if (req.user.totalWords !== totalVocab())  {
      console.log("Updating user.totalWords");
      console.log("New total created equals")
      const student = await User.findById(req.user._id);
      student.totalWords = totalVocab();
      console.log("new Total")
      console.log(student.totalWords)
      await student.save();  
   };
   const checkReviews = (element) => element._id.toString() === req.user._id.toString();
   const notReviewed = activities.filter(e => {         
      if(e.reviewedBy.some(checkReviews) === false){
          return true;
   }});
      let activitiesDD = [];
      let activitiesS = [];
      let activitiesWaL = [];
      let activityToSort;
      console.log(activities.length);
      let reviewed = activities.filter(e => {         
         if(e.reviewedBy.some(checkReviews)){
            return true;
      }});
      console.log("Reviewed");
      console.log(reviewed.length);
      const totalActivities = reviewed.length;
      for (let i = 0; i < reviewed.length; i++){
            const element = reviewed[i];
         if(element.hasOwnProperty('type')){
            console.log("IT HAS A TYPE")
            if (element.type === "DD") {
               activitiesDD.unshift(element);
               console.log(`Activities DD length: ${activitiesDD.length}`)
            } else if(element.type === 'WaL'){
               console.log('WAL');
               console.log(element.reviewedBy);
               activitiesWaL.unshift(element);
               console.log(`Activities WALL: ${activitiesWaL.length}`)
            } else if (element.type === 'CS' && 'BS'){
               activitiesS.unshift(element);
            };
         } else { 
         activitiesDD.unshift(element);
         } //console.log(activitiesDD[i]);
      }

      res.render("student",  {student: req.user, totalActivities: totalActivities, activitiesDD: activitiesDD, activitiesS: activitiesS, activitiesWaL: activitiesWaL, categories: categories, wordsSelected: wordsSelected, notReviewed: notReviewed});
   } catch (error) {
      console.log(error);

   }
};

module.exports.getDictionary = async (req, res) => {
   try {
      const cohort = await Cohort.findById(req.user.cohort);
      let wordsSelected = [];
      for (let i = 0; i < req.user.wordsSelected.length; i++) {
         const selectedIdenx = req.user.wordsSelected[i];
         for (let index = 0; index < cohort.vocabWords.length; index++) {
            const vocabWord = cohort.vocabWords[index];
            if (selectedIdenx === vocabWord.ident){
               wordsSelected.push(vocabWord);
      }}};
      const categories = cohort.categories;
      const dictionary = [];
      for (let i = 0; i < cohort.vocabWords.length; i++) {
         const vocabWord = cohort.vocabWords[i];
         let filteredVocabWord;
            for (let i2 = 0; i2 < vocabWord.reviewedBy.length; i2++) {
               element = vocabWord.reviewedBy[i2];
               const checkReviews = (element) => element._id.toString() === req.user._id.toString();
               console.log(vocabWord.reviewedBy.some(checkReviews)); 
               if(vocabWord.reviewedBy.some(checkReviews) === true){
                  filteredVocabWord = {
                     description: vocabWord.description,
                     category: vocabWord.category,
                     imageUrl: vocabWord.imageUrl,
                     audioN: vocabWord.audioN,
                     ident: vocabWord.ident,
                  };
                  dictionary.push(filteredVocabWord);
                  break;
               }}
         
      }
      res.render("customAandD", {student: req.user, categories: categories, dictionary: dictionary, wordsSelected: wordsSelected});
   } catch (error) {
      console.log(error);
   
   }
};
module.exports.getAllVocab = async (req, res) => {
   try {
      console.log("getAllVocab is Running")
      const cohort = await Cohort.findById(req.user.cohort);
      const dictionary = [];
      for (let i = 0; i < cohort.vocabWords.length; i++) {
         const vocabWord = cohort.vocabWords[i];
         let filteredVocabWord;
            for (let i2 = 0; i2 < vocabWord.reviewedBy.length; i2++) {
               element = vocabWord.reviewedBy[i2];
               const checkReviews = (element) => element._id.toString() === req.user._id.toString();
               //console.log(vocabWord.reviewedBy.some(checkReviews)); 
               if(vocabWord.reviewedBy.some(checkReviews) === true){
                 
                  
                  filteredVocabWord = {
                     description: vocabWord.description,
                     category: vocabWord.category,
                     imageUrl: vocabWord.imageUrl,
                     audioN: vocabWord.audioN,
                     ident: vocabWord.ident,
                  };
                  dictionary.push(filteredVocabWord);
                  break;
      }}};
      res.json({dictionary: dictionary});
   } catch (error) {
      console.log(error);
   }
}
module.exports.getSelectedVocab = async (req, res) => {//needs to be tested
   try {  
      console.log("Get Selected Vocab is running"); 
      let selectedVocab = [];
      const theCohort = await Cohort.findById(req.user.cohort);
      for (let i = 0; i < req.user.wordsSelected.length; i++) {
         const selection = req.user.wordsSelected[i];
         for (let index = 0; index < theCohort.vocabWords.length; index++) {
            const vocabWord = theCohort.vocabWords[index];
            if(selection === vocabWord.ident){
               selectedVocab.push(vocabWord);
      }}};
     
      res.json({selectedVocab: selectedVocab});

   } catch (error) {
     console.log(error); 
   };
};

 module.exports.reviewActivity = async (req, res, next) => {
   let activityVocab = [];
   let vocabList = [];
   let activity
   try {
      const theCohort = await Cohort.findById(req.user.cohort);      
       for (let i = 0; i < theCohort.activities.length; i++){
            if(theCohort.activities[i].description === req.body.activity){
               activity = theCohort.activities[i];
         }};
      const reviewDD = async function (){
         try {
            activityVocab = activity.vocabWords;
            for (let i = 0; i < activityVocab.length; i++) {
               const activityWord = activityVocab[i];
               for (let index = 0; index < theCohort.vocabWords.length; index++) {
                  const vocabWord = theCohort.vocabWords[index];
                  if(activityWord === vocabWord.ident){
                     vocabList.push(vocabWord);
            }}}; 

            //console.log(vocabList[0].audioN);
            const student = await User.findById(req.user._id);
            console.log(student.currentVocabList)
            student.currentVocabList = vocabList;
            await student.save();
            res.render('study', {user: req.user, vocabList: vocabList, activity: req.body.activity});

      } catch (error) {
      console.log(error);
      }};
      const reviewWaL = function() {
         console.log(req.body.activity);
         res.render('studyWaL', {student: req.user, activity: activity});
      };

        
         if (activity.hasOwnProperty('type')){
            console.log(activity.type)
            if (activity.type === "WaL"){
               console.log("running WaL");
               reviewWaL();
            } else if (activity.type === "DD"){
               console.log("Running DD");
               reviewDD();
            } else {
               console.log('This Activity type has not ben set up yet.')
            };

         } else {reviewDD()};
      
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
 
     
   } catch (error) {
      console.log(error);
   };
};

module.exports.userReviewResults = async (req, res, next) => {
   try {   
      console.log("Processing userReviewResults!!!")
      let student = await User.findById(req.user._id);
      let theCohort = await Cohort.findById(req.user.cohort);
      //console.log(student);

      let activity;
      let reviewResults = req.body.infoToSend;
      let isCustomActivity = false
      for (let i = 0; i < req.user.individualExercises.length; i++) {
         if(reviewResults.activity === req.user.individualExercises[i].description) {
            isCustomActivity = true;
      }};
      const categories = theCohort.categories;
      let isReviewByCategory = false;
      //console.log(reviewResults.activity)
      for (let i = 0; i < categories.length; i++) {
         //console.log('categories i');
         //console.log(categories[i])
         if(reviewResults.activity === categories[i]){
            console.log(categories[i].category)
            isReviewByCategory = true;
         }}
         if (reviewResults.activity === 'All'){
            isReviewByCategory = true;
         };

         console.log("Review By Category")
         console.log(isReviewByCategory)
 
      console.log("reviewResults.Activity");
      console.log(reviewResults.activity)
      console.log("Not Challenging Words?");
      console.log(reviewResults.activity !== "Challenging Words");
     
      if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false){   
         console.log('Has Reviewed included?');
      
      for (let i = 0; i < theCohort.activities.length; i++){
         if(theCohort.activities[i].description === reviewResults.activity){
            activity = theCohort.activities[i];
      }};
       
         console.log("Activity is:");
         console.log(activity);

    
};
      console.log(activity);

      if(reviewResults.wasReview === true){
      student.totalReviews = student.totalReviews + reviewResults.numberOfReviews;
      };
      console.log(`total words: ${student.totalWords}`);
      console.log(`total reviews: ${student.totalReviews}`);
     

//updates vocabWords.reviewedBy
      //console.log('wordsReviewed');
      console.log('vocabWords.hasReviewed');
      const userId = req.user._id;
      if (reviewResults.wasReview === true){
         console.log('past first step');
      for (let i = 0; i < reviewResults.vocabList.length; i++) {
         console.log('first loop running');
            let reviewedWord = reviewResults.vocabList[i];
            //console.log('reviewedWord ident');
            //console.log(reviewedWord.ident);
         for (let index = 0; index < theCohort.vocabWords.length; index++){
            //console.log('second loop running');
            let vocabWord = theCohort.vocabWords[index];
            //console.log("vocabWord ident");
            //console.log(vocabWord.ident)
            if (reviewedWord.ident === vocabWord.ident) {
               //console.log("they were equal")
               const checkReviews = (element) => element._id.toString() === userId.toString();
               console.log(vocabWord.reviewedBy.some(checkReviews)); 
               if(vocabWord.reviewedBy.some(checkReviews) === false){
                  let reviewObject = {
                  "_id": userId,
                  "totalReviews": 1,
               };
               console.log(reviewObject)
               vocabWord.reviewedBy.push(reviewObject);
            } else {
               console.log("userID");
               console.log(userId);
               for (let i2 = 0; i2 < vocabWord.reviewedBy.length; i2++) {
                  const element = vocabWord.reviewedBy[i2];
                  console.log("element");
                  console.log(element)
                  if(element._id.toString() === userId.toString()){
                     element.totalReviews = element.totalReviews + reviewResults.numberOfReviews;
            }}};

               console.log(`${vocabWord.ident} after`)
               console.log(vocabWord.hasReviewed); 
     }}}};
//adds userId to activity.hasReviewed

      if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false && reviewResults.wasReview === true) {
         console.log('activity.reviewedBy');
         console.log(typeof(userId));
         console.log(typeof(activity.reviewedBy[0]));
         console.log(activity.reviewedBy.includes(userId));
         const checkReviews = (element) => element.toString() === userId.toString();
               if(activity.reviewedBy.some(checkReviews) === false){
            activity.reviewedBy.push(userId);
            console.log("activity.reviewedBy");
            console.log(activity.reviewedBy);
         }};

      //console.log('wordsReviewed');
      //console.log(student.wordsReviewed);
      
//adds selectedWords to user
      console.log('Review Results.wordsSelected');
      console.log(reviewResults.wordsSelected);
      console.log('student.wordsSelected');
      console.log(student.wordsSelected);
      console.log(student.wordsSelected.includes(reviewResults.wordsSelected[0]))
      reviewResults.wordsSelected.forEach(element => {  
         if (!student.wordsSelected.includes(element)){
            student.wordsSelected.push(element);
         };
         console.log("updated words selected")
         console.log(student.wordsSelected);
      });
//upated problemwords array 
      console.log("dealing with problemWords");
      console.log(student.problemWords);
      let challengingArray = []
      if (reviewResults.activity === "Challenging Words") {
         console.log("Updating ProblemWords after Challenging Activity")
         if (student.problemWords.length < 13) { 
              student.problemWords = [];
            } else {
               console.log("about to splice!")
               let toRemove = student.currentVocabList.length;
               console.log("TO REMOVE")
               console.log(toRemove)
               let challengingArray = student.problemWords.splice(toRemove);
               console.log("Else challenging Array")
               console.log(challengingArray);
               student.problemWords = challengingArray;
      }};

      console.log("after first if");
      console.log(student.problemWords);
      for (let i = 0; i < reviewResults.mistakes.length; i++) {
         for (let i2 = 0; i2 < student.problemWords.length; i2++) {
            if (reviewResults.mistakes[i] === student.problemWords[i2]) {
               student.problemWords.splice(i2, 1);
      }}}

      console.log("after splice");
      console.log(student.problemWords);
      reviewResults.mistakes.forEach(element => {
         student.problemWords.push(element);
         console.log('before shift');
         console.log(`Number of Problem Words is: ${student.problemWords.length}`);
  
         if (student.problemWords.length > 36) {
            for (let i = 0; i < student.problemWords.length - 36; i++) {
               student.problemWords.shift();
         }};

         console.log("afterShift");
         console.log(`Number of Problem Words is: ${student.problemWords.length}`);
         let vocabArray = [...new Set(student.problemWords)]; 
         student.problemWords = Array.from(vocabArray);
      });

   console.log(student)
       //adds activity to has reviewed
  /*
   if (isCustomActivity === false && reviewResults.activity !== "Challenging Words" && isReviewByCategory === false && reviewResults.wasReview === true){   
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
*/



  const vocabArray = theCohort.vocabWords
      console.log('array length')
      console.log(vocabArray.length)
      console.log("test");
      console.log(vocabArray[0].reviewedBy[0]._id.toString());
   const totalVocab = function () {
      let total = 0
      const userId = req.user._id.toString();
      for (let i = 0; i < vocabArray.length; i++) {
         const usedByArray = vocabArray[i].reviewedBy;
         for (let i = 0; i < usedByArray.length; i++) {
            const element = usedByArray[i];
            if (element._id.toString().includes(userId) && vocabArray[i].category.includes("Phrases") === false) {
            total++;
            }  
      }}  
      return total;
   };
   console.log("TotalVocab");
   console.log(totalVocab())
    if (req.user.totalWords !== totalVocab())  {
    
         console.log("Updating user.totalWords");

      student.totalWords = totalVocab();
      console.log(student.totalWords)
 
    }


   //console.log(student);
   //need an if else for when there is nothing to save
   
   await student.save();
   
   theCohort.markModified('vocabWords');
   theCohort.markModified('activities');
   await theCohort.save();

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
      const newActivity = {description: req.body.activityName, vocabWords: req.body.activityVocab};
      student.individualExercises.push(newActivity);
      console.log(student.individualExercises)
      
      for (let i = student.wordsSelected.length -1; i > -1; i--) {
         const element = student.wordsSelected[i];
         for (let index = 0; index < req.body.activityVocab.length; index++) {
            const toRemove = req.body.activityVocab[index];
            if (element === toRemove){
               student.wordsSelected.splice(i, 1)
      }}};
      console.log(student.wordsSelected)
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
            vocabArray.splice(12, toRemove);
            console.log(vocabArray);
            }
      } else {
         console.log("else: NOT Challange Words")
         for (let i = 0; i < req.user.individualExercises.length; i++) {
            if (customActivity === req.user.individualExercises[i].description)
            vocabArray = req.user.individualExercises[i].vocabWords;   
            console.log('vocabArray req.use.individualExcersises')
      }};
   console.log("this is vocabArray");
   console.log(vocabArray);
   const theCohort = await Cohort.findById(req.user.cohort);
  
   let activityVocab = [];
   let vocabList = [];
      for (let i = 0; i < vocabArray.length; i++){
         const vWordId = vocabArray[i];
         for (let index = 0; index < theCohort.vocabWords.length; index++) {
            const vocabWord = theCohort.vocabWords[index];
            if(vWordId === vocabWord.ident){
               vocabList.push(vocabWord);
            }}}
            console.log('vocabList after');
            console.log(vocabList)

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
      const theCohort = await Cohort.findById(req.user.cohort._id);
      let vocab = [];
      let vocabArray = [];
      for (let i = 0; i < theCohort.vocabWords.length; i++) {
         const vocabWord = theCohort.vocabWords[i];
         for (let index = 0; index < vocabWord.reviewedBy.length; index++) {
            const reviewerId = vocabWord.reviewedBy[index]._id;   
            console.log('reviewerId');
            console.log(reviewerId);
         if (reviewerId.toString() === req.user._id.toString()){
            vocab.push(vocabWord);
         }}};
      makeRandomIndex = function(arr) {
         return Math.floor(Math.random() * arr.length)
      };

      makeRandomElement = function(arr) { //randomly removes an element from an array then returns that element
         console.log("makeRandomElement is running")
         let newArray = arr.splice(makeRandomIndex(arr), 1);
         return newArray[0]
      };
      shuffleArray = function(arr, length) { //l = will be the length of new array.
         console.log("shuffle Array is running")
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
      if (vocabArray === undefined || vocabArray.length < 5){
         console.log("Less than 5 vocab words were found.");

         res.redirect("/student");
      } else {
         for (let i = vocabArray.length - 1; i > -1; i--) { 
            const vWord = vocabArray[i];
            for (let index = vWord.reviewedBy.length - 1; index > - 1; index--) {//This loop has been fixed for use with splice
               const reviewerId = vWord.reviewedBy[index]._id;
               if(reviewerId.toString() !== req.user._id.toString()){
                  vWord.reviewedBy.splice(index, 1)
               }}};
               console.log('vocabArra after splice')
               console.log(vocabArray);
               console.log('example')
               console.log(vocabArray[0].reviewedBy[0].totalReviews);
         vocabArray.sort((a, b) => {
            return a.reviewedBy[0].totalReviews - b.reviewedBy[0].totalReviews;
         });

         console.log("Array after sort");
         console.log(vocabArray);
//sellect the lest reviewed group of vwords that includes at least 12 words
         let workingArray = [];
         console.log(vocabArray.length);
         console.log(vocabArray.length < 12);
         let x = 1;
         if (vocabArray.length > 12) {
            console.log('step 1')
            while (workingArray.length < 12) {
               console.log("Your WHILE loop is running!")
               vocabArray.forEach(e => {
                  if (e.reviewedBy[0].totalReviews === x){
                     console.log(e.reviewedBy[0].totalReviews);

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

        /* let vocabArray2 = vocabArray.map((x) => x = x._id);
         console.log("maped array");
         console.log(vocabArray2);

         vocabArray = await VocabWord.find({'_id': {$in: vocabArray2}});
*/
         const vocabList = shuffleArray(vocabArray, 12); //this is probabaly not neccesary now.
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