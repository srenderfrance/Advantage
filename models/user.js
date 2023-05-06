const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cohort: {
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
})

const User = mongoose.model('User', UserSchema);
module.exports = User