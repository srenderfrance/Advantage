const { default: mongoose } = require("mongoose");

const audioPreloadSchema = new mongoose.Schema ({

    language: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },  
    category: {
        type: String,
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
    defaultImageID: {
        type: String,
        default: "",
    },
    defaultImageUrl: {
        type: String,
        default: "",
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
    defaultActivityNumber: {
      type: Number,
    },
});


//cSpell:ignore cloudinary