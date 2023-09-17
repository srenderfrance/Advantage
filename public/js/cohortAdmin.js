document.querySelector("#selectActivity").addEventListener("click", getVocab);
//document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo);
document.querySelector("#existingVocabWords").addEventListener("change", loadPreview);
document.querySelector("#replaceImage").addEventListener("click", replaceImage);
document.querySelector("#replaceaudioTis").addEventListener("click", replaceAudioTis);
document.querySelector("#replaceAudioQ").addEventListener("click", replaceAudioQ);
document.querySelector("#replaceAudioN").addEventListener("click", replaceAudioN);
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
         console.log('audioTis')
         console.log(vw.audioTis)
         audioTis.src = vw.audioTis;
         console.log('audioQ')
         console.log(vw.audioQ)
         audioQPreview.src = vw.audioQ;
         console.log(audioQPreview.src)
         description.innerText = `Description: ${vw.description}`;
         category.innerText = `Category: ${vw.category}`;
         selectedVWord = vw;
         console.log(category);
         console.log('selecgtedVWord');
         console.log(selectedVWord); 
         //console.log('audioN.src') 
         //console.log(audioN.src)

         audioNPreview.src = vw.audioN;

   }});
};

async function replaceImage () {
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdImage;
   }});
   try {
      
   
   const newImage = document.querySelector('#newImageForm');
   console.log(newImage);
   let form = new FormData(newImage);
   form.append('toDelete', toDelete);
   const response = await fetch('/admin/replaceImage', {method: 'PUT',
      body: form,
   });
console.log("delete image sent");
window.location = response.url;
} catch (error) {
      console.log(error);
   }
};

async function replaceAudioTis () {
   console.log("delete Audio Tis is running");
  
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdTis;
   }});
   console.log(toDelete);
   const newAudioTis = document.querySelector('#newAudioTis');
   console.log(newAudioTis);
   let form = new FormData(newAudioTis);
   form.append('toDelete', toDelete);

   const response = await fetch('/admin/replaceAudioTis', {method: 'PUT',
   body: form,});
   window.location = response.url;
};

async function replaceAudioQ () {
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

   const newAudioQ = document.querySelector('#newAudioQ');
   console.log(newAudioQ);
   let form = new FormData(newAudioQ);
   form.append('toDelete', toDelete);

   const response = await fetch('/admin/replaceAudioQ', {method: 'PUT',
   body: form,});
   window.location = response.url;
};


async function replaceAudioN () {
   console.log("delete AudioN is running")
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdN;
   }});
   const response = await fetch('/admin/deleteAudioN', {method: 'PUT',
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

