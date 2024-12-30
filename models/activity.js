const { default: mongoose } = require("mongoose");
const ActivityWaLSchema = require('../models/activityWaL');

const ActivitySchema = new mongoose.Schema({
    
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    vocabWords: {
        type: Array,
        default: [],
    },
    reviewedBy: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        default: ""
    },
    ready: {
        type: Boolean,
        default: false
    },
    subType: {
        type: String,
        default: "",
    },
    activityNumber: {
        type: Number,
        default: null,
    },
    additionalInfo: {
        type: Array,
        default: [ActivityWaLSchema],
    },
    language: {
        type: String,
        default: null,
    }
});
const Activity = mongoose.model('Activity', ActivitySchema);

const ActivitySubdocSchema = new mongoose.Schema ({
    activity: {
        type: ActivitySchema,
        default: () => ({})
    }
});
const ActivitySubdoc = mongoose.model('ActivitySubdoc', ActivitySubdocSchema);


module.exports = ActivitySubdoc;

//cSpell:ignore subdoc
