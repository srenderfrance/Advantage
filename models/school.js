const { default: mongoose } = require("mongoose");


const SchoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        unique: true,
        require: true,
    },
    cohorts: {
        type: Array,
        default: [],
    },
    audios: {
        type: Array,
        default: [],
    },
    visuals: {
        type: Array,
        default: [],
    },
    modelActivities: {
        type: Array,
        default: [],
    },
});

const School = mongoose.model("School", SchoolSchema);
module.exports = School;