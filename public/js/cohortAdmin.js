document.querySelector("#selectActivity").addEventListener("click", getVocab);
document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo&&loadPreview);
document.querySelector("#deleteImage").addEventListener("click", deleteImage);
let vocabList = []

//const cohort = document.querySelector("#cohort").value;
async function getVocab()  {
   const activity = document.querySelector("#activityName").value
   //const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
   console.log(activity);

   const response = await fetch("/admin/getVocabList", {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({activity: activity}),/* JSON.stringify({cohort: cohort})*/
});
const data = await response.json();

console.log(data.vocabList);

vocabList = data.vocabList;

let toInsert = ""
    for (let i = 0; i < vocabList.length; i++){
       toInsert += `<option value="${vocabList[i].description}">${vocabList[i].description}</option> `
    }
    //console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#existingVocabWords");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   
function populateExtraInfo() { //this needs to be redone? Is it neccesary now?
   console.log("populte is running")
   
   const vocabWord = document.querySelector("#existingVocabWords").value;
   console.log(vocabWord);
   const activityInputs = document.querySelectorAll(".activityUF");
   let vwId
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         vwId = vw._id
         console.log("vwId")
         console.log(vwId)
      }
   })
   const vocabWordInputs = document.querySelectorAll(".vocabWordUF");
   vocabWordInputs.forEach((input) => {
      console.log("V forEach is running");
      input.value = vwId;
   });
   
}
function loadPreview() {
   console.log("vacabList is");
   console.log(vocabList);
   const image = document.querySelector("img");
   const audioTis = document.querySelector("#audioTis");
   const audioQ = document.querySelector("#audioQ");
   const audioN = document.querySelector("#audioN");
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         image.src = vw.imageUrl
         audioTis.src = vw.audioTis
         audioQ.src = vw.audioQ
         audioN.src = vw.audioN
         
      }
   })
   
}
async function deleteImage () {
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdImage
      }
   })
   const response = await fetch("/admin/delete", {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({toDelete: toDelete}),/* JSON.stringify({toDelete: toDelete})*/
});
}