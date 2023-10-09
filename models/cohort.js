const { default: mongoose } = require("mongoose");
const VocabWordSubdocSchema = require('../models/vocabWord');
const ActivitySubdocSchema = require('../models/activity');


const CohortSchema = new mongoose.Schema({
    cohortName: {
        type: String, 
        unique: true,
        required: true
    },
    language: {
        type: String,
        reuired: true
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
        default: ["Not Categorized", "Asjectives/Descriptive Words", "Animals", "Body Parts", "Common Objects", "Countries & Nationalities", "Days/Months/Time", "Emotions & Feelings", "Food & Drinks", "Geography/Countryside", "Household Items", "Inside Locations/Parts of Buildings", "Lexicarry", "Numbers", "Office/School Items", "Places in the City", "Sounds/Letters", "Verbs" ],
    }

});

const CohortTwo = mongoose.model('CohortTwo', CohortSchema);
module.exports = CohortTwo