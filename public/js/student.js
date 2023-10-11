let selectedVocab = [];
let newActivity = [];
let visualArray = [];
let keyArray = [];

async function getSelectedVocab () {
    try {
        console.log('Get Sected Vocab is running')
        const response = await fetch("/student/getSelectedVocab", {method: 'GET',
            headers: {"Accept": "application/json",},
        });
        const data = await response.json();
        selectedVocab = data.selectedVocab;
        console.log(selectedVocab);
        //console.log(selectedVocab.length)
    for (let i = 0; i < selectedVocab.length; i++) {
        let id = `#A${1+i}`
        console.log(id);
        document.querySelector(id).addEventListener('click', selectWord);
        id = `A${1+i}`
        visualArray.push(id);
    }

    //console.log("Visual array");
    //console.log(visualArray);
    for (let i = 0; i < visualArray.length; i++) {
        keyArray[i] = {id: visualArray[i], vocabWord: selectedVocab[i]};
        
    };
    console.log("key Array")
    console.log(keyArray)
 
    } catch (error) {
        console.log("There was an error");
        console.log(error)
    }
}


function selectWord (Event) {
    //console.log("A Word was clicked")
    Event.currentTarget.classList.toggle('selected');
    //console.log(Event.currentTarget.id)
   /* for (let i = 0; i < keyArray.length; i++) {
        //console.log(keyArray[i].id)
        //console.log(keyArray[1].vocabWord._id)
        if (keyArray[i].id === Event.currentTarget.id){
            if (newActivity.includes(keyArray[i].vocabWord._id)){
                const index = newActivity.indexOf(keyArray[i].vocabWord._id);
                newActivity.splice(index, 1);
            } else {
                console.log(keyArray[i].vocabWord._id);
                newActivity.push(keyArray[i].vocabWord._id)

}}}
    console.log(newActivity)*/
};

async function createCustomActivity () {
    try {
        const activityName = document.querySelector('#activity').value;
        //console.log(activityName)
        let selection = [];
        keyArray.forEach(element => {
            console.log(element)
            //console.log(element.id.classList.contains('selected'))
            let selectedELement = document.getElementById(element.id);
            console.log("selectedElement")
            console.log(selectedELement)
            if (selectedELement.classList.contains('selected')){
                selection.push(element.vocabWord.ident)
                //selectedELement.classList.toggle('selected')
            }});
        console.log(selection)
        const response = await fetch("/student/createCustomActivity", {method: 'POST',
            headers: {"Content-Type": "application/json",},    
            body: JSON.stringify({activityName: activityName, activityVocab: selection}),
        })
        //console.log(response);
        window.location = response.url;
    } catch (error) {
        console.log(error);
}};

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

async function deleteCustomAtivity () {
    try {
        const confirmDelete = confirm("Are you sure want to delete this Activity?");
        if(confirmDelete === true){
            const activityToDelete = document.querySelector('#activityToDelete').value;
            const response = await fetch('student/deleteCustomActivity', {method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({activityToDelete: activityToDelete}),
    });
    window.location = response.url;
    }} catch (error) {
        console.log(error)
    }};

getSelectedVocab();

document.querySelector('#newActivity').addEventListener('click', createCustomActivity);
document.querySelector('#selectByTopic').addEventListener('click', reviewByTopic);
document.querySelector('#deleteCustomActivity').addEventListener('click', deleteCustomAtivity);