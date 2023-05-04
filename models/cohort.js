const { default: mongoose } = require("mongoose");

const CohortSchema = new mongoose.Schema({
    cohortName: {
        type: String, 
        unique: true,
        required: true
    },
    adminCode: {
        type: String,
        required: true
    },
    language: {
        type: String,
        reuired: true
    },
    exercises: {
        type: Array,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    students: {
        type: Array,
    },
    vocabWords: {
        type: Array,
    },
    Exercises: {
        type: Array
    }

})
const Cohort = mongoose.model('Cohort', CohortSchema);
module.exports = Cohort