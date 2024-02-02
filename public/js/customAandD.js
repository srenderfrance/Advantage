


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
            //console.log(data)
        } catch (error) {
            console.log(error)
        }
};
getAllVocab();
document.querySelector('#deleteCustomActivity').addEventListener('click', deleteCustomAtivity);
document.querySelector('#newActivity').addEventListener('click', createCustomActivity);