let activitiesAlpha = [];
let activitiesWaLAlpha = [];
let activitiesNewAlpha = [];
let activitiesDate = [];
let activitiesWaLDate = [];
let activitiesNewDate = [];
let activitiesNumber = [];
let activitiesWaLNumber = [];
let activitiesNewNumber = [];

async function reviewByTopic () {
    try {
        const topic = document.querySelector('#subjectToReview').value;
        console.log(topic);

        const response = await fetch('student/reviewByTopic', {method: 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({topic: topic}),
    });
    } catch (error) {
        console.log(error);
    }
};

async function getActivities () {
    const currentCohort = document.querySelector("#currentCohort").innerText.slice(8);
    try {
       const response = await fetch ('student/getActivities', {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({currentCohort}),
       })
       data = await response.json();
       activitiesAlpha = data.activitiesAlpha;
       activitiesWaLAlpha = data.activitiesWaLAlpha;
       activitiesDate = data.activitiesDate;
       activitiesWaLDate = data.activitiesWaLDate;
       console.log("ActivitiesDate")
       console.log(activitiesDate[0])

    } catch (error) {
       console.log(error);
    }
};

function filterAndSort (event) {
    console.log("filtering or sorting!");
    if (event.target.id === "filterNewActivities") { //Handles filtering and sorting the New activity drop down.
        const dropD = document.querySelector("#activityName");
        console.log('yes1');
        if (event.target.value === "Date") {
            console.log ("DATE")
            clearAndPopulate(dropD, activitiesNewDate);
        } else if (event.target.value === "Alphabetical") {
            console.log("Alphabetical");
            clearAndPopulate(dropD, activitiesNewAlpha);
        } else if (event.target.value === "Number") {
            console.log("Number");
            clearAndPopulate(dropD, activitiesNewNumber);
        };
    }
    if (event.target.id === "filterActivities") { //Handles Filtering and Sorting the RR Activity dropdown.
        console.log("YES 2")
        const dropD = document.querySelector("#activityDDName");
        if (event.target.value === "Date") {
            console.log ("DATE");
            clearAndPopulate(dropD, activitiesDate);
        } else if (event.target.value === "Alphabetical") {
            console.log("Alphabetical");
            clearAndPopulate(dropD, activitiesAlpha);
        } else if (event.target.value === "Number") {
            console.log("Number");
            clearAndPopulate(dropD, activitiesNumber);
        };
    };
    if (event.target.id === "filterWaL") { //Handles filtering and sorting the WAL dropdown.
        console.log("YES 3");
        const dropD = document.querySelector("#activityWaLName");
        if (event.target.value === "Date") {
            console.log ("DATE")
            clearAndPopulate(dropD, activitiesWaLDate);
        } else if (event.target.value === "Alphabetical") {
            console.log("Alphabetical");
            clearAndPopulate(dropD, activitiesWaLAlpha);
        } else if (event.target.value === "Number") {
            console.log("Number");
            clearAndPopulate(dropD, activitiesWaLNumber);
        };
    }
    function clearAndPopulate (dropDown, array) {
        console.log("Clearing and Populating")
        for (let i = dropDown.options.length - 1; i > -1; i--){
         dropDown.remove(i);
        }; 
        let toInsert = ""
        for (let i = 0; i < array.length; i++){
         toInsert += `<option value="${array[i].description}">${array[i].description}</option>`
        };
        dropDown.insertAdjacentHTML("beforeend", `${toInsert}`);
    };
    
      
     // const dropDownSelector = document.querySelector("#existingVocabWords");
      
};

getActivities();
document.querySelector("#filterNewActivities").addEventListener('change', filterAndSort);
document.querySelector("#filterActivities").addEventListener('change', filterAndSort);
document.querySelector("#filterWaL").addEventListener('change', filterAndSort);
document.querySelector('#selectByTopic').addEventListener('click', reviewByTopic);