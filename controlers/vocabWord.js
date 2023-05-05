const VocabWord = require('../models/vocabWord');


module.exports.postVocabWord = async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.file.path); //need to figure out how to have 3

    const vocabWord = await VocabWord.create({
        description: req.body.description,
        image: result.secure_url, //Need to figure out how to have 3
        cloudinaryIdImage: result.public_id,
        audioQ: result.secure_url,  //Need to figure out how to have 3
        cloudinaryIdQ: result.public_id,
        audioW: result.secure_url,//Need to figure out how to have 3
        cloudinaryIdW: result.public_id,
        excercise: req.body.excersise,
        cohort: req.body.cohort,
        });
    console.log("A new vocab word has been created!");
    console.log(VocabWord);
   }