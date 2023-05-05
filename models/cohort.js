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
    startDate: {
        type: Date,
    },
    Activities: {
        type: Array,
        default: [],
    },
    endDate: {
        type: Date,
        default: '',
    },
    students: {
        type: Array,
        default: [],
    },
    vocabWords: {
        type: Array,
        default: [],
    },
    activities: {
        type: Array,
        default: [],
    },

})
const Cohort = mongoose.model('Cohort', CohortSchema);
module.exports = Cohort