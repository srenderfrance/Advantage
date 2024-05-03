document.querySelector("#selectActivity").addEventListener("change", populateDropDown1);
document.querySelector('#activityName2').addEventListener('change', populateDropDown2)
//document.querySelector("#existingVocabWords").addEventListener("change", populateExtraInfo);
document.querySelector("#existingVocabWords").addEventListener("change", loadPreview);
document.querySelector("#replaceImage").addEventListener("click", replaceImage);
document.querySelector("#replaceAudioTis").addEventListener("click", replaceAudioTis);
document.querySelector("#replaceAudioQ").addEventListener("click", replaceAudioQ);
document.querySelector("#replaceAudioN").addEventListener("click", replaceAudioN);
document.querySelector("#changeVWDescription").addEventListener("click", updateVWDescription);
document.querySelector("#changeVWCategory").addEventListener("click", updateVWCategory);
document.querySelector("#deleteVW").addEventListener("click", deleteVW);
document.querySelector("#deleteActivity").addEventListener("click", deleteActivity);
document.querySelector('#selectActivity2').addEventListener("click", linkAudio);
document.querySelector("#vocabType").addEventListener('change', toggleCheckbox);
document.querySelector('#submitButton').addEventListener('click', uploadVocabWord);
document.querySelector("#finalizeActivity").addEventListener("click", finalizeActivity);

let vocabList = [];
let selectedVWord = {};
let vocabList2 = [];

async function uploadVocabWord (){
   console.log("Upload Vocab Word Is running");
   document.querySelector('#submitButton').disabled = true;
   const formElement = document.querySelector("#newVWForm");
   const activity = document.querySelector("#selectActivity").value;
   const form = new FormData(formElement);
   console.log(Array.from(formElement));
   const folderInput = document.querySelector('#folderUpload').value;
   console.log("FolderInput")
   if (activity === "") {
      window.alert("Please Select an Activity to Edit.")
   } else {
   if (folderInput === ""){
   
      for (let i = 0; i < vocabList.length; i++){
         vwDescription = vocabList[i].description;
         if (vwDescription === document.querySelector("#newVocabWord").value){
            window.alert("This activity already has a Vocab Word with that description. Please choose another.")
      }};

      try {
         const response = await fetch("/admin/createVocab", {method: 'POST',
         body: form,});

         const data = await response.json();
         console.log("data")
         console.log(data);

         console.log(data);
      } catch (error) {
         console.log(error);
      }
   } else {
      try {
               const response = await fetch("/admin/uploadVWFromFolder", {method: 'POST',
               body: form,});
      
               const data = await response.json();
               console.log("data")
               console.log(data);
      
               console.log(data);
      } catch (error) {
         console.log(error);
   }}};

   populateDropDown1();
    
      document.querySelector("#image").value = "";
      document.querySelector("#audioQ").value = "";
      document.querySelector("#audioT").value = "";
      document.querySelector("#audioN").value = "";
      document.querySelector("#newVocabWord").value = "";
      document.querySelector("#category").value = "";
      document.querySelector("#vwToLink").value = "";
      document.querySelector("#activityName2").value = "";
      document.querySelector('#folderUpload').value = "";

      
      if (document.querySelector("#audioQ").hasAttribute('disabled')){
         document.querySelector("#audioQ").toggleAttribute('disabled');
      };
      if (document.querySelector("#audioT").hasAttribute('disabled')){
         document.querySelector("#audioT").toggleAttribute('disabled');
      };
      if (document.querySelector("#audioN").hasAttribute('disabled')){
         document.querySelector("#audioN").toggleAttribute('disabled');
      };
      console.log(document.querySelector("#submitButton"));
      document.querySelector("#submitButton").disabled = false;
}

