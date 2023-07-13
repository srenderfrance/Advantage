document.querySelector("#selectActivity").addEventListener("click", getVocab);

const activity = document.querySelector("#activityName")
const cohort = document.querySelector("#cohort").value;
async function getVocab()  {
//const activitySelection = await Activity.where("cohort").equals(cohort).where("description").equals(activity);

const response = await fetch("/admin/activitySelection", {method: 'POST',
headers: {"Content-Type": "application/json",},
body: JSON.stringify({activitySelection: activity, cohort: cohort}),
});
const data = await response.json();
console.log(data);

}