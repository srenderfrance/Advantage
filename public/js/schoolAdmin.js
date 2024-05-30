document.querySelector("#cohortName").addEventListener("change", sendCohortSelection);
document.querySelector("#giveToStudent").addEventListener("click", giveToStudent);
document.querySelector("#removeFromStudent").addEventListener("click", removeFromStudent);

let studentList;

async function sendCohortSelection() {
    const cohortSelection = document.querySelector("#cohortName").value;
    const response = await fetch("/admin/cohortName", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({cohortSelection: cohortSelection}),
        });
    const data = await response.json();
    console.log(data);
    studentList = data;
    /*console.log(studentList);
    console.log(studentList.length)*/
    
    //sessionStorage.setItem("sessionStoreStudentList", JSON.stringify(studentList));

    let toInsert = ""
    for (let i = 0; i < studentList.length; i++){
        console.log('name')
        console.log(studentList[i].firstName)
        toInsert += `<option value="${studentList[i].firstName} ${studentList[i].lastName}">${studentList[i].firstName} ${studentList[i].lastName}</option>`
    }
    //console.log(toInsert)
    dropDownDefaultElement = document.querySelector("#studentName");
    dropDownDefaultElement.insertAdjacentHTML("beforeend", `${toInsert}`)
    };
   
    
async function giveToStudent () {
    let student = document.querySelector("#studentName").value;
    let studentId;
    let infoToSend;
    const cohortSelection = document.querySelector("#cohortName").value;
    const studentName = student.split(' ');
    for (let i=0; i<studentList.length; i++){
        if (studentList[i].firstName === studentName[0] && studentList[i].lastName === studentName[1]){
            studentId = studentList[i]._id;
            console.log('studentID set');
            console.log(studentId); 
            infoToSend = [studentId, cohortSelection];
        }};
    console.log("infoToSend")
    console.log(infoToSend);
    const response = await fetch("/admin/updateCohortAdmin", {method: 'POST',
    headers: {"Content-Type": "application/json",},    
    body: JSON.stringify({infoToSend: infoToSend}),
});
console.log("location.reload")
location.reload();
};


async function removeFromStudent () {
    let student = document.querySelector("#studentName").value;
    //let studentList = JSON.parse(sessionStorage.getItem("sessionStoreStudentList"));
    const cohortSelection = document.querySelector("#cohortName").value;
    let studentId
    let infoToSend
    const studentName = student.split(' ');
    for (let i=0; i<studentList.length; i++){
        if (studentList[i].firstName === studentName[0] && studentList[i].lastName === studentName[1]){
            studentId = studentList[i]._id;
            console.log('studentID set');
            console.log(studentId); 
            infoToSend = [studentId, cohortSelection];
        }};
    console.log("infoToSend")
    console.log(infoToSend);
    const response = await fetch("/admin/removeCohortAdmin", {method: 'POST',
    headers: {"Content-Type": "application/json",},    
    body: JSON.stringify({infoToSend: infoToSend}),
});
console.log("location.reload")
location.reload();
};