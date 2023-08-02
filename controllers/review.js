const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const ObjectId = require('mongodb').ObjectId;


module.exports.getStudent = async (req, res) => {

    let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
    console.log(activities);

    res.render("student",  { user: req.user, activities: activities});
 };

 

module.exports.getStudy = (req, res) => {
    res.render("study", { user: req.user });
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