document.querySelector('#waLActivities').addEventListener('change', populatePreview);

async function populatePreview (){
    console.log("populatePreview is running");
    let additionalInfo
    const activity = document.querySelector("#waLActivities").value;
   //console.log('activity');
   //console.log(activity);
   //console.log(typeof(activity))
   if (activity !== ''){
      const response = await fetch("/admin/getAdditionalInfo", {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({activity: activity}),
      });
      const data = await response.json();
      additionalInfo = data.additionalInfo[0];
      console.log(additionalInfo);
      console.log(additionalInfo.videoURL);
    };
    console.log("startPreivew")
    const video = document.querySelector("#video");
    video.src=additionalInfo.videoURL;
    const imageD = document.querySelector("#imageDP");
    imageD.src=additionalInfo.imageDURL;
    const audioD = document.querySelector("#audioDP");
    audioD.src=additionalInfo.audioDURL;
    const imageR = document.querySelector("#imageRP");
    imageR.src=additionalInfo.imageRURL;
    const audioR = document.querySelector("#audioRP");
    console.log(audioR);
    audioR.src=additionalInfo.audioRURL;
    console.log("end Preview")

}