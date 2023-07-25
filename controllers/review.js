const { default: mongoose } = require("mongoose");
const validator = require("validator");
const Cohort = require('../models/cohort');
const VocabWord = require('../models/vocabWord');
const User = require("../models/user");
const Activity = require("../models/activity");
const cloudinary = require("../middleware/cloudinary");
const ObjectId = require('mongodb').ObjectId;


module.exports.getStudent = async (req, res) => {
    console.log(req.user.cohort);
    let activities = await Activity.where('cohort').equals(req.user.cohort).select('description');
  
    console.log('Activities')
    console.log(activities);
    res.render("student",  { user: req.user, activities: activities});
 };

 

module.exports.getStudy = (req, res) => {
    res.render("study", { user: req.user });
 };