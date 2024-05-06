document.querySelector("#submitActivity").addEventListener("click", createNewActivity);


async function createNewActivity () {

 const formElement = document.querySelector("#newActivityForm");
   const form = new FormData(formElement);
   console.log(Array.from(formElement));
   console.log("FORM")
   const formArray = Array.from(formElement);
   const description = formArray[0].value;
   console.log(description);
   const date = formArray[2].value;
   console.log(date);
   const type = formArray[1].value;
   console.log(type);
   const actNumber = formArray[3].value;
   console.log(actNumber)

if (description === ''){
    window.alert("A description is needed to create a new Activity,")
} else if (date === '' && actNumber === ''){
  window.alert("Either a date or an activity number are needed to create an Activity.")
} else{
 try {

      const response = await fetch("/admin/activity", {method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({description: description, date: date, type: type})
});
      const data = await response.json();
      console.log("data")
      console.log(data);
      if (data.bodyObjectEmpty){
        if(data.bodyObjectEmpty === true){
          console.log("EMPTY EMPTY EMPTY")
        }
      }
      if (data.activityNameIsUsed){
        if(data.activityNameIsUsed === true){
            window.alert("That activity name has already been used. Please choose another.")
        }
      }
      if(data.bodyObjectEmpty === false && data.activityNameIsUsed === false){
        if (type === "DD"){
         window.location.href ='/admin/activityDD';
        } else if (type === "WaL"){
          window.location.href = '/admin/activityWaL';
        } /*else if (type === "BS" || "CS"){
          window.location.href = '/admin/activityP';
        }*/


      }
   } catch (error) {
    console.log(error);
   };

}};