document.querySelector("#selectActivity").addEventListener("click", getVocab);
//document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo);
document.querySelector("#existingVocabWords").addEventListener("change", loadPreview);
document.querySelector("#replaceImage").addEventListener("click", replaceImage);
document.querySelector("#replaceaudioTis").addEventListener("click", replaceAudioTis);
document.querySelector("#replaceAudioQ").addEventListener("click", replaceAudioQ);
document.querySelector("#replaceAudioN").addEventListener("click", replaceAudioN);
document.querySelector("#changeVWDescription").addEventListener("click", updateVWDescription);
document.querySelector("#changeVWCategory").addEventListener("click", updateVWCategory);
document.querySelector("#deleteVW").addEventListener("click", deleteVW);
document.querySelector("#deleteActivity").addEventListener("click", deleteActivity);

let vocabList = [];
let selectedVWord = {};

//const cohort = document.querySelector("#cohort").value;
async function getVocab()  {
   console.log("getVocab is running")
   const activity = document.querySelector("#activityName").value;
   //console.log('activity');
   //console.log(activity);
   //console.log(typeof(activity))
   if (activity !== ''){
      const response = await fetch("/admin/getVocabList", {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({activity: activity}),
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
      document.querySelector('#activityToEdit').innerText = `Add vocabulary word to: ${activity}`
   } else {alert("No Activity was selected.")}

};

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
   const fileElement = document.querySelector("#newImage").value;
   if(fileElement === ""){
      alert("No file is attatched.")
   } else {
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
}}};

async function replaceAudioTis () { //Updated
   console.log("delete Audio Tis is running");
   const fileElement = document.querySelector("#newAudioTis").value;
   if(fileElement === ""){
      alert("No file is attatched.")
   } else {

   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdTis;
   }});
   console.log(toDelete);
   const newAudioTis = document.querySelector('#newAudioTisForm');
   console.log(newAudioTis);
   let form = new FormData(newAudioTis);
   form.append('toDelete', toDelete);

   const response = await fetch('/admin/replaceAudioTis', {method: 'PUT',
   body: form,});
   window.location = response.url;
}};

async function replaceAudioQ () { //Updated
   console.log("delete AudioQ is running")
   const fileElement = document.querySelector("#newAudioQ").value;
   if(fileElement === ""){
      alert("No file is attatched.")
   } else {

   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   console.log(vocabWord);
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdQ;
   }});
   console.log('To delete is');
   console.log(toDelete);

   const newAudioQ = document.querySelector('#newAudioQForm');
   console.log(newAudioQ);
   let form = new FormData(newAudioQ);
   form.append('toDelete', toDelete);

   const response = await fetch('/admin/replaceAudioQ', {method: 'PUT',
   body: form,});
   window.location = response.url;
}};


async function replaceAudioN () { //Updated
   console.log("delete AudioN is running")
   const fileElement = document.querySelector("#newAudioN").value;
   if(fileElement === ""){
      alert("No file is attatched.")
   } else {
  
   let toDelete
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdN;
   }});
   const newAudioN = document.querySelector('#newAudioNForm');
   console.log(newAudioN);
   let form = new FormData(newAudioN);
   form.append('toDelete', toDelete);

   const response = await fetch('/admin/replaceAudioN', {method: 'PUT',
   body: form,
   });
   window.location = response.url;
}};

async function updateVWDescription () {//updated
   console.log(selectedVWord);
   const newVWDescription = document.querySelector("#newVWDescription").value;
   console.log('newWVDescription')
   if(newVWDescription === ""){
      alert("No Despcription Provided");
   } else {
   
   
   const response = await fetch('admin/updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWDescription: newVWDescription, vocabWordId: selectedVWord.ident}),
   });

   window.location = response.url;

}};

async function updateVWCategory () { //updated
   console.log(selectedVWord);
   const selectedElement =  document.querySelector("#newVWCategory");
   console.log("selectElement")
   if(selectedElement.value === ""){
      alert("No Category has been Selected.")
   
   }else {
   const newVWCategory = selectedElement.options[selectedElement.selectedIndex].value;
   const response = await fetch('admin/updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWCategory: newVWCategory, vocabWordId: selectedVWord.ident}),
   });
   window.location = response.url;
}};

async function deleteVW () {
   console.log(selectedVWord);

   const activity = document.querySelector("#activityName").value;
   const response = await fetch('admin/deleteVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({vocabWordId: selectedVWord.ident, activity: activity}),
   });
window.location = response.url;

};

async function deleteActivity () {
   console.log("Delete Activity is Running");
   try {
      const confirmDelete = confirm("Are you sure want to delete this Activity and all of its vocab words?");
      if(confirmDelete === true){

         const activity = document.querySelector("#activityName").value;
         const response = await fetch('/admin/deleteActivity', {method: 'PUT',
         headers: {"Content-Type": "application/json",},
         body: JSON.stringify({activity: activity}),
      });
         window.location = response.url;
      }
   } catch (error) {
      console.log(error)
   }
}

