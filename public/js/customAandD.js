document.querySelector('#selectorToggle').addEventListener('click', toggleSelector);
document.querySelector('#saveSelection').addEventListener('click', saveSelection);
let vocabDictionary = [];
let userSelectedVocab = [];

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
    };
};

async function saveSelection () {
    
    console.log('Time to save Selection');
    const elementsSelected = document.querySelectorAll('.selectedVocab');
    let selectedVw = [];
    console.log(typeof(elementsSelected[0].style.backgroundImage.slice(5, -2)));
    for (let i = 0; i < elementsSelected.length; i++) {
        const element = elementsSelected[i];
        for (let i2 = 0; i2 < vocabDictionary.length; i2++) {
            const vw = vocabDictionary[i2];
            //console.log(vw.imageUrl);
            //console.log(typeof(vw.imageUrl));
            if (element.style.backgroundImage.slice(5, -2).toString() === vw.imageUrl.toString()){
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
        const userSelected = document. querySelectorAll('selected2');
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
    console.log(selectedVw);

        const response = await fetch("/student/createCustomActivity", {method: 'POST',
            headers: {"Content-Type": "application/json",},    
            body: JSON.stringify({activityName: activityName, activityVocab: selection}),
        })
        //console.log(response);
        window.location = response.url;
    } catch (error) {
        console.log(error);
}};

async function deleteCustomAtivity () {
    try {
        const confirmDelete = confirm("Are you sure want to delete this Activity?");
        if(confirmDelete === true){
            const activityToDelete = document.querySelector('#activityToDelete').value;
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
            console.log(userSelectedVocab);
        } catch (error) {
            console.log(error)
        }
};

function filterByCategory () {
    let category = document.querySelector('#categoryToReview').value;
    console.log(category);

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    const container = document.querySelector('.dictionaryContainer');
    removeAllChildNodes(container);
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
            audioIdAtt.value = 'audioN' + (i+1);
            const sourceAtt = document.createAttribute('src');
            sourceAtt.value = element.audioN;
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
            audioIdAtt.value = 'audioN' + (i+1);
            const sourceAtt = document.createAttribute('src');
            sourceAtt.value = element.audioN;
            audio.setAttributeNode(audioIdAtt);
            audio.setAttributeNode(sourceAtt);
            container.append(div);
            const createdDiv = document.getElementById(idAtt.value);
            createdDiv.style.backgroundImage = 'url(' + element.imageUrl + ')';
            createdDiv.append(audio);
            //console.log(createdDiv);
}}}};
function findVocab (Event){
    if(Event.target.matches('.dictionaryContainer > div')){
        const div = Event.target.id;
        const audioId = "audioN" + div.slice(1);
        const vocabAudio = document.getElementById(audioId);
        vocabAudio.play();
    }
}
getAllVocab();
document.addEventListener('click', selectFromUserselection)
document.addEventListener('click', findVocab);
document.querySelector('#deleteCustomActivity').addEventListener('click', deleteCustomAtivity);
document.querySelector('#newActivity').addEventListener('click', createCustomActivity);
document.querySelector('#selectByCategory').addEventListener('click', filterByCategory);