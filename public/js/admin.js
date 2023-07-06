console.log("Hello World")

document.querySelector("#cohortName").addEventListener("click", sendCohortSelection)




  

 async function sendCohortSelection() {
    const cohortSelection = document.querySelector("#cohortName").value;
    const response = await fetch("/api/admin", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({cohortSelection: cohortSelection}),
        });
    const data = await response.json();
    console.log(data);
    let studentList =[data[0].students];
    console.log(studentList);
    };
   
    

