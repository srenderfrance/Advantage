document.querySelector("#selectActivity").addEventListener("click", getVocab);
document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo);
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
console.log(data);
console.log(data.vocabList);

console.log(data.vocabList[0]);
vocabList = data.vocabList;

let toInsert = ""
    for (let i = 0; i < vocabList.length; i++){
       toInsert += `<option value="${vocabList[i].description}">${vocabList[i].description}</option> `
    }
    //console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#existingVocabWords");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   
function populateExtraInfo() {
   console.log("populte is running")
   //const activity = document.querySelector("#activityName").value;
   const vocabWord = document.querySelector("#existingVocabWords").value;
   //console.log(activity);
   console.log(vocabWord);
   const activityInputs = document.querySelectorAll(".activityUF");
   /*console.log(activityInputs)
   activityInputs.forEach((input) => {
      input.value = activity;
      console.log("A forEach is running")
   })*/
   let vwId
   console.log("vacabList is");
   console.log(vocabList);
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         vwId = vw._id
         console.log("vwId")
         console.log(vwId)
      }
   })
   const vocabWordInputs = document.querySelectorAll(".vocabWordUF");
   console.log(vocabWordInputs);
   vocabWordInputs.forEach((input) => {
      console.log("V forEach is running");
      input.value = vwId;
   });
   
}
