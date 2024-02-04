


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

async function getAllVocab () {
        try {
            const response = await fetch("/student/getAllVocab", {method: 'PUT',
                headers: {"Content-Type": "application/json",},
                body: '',
            });
            const data = await response.json();
            vocabDictionary = data.dictionary;
            console.log(vocabDictionary);
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
        //console.log(Event);
        const div = Event.target.id;
        //console.log(div);
        const audioId = "audioN" + div.slice(1);
        const vocabAudio = document.getElementById(audioId);
        //console.log(vocabAudio);
        vocabAudio.play();
    }
}
getAllVocab();
document.addEventListener('click', findVocab);
document.querySelector('#deleteCustomActivity').addEventListener('click', deleteCustomAtivity);
document.querySelector('#newActivity').addEventListener('click', createCustomActivity);
document.querySelector('#selectByCategory').addEventListener('click', filterByCategory);