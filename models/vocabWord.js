const { default: mongoose } = require("mongoose");

const VocabWordSchema = new mongoose.Schema({

    description: {
        type: String,
    },  
    category: {
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
    audioN: {
        type: String,
        default: "",
    },
    cloudinaryIdN: {
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
    reviewedBy: {
        type: Array,
        default: [],
    },

    vocabType: {
        type: String,
        default: "new", 
    },

    linkedVocab: {
        type: Array,
        default: [],
    },
    
    specialInfo: {
        type: Object,
        default: {},
    },
    ident: {
        type: Number,
        default: 0,
    },
 
});
const VocabWord = mongoose.model('VocabWord', VocabWordSchema);

const VocabWordSubdocSchema = new mongoose.Schema({
    vocabWord: {
        type: VocabWordSchema,
        default: () => ({})
    }
});
const VocabWordSubdoc = mongoose.model('VocabWordSubdoc', VocabWordSubdocSchema);
module.exports = VocabWordSubdoc;



//cSpell:ignore cloudinary subdoc