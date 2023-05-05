const VocabWord = require('../models/vocabWord');


module.exports.postVocabWord = async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path); //need to figure out how to have 3

    const vocabWord = await VocabWord.create({
        cohort: req.body.cohort,
        description: req.body.description,
        excercise: req.body.excersise,
        image: undefined,
        cloudinaryIdImage: undefined,
        audioQ: undefined,
        cloudinaryIdQ: undefined,
        audioW: undefined,
        cloudinaryIdW: undefined,

        /* Need to figure out how to add these!
         image: result.secure_url, 
        cloudinaryIdImage: result.public_id,
        audioQ: result.secure_url,  
        cloudinaryIdQ: result.public_id,
        audioW: result.secure_url,
        cloudinaryIdW: result.public_id,*/

        });
    console.log("A new vocab word has been created!");
    console.log(VocabWord);
   }