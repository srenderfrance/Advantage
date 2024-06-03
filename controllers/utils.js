const crypto = require('crypto');


function sortAlpha (array){
      array.sort(function (a,b) {
         if(a.description > b.description) {
            return 1;
         };
         if (a.description < b.description) {
            return -1;
         };
         return 0;
      })};

function salt () {
   return crypto.randomBytes(16).toString('hex');
};

function hashPassword(password, salt, callback) {
   try {
      return new Promise((resolve, reject) => {   
         password = password.normalize();
         console.log("password inside of hash function")
         //console.log(password);
         //console.log(salt)
         const iterations = 10000;
         const hashBytes = 64;
         const digest = 'sha512';

         crypto.pbkdf2(password, salt, iterations, hashBytes, digest, (err, derivedKey) => {
            console.log("PBKDF2")
            console.log(password)
            console.log(salt)
            if (err) {
               reject (err)
            } else {
               resolve (derivedKey.toString('hex'));
            }
   });
})

  } catch (error) {
     console.log(error); 
   }
};




/*
function updateLV (cohort, vocabWord, mediaKeyObj, newMediaObj) { //The newMediaObj parameter needs 2 keys {ulr: , id: }
   const links = vocabWord.linkedVocab;
   for (let i = 0; i < links.length; i++) {
      const linkIdent = links[i];
      for (let j = cohort.vocabWords.length-1; j > -1; j--) { //Slice!
         const vocabW = cohort.vocabWords[j];
         if (linkIdent === vocabW.ident) {
            if (!mediaKey) { //This the ident of the vocab word that is being deleted, from the linked Vocab Arrays it is referenced in.
               for (let k = vocabW.linkedVocab.length - 1; k > -1;  k--) {//Slice!
                  const element = vocabW.linkedVocab[k];
                  if(element === linkIdent) {
                     vocabW.linkedVocab.slice(k, 1);
               }}; 
            } else { // This updates the media references in all linked vocab words.
               if (mediaKey === "imageUrl") {
                  vocabW.imageUrl = newMediaObj.url;
                  vocabW.cloudinaryIdImage = newMediaObj.id;
               } else if (mediaKey === "audioTis") {
                  vocabW.audioTis = newMediaObj.url;
                  vocabW.cloudinaryIdTis = newMediaObj.id;
               } else if (mediaKey === "audioQ") {
                  vocabW.audioQ = newMediaObj.url;
                  vocabW.cloudinaryIdQ = newMediaObj.id;
               } else if (mediaKey === "audioN") {
                  vocabW.audioN = newMediaObj.url;
                  vocabW.cloudinaryIdN = newMediaObj.id;
               }
            }}}
      
   }




};

module.exports = {updateLV};

*/


module.exports = {sortAlpha, salt, hashPassword};

//cSpell:ignore cloudinary     