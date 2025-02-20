document.querySelector('#loginButton').addEventListener('click', login);


async function login () {
    const loginUsername = document.querySelector('#username').value;
    const loginPassword = document.querySelector('#password').value;

    /*if (loginUsername === ''){
        window.alert("Please enter your Username.")
    } else if (loginPassword === ''){
        window.alert('Please enter your Password.')
    } else {*/
    try {
        const response = await fetch("/", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({username: loginUsername, password: loginPassword}),
        });
             
            if (response.redirected === true) {
                console.log("Response.Redirected was TRUE")
                window.location = response.url;
            } else{
                
                const data = await response.json();
                console.log("Not Redirecting");

                alert(data);
            }
    } catch (error) {
        console.log(error);
    }
};
function togglePassword () {
    const checkBox = document.querySelector("#passWord");
    if (checkBox.type === "password"){
        checkBox.type = "text";
    } else {
        checkBox.type = "password";
}};
function togglePassword2 () {
    const checkBox = document.querySelector("#passWord2");
    if (checkBox.type === "password"){
        checkBox.type = "text";
    } else {
        checkBox.type = "password";
}};

function submitLogin (event) {
    if (event.key === 'Enter' || event.code === "Enter") {
        login();
}};

function submitRegister (event) {
    if (event.key === 'Enter' || event.code === "Enter") {

        document.querySelector("#registerForm").submit();
}};

async function getDemos () {
    try {
          const response = await fetch("/admin/getDemos", {method: 'GET',
            headers: {"Content-Type": "application/json",},
        });
    const data = await response.json();
    console.log(data);
    } catch (error) {
        console.log(error);
    };
};

/*async function tryDemo () {
    try {
        const demoSelection = document.querySelector("#demoSelect").value;
        console.log(demoSelection);
        const response = await fetch("/demo", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({demoSelection: demoSelection}),
        });
    } catch (error) {
       console.log(error);
    };
};*/

getDemos();

document.querySelector("#password2").addEventListener('keydown', submitRegister);
document.querySelector("#password").addEventListener('keydown', submitLogin);
document.querySelector("#passWordCheckBox").addEventListener('click', togglePassword);
document.querySelector('#passwordCheckBox2').addEventListener('click', togglePassword2);
//document.querySelector('#demoButton').addEventListener('click', tryDemo);