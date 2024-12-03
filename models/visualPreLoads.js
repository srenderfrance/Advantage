const { default: mongoose } = require("mongoose");

const visualPreLoadSchema = new mongoose.schema ({
description: {
        type: String,
    },  
    searchTerms: {
      type: Array,
    },
    version: {
      type: Number,
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
    associatedAudios:  {
      type: Object,
        "audioQ": "", 
        "cloudinaryIdQ": "",
        "audioN": "", 
        "cloudinaryIdN": "",
        "audioTis": "", 
        "cloudinaryIdTis": "",
      },
    defaultActivityNumber: {
      type: Number,
    }
    });  
    
    


//cSpell:ignore cloudinary