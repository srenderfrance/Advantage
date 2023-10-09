const { default: mongoose } = require("mongoose");

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
