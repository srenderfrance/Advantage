const { default: mongoose } = require("mongoose");

const VocabWordSchema = new mongoose.Schema({
    cohort: {
        type:Array,
        required: true,
    }, 
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    catagory: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },  
    imageUrl: {
        type: String,
        default: "",
      },
    cloudinaryIdImage: {
        type: String,
        default: "",
      },
    audioQ: {
        type: String,
         default: "",
    },
    cloudinaryIdQ: {
        type: String,
        default: "",
    },
    audioW: {
        type: String,
        default: "",
    },
    cloudinaryIdW: {
        type: String,
        default: "",
    },
    audioTis: {
        type: String,
        default: "",
    },
    cloudinaryIdTis: {
        type: String,
        default: "",
    },
 
})
const VocabWord = mongoose.model('VocabWord', VocabWordSchema);
module.exports = VocabWord