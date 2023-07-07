console.log("Hello World")

document.querySelector("#cohortSelection").addEventListener("click", sendCohortSelection);
document.querySelector("#selectedStudent").addEventListener("click", sendStudentId);




  

 async function sendCohortSelection() {
    const cohortSelection = document.querySelector("#cohortName").value;
    const response = await fetch("adminCohortName", {method: 'POST',
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
   
    
async function sendStudentId () {
    let student = document.querySelector("#studentName").value;
    let studentList = JSON.parse(sessionStorage.getItem("sessionStoreStudentList"));

    console.log(`Selection = ${student}`)
    console.log(`Student 1 is ${studentList[0].name}`)
    let studentId
    for (let i=0; i<studentList.length; i++){
        console.log(`Student I = ${studentList[i].name}`)
        if (studentList[i].name === student){
            studentId = studentList[i].id;
        };
    };
    console.log(studentId)
    const response = await fetch("adminUpdateCohortAdmin", {method: 'POST',
    headers: {"Content-Type": "application/json",},    
    body: JSON.stringify({studentId: studentId}),
});
const data = await response.json();
}