async function populateDropDown1 () {
   console.log("populate1")
   const activity = document.querySelector("#selectActivity").value;
const vocabList = await getVocab(activity);
   console.log(vocabList);
   let toInsert = ""
      for (let i = 0; i < vocabList.length; i++){
         toInsert += `<option value="${vocabList[i].description}">${vocabList[i].description}</option> `
      }
      const dropDownSelector = document.querySelector("#existingVocabWords");
      for (let i = dropDownSelector.options.length - 1; i > 0; i--){
         dropDownSelector.remove(i);
      }
      dropDownSelector.insertAdjacentHTML("beforeend", `${toInsert}`);
          
      document.querySelector('#activityToEdit').innerText = `Selected Activity: ${activity}`;
      document.querySelector('#activityToEdit').style.textDecoration = 'none';
      const audioNodes = document.querySelectorAll(".audioPreviewContainer audio");
      
      for (let i = 0; i < audioNodes.length; i++) {
         const element = audioNodes[i];
         element.src = "";
      }

      document.querySelector("#description").innerText = "Description: No vocab word has been selected.";
      document.querySelector("#kind").innerText = "";
      document.querySelector(".imageContainer img").src = "Category: No vocab word has been selected.";
      document.querySelector("#newVWDescription").value = "";
      document.querySelector("#newVWCategory").value = "";
      console.log("NEW TIS")
      console.log(document.querySelector("#newAudioTis").value);
      document.querySelector("#newAudioTis").value = "";
      document.querySelector("#newAudioQ").value = "";
      document.querySelector("#newAudioN").value = "";
      document.querySelector("#newImage").value = "";
      
}
async function populateDropDown2 () {
   const activity = document.querySelector("#activityName2").value;
   vocabList2 = await getVocab(activity);
   let toInsert = ""
          for (let i = 0; i < vocabList.length; i++){
             toInsert += `<option value="${vocabList[i].ident}">${vocabList[i].description}</option> `
          }
   const dropDownSelector = document.querySelector("#vwToLink");
   for (let i = dropDownSelector.options.length - 1; i > 0; i--){
         dropDownSelector.remove(i);
      }
   dropDownSelector.insertAdjacentHTML("beforeend", `${toInsert}`);
}
//const cohort = document.querySelector("#cohort").value;
async function getVocab(activityD)  {
   console.log("getVocab is running")
   //console.log('activity');
   //console.log(activity);
   //console.log(typeof(activity))
   console.log(activityD)
   if (activityD !== ''){
      const response = await fetch("/admin/getVocabList", {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({activity: activityD}),
      });
      const data = await response.json();
      console.log("data.vL")
      console.log(data.vocabList);

      vocabList = data.vocabList;
      //console.log(vocabList);
     return vocabList;

   } else {alert("No Activity was selected.")}

};

function loadPreview() {
   
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
         
         audioQPreview.src = vw.audioQ;
         console.log(audioQPreview.src)
         description.innerText = `Description: ${vw.description}`;
         category.innerText = `Category: ${vw.category}`;
         selectedVWord = vw;
        

         audioNPreview.src = vw.audioN;

   }});
};

async function replaceImage () {

   let toDelete;
   let vwIdent;

   const vocabWord = document.querySelector("#existingVocabWords").value;
   const fileElement = document.querySelector("#newImage").value;
   if(fileElement === ""){
      alert("No file is attached.")
   } else {
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdImage;
         vwIdent = vw.ident;
   }});
   try { 
   const newImage = document.querySelector('#newImageForm');
   console.log(newImage);
   let form = new FormData(newImage);
   form.append('toDelete', toDelete);
   form.append('vwIdent', vwIdent);

   const response = await fetch('/admin/replaceImage', {method: 'PUT',
      body: form,
   });

console.log("delete image sent");
await populateDropDown1();
document.querySelector("#newImage").value = "";

} catch (error) {
      console.log(error);
}}};

   


async function replaceAudioTis () { 
try {
   console.log("delete Audio Tis is running");
   const fileElement = document.querySelector("#newAudioTis").value;
   if(fileElement === ""){
      alert("No file is attached.")
   } else {

   let toDelete;
   let vwIdent;

   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdTis;
         vwIdent = vw.ident;
   }});
   console.log(toDelete);
   const newAudioTis = document.querySelector('#newAudioTisForm');
   console.log(newAudioTis);
   let form = new FormData(newAudioTis);
   form.append('toDelete', toDelete);
   form.append('vwIdent', vwIdent);

   const response = await fetch('/admin/replaceAudioTis', {method: 'PUT',
   body: form,});
   await populateDropDown1();
   document.querySelector("#newAudioTis").value = "";
};
} catch (error) {
   console.log(error);
}};

async function replaceAudioQ () {
try {
   

   console.log("delete AudioQ is running")
   const fileElement = document.querySelector("#newAudioQ").value;
   if(fileElement === ""){
      alert("No file is attached.")
   } else {

   let toDelete;
   let vwIdent;
   const vocabWord = document.querySelector("#existingVocabWords").value;
   console.log(vocabWord);
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdQ;
         vwIdent = vw.ident;
   }});
   console.log('To delete is');
   console.log(toDelete);

   const newAudioQ = document.querySelector('#newAudioQForm');
   console.log(newAudioQ);
   let form = new FormData(newAudioQ);
   form.append('toDelete', toDelete);
   form.append('vwIdent', vwIdent);

   const response = await fetch('/admin/replaceAudioQ', {method: 'PUT',
   body: form,});
   await populateDropDown1();
   document.querySelector("#newAudioQ").value = "";
}} catch (error) {
   console.log(error);
}};


async function replaceAudioN () {

   try {
      
   
   console.log("delete AudioN is running")
   const fileElement = document.querySelector("#newAudioN").value;
   if(fileElement === ""){
      alert("No file is attached.")
   } else {
  
   let toDelete
   let vwIdent 
   const vocabWord = document.querySelector("#existingVocabWords").value;
   vocabList.forEach((vw) => {
      if (vw.description === vocabWord){
         toDelete = vw.cloudinaryIdN;
         vwIdent = vw.ident;
   }});
   const newAudioN = document.querySelector('#newAudioNForm');
   console.log(newAudioN);
   let form = new FormData(newAudioN);
   form.append('toDelete', toDelete);
   form.append('vwIdent', vwIdent);

   const response = await fetch('/admin/replaceAudioN', {method: 'PUT',
   body: form,});
   console.log(response);
   await populateDropDown1();
   document.querySelector("#newAudioN").value = "";

}} catch (error) {
    console.log(error);  
   }
};

async function updateVWDescription () { 
try {
   

   console.log(selectedVWord);
   const newVWDescription = document.querySelector("#newVWDescription").value;
   console.log('newWVDescription')
   if(newVWDescription === ""){
      alert("No Description Provided");
   } else {
   
   
   const response = await fetch('updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWDescription: newVWDescription, vocabWordId: selectedVWord.ident}),
   });

   await populateDropDown1();
   document.querySelector("#newVWDescription").value = "";

}} catch (error) {
   console.log(error);
}};

async function updateVWCategory () {
try {
   

   console.log(selectedVWord);
   const selectedElement =  document.querySelector("#newVWCategory");
   console.log("selectElement")
   if(selectedElement.value === ""){
      alert("No Category has been Selected.")
   
   }else {
   const newVWCategory = selectedElement.options[selectedElement.selectedIndex].value;
   const response = await fetch('updateVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({newVWCategory: newVWCategory, vocabWordId: selectedVWord.ident}),
   });

   await populateDropDown1();
   document.querySelector("#newVWCategory").value = "";



}} catch (error) {
   console.log(error);
}};

async function deleteVW () {
   console.log(selectedVWord);

   const activity = document.querySelector("#selectActivity").value;
   const response = await fetch('/admin/deleteVWord', {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({vocabWordId: selectedVWord.ident, activity: activity}),
   });
   await populateDropDown1();

indow.location.reload();

};

async function deleteActivity () {
   console.log("Delete Activity is Running");
   try {
      const confirmDelete = confirm("Are you sure want to delete this Activity and all of its vocab words?");
      if(confirmDelete === true){

         const activity = document.querySelector("#selectActivity").value;
         const response = await fetch('/admin/deleteActivity', {method: 'PUT',
         headers: {"Content-Type": "application/json",},
         body: JSON.stringify({activity: activity}),
      });
         window.location = response.url;
      }
   } catch (error) {
      console.log(error);
   };
};

function linkAudio () {
   console.log("LINK AUDIO IS RUNNING");
   let linkedStatus = false;
   const vw = document.querySelector("#vwToLink").value;
   if(vw === ""){
      window.alert("No Vocab Word has been selected.");
   };
   toggleAudioInputs();
   if (linkedStatus === false) {
      linkedStatus = true;
      for (let i = 0; i < vocabList2.length; i++) {
      const element = vocabList2[i];
      if(element.description === vw){
         console.log(element);
      }
      
   }
   } else {
   linkedStatus = false;
   toggleAudioInputs();
   } ;
   
   
   function toggleAudioInputs () {
   document.querySelector("#audioT").toggleAttribute('disabled');
   document.querySelector("#audioQ").toggleAttribute('disabled');
   document.querySelector("#audioN").toggleAttribute('disabled');
   }

};

function toggleCheckbox () {
   console.log("toggle checkbox running");
   if (document.querySelector("#vocabType").value === "individual") {
      document.querySelector("#newVocabulary").toggleAttribute("disabled");
   }
}

async function finalizeActivity () {
   console.log("Finalize Activity is Running");
   const activity = document.querySelector("#selectActivity").value;
   const vocabType = document.querySelector('#vocabType').value;
   try {
     const response = await fetch('/admin/finalizeActivity', {method: 'PUT',
         headers: {"Content-Type": "application/json",},
         body: JSON.stringify({activity: activity, vocabType: vocabType}),
      });
         window.location = response.url;
  } catch (error) {
     console.log(error); 
   }
}

//cSpell:ignore cloudinary cloudinaryid durl eurl