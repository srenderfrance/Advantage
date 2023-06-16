const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require ('passport-local-mongoose');

const User = new Schema({
   
    email: {
        type: String,
        required: true
    },
    cohort: {
        type: String,
        required: true
    },
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    nativeLanguage: {
        type: String,
        reuired: true
    },
    hasReviewed: {
        type: Array,
        default: [],
    },
    individualExercises: {
        type: Array,
        default: [],
    },
    problemWords: {
        type:Array,
        default:[],
    },
    corhortAdmin: {
        type: Boolean,
        default: false
    },
    reviewHistory: {
        type: Array,
        default: []
    },
})

User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);