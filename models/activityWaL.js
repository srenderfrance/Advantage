const { default: mongoose } = require("mongoose");

const ActivityWaLSchema = new mongoose.Schema({
    
  
    imageDURL: {
        type: String,
        default: "",
    },
    imageDCloudinaryID: {
        type: String,
        default: ""
    },
    imageRURL: {
        type: String,
        default: ""
    },
    imageRCloudinaryID: {
        type: String,
        default: ""
    },
    audioDURL: {
        type: String,
        default: "" 
    },
    audioDCloudinaryID: {
        type: String,
        default: ""
    },
    audioRURL: {
        type: String,
        default: "",
    },
    audioRCloudinaryID: {
        type: String,
        default: ""
    },
    audioEURL: {
        type: String,
        default: ""
    },
    videoURL: {
        type: String,
        default: ""
    },
    videoCloudinaryID: {
        type: String,
        default: "",
    },
    
});
const ActivityWaL = mongoose.model('ActivityWaL', ActivityWaLSchema);

const ActivityWaLSubdocSchema = new mongoose.Schema ({
    activity: {
        type: ActivityWaLSchema,
        default: () => ({})
    }
});
const ActivityWaLSubdoc = mongoose.model('ActivityWaLSubdoc', ActivityWaLSubdocSchema);


module.exports = ActivityWaLSubdoc;




//cSpell:ignore cloudinary subdoc durl rurl eurl
