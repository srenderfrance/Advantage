const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String, 
        unique: true,
        //required: true
    },
    password: {
        type: String,
       // required: true
    },
    email: {
        type: String,
       // required: true
    },
    className: {
        type: String,
       // required: true
    },
    nativeLanguage: {
        type: String,
      //  reuired: true
    },
    hasReviewed: {
        type: Array,
    },
    individualExercises: {
        type: Array,
    },
    problemWords: {
        type:Array,
    },

})
const User = mongoose.model('User', UserSchema);
module.exports = User