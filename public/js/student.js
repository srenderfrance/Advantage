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
    console.log("Running Get Activities")
    const currentCohort = document.querySelector("#currentCohort").innerText.slice(8);
    try {
       const response = await fetch ('student/getActivities', {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({currentCohort}),
       })
       data = await response.json();

       console.log(data)

       if (data.activitiesAlpha !== undefined) {
       activitiesAlpha = data.activitiesAlpha;
       } else {activitiesAlpha = []};

       if (data.activitiesWaLAlpha !== undefined) {
       activitiesWaLAlpha = data.activitiesWaLAlpha;
       } else {activitiesWaLAlpha = []};
       
       if (data.activitiesNewAlpha !== undefined) {
       activitiesNewAlpha = data.activitiesNewAlpha;
       console.log(data.activitiesNewAlpha)
       console.log("ActivitiesNewAlpha Good")
       console.log(activitiesNewAlpha)
       } else {activitiesNewAlpha = []
        console.log("ActivitiesNewAlpha Not good")
       };
    } catch (error) {
       console.log(error);
    };

    for (let i = 0; i < activitiesAlpha.length; i++) {
        const element = activitiesAlpha[i];
        activitiesDate.push(element);
        activitiesNumber.push(element);
    };
    for (let i = 0; i < activitiesWaLAlpha.length; i++) {
        const element = activitiesWaLAlpha[i];
        activitiesWaLDate.push(element);
        activitiesWaLNumber.push(element);
    };

    for (let i = 0; i < activitiesNewAlpha.length; i++) {
        const element = activitiesNewAlpha[i];
        activitiesNewDate.push(element);
        activitiesNewNumber.push(element);
    }; 
    console.log("ANYTHING?")
    sortDate(activitiesDate);
    sortDate(activitiesWaLDate);
    sortDate(activitiesNewDate);
    console.log(activitiesNewDate)

    function sortDate (array) {
        console.log("sorting Date")
      array.sort(function (a,b) {
         let date1;
         let date2;
         if (a.date.length === 8){
            const part1 = a.date.slice(6);
            const part2 = a.date.slice(3,5);
            const part3 = a.date.slice(0,2);
            date1 = `${part1}`+`${part2}`+`${part3}`;
         } else if (a.date.length === 10) {
            const part1 = a.date.slice(8);
            const part2 = a.date.slice(3,5);
            const part3 = a.date.slice(0,2);
            date1 = `${part1}`+`${part2}`+`${part3}`;
         };
          if (b.date.length === 8){
            const part1 = b.date.slice(6);
            const part2 = b.date.slice(3,5);
            const part3 = b.date.slice(0,2);
            date2 = `${part1}`+`${part2}`+`${part3}`;
         } else if (b.date.length === 10) {
            const part1 = b.date.slice(8);
            const part2 = b.date.slice(3,5);
            const part3 = b.date.slice(0,2);
            date2 = `${part1}`+`${part2}`+`${part3}`;
         }; 

         if (date1 > date2) {
            return 1;
         };
         if (date1 < date2) {
            return -1;
         };
         return 0;
    })};
    console.log("NUMBER TEST")
    console.log(activitiesNumber[0])
    sortNumber(activitiesNumber);
    console.log(activitiesNumber[0])
    sortNumber(activitiesWaLNumber);
    sortNumber(activitiesNewNumber);
    
    function sortNumber (array) {
        console.log("Sort Number Running")
        
        array.sort(function (a,b) {
            if (a.activityNumber === null) {
                return 1;
            };
            if (b.activityNumber === null) {
                return -1;
            };
            if (a.activityNumber > b.activityNumber) {
                return 1;
            };
            if (a.activityNumber < b.activityNumber) {
                return -1;
            };
            if (a.activityNumber === b.activityNumber) {
            return 0;
            };
    })};
};

function filterAndSort (event) {
    console.log("filtering or sorting!");
    console.log(event.target.value);
    const param = event.target.value;
    if (event.target.id === "filterNewActivities") { //Handles filtering and sorting the New activity drop down.
        const dropD = document.querySelector("#activityName");
        let currentList = activitiesNewAlpha;
        console.log('yes1');
        if (param === "Date") {
            console.log ("DATE")
            currentList = activitiesNewDate;
            clearAndPopulate(dropD, activitiesNewDate);
        } else if (param === "Alphabetical") {
            console.log("Alphabetical");
            clearAndPopulate(dropD, activitiesNewAlpha);
            currentList = activitiesNewAlpha;
        } else if (param === "Number") {
            console.log("Number");
            currentList = activitiesNewNumber;
            clearAndPopulate(dropD, activitiesNewNumber);
        } else {
            console.log("GOING TO RUN FILTER");
            const newList = filter(param, currentList);
            clearAndPopulate(dropD, newList);
        }
    }
    if (event.target.id === "filterActivities") { //Handles Filtering and Sorting the RR Activity dropdown.
        console.log("YES 2")
        const dropD = document.querySelector("#activityDDName");
        let currentList = activitiesAlpha;
        if (param === "Date") {
            console.log ("DATE");
            currentList = activitiesDate;
            clearAndPopulate(dropD, activitiesDate);
        } else if (param === "Alphabetical") {
            console.log("Alphabetical");
            currentList = activitiesAlpha;
            clearAndPopulate(dropD, activitiesAlpha);
        } else if (param === "Number") {
            console.log("Number");
            currentList = activitiesNumber;
            clearAndPopulate(dropD, activitiesNumber);
        } else {
            console.log("GOING TO RUN FILTER");
            const newList = filter(param, currentList);
            clearAndPopulate(dropD, newList);
        }
    };
    if (event.target.id === "filterWaL") { //Handles filtering and sorting the WAL dropdown.
        console.log("YES 3");
        const dropD = document.querySelector("#activityWaLName");
        if (param === "Date") {
            console.log ("DATE")
            clearAndPopulate(dropD, activitiesWaLDate);
        } else if (param === "Alphabetical") {
            console.log("Alphabetical");
            clearAndPopulate(dropD, activitiesWaLAlpha);
        } else if (param === "Number") {
            console.log("Number");
            clearAndPopulate(dropD, activitiesWaLNumber);
        } else {
            console.log("GOING TO RUN FILTER");
            const newList = filter(param, currentList);
            clearAndPopulate(dropD, newList);
        }

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
    function filter (param, array) {
        let filteredArray = [];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.subType === param) {
                filteredArray.push(element)
        }}
        return filteredArray;
    }; 
      
     // const dropDownSelector = document.querySelector("#existingVocabWords");
      
};

getActivities();
document.querySelector("#filterNewActivities").addEventListener('change', filterAndSort);
document.querySelector("#filterActivities").addEventListener('change', filterAndSort);
document.querySelector("#filterWaL").addEventListener('change', filterAndSort);
document.querySelector('#selectByTopic').addEventListener('click', reviewByTopic);