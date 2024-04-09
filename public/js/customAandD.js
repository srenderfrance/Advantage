document.querySelector('#selectorToggle').addEventListener('click', toggleSelector);
document.querySelector('#saveSelection').addEventListener('click', saveSelection);
let vocabDictionary = [];
let userSelectedVocab = [];
let customActivities = [];

function toggleSelector () {
    console.log ("Toggled!");
    let labelElement = document.querySelector("#toggleButtonLabel");
    if (labelElement.textContent === "Select Vocab for a Custom Activity"){
        document.addEventListener('click', selectionToggle);
        labelElement.textContent = "Return to Dicionary Mode";
    } else {
        labelElement.textContent = "Select Vocab for a Custom Activity";
        document.removeEventListener('click', selectionToggle);
        const elementsSelected = document.querySelectorAll('.selectedVocab');
        for (let i = 0; i < elementsSelected.length; i++) {
            const element = elementsSelected[i];
            element.classList.toggle('selectedVocab');
        };
    };
};

function selectionToggle (Event) {
    if(Event.target.matches('.dictionaryContainer > div')){
        const div = Event.target;
        div.classList.toggle('selectedVocab');
    };
     
};
function selectFromUserselection (Event) {
    if (Event.target.matches('.userSelectionContainer > div')){
        const userDiv = Event.target;
        userDiv.classList.toggle('selectedVocab2');
    } else if (Event.target.matches('.customActivityContainer > div')){
        const userDiv = Event.target;
        userDiv.classList.toggle('selectedVocab3')
    };
};

async function saveSelection () {
    
    console.log('Time to save Selection');
    const elementsSelected = document.querySelectorAll('.selectedVocab');
    let selectedVw = [];
    //console.log(typeof(elementsSelected[0].style.backgroundImage.slice(5, -2)));
    for (let i = 0; i < elementsSelected.length; i++) {
        const element = elementsSelected[i];
        for (let i2 = 0; i2 < vocabDictionary.length; i2++) {
            const vw = vocabDictionary[i2];
            //console.log(vw.imageUrl);
            //console.log(typeof(vw.imageUrl));
            if (element.style.backgroundImage.slice(5, -2) === vw.imageUrl){
                console.log(vw.ident);
                selectedVw.push(vw.ident);
                break;
            };
            
        }};
        const elementsSaved = document.querySelectorAll('.selectedVocab');
        for (let i = 0; i < elementsSaved.length; i++) {
            const element = elementsSaved[i];
            element.classList.toggle('selectedVocab');
        };
    console.log(selectedVw);
    try {
    const response = await fetch("/student/saveSelectedVocab", {method: 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({selectedVocab: selectedVw}),

    });
    const data = await response.json();
    let usvw = []
    for (let i = 0; i < selectedVw.length; i++) {
        const element = selectedVw[i];
        for (let i2 = userSelectedVocab.length -1; i2 > -1; i2--) {//loof fixed for splice.
            const element2 = userSelectedVocab[i2];
            if(element2.ident === element){
                selectedVw.splice(i, 1);
    }}};
    for (let i = 0; i < selectedVw.length; i++) {
        const element = selectedVw[i];
        for (let i1 = 0; i1 < vocabDictionary.length; i1++) {
            const element2 = vocabDictionary[i1];
            if (element2.ident === element){
                userSelectedVocab.push(element2);
    }}};
    userSelectionVocabContainer = document.querySelector('.userSelectionContainer');
    console.log(userSelectionVocabContainer.id);
    const letter = userSelectionVocabContainer.id;
    emptyContainer(userSelectionVocabContainer);
    fillContainer(userSelectionVocabContainer, userSelectedVocab, letter);
        console.log("UPDATED userSelectedVocab");
        console.log(userSelectedVocab);
        
    
    console.log(data);
} catch (error) {
        console.log(error)
    }
};

async function createCustomActivity () {
    try {
        const activityName = document.querySelector('#activity').value;
        //console.log(activityName)
        let selection = [];
        let activityNameIsUsed = false;

        const userSelected = document.querySelectorAll('.selectedVocab2');
        console.log("userSelectedVocab");
        console.log(userSelectedVocab);
        for (let i = 0; i < customActivities.length; i++) {
            const activityDescription = customActivities[i].description;
            if (activityName === activityDescription){
                activityNameIsUsed = true;
        }}
        if (activityNameIsUsed === true) {
             window.alert("This activity name has aready been used.");
        } else if (userSelected.length > 12){
            window.alert('You have selected more than 12 Vocab Words. An Activity cannot have more than 12 Vocab Words.');
        } else {
        for (let i = 0; i < userSelected.length; i++) {
            const element = userSelected[i];
            for (let i2 = 0; i2 < userSelectedVocab.length; i2++) {
                const usersW = userSelectedVocab[i2];
            if (element.style.backgroundImage.slice(5, -2).toString() === usersW.imageUrl.toString()){
                console.log(usersW.ident);
                selection.push(usersW.ident);
                break;
            };
            
        }};
        for (let i = 0; i < userSelectedVocab.length; i++) {
            const element = userSelectedVocab[i];
            if (selection.includes(element.ident)){
                userSelectedVocab.splice(i, 1);
            };
        };
        console.log(selection);
        const response = await fetch("/student/createCustomActivity", {method: 'POST',
            headers: {"Content-Type": "application/json",},    
            body: JSON.stringify({activityName: activityName, activityVocab: selection}),
        });
        const data = await response.json();

        console.log(data);
       window.location.reload();
    }} catch (error) {
        console.log(error);
}};

async function deleteCustomAtivity () {
    try {
        const confirmDelete = confirm("Are you sure want to delete this Activity?");
        if(confirmDelete === true){
            const activityToDelete = document.querySelector('#activityToEdit2').value;
            const response = await fetch('/student/deleteCustomActivity', {method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({activityToDelete: activityToDelete}),
    });
    window.location = response.url;
    }} catch (error) {
        console.log(error)
    }};

async function getAllVocab () {
        try {
            const response = await fetch("/student/getAllVocab", {method: 'PUT',
                headers: {"Content-Type": "application/json",},
                body: '',
            });
            const data = await response.json();
            vocabDictionary = data.dictionary;
            userSelectedVocab = data.userSelectedVocab;
            customActivities = data.customActivities;
            console.log("GET ALL VOCAB customActivities")
            console.log(customActivities);
        } catch (error) {
            console.log(error)
        }
};

function emptyContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }};
function fillContainer(container,array, idLetter){
    console.log("FILL CONTAINER IS RUNNING!")
    for (let i = 0; i < array.length; i++) {
            const element = array[i];     
            const div = document.createElement("div");
            const idAtt = document.createAttribute("id");
            idAtt.value = idLetter + (i+1);
            div.setAttributeNode(idAtt);
            const audio = document.createElement('audio')
            const audioIdAtt = document.createAttribute('id');
            audioIdAtt.value = 'audioTis' + idLetter + (i+1);
            const sourceAtt = document.createAttribute('src');
            sourceAtt.value = element.audioTis;
            audio.setAttributeNode(audioIdAtt);
            audio.setAttributeNode(sourceAtt);
            container.append(div);
            const createdDiv = document.getElementById(idAtt.value);
            createdDiv.style.backgroundImage = 'url(' + element.imageUrl + ')';
            createdDiv.append(audio);
}};
function filterByCategory () {
    let category = document.querySelector('#categoryToReview').value;
    console.log(category);
    const container = document.querySelector('.dictionaryContainer');
    emptyContainer(container);
    //let categoryDictionary = [];
    if (category === 'All'){
        for (let i = 0; i < vocabDictionary.length; i++) {
            const element = vocabDictionary[i];     
            const div = document.createElement("div");
            const idAtt = document.createAttribute("id");
            idAtt.value = 'A' + (i+1);
            div.setAttributeNode(idAtt);
            const audio = document.createElement('audio')
            const audioIdAtt = document.createAttribute('id');
            audioIdAtt.value = 'audioTisA' + (i+1);
            const sourceAtt = document.createAttribute('src');
            console.log("AUDIOTIS")
            console.log(element.audioTis);
            sourceAtt.value = element.audioTis;
            audio.setAttributeNode(audioIdAtt);
            audio.setAttributeNode(sourceAtt);
            container.append(div);
            const createdDiv = document.getElementById(idAtt.value);
            createdDiv.style.backgroundImage = 'url(' + element.imageUrl + ')';
            createdDiv.append(audio);
}} else {
    for (let i = 0; i < vocabDictionary.length; i++) {
        const element = vocabDictionary[i];
        if (element.category === category) {
            //console.log("It and Animal")
            //categoryDictionary.push(element);
            const div = document.createElement("div");
            const idAtt = document.createAttribute("id");
            idAtt.value = 'A' + (i+1);
            div.setAttributeNode(idAtt);
            const audio = document.createElement('audio')
            const audioIdAtt = document.createAttribute('id');
            audioIdAtt.value = 'audioTis' + idAtt.value;
            const sourceAtt = document.createAttribute('src');
            console.log('Source ATT');
            console.log(sourceAtt);
            sourceAtt.value = element.audioTis;
            audio.setAttributeNode(audioIdAtt);
            audio.setAttributeNode(sourceAtt);
            container.append(div);
            const createdDiv = document.getElementById(idAtt.value);
            createdDiv.style.backgroundImage = 'url(' + element.imageUrl + ')';
            createdDiv.append(audio);
            //console.log(createdDiv);
}}}};
function playVocab (Event) {
    if(Event.target.matches('.vWContainer > div')){
        console.log("FIND VOCAB IS RUNNING")
        const div = Event.target.id;
        console.log(div);
        const audioId = "audioTis" + div;
        console.log(audioId);
        const vocabAudio = document.getElementById(audioId);
        console.log(vocabAudio);
        vocabAudio.play();
        let duration = vocabAudio.duration * 1000;
        console.log('Duration');
        console.log(duration);
        document.removeEventListener('click', playVocab);
        setTimeout(remakeListener, duration);
        
       

}};
function remakeListener () {
    console.log("REMAKE IS RUNNING")
    document.addEventListener('click', playVocab);
    console.log('TimeOUT OVER'); 
}

function showSelectedActivity (){
    const activityToShow = document.querySelector('#activityToEdit2').value;
    console.log(activityToShow);
    console.log("SHOW SELECTED ACTIVITY RAN")
    const container = document.querySelector('.customActivityContainer');
    const idLetter = container.id;
    console.log(container);
    console.log(idLetter);
    let vwArray = [];
    for (let i = 0; i < customActivities.length; i++) {
        const element = customActivities[i];
        if(element.description === activityToShow){
            vwArray = element.vocabWords;  
    }}
    console.log(vwArray);
    emptyContainer(container);
    fillContainer(container, vwArray, idLetter);

};
async function addToActivity() {
    console.log("Add To Activity is Running!");
    const vwToAdd = document.querySelectorAll('.selectedVocab2');
    let arrayToAdd = [];
    let newIdentArray = [];
    console.log(vwToAdd);
    console.log("USER SELECTED VOCAB");
    console.log(userSelectedVocab);
    for (let i = 0; i < vwToAdd.length; i++) {//This creates an array of VWs from the selected images AND removes them from userSelectedVocab. 
        const element = vwToAdd[i];
        for (let i2 = userSelectedVocab.length -1; i2 > -1; i2--) {//Splice for loop.
            const element2 = userSelectedVocab[i2];
            if (element.style.backgroundImage.slice(5, -2) === element2.imageUrl){
                console.log(element2.imageUrl);
                arrayToAdd.push(element2);
                userSelectedVocab.splice(i2, 1);
    }}};
    for (let i = 0; i < userSelectedVocab.length; i++) {//Creates an array for the userSelectedVocag in the database.
        const element = userSelectedVocab[i];
        newIdentArray.push(element.ident);
    };
    console.log('ARRAY TO ADD');
    console.log(arrayToAdd);
    let currentActivityVL =[];
    let arrayToShow = [];
    const cActivity = document.querySelector("#activityToEdit2").value;
    console.log("Activity Selector Value");
    console.log(cActivity);
    for (let i = 0; i < customActivities.length; i++) {//This dinds the correct Activity Object to modify.
        const element = customActivities[i];
        if(element.description === cActivity){
            console.log("Activity");
            console.log(element.description);
            currentActivityVL = element.vocabWords;
    }};
    console.log("CURRENT ACTIVITY");
    console.log(currentActivityVL);

    for (let i = 0; i < currentActivityVL.length; i++) {//This removes any VWs that are already in the Activity.
        const element = currentActivityVL[i];
        for (let i2 = arrayToAdd.length -1; i2 > -1; i2--) {//Splice for loop.
                const element2 = arrayToAdd[i2];
                if(element.ident === element2.ident){
                    arrayToAdd.splice(i2, 1);
    }}};
    console.log("ArrayToAdd secondtime");
    console.log(arrayToAdd);
    arrayToShow.push(...arrayToAdd,...currentActivityVL);//This add the remaining selected VWs to the activity.
    const userVocabC = document.querySelector('#B');
    emptyContainer(userVocabC);
    fillContainer(userVocabC, userSelectedVocab, "B");
    const userActivityC = document.querySelector('#C');
    emptyContainer(userActivityC);
    fillContainer(userActivityC, arrayToShow, "C" );
    console.log("NEW IDENT ARRAY");
    console.log(newIdentArray);

    try {
        const response = await fetch("/student/updateIndividualExercise", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({activityToUpdate: cActivity, updatedVocabWords: arrayToShow, updatedUserSelections: newIdentArray}),
        });
   const data = await response.json();       
   console.log(data);
    } catch (error) {
        console.log(error)
        
    }

};

