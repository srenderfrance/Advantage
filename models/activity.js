const { default: mongoose } = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    cohort: {
        type: String, 
        unique: true,
        required: true
    },
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
    
})
const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity
