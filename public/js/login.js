document.querySelector('#loginButton').addEventListener('click', login);


async function login () {
    const loginUsername = document.querySelector('#username').value;
    const loginPassword = document.querySelector('#password').value;
    try {
        const response = await fetch("/", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({username: loginUsername, password: loginPassword}),
        });
             
            if (response.redirected === true) {
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

document.querySelector("#passWordCheckBox").addEventListener('click', togglePassword);