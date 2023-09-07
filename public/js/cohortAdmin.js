document.querySelector("#selectActivity").addEventListener("click", getVocab);
//document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo);
document.querySelector("#existingVocabWords").addEventListener("change", loadPreview);
document.querySelector("#deleteImage").addEventListener("click", deleteImage);
document.querySelector("#deleteaudioTis").addEventListener("click", deleteAudioTis);
document.querySelector("#deleteAudioQ").addEventListener("click", deleteAudioQ);
document.querySelector("#deleteAudioN").addEventListener("click", deleteAudioN);
document.querySelector("#changeVWDescription").addEventListener("click", updateVWDescription);
document.querySelector("#changeVWCategory").addEventListener("click", updateVWCategory);
document.querySelector("#deleteVW").addEventListener("click", deleteVW)

let vocabList = [];
let selectedVWord = {};

//const cohort = document.querySelector("#cohort").value;
async function getVocab()  {
   console.log("getVocab is")
   const activity = document.querySelector("#activityName").value;
   //const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);
   //console.log(activity);

   const response = await fetch("/admin/getVocabList", {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({activity: activity}),/* JSON.stringify({cohort: cohort})*/
});
const data = await response.json();

console.log(data.vocabList);

vocabList = data.vocabList;
console.log(vocabList);
let toInsert = ""
    for (let i = 0; i < vocabList.length; i++){
       toInsert += `<option value="${vocabList[i].description}">${vocabList[i].description}</option> `
    }
    //console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#existingVocabWords");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   
/*function populateExtraInfo() { //this needs to be redone? Is it neccesary now?
   console.log("populte is running")

   const vocabWord = document.querySelector("#existingVocabWords").value;   /*
   console.log(vocabWord);
   const activityInputs = document.querySelectorAll(".activityUF");
   let vwId
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         vwId = vw._id;

      }
   })
   const vocabWordInputs = document.querySelectorAll(".vocabWordUF");
   vocabWordInputs.forEach((input) => {
      input.value = vwId;
   })
   
}*/
function loadPreview() {
   console.log("vacabList is");
   console.log(vocabList);
   const image = document.querySelector("img");
   const audioTis = document.querySelector("#audioTis");
   const audioQ = document.querySelector("#audioQ");
   const audioN = document.querySelector("#audioN");
   const vocabWord = document.querySelector("#existingVocabWords").value;
   let description = document.querySelector("#description");
   let category = document.querySelector("#kind");
   console.log(category);
   
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         image.src = vw.imageUrl;
         audioTis.src = vw.audioTis;
         audioQ.src = vw.audioQ;
         audioN.src = vw.audioN;
         description.innerText = `Description: ${vw.description}`;
         category.innerText = `Category: ${vw.category}`;
         selectedVWord = vw;
         console.log(category);
         console.log('selecgtedVWord');
         console.log(selectedVWord);  
   }});
};

async function deleteImage () {
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdImage;
      };
   })
   const response = await fetch('/admin/deleteImage', {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({toDelete: toDelete}),
});
console.log("delete image sent");

}
async function deleteAudioTis () {
   console.log("delete Audio Tis is running")
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdTis;
   }});
   const response = await fetch('/admin/deleteAudio', {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({toDelete: toDelete}, /*{'id': 'cloudinaryIdTis'}, {'url': 'audioTis'}*/),
   });
};

async function deleteAudioQ () {
   console.log("delete AudioQ is running")
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   console.log(vocabWord);
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdQ;
   }});
   console.log('To delete is');
   console.log(toDelete);
   const response = await fetch('/admin/deleteAudio', {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({toDelete: toDelete, /*'id': 'cloudinaryIdTQ', 'url': 'audioQ'*/}),
   });
};


async function deleteAudioN () {
   console.log("delete AudioN is running")
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdN;
   }});
   const response = await fetch('/admin/deleteAudio', {method: 'PUT',
   headers: {"Content-Type": "application/json",},
   body: JSON.stringify({toDelete: toDelete}, /*{'id': 'cloudinaryIdN'}, {'url': 'audioN'}*/),
   });
};

async function updateVWDescription () {
   console.log(selectedVWord._id);
   const newVWDescription = document.querySelector("#newVWDescription").value;
   const response = await fetch('admin/updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWDescription: newVWDescription, vocabWordId: selectedVWord._id}),
   });


};
async function updateVWCategory () {
   console.log(selectedVWord._id);
   const selectedElement =  document.querySelector("#newVWCategory");
   const newVWCategory = selectedElement.options[selectedElement.selectedIndex].value;
   const response = await fetch('admin/updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWCategory: newVWCategory, vocabWordId: selectedVWord._id}),
   });
};

async function deleteVW () {
   console.log(selectedVWord);
   const response = await fetch('admin/deleteVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({vocabWordId: selectedVWord._id}),
   });
window.location = response.url;

};

