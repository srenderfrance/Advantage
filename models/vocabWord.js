const { default: mongoose } = require("mongoose");

const VocabWordSchema = new mongoose.Schema({
    cohort: {
        type:Array,
        required: true,
    },
    catagory: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
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
    exercise: {
        type: Array,
        default: [],
    },
   
})
const VocabWord = mongoose.model('VocabWord', VocabWordSchema);
module.exports = VocabWord