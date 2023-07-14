document.querySelector("#selectActivity").addEventListener("click", getVocab);


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
const vocabList = data.vocabList;

let toInsert = ""
    for (let i = 0; i < vocabList.length; i++){
       toInsert += `<option value="${vocabList[i].description}">${vocabList[i].description}</option> `
    }
    //console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#existingVocabWords");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   