async function moveToCollection () {
    console.log("MOVE TO COLLECTION IS RUNNING!");
    const toMove = document.querySelectorAll('.selectedVocab3');
    const activityDescription = document.querySelector('#activityToEdit2').value;
    console.log("Activity element");
    console.log(activityDescription);
    let vArrayToModify = [];
    for (let i = 0; i < customActivities.length; i++) {
        const element = customActivities[i];
        console.log(element.description);
        if (element.description === activityDescription){
            console.log("THEY WERE THE SAME");
            vArrayToModify = element.vocabWords;
    }};
    let selection = [];
    let forCollection = [];
    for (let i = 0; i < toMove.length; i++) {
            const element = toMove[i];
            for (let i2 = vArrayToModify.length -1; i2 > -1; i2--) {
                const sW = vArrayToModify[i2];
                if (element.style.backgroundImage.slice(5, -2) === sW.imageUrl){
                    console.log(sW.ident);
                    forCollection.push(sW);
                    selection.push(sW.ident);
                    vArrayToModify.splice(i2, 1); 
    }}};
    userSelectedVocab.push(...forCollection);
    try {
        const response = await fetch("/student/moveToCollection", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({activity: activityDescription, toRemove: selection}),
        });
        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.log(error);
    };
    const userSVocab = document.querySelector('#B');
    const userActivityC = document.querySelector('#C')
    emptyContainer(userSVocab);
    fillContainer(userSVocab, userSelectedVocab, 'B');
    emptyContainer(userActivityC);
    fillContainer(userActivityC, vArrayToModify, 'C');
    console.log("THIS IS THE SELECTION");
    console.log(selection);

};

async function removeFromCollection () {
    console.log("REMOVE FROM COLLECTION IS RUNNING!");
    const toRemove = document.querySelectorAll('.selectedVocab2');
    let selection = [];
    for (let i = 0; i < toRemove.length; i++) {
            const element = toRemove[i];
            for (let i2 = userSelectedVocab.length -1; i2 > -1; i2--) {
                const usersW = userSelectedVocab[i2];
            if (element.style.backgroundImage.slice(5, -2).toString() === usersW.imageUrl.toString()){
                console.log(usersW.ident);
                selection.push(usersW.ident);
                userSelectedVocab.splice(i2, 1);
                
            };
            
        }};
    console.log("THIS IS THE SELECTION");
    console.log(selection);
    const container = document.querySelector('#B');
    emptyContainer(container);
    fillContainer(container, userSelectedVocab, 'B');
    try {
        const response = await fetch('/student/removeFromCollection', {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({vocabToRemove: selection}),
        });
        data = await response.json();
        console.log(data);
    } catch (error) {
       console.log(error) 
    };
};

async function removeFromActivity () {
    console.log("REMOVE FROM ACTIVITY IS RUNNING");
    const toRemove = document.querySelectorAll('.selectedVocab3');
    console.log(toRemove);
    const activityDescription = document.querySelector('#activityToEdit2').value;
    console.log("Activity element");
    console.log(activityDescription);
    let vArrayToModify = [];
    for (let i = 0; i < customActivities.length; i++) {
        const element = customActivities[i];
        console.log(element.description);
        if (element.description === activityDescription){
            console.log("THEY WERE THE SAME");
            vArrayToModify = element.vocabWords;
    }};
    let selection = [];
    for (let i = 0; i < toRemove.length; i++) {
            const element = toRemove[i];
            for (let i2 = vArrayToModify.length -1; i2 > -1; i2--) {
                const sW = vArrayToModify[i2];
                if (element.style.backgroundImage.slice(5, -2) === sW.imageUrl){
                    console.log(sW.ident);
                    selection.push(sW.ident);
                    vArrayToModify.splice(i2, 1); 
    }}};
 try {
        const response = await fetch("/student/removeFromActivity", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({activity: activityDescription, toRemove: selection}),
        });
        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.log(error);
    };
    const userActivityC = document.querySelector('#C')
    emptyContainer(userActivityC);
    fillContainer(userActivityC, vArrayToModify, 'C');
    console.log("THIS IS THE SELECTION");
    console.log(selection);
};

getAllVocab();
document.querySelector('#activityToEdit2').addEventListener('change', showSelectedActivity);
document.addEventListener('click', selectFromUserselection);
document.addEventListener('click', playVocab);
document.querySelector('#deleteCustomActivity').addEventListener('click', deleteCustomAtivity);
document.querySelector('#newActivity').addEventListener('click', createCustomActivity);
document.querySelector('#selectByCategory').addEventListener('click', filterByCategory);
document.querySelector('#addToActivity').addEventListener('click', addToActivity);
document.querySelector('#moveToCollection').addEventListener('click', moveToCollection);
document.querySelector('#removeFromCollection').addEventListener('click', removeFromCollection);
document.querySelector('#removeFromActivity').addEventListener('click', removeFromActivity);