console.log("Hello World")

document.querySelector("#cohortSelection").addEventListener("click", sendCohortSelection);
document.querySelector("#giveToStudent").addEventListener("click", giveToStudent);
document.querySelector("#removeFromStudent").addEventListener("click", removeFromStudent);




  

 async function sendCohortSelection() {
    const cohortSelection = document.querySelector("#cohortName").value;
    const response = await fetch("/admin/cohortName", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({cohortSelection: cohortSelection}),
        });
    const data = await response.json();
    console.log(data);
    studentList =data[0].students;
    console.log(studentList);
    console.log(studentList.length)
    
    sessionStorage.setItem("sessionStoreStudentList", JSON.stringify(studentList));

    let toInsert = ""
    for (let i = 0; i < studentList.length; i++){
       toInsert += `<option value="${studentList[i].name}">${studentList[i].name}</option> `
    }
    console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#studentName");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   
    
async function giveToStudent () {
    let student = document.querySelector("#studentName").value;
    let studentList = JSON.parse(sessionStorage.getItem("sessionStoreStudentList"));
    const cohortSelection = document.querySelector("#cohortName").value;
    let studentId
    for (let i=0; i<studentList.length; i++){
        if (studentList[i].name === student){
            studentId = studentList[i].id};
    }; let infoToSend = [studentId, cohortSelection]
    const response = await fetch("/admin/updateCohortAdmin", {method: 'POST',
    headers: {"Content-Type": "application/json",},    
    body: JSON.stringify({infoToSend: infoToSend}),
});
console.log("Await response.reload")
await response.reload();
};


async function removeFromStudent () {
    let student = document.querySelector("#studentName").value;
    let studentList = JSON.parse(sessionStorage.getItem("sessionStoreStudentList"));
    const cohortSelection = document.querySelector("#cohortName").value;
    let studentId
    for (let i=0; i<studentList.length; i++){
        if (studentList[i].name === student){
            studentId = studentList[i].id};
    }; let infoToSend = [studentId, cohortSelection]
    const response = await fetch("/admin/removeCohortAdmin", {method: 'POST',
    headers: {"Content-Type": "application/json",},    
    body: JSON.stringify({infoToSend: infoToSend}),
});
console.log('await response.reload remove')
await response.reload();
};