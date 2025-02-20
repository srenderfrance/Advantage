const { default: mongoose } = require("mongoose");
const VocabWordSubdocSchema = require('../models/vocabWord');
const ActivitySubdocSchema = require('../models/activity');


const CohortSchema = new mongoose.Schema({
    cohortName: {
        type: String, 
        unique: true,
        required: true
    },
    schoolName: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,    
    },
    endDate: {
        type: Date,
        default: null,
    },
    students: {
        type: Array,
        default: [],
    },
    vocabWords: {
        type: Array,
        default: [VocabWordSubdocSchema],
    },
    activities: {
        type: Array,
        default: [ActivitySubdocSchema],
    },
    categories: {
        type: [String],
        default: ["Not Categorized", "Descriptive Words", "Animals", "Body Parts", "Common Objects", "Countries & Nationalities", "Days/Months/Time", "Descriptions of People (Phrases)", "Emotions & Feelings", "Food & Drinks", "Grammar Flooding", "Geography/Countryside", "Household Items", "Inside Locations/Parts of Buildings", "Lexicarry", "None", "Numbers", "Office/School Items", "Places in the City", "Sounds/Letters", "Verbs", "Verb Conjugations"],
    }
 
});

const Cohort = mongoose.model('Cohort', CohortSchema);
module.exports = Cohort;



//cSpell:ignore subdoc lexicarry