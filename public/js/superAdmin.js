document.querySelector('#subNewSchool').addEventListener('click', createNewSchool);
document.querySelector('#materialType').addEventListener('change', getMaterialLoader);


async function createNewSchool () {
    const newSchool = document.getElementById('schoolName').value;
    console.log(newSchool)
    try {
        const response = await fetch("/admin/newSchool", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({newSchool: newSchool}),
       });
       data = await response.json();
         
    } catch (error) {
       console.log(error);
    };
};

async function getMaterialLoader () {
    const materialType = document.getElementById('materialType').value;
    console.log(materialType);
    try {
           const response = await fetch("/admin/getMaterialLoader", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({materialType: materialType}),
           });
    } catch (error) {
        console.log(error);
    }
}