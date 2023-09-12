


function validate () {
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    console.log('validate is running')
    console.log(password);
    console.log(confirmPassword);
    if (password !== confirmPassword){
        document.querySelector('#submitReg').disabled = true;
        window.alert('Password confirmation does not match password.')
    } else {document.querySelector('#submitReg').disabled = false};
};

async function disableButton () {
            console.log("disableButton is running")
            const result = await checkUsername()
            console.log(result);
        if (result.isUsed === true) {
            console.log('It is true!')
            window.alert("The username you have entered is already used. Please try another.");
            document.querySelector('#submitReg').disabled = true;
          } else {
            console.log("The else ran!")
            document.querySelector('#submitReg').disabled = false};
};

async function checkUsername () {
    console.log("check Username is running")
    const username = document.querySelector('#username').value;
    try {
        const response = await fetch("/checkUsername", {method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({username: username}),       
        });
        return await response.json();  
        /*console.log(data);
        console.log(typeof(data.isUsed));

        console.log(`dataIsUsed: ${data.isUSed}`)
        return data.isUSed;*/
    } catch (error) {
        console.log(error);
    }

}






document.querySelector('#confirmPassword').addEventListener('change', validate);
document.querySelector('#username').addEventListener('change', disableButton);