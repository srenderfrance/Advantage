const { default: mongoose } = require("mongoose");

const VocabWordSchema = new mongoose.Schema({
    catagory: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        require: true,
      },
    cloudinaryIdImage: {
        type: String,
        require: true,
      },
    audioQ: {
        type: String,
        required: true
    },
    cloudinaryIdQ: {
        type: String,
        required: true
    },
    audioW: {
        type: String,
        reuired: true
    },
    cloudinaryIdW: {
        type: Array,
        
    },
    exercise: {
        type: Array,
    },
    cohort: {
        type:Array,
        required: true,
    },

})
const VocabWord = mongoose.model('VocabWord', VocabWordSchema);
module.exports = VocabWord