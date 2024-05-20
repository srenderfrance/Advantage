



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

module.exports = { sortAlpha};