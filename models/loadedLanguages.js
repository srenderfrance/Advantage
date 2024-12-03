const { default: mongoose } = require("mongoose");
const VocabWordSubdocSchema = require('./vocabWord');
const ActivitySubdocSchema = require('./activity');


const loadedLanguageSchema = new mongoose.Schema({
    language: {
        type: String, 
        required: true
    },
    versionNumber: {
        type: Number,
        required: true
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
        default: ["Not Categorized", "Adjectives/Descriptive Words", "Animals", "Body Parts", "Common Objects", "Countries & Nationalities", "Days/Months/Time", "Descriptions of People (Phrases)", "Emotions & Feelings", "Food & Drinks", "Grammar Flooding", "Geography/Countryside", "Household Items", "Inside Locations/Parts of Buildings", "Lexicarry", "None", "Numbers", "Office/School Items", "Places in the City", "Sounds/Letters", "Verbs", "Verb Conjugations"],
    }
 
});

const Cohort = mongoose.model('loadedLanguage', CohortSchema);
module.exports = LoadedLanguage;



//cSpell:ignore subdoc lexicarry